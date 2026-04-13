import type { NextFunction, Response, Request } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { accountServices } from "../services/account.services.js";

export const accountController = {
  getUserBalance: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userBalance = await accountServices.getUserBalance(req.userId);
      res.status(200).json({
        success: true,
        message: "User Balnce",
        data: userBalance,
      });
    },
  ),

  transferAmount: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = req.body;
      const moneyTransfered = await accountServices.transferAmount(
        req.userId,
        data,
      );
      res.status(200).json({
        success: true,
        message: "Money transfered sucesssfully",
        data: moneyTransfered,
      });
    },
  ),
};
