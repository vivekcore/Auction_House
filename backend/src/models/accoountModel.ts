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

// Define virtual AFTER schema (stable way)
AccountSchema.virtual("availableBalance").get(function (this: any): number {
  return (this.balance ?? 0) - (this.lockedAmount ?? 0);
});

// Base type from schema
type AccountBase = InferSchemaType<typeof AccountSchema>;

// Extend with virtuals manually (this fixes the TS error)
export type AccountDocument = AccountBase & {
  availableBalance: number;
  // Add more virtuals here in future, e.g. totalLocked?: number;
};

// Model
export const AccountModel: Model<AccountDocument> = 
  mongoose.model<AccountDocument>("BankAccount", AccountSchema);