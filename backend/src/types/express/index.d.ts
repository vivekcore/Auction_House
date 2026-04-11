import { Types } from "mongoose";
import mongoose from "../../db/db.ts";
declare global {
  namespace Express {
    interface Request {
      userId: mongoose.Types.ObjectId,
      name:string,
    }
  }
}