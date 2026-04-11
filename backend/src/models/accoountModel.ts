import mongoose, { type InferSchemaType } from "mongoose";
import { Types } from "mongoose";

const AccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  balance: { type: Number,default:0 },
},{
  timestamps: true,
});
type AccountDocument = InferSchemaType<typeof AccountSchema>
export const AccountModel = mongoose.model<AccountDocument>("bankaccount",AccountSchema);
