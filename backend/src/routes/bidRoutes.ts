import { Router, type Request, type Response } from "express";
import { userAuth } from "../middleware/userMiddleware.js";
import { AuctionModel } from "../models/auctionModel.js";
import { BidModel } from "../models/bidModel.js";
import { AccountModel } from "../models/accoountModel.js";
import mongoose from "../db/db.js";
import { Types } from "mongoose";
import { AuctionStatus } from "../middleware/checkAuctionState.js";

const router: Router = Router();

router.post(
  "/place",
  userAuth,
  AuctionStatus,
  async (req: Request, res: Response) => {
    const bidData: { auctionId: string; amount: number } = req.body;
    const session = await mongoose.startSession();
    try {
        if(bidData.amount < 5 || bidData.amount % 5 !== 0){
            return res.json({
                message: "Bidding amount must be multiple of 5",
            })
        }
      const auction = await AuctionModel.findById(bidData.auctionId);
      if (!auction) {
        return res.json({
          message: "Aucton does not exist",
        });
      }
      if (auction.status === "ended") {
        return res.json({
          message: "This auction is ended",
        });
      }
      if(bidData.auctionId === req.userId){
        return res.status(400).json({
            message: "You can not bid on your own auctions"
        })
      }
      const checkBalance = await AccountModel.findOne({ userId: req.userId });

      if (checkBalance && checkBalance.balance < bidData.amount) {
        return res.json({
          message: "Insufficent balance!",
        });
      }
      const lastbid = await BidModel.findOne({
        auctionId: bidData.auctionId,
      }).sort({ amount: -1 });

      if (lastbid && bidData.amount <= lastbid.amount) {
        return res.json({
          message: "Bid amount must be greater than current bid",
        });
      }

      session.startTransaction();
      const response = await BidModel.create(
        [
          {
            auctionId: new mongoose.Types.ObjectId(bidData.auctionId),
            bidderId: new mongoose.Types.ObjectId(req.userId),
            amount: bidData.amount,
          },
        ],
        { session },
      );

      await AuctionModel.findByIdAndUpdate(
        bidData.auctionId,
        {
          $set: { finalPrice: bidData.amount, winnerId: new mongoose.Types.ObjectId(req.userId) },
        },
        { new: true, session },
      );
      await session.commitTransaction();

      res.status(200).json({
        message: "Bid placed sucessfully",
        response,
      });
    } catch (error) {
      await session.abortTransaction();
      res.status(500).json({
        Error: error,
      });
    } finally {
      session.endSession();
    }
  },
);

router.get(
  "/:auctionId",
  userAuth,
  AuctionStatus,
  async (req: Request, res: Response) => {
    const { auctionId } = req.params;
    try {
      if (!auctionId) {
        return res.status(400).json({
          message: "Auction id required",
        });
      }
      const allbids = await BidModel.find({ auctionId });
      if (allbids.length === 0) {
        return res.status(400).json({
          message: "Auction does not exist",
        });
      }
      res.json({
        Allbid: allbids,
      });
    } catch (error) {
      res.status(400).json({
        Error: error,
      });
    }
  },
);

export default router;
