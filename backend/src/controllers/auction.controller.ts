import { auctionServices } from "../services/auction.services.js";
import { catchAsync } from "../utils/catchAsync.js";
import type { Request, Response, NextFunction } from "express";
export const auctionController = {
  createAuction: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const CreatedAuction = await auctionServices.createAuction(
        req.userId,
        req.body,
      );

      res.status(200).json({
        success: true,
        message: "Auction createed sucessfully",
        data: CreatedAuction,
      });
    },
  ),

  allActiveAuctions: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const ActiveAuctons = await auctionServices.allActiveAuctions(
        page,
        limit,
      );
      res.status(200).json({
        success: true,
        message: "Active auctions",
        data: ActiveAuctons,
      });
    },
  ),

  findAuctionById: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;

      const Auction = await auctionServices.findAuctionByID(id);
      res.status(200).json({
        success: true,
        message: "Auction",
        data: Auction,
      });
    },
  ),

  myAuctons: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const myAuctions = await auctionServices.myAuctons(
        req.userId,
        page,
        limit,
      );
      res.status(200).json({
        success: true,
        Message: "My auctions",
        data: myAuctions,
      });
    },
  ),

  mannualEndAuction: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const auctionId = req.params.id;
      const endAuction = await auctionServices.mannualEndAuction(
        req.userId,
        auctionId,
      );
      res.status(200).json({
        success: true,
        message: "Auction ended sucessfully",
        data: endAuction,
      });
    },
  ),
};
