import mongoose,{Document, type InferSchemaType} from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';


const BidSchema = new mongoose.Schema(
  {
    auctionId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "auction",
    },
    bidderId: { type: mongoose.Types.ObjectId, required: true, ref: "user" },
    amount: { type: Number, required: true },
    isLocked: {type:Boolean,default:false},
    isActive: {type:Boolean,default:false},
    lockedAt: {type:Date,default: new Date()},
  },
  {
    timestamps: true,
  },
);
type BidDocument = InferSchemaType<typeof BidSchema>;
BidSchema.plugin(mongoosePaginate);
BidSchema.index({
  auctionId: 1,
  amount: -1,
});
export const BidModel = mongoose.model<BidDocument,mongoose.PaginateModel<BidDocument>>("bid", BidSchema);
