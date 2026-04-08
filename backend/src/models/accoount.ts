import mongoose from "mongoose";
import { Types } from "mongoose";

const AccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", require: true },
  balance: { type: Number },
},{
  timestamps: true,
});

export const Account = mongoose.model("bankaccount",AccountSchema);
