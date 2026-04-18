import z from "zod";
import mongoose from "mongoose";
import ApiError from "../utils/apiError.js";
import { formatZodError } from "../utils/zodError.js";
import { AuctionModel } from "../models/auctionModel.js";
import { mongoId } from "../utils/mongoId.js";
export const auctionServices = {
  async createAuction(id: mongoose.Types.ObjectId, Data: any) {
    const zodSchem = z.object({
      title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title cannot exceed 100 characters"),
      description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description cannot exceed 500 characters"),
      sellingPrice: z.number().min(5, "Starting price must be at least 5"),
    });

    const result = zodSchem.safeParse(Data);
    if (!result.success) {
      throw new ApiError(400, formatZodError(result.error));
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
      throw new ApiError(500, "Failed to create auction. Please try again.");
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
      message: "Active auctions fetched successfully",
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
    const result = zodSchema.safeParse({ auctionID: auctionId });
    if (!result.success) {
      throw new ApiError(400, formatZodError(result.error));
    }
    const { auctionID } = result.data;
    const response = await AuctionModel.findById(auctionID);
    if (!response) {
      throw new ApiError(404, "Auction not found");
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
    if (!result || result.docs.length === 0) {
      throw new ApiError(404, "You have not created any auctions yet");
    }
    return {
      Message: "Your auctions fetched successfully",
      data: result.docs,
      total: result.totalDocs,
      page: result.page,
      totalPages: result.totalPages,
      hasNext: result.hasNextPage,
      hasPrev: result.hasPrevPage,
    };
  },

  async mannualEndAuction(id: mongoose.Types.ObjectId, auctionId: any) {
    const zodSchema = z.object({
      auctionID: mongoId("auctionId"),
    });
    const result = zodSchema.safeParse({ auctionID: auctionId });
    if (!result.success) {
      throw new ApiError(400, formatZodError(result.error));
    }
    const { auctionID } = result.data;
    const auction = await AuctionModel.findById(auctionID);
    if (!auction) {
      throw new ApiError(404, "Auction not found");
    }
    if (auction.status === "ended") {
      throw new ApiError(400, "This auction has already ended");
    }
    if (auction.sellerId?.toString() !== id.toString()) {
      throw new ApiError(403, "You can only end your own auctions");
    }

    const updatedAuction = await AuctionModel.findOneAndUpdate(
      { sellerId: id, _id: auctionID },
      { $set: { status: "ended", endDate: new Date() } },
      { returnDocument: "after", runValidators: true },
    );

    return updatedAuction;
  },
};
