import type { Request, Response } from "express";
import { Router } from "express";
import { userAuth } from "../middleware/userMiddleware.js";
import mongoose from "../db/db.js";
import { Account } from "../models/accoount.js";
import { User } from "../models/userModel.js";


const router: Router = Router();

router.get("/balance", userAuth, async (req: Request, res: Response) => {
  //@ts-ignore
  console.log(req.userId);
  try {
    const response = await Account
      //@ts-ignore
      .findOne({userId:req.userId}).populate({
        path:"userId",
        model: User,
        select:"name username email"
      })
    //const response = await Account.find();
    res.status(200).json({
      msg: response,
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/transfer", userAuth, async (req: Request, res: Response) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const { amount, to } = req.body;
    //@ts-ignore
    const account = await Account.findOne({ userId: req.userId });
    const toAccount = await Account.findOne({userId: to});
    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({
        msg: "Invalid account",
      });
    }
    if (account?.balance && account.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        msg: "Insufficient balance",
      });
    }

    await Account.updateOne(
      //@ts-ignore
      { userId: req.userId },
      { $inc: { balance: -amount } },
    ).session(session)
    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } },
    ).session(session)

    await session.commitTransaction();
    session.endSession();

    res.json({
        msg:"Amount transfered sucessfully",  
    })
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
        msg:"Error" + error
    })
  }
});
export default router;
