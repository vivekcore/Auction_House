import mongoose, {Document, type InferSchemaType} from "mongoose";
import paginate from 'mongoose-paginate-v2';
import { title } from "node:process";


const AuctionSchema = new mongoose.Schema(
  {
    title: {type: String, required: true, minLength: 5, maxLength: 100,},
    description: {type: String, required: true, minLength: 10, maxLength: 500,},
    status: {type:String, enum: ["active","ended"],default:"active"},
    sellerId: {  type: mongoose.Types.ObjectId,  require: true,  ref: "user"},
    winnerId: {  type: mongoose.Types.ObjectId,  default:null},
    isTransactionDone:{type:Boolean, default:false},
    sellingPrice: {  type: Number,  required: true,  min:5,},
    finalPrice: {  type: Number,  default:null},
    endDate: { type: Date,require: true },
  },
  {
    timestamps: true,
  },
);
type AuctionDocument = InferSchemaType<typeof AuctionSchema>;
AuctionSchema.plugin(paginate)
AuctionSchema.index({endDate:1,status:1,})
AuctionSchema.index({status:1,finalPrice:1})
AuctionSchema.index({title:"text", description:"text"});
//AuctionSchema.index({endDate:1},{expireAfterSeconds:0})

export const AuctionModel = mongoose.model<AuctionDocument, mongoose.PaginateModel<AuctionDocument>>("auctions",AuctionSchema);
