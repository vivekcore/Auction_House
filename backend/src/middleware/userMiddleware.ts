import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { getAuth } from "../auth/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import mongoose from "mongoose";

dotenv.config();
export const userAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = getAuth();
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers)
  });
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  console.log(session.user.id);
  req.userId = new mongoose.Types.ObjectId(session.user.id);
  req.name = session.user.name;

  next();
};
