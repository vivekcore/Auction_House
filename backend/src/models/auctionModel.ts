import mongoose from "mongoose";


const AuctionSchem = new mongoose.Schema(
  {
    title: {type: String, required: true, minLength: 5, maxLength: 100,},
    description: {type: String, required: true, minLength: 10, maxLength: 500,},
    status: {type:String, enum: ["active","ended"]},
    sellerId: {  type: mongoose.Types.ObjectId,  require: true,  ref: "user"},
    winnerId: {  type: mongoose.Types.ObjectId,  default:null},
    sellingPrice: {  type: Number,  required: true,  min:5,},
    finalPrice: {  type: Number,  default:null},
    endtime: { type: Date,require: true },
  },
  {
    timestamps: true,
  },
);

export const AuctionModel = mongoose.model("auction",AuctionSchem);
