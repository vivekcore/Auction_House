import type { Request, Response } from "express";
import { Router } from "express";
import { userAuth } from "../middleware/userMiddleware.js";
import mongoose from "../db/db.js";
import { AccountModel } from "../models/accoountModel.js";
import { UserModel } from "../models/userModel.js";

const router: Router = Router();

router.get("/balance", userAuth, async (req: Request, res: Response) => {
  console.log(req.userId);
  try {
    const response = await AccountModel.findOne({
      userId: req.userId,
    }).populate({
      path: "userId",
      model: UserModel,
      select: "name username email",
    });

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

    const account = await AccountModel.findOne({ userId: new mongoose.Types.ObjectId(req.userId) });
    const toAccount = await AccountModel.findOne({ userId: new mongoose.Types.ObjectId(to) });
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

    await AccountModel.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } },
    ).session(session);
    await AccountModel.updateOne(
      { userId: to },
      { $inc: { balance: amount } },
    ).session(session);

    await session.commitTransaction();

    res.json({
      msg: "Amount transfered sucessfully",
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      msg: "Error" + error,
    });
  } finally {
    session.endSession();
  }
});
export default router;
