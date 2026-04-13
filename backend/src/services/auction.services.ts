import z, { json } from "zod";
import mongoose from "mongoose";
import ApiError from "../utils/apiError.js";
import { AuctionModel } from "../models/auctionModel.js";
import { mongoId } from "../utils/mongoId.js";
export const auctionServices = {
  async createAuction(id: mongoose.Types.ObjectId, Data: any) {
    const zodSchem = z.object({
      title: z.string().min(5).max(100),
      description: z.string().min(10).max(500),
      sellingPrice: z.number().min(5),
    });

    const result = zodSchem.safeParse(Data);
    if (!result.success) {
      throw new ApiError(400, JSON.stringify(result.error.format()));
    }
    const { title, description, sellingPrice } = result.data;

    const response = AuctionModel.create({
      title,
      description,
      sellingPrice,
      sellerId: id,
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    if (!response) {
      throw new ApiError(400, "Failed to create Auction");
    }
    return response;
  },

  async allActiveAuctions(page: number, limit: number) {
    const result = await AuctionModel.paginate(
      {
        endDate: { $gt: new Date() },
        status: "active",
      },
      {
        page,
        limit,
        sort: { createdAt: -1 },
        lean: true,
      },
    );
    return {
      message: "Fetched docs",
      data: result.docs,
      total: result.totalDocs,
      page: result.page,
      totalPages: result.totalPages,
      hasNext: result.hasNextPage,
      hasPrev: result.hasPrevPage,
    };
  },

  async findAuctionByID(auctionId: any) {
    const zodSchema = z.object({
      auctionID: mongoId("auctionId"),
    });
    const result = zodSchema.safeParse(auctionId);
    if (!result.success) {
      throw new ApiError(400, JSON.stringify(result.error?.format()));
    }
    const { auctionID } = result.data;
    const response = await AuctionModel.findById(
      new mongoose.Types.ObjectId(auctionID),
    );
    if (!response) {
      throw new ApiError(400, "Aucton not found");
    }
    return response;
  },
  async myAuctons(id: mongoose.Types.ObjectId, page: number, limit: number) {
    const result = await AuctionModel.paginate(
      { sellerId: id },
      {
        page,
        limit,
        sort: { createdAt: -1 },
        lean: true,
      },
    );
    if (!result) {
      throw new ApiError(400, "Auctions not found");
    }
    return {
      Message: "My Auctions",
      data: result.docs,
      total: result.totalDocs,
      page: result.page,
      totalPages: result.totalPages,
      hasNext: result.hasNextPage,
      hasPrev: result.hasPrevPage,
    };
  },

  async mannualEndAuction(id:mongoose.Types.ObjectId,auctionId: any) {
    const zodSchema = z.object({
      auctionID: mongoId("auctionId"),
    });
    const result = zodSchema.safeParse(auctionId);
    if (!result.success) {
      throw new ApiError(400, JSON.stringify(result.error?.format()));
    }
    const { auctionID } = result.data;
    const auction = await AuctionModel.findById(auctionID);
    if(!auction){
        throw new ApiError(400, "Auction does not exist");
    }
    if(auction.status === "ended"){
        throw new ApiError(400,"Auction already ended");
    }
    const updatedAuction = await AuctionModel.findOneAndUpdate(
        {sellerId:id},
        {$set:{status:"ended"}},
        {new:true,runValidators:true}
    );
    if(!updatedAuction){
        throw new ApiError(400,"Failed to update");
    }
    return updatedAuction;
  },
};
