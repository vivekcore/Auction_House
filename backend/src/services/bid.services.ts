import mongoose from "mongoose";
import { BidModel } from "../models/bidModel.js";
import ApiError from "../utils/apiError.js";
import { formatZodError } from "../utils/zodError.js";
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
        .min(5, "Bid amount must be at least 5")
        .refine((val) => val % 5 === 0, "Bid amount must be a multiple of 5"),
    });
    const result = zodSchema.safeParse(Data);
    if (!result.success) {
      throw new ApiError(400, formatZodError(result.error));
    }

    const { auctionId, amount } = result.data;
    const auction = await AuctionModel.findById(auctionId);
    if (!auction) {
      throw new ApiError(400, "Auction not found");
    }
    if (auction.status === "ended") {
      throw new ApiError(400, "This auction has already ended");
    }
    if (auction.sellerId?.toString() === id.toString()) {
      throw new ApiError(400, "You cannot bid on your own auction");
    }
    const checkBalance = await AccountModel.findOne({ userId: id });
    if (!checkBalance) {
      throw new ApiError(400, "Account not found. Please contact support.");
    }
    if (checkBalance.availableBalance < amount) {
      throw new ApiError(400, `Insufficient balance. Your available balance is ${checkBalance.availableBalance}, but bid requires ${amount}`);
    }
    const lastbid = await BidModel.findOne({
      auctionId,
    }).sort({ amount: -1 });
    if (lastbid && amount <= lastbid.amount) {
      throw new ApiError(400, `Bid must be higher than current highest bid of ${lastbid.amount}`);
    }
    if (lastbid?.bidderId.toString() === id.toString()) {
      throw new ApiError(400, "You are already the highest bidder. Wait for someone else to outbid you");
    }

    try {
      const previousBids = await BidModel.find({
        auctionId,
        isActive: true,
        isLocked: true,
      });
      for (const bids of previousBids) {
        const { bidderId, amount, _id } = bids;
        await AccountModel.findOneAndUpdate({userId:bidderId}, {
          $inc: { lockedAmount: -amount },
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
          $inc: { lockedAmount: +amount },
        },
        { returnDocument: "after", runValidators: true },
      ).session(session);

      const UpdatedAuction = await AuctionModel.findByIdAndUpdate(
        auctionId,
        {
          $set: { finalPrice: amount, winnerId: id },
        },
        { returnDocument: "after", runValidators: true },
      ).session(session);
      await session.commitTransaction();
      return {
        BidCreated: response,
        UserUpdatedBalace: updatedBalance,
        UpdatedAuction,
      };
    } catch (error) {
      await session.abortTransaction();
      throw new ApiError(500, "Failed to place bid. Please try again.");
    } finally {
      session.endSession();
    }
  },
  async getAllBidsOnAuction(auctionId: any) {
    const zodSchema = z.object({
      auctionID: mongoId("auctionId"),
    });
    const result = zodSchema.safeParse({ auctionID: auctionId });
    if (!result.success) {
      throw new ApiError(400, formatZodError(result.error));
    }
    const { auctionID } = result.data;
    const allBids = await BidModel.find({ auctionId: auctionID }).populate({
      path: "auctionId",
      model: AuctionModel,
      select: "title sellingPrice finalPrice",
    });
    if (!allBids || allBids.length === 0) {
      throw new ApiError(404, "No bids found for this auction");
    }
    return allBids;
  },
  async myBids(id: mongoose.Types.ObjectId, page: number, limit: number) {
    const result = await BidModel.paginate(
      { bidderId: id, isActive: true },
      {
        page,
        limit,
        sort: { createdAt: -1 },
        lean: true,
      },
    );
    if (!result || result.docs.length === 0) {
      throw new ApiError(404, "You have no active bids");
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
