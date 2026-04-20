import cron from "node-cron";
import { AuctionModel } from "../models/auctionModel.js";
import mongoose from "../db/db.js";
import { AccountModel } from "../models/accoountModel.js";
import { BidModel } from "../models/bidModel.js";

export const startExpirationJob = () => {
  cron.schedule("*/5 * * * *", async () => {
    const now = new Date();
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const result = await AuctionModel.updateMany(
        {
          endDate: { $lte: now },
          status: "active",
        },
        {
          $set: {
            status: "ended",
          },
        },
      ).session(session);

      const endedAuctions = await AuctionModel.find({
        status: "ended",
        finalPrice: { $gte: 5 },
        isTransactionDone:false,
      }).session(session);
  
        for (const auction of endedAuctions) {
          const { sellerId, winnerId, finalPrice,_id } = auction;
          if (sellerId && winnerId && finalPrice) {
            // Add money to seller
            await AccountModel.findOneAndUpdate(
              { userId: sellerId },
              { $inc: { balance: finalPrice } },
            ).session(session);
            // Deduct from winner Locked amount
            await AccountModel.findOneAndUpdate(
              { userId: winnerId },
              { $inc: { lockedAmount: -finalPrice,balance: -finalPrice } },
            ).session(session);
            // Set winner Active bid false
            await BidModel.findOneAndUpdate(
              { bidderId: winnerId, isActive: true, isLocked: true },
              { $set: { isActive: false, isLocked: false } },
            ).session(session);
            //set transacton done from that auction
            await AuctionModel.findByIdAndUpdate(_id,{$set:{isTransactionDone:true}}).session(session)
          }
        }
      
      await session.commitTransaction();
      const modCount = result.modifiedCount;
      if (modCount > 0) {
        console.log(`Updated ${modCount} documents to 'expired' status`);
      }
    } catch (error) {
      await session.abortTransaction();
      console.error(" Error in expiration job:", error);
    } finally {
      session.endSession();
    }
  });
  console.log("Expiration status update job started (every 5 minutes)");
};
