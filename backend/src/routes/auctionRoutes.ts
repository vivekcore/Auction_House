import { Router, type Request, type Response } from "express";
import { userAuth } from "../middleware/userMiddleware.js";
import z from "zod";
import { AuctionModel } from "../models/auctionModel.js";
import { AuctionStatus } from "../middleware/checkAuctionState.js";
import mongoose from "../db/db.js";
import { AccountModel } from "../models/accoountModel.js";

const router: Router = Router();

router.post("/create", userAuth, async (req: Request, res: Response) => {
  const auctionData = req.body;
  const auction = z.object({
    title: z.string().min(5).max(100),
    description: z.string().min(10).max(500),
    sellingPrice: z.number().min(5),
  });
  const zodResponse = auction.safeParse(auctionData);
  if (zodResponse.error) {
    return res.status(400).json({
      message: zodResponse.error.issues.map((i) => {
        path: i.path;
        message: i.message;
      }),
    });
  }

  try {
    const checkbalance = await AccountModel.findById(req.userId);
    if(checkbalance)
    if(checkbalance.balance < 5 || checkbalance?.balance < auctionData.sellingPrice){
        return res.json({
            message:"insufficient balance"
        })
    }
    const response = AuctionModel.create({
      title: auctionData.title,
      description: auctionData.description,
      status: "active",
      sellingPrice:auctionData.sellingPrice,
      sellerId: new mongoose.Types.ObjectId(req.userId),
      endtime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    res.status(200).json({
      message: "Auction creaated sucessfully",
      AuctionDetails: response,
    });
  } catch (error) {
    res.status(500).json({
      Error: error,
    });
  }
});

router.get("/list", userAuth ,async (req: Request, res: Response) => {
  try {
     const updatedDocs = await AuctionModel.find({status: "active"});
      res.status(200).json({
        message:"All active auctions",
        Auctions: updatedDocs,
      })

  } catch (error) {
    res.status(500).json({
        Error: error,
    })
  }
});

router.get("/:id", userAuth, async (req: Request, res: Response) => {
    const id = req.params.id
   
    try {
        const response = await AuctionModel.findById(id);
        res.status(200).json({
            Auction:response,
        })
    } catch (error) {
        res.status(500).json({
            Errro: error,
        })
    }
});

export default router;
