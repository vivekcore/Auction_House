import mongoose from "mongoose";

const BidSchema = new mongoose.Schema({
    auctionId: {type:mongoose.Types.ObjectId,required:true, ref:"auction"},
    bidderId: {type:mongoose.Types.ObjectId, required:true, ref: "user"},
    amount: {type:Number, required: true},
},
{
    timestamps:true,
}
)

export const BidModel = mongoose.model("bid",BidSchema);