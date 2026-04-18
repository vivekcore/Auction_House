import mongoose, { Schema,type HydratedDocument, Model,type InferSchemaType } from "mongoose";

const AccountSchema = new Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "user", 
      required: true 
    },
    balance: { 
      type: Number, 
      default: 0 
    },
    lockedAmount: { 
      type: Number, 
      default: 0 
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

AccountSchema.virtual("availableBalance").get(function (this: any): number {
  return (this.balance ?? 0) - (this.lockedAmount ?? 0);
});
type AccountBase = InferSchemaType<typeof AccountSchema>;
export type AccountDocument = AccountBase & {
  availableBalance: number;
};

export const AccountModel: Model<AccountDocument> = 
  mongoose.model<AccountDocument>("bankaccounts", AccountSchema);