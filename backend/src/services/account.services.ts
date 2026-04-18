import mongoose from "mongoose";
import { AccountModel } from "../models/accoountModel.js";
import ApiError from "../utils/apiError.js";
import { formatZodError } from "../utils/zodError.js";
import { UserModel } from "../models/userModel.js";
import z from "zod";
import { mongoId } from "../utils/mongoId.js";
export const accountServices = {
  async getUserBalance(id: mongoose.Types.ObjectId) {
    const userBalance = await AccountModel.findOne({ userId: id }).populate({
      path: "userId",
      model: UserModel,
      select: "name username email",
    });
    if (!userBalance) {
      throw new ApiError(404, "Account not found. Please contact support.");
    }
    return userBalance;
  },

  async transferAmount(id: mongoose.Types.ObjectId, Data: any) {
    const zodSchema = z.object({
      to: mongoId("recipient_userId"),
      amount: z.number().min(5, "Transfer amount must be at least 5"),
    });
    const result = zodSchema.safeParse(Data);
    if (!result.success) {
      throw new ApiError(400, formatZodError(result.error));
    }
    const { to, amount } = result.data;
    if (id.toString() === to.toString()) {
      throw new ApiError(400, "You cannot transfer money to yourself");
    }
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const account = await AccountModel.findOne({
        userId: id,
      });
      const toAccount = await AccountModel.findOne({
        userId: to,
      });
      if (!toAccount) {
        await session.abortTransaction();
        throw new ApiError(404, "Recipient account not found");
      }
      if (account?.availableBalance && account.availableBalance < amount) {
        await session.abortTransaction();
        throw new ApiError(400, `Insufficient balance. Available: ${account.availableBalance}, Requested: ${amount}`);
      }

      const fromUser = await AccountModel.findOneAndUpdate(
        { userId: id },
        { $inc: { balance: -amount } },
        { returnDocument: "after", runValidators: true },
      )
        .populate({
          path: "userId",
          model: UserModel,
          select: "name email",
        })
        .session(session);
      const toUser = await AccountModel.findOneAndUpdate(
        { userId: new mongoose.Types.ObjectId(to) },
        { $inc: { balance: amount } },
        { returnDocument: "after", runValidators: true },
      )
        .populate({
          path: "userId",
          model: UserModel,
          select: "name email",
        })
        .session(session);

      await session.commitTransaction();
      return { fromUser, toUser };
    } catch (error) {
      await session.abortTransaction();
      throw new ApiError(500, "Transfer failed. Please try again.");
    } finally {
      session.endSession();
    }
  },
};
