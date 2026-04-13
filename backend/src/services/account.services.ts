import mongoose from "mongoose";
import { AccountModel } from "../models/accoountModel.js";
import ApiError from "../utils/apiError.js";
import { UserModel } from "../models/userModel.js";
import { abort } from "node:process";
import z from "zod";
import { mongoId } from "../utils/mongoId.js";
export const accountServices = {
    //Get user Balance
  async getUserBalance(id: mongoose.Types.ObjectId) {
    const userBalance = await AccountModel.findOne({ userId: id }).populate({
      path: "userId",
      model: UserModel,
      select: "name username email",
    });
    if (!userBalance) {
      throw new ApiError(400, "User account does not exist");
    }
    return userBalance;
  },
  //transfer money from one to antother user 
  async transferAmount(id: mongoose.Types.ObjectId, Data: any) {
  
    const zodSchema = z.object({
        to: mongoId("to_userId"),
        amount: z.number().min(5,"Amount must be 5 or more"),
    })
    const result = zodSchema.safeParse(Data);
    if(!result.success){
        throw new ApiError(400, JSON.stringify(result.error.flatten()))
    }
    const {to , amount} = result.data;
    
    const session = await mongoose.startSession();
    try {
        
    session.startTransaction();
    const account = await AccountModel.findOne({
      userId: id,
    });
    const toAccount = await AccountModel.findOne({
      userId: new mongoose.Types.ObjectId(to),
    });
    if (!toAccount) {
      await session.abortTransaction();
      throw new ApiError(400, "Invalid account");
    }
    if (account?.availableBalance && account.availableBalance < amount) {
      await session.abortTransaction();
      throw new ApiError(400, "Insufficeint balance");
    }

    const fromUser = await AccountModel.findOneAndUpdate(
      { userId: id },
      { $inc: { balance: -amount } },
      { new: true, runValidators: true },
    ).populate({
        path:"userId",
        model:UserModel,
        select:"name email"
    }).session(session);
    const toUser = await AccountModel.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(to) },
      { $inc: { balance: amount } },
      { new: true, runValidators: true },
    ).populate({
        path:"userId",
        model:UserModel,
        select:"name email"
    }).session(session)

    await session.commitTransaction();
    return {fromUser,toUser};
    } catch (error) {
        throw new ApiError(400,error as string)
    }
    finally{
        session.endSession();
    }
  },

};
