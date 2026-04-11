
import type { InferSchemaType } from "mongoose";
import mongoose from "../db/db.js";

const userSchema = new mongoose.Schema(
  {
    //better auth feilds
    id: { type: String, required: true},
    name: { type: String },
    email: { type: String, unique: true, sparse: true },
    emailVerified: { type: Boolean, default: false },
    //custom feilds
    username: { type: String, unique: true, sparse: true },
    displayUsername: { type: String },
    image: {
      type: String,
      default: "https://placehold.net/avatar.svg",
    },
    usernameSetup: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "user",
    timestamps: true,
    strict: false,
  },
);
userSchema.index({name:"text",username:"text"});

type userDocument = InferSchemaType<typeof userSchema>;
export const UserModel = mongoose.model<userDocument>("User", userSchema);
