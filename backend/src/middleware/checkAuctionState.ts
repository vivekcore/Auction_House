import type { NextFunction, Request, Response } from "express";
import { AuctionModel } from "../models/auctionModel.js";

export const AuctionStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await AuctionModel.find({ status: "active" });
     response.map(async (i) =>  {
      if (i.endtime) {
        if ( i.endtime <= new Date()) {
          ((i.status = "ended"), await i.save());
        }
      }
    });
    next();
  } catch (error) {
    res.status(500).json({
      Errro: error,
    });
  }
};
