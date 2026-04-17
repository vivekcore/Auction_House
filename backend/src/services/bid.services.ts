import mongoose from "mongoose";
import { BidModel } from "../models/bidModel.js";
import ApiError from "../utils/apiError.js";
import z from "zod";
import { mongoId } from "../utils/mongoId.js";
import { AuctionModel } from "../models/auctionModel.js";
import { AccountModel } from "../models/accoountModel.js";
export const bidServices = {
  async placeBid(id: mongoose.Types.ObjectId, Data: any) {
    const session = await mongoose.startSession();
    session.startTransaction();
    const zodSchema = z.object({
      auctionId: mongoId("auctionId"),
      amount: z
        .number()
        .min(5)
        .refine((val) => val % 5 === 0),
    });
    const result = zodSchema.safeParse(Data);
    if (!result.success) {
      throw new ApiError(400, JSON.stringify(result.error.format()));
    }
    
    const { auctionId, amount } = result.data;
    const auction = await AuctionModel.findById(auctionId);
    if (!auction) {
      throw new ApiError(400, "Auction does not exist");
    }
    if (auction.status === "ended") {
      throw new ApiError(400, "This auction is ended");
    }
    if (auction.sellerId === id) {
      throw new ApiError(400, "You can not place bid on your own auction");
    }
    const checkBalance = await AccountModel.findOne({ userId: id });
    if (!checkBalance) {
      throw new ApiError(400, "Account not found");
    }
    if (checkBalance.availableBalance < amount) {
      throw new ApiError(400, "Avalible balance is low");
    }
    const lastbid = await BidModel.findOne({
      auctionId,
    }).sort({ amount: -1 });
    if (lastbid && amount <= lastbid.amount) {
      throw new ApiError(400, "Bid amount must be greater than current bid");
    }
    if(lastbid?.bidderId === id){
      throw new ApiError(400, "Wait before someone out bids you");
    }

    
    try {
      

      const previousBids = await BidModel.find({
        auctionId,
        isActive: true,
        isLocked: true,
      });
      for (const bids of previousBids) {
        const { bidderId, amount, _id } = bids;
        await AccountModel.findByIdAndUpdate(bidderId, {
          $inc: { balance: amount, lockedAmount: -amount },
        }).session(session);
        await BidModel.findByIdAndUpdate(_id, {
          $set: { isActive: false, isLocked: false },
        }).session(session);
      }

      const response = await BidModel.create(
        [
          {
            auctionId,
            bidderId: id,
            amount,
            isLocked: true,
            isActive: true,
          },
        ],
        { session },
      );

      const updatedBalance = await AccountModel.findOneAndUpdate(
        { userId: id },
        {
          $inc: { balance: -amount, lockedAmount: +amount },
        },
        { new: true, runValidators: true },
      ).session(session);

      const UpdatedAuction = await AuctionModel.findByIdAndUpdate(
        auctionId,
        {
          $set: { finalPrice: amount, winnerId: id },
        },
        { new: true, runValidators: true },
      ).session(session);
      await session.commitTransaction();
      return {
        BidCreated: response,
        UserUpdatedBalace: updatedBalance,
        UpdatedAuction,
      };
    } catch (error) {
      await session.abortTransaction();
      throw new ApiError(400, "failed to place bid");
    } finally {
      session.endSession();
    }
  },
  async getAllBidsOnAuction(auctionId: any) {
    const zodSchema = z.object({
      auctionID: mongoId("auctionId"),
    });
    const result = zodSchema.safeParse({auctionID:auctionId});
    if (!result.success) {
      throw new ApiError(400, JSON.stringify(result.error.format()));
    }
    const { auctionID } = result.data;
    const allBids = await BidModel.find({ auctionId: auctionID }).populate({
      path: "auctionId",
      model: AuctionModel,
      select: "title sellingPrice finalPrice",
    });
    if (!allBids) {
      throw new ApiError(400, "Auction does not exist");
    }
    return allBids;
  },
  async myBids(id: mongoose.Types.ObjectId, page: number, limit: number) {
    const result = await BidModel.paginate(
      { bidderId: id,isActive:true },
      {
        page,
        limit,
        sort: { createdAt: -1 },
        lean: true,
      },
    );
    if (!result) {
      throw new ApiError(400, "Bids not found");
    }
    return {
      Message: "My bids",
      data: result.docs,
      total: result.totalDocs,
      page: result.page,
      totalPages: result.totalPages,
      hasNext: result.hasNextPage,
      hasPrev: result.hasPrevPage,
    };
  },
};
