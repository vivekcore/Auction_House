import { Router, type Request, type Response } from "express";
import { userAuth } from "../middleware/userMiddleware.js";
import { AuctionModel } from "../models/auctionModel.js";
import { BidModel } from "../models/bidModel.js";
import { AccountModel } from "../models/accoountModel.js";
import mongoose from "../db/db.js";

const router: Router = Router();

router.post("/place", userAuth, async (req: Request, res: Response) => {
  const bidData: { auctionId: string; amount: number } = req.body;
  const session = await mongoose.startSession();
  try {
    if (bidData.amount < 5 || bidData.amount % 5 !== 0) {
      return res.json({
        message: "Bidding amount must be multiple of 5",
      });
    }
    if (!bidData.auctionId || typeof bidData.auctionId !== "string") {
      return res.status(400).json({ error: "Missing or invalid id parameter" });
    }
    if (!mongoose.Types.ObjectId.isValid(bidData.auctionId)) {
      return res.status(400).json({ error: "Invalid ObjectId format" });
    }
    const auction = await AuctionModel.findById(
      new mongoose.Types.ObjectId(bidData.auctionId),
    );
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
    if (auction.sellerId === req.userId) {
      return res.status(400).json({
        message: "You can not bid on your own auctions",
      });
    }
    const checkBalance = await AccountModel.findOne({ userId: req.userId });

    if (checkBalance && checkBalance.availableBalance < bidData.amount) {
      return res.json({
        message: "Insufficent balance!",
      });
    }
    const lastbid = await BidModel.findOne({
      auctionId:  new mongoose.Types.ObjectId(bidData.auctionId),
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
          bidderId: req.userId,
          amount: bidData.amount,
          isLocked:true,
          isActive:true,
          lockedAt: new Date(),
        },
      ],
      { session },
    );
    if(checkBalance?.lockedAmount){
      const lockedAmount = checkBalance?.lockedAmount + bidData.amount;
      const availableBalance = checkBalance.balance - lockedAmount;

       await AccountModel.findOneAndUpdate(
      {userId:req.userId},
      {
        $set:{availableBalance,lockedAmount }
      }
    ).session(session)
    }
    else{
      await session.abortTransaction();
      return res.status(500).json({
        message:"Server error",
      })
    }
    
   
    await AuctionModel.findByIdAndUpdate(
      bidData.auctionId,
      {
        $set: { finalPrice: bidData.amount, winnerId: req.userId },
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
});
router.get("/:auctionId", userAuth, async (req: Request, res: Response) => {
  const { auctionId } = req.params;
  try {
    if (!auctionId || typeof auctionId !== "string") {
      return res.status(400).json({ error: "Missing or invalid id parameter" });
    }
    if (!mongoose.Types.ObjectId.isValid(auctionId)) {
      return res.status(400).json({ error: "Invalid ObjectId format" });
    }
    const allbids = await BidModel.find({
      auctionId: new mongoose.Types.ObjectId(auctionId),
    });
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
});
router.get("/my", userAuth, async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  try {
    const result = await BidModel.paginate(
      { bidderId: req.userId },
      {
        page,
        limit,
        sort: { createdAt: -1 },
        lean: true,
      },
    );
    res.status(200).json({
      Message: "My bids",
      data: result.docs,
      total: result.totalDocs,
      page: result.page,
      totalPages: result.totalPages,
      hasNext: result.hasNextPage,
      hasPrev: result.hasPrevPage,
    });
  } catch (error) {
    res.status(500).json({
      Error: error,
    });
  }
});
export default router;
