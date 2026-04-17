import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { bidServices } from "../services/bid.services.js";

export const bidController = {
  placeBid: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = req.body;
      const bidplaced = await bidServices.placeBid(req.userId, data);
      res.status(200).json({
        success: true,
        message: "Bid Places sucessfully",
        data: bidplaced,
      });
    },
  ),

  getAllBidsOnAuction: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const {auctionId}  = req.params;
      const allbids = await bidServices.getAllBidsOnAuction(auctionId);
      res.status(200).json({
        success: true,
        message: "All bids on auction",
        data: allbids,
      });
    },
  ),

  myBids: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const myBids = await bidServices.myBids(req.userId, page, limit);
      res.status(200).json({
        success: true,
        message: "My Bids on all auctions",
        data: myBids,
      });
    },
  ),
};
