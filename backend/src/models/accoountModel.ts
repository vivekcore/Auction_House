import mongoose, { type InferSchemaType ,Document } from "mongoose";
interface IAccount extends Document {
  userId: mongoose.Types.ObjectId,
  balance: String,
  lockedAmount: Number,
  availableBalance: Number,
}
const AccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  balance: { type: Number,default:0 },
  lockedAmount: {type: Number, default: 0},
  availableBalance: {type:Number,default:0}
},
{
  timestamps: true,
});
type AccountDocument = InferSchemaType<typeof AccountSchema>
export const AccountModel = mongoose.model<AccountDocument>("bankaccount",AccountSchema);
