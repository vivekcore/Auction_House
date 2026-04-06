import mongoose from "mongoose";
import { Types } from "mongoose";
const User = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    require: true,
    minLength: 3,
    maxLength: 20,
    trim: true,
    lowercase: true,
  },
  firstname: { type: String, require: true, maxLength: 50, trim: true },
  lastname: { type: String, require: true, maxLength: 50, trim: true },
  password: { type: String, require: true, minLength: 6 },
});
const Accounts = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  balance: { type: Number },
});
User.index({
  firstname: "text",
  lastname: "text",
});
const userModel = mongoose.model("User", User);
const accountsModel = mongoose.model("Accounts",Accounts);
export default { userModel, accountsModel };
