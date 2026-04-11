import { Router, type Request, type Response } from "express";
import { userAuth } from "../middleware/userMiddleware.js";
import z from "zod";
import { AuctionModel } from "../models/auctionModel.js";
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
    const response = AuctionModel.create({
      title: auctionData.title,
      description: auctionData.description,
      sellingPrice: auctionData.sellingPrice,
      sellerId: req.userId,
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
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

router.get("/list", userAuth, async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  try {
    const result = await AuctionModel.paginate(
      {
        endDate: { $gt: new Date() },
        status: "active",
      },
      {
        page,
        limit,
        sort: { createdAt: -1 },
        lean: true,
      },
    );
    res.status(200).json({
      message: "Fetched docs",
      data: result.docs,
      total: result.totalDocs,
      page: result.page,
      totalPages: result.totalPages,
      hasNext: result.hasNextPage,
      hasPrev: result.hasPrevPage,
    });
  } catch (error) {
    res.status(500).json({
      Error: error,
    });
  }
});

router.get("/:id", userAuth, async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Missing or invalid id parameter" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ObjectId format" });
    }

    const response = await AuctionModel.findById(
      new mongoose.Types.ObjectId(id),
    );
    res.status(200).json({
      Auction: response,
    });
  } catch (error) {
    res.status(500).json({
      Errro: error,
    });
  }
});

router.get("/my", userAuth, async (req: Request, res: Response) => {
   const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  try {
    const result = await AuctionModel.paginate(
      {sellerId:req.userId},
      {
        page,
        limit,
        sort: {createdAt: -1},
        lean: true,
      }
    )
    res.status(200).json({
      Message:  "My Auctions",
    data:       result.docs,
    total:      result.totalDocs,
    page:       result.page,
    totalPages: result.totalPages,
    hasNext:    result.hasNextPage,
    hasPrev:    result.hasPrevPage,
    });
  } catch (error) {
    res.status(500).json({
      Error: error,
    });
  }
});

router.post("/:id/end", userAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Missing or invalid id parameter" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ObjectId format" });
    }
    const isExist = await AuctionModel.findById(
      new mongoose.Types.ObjectId(id),
    );
    if (!isExist) {
      return res.status(400).json({
        message: "Auction does not exist",
      });
    }
    if (isExist.status === "active") {
      if (isExist.sellerId && isExist.sellerId === req.userId) {
        await AuctionModel.findByIdAndUpdate(id, { status: "ended" });
        return res.status(200).json({
          message: "Auction status changed to ended",
        });
      }
    } else {
      return res.status(400).json({
        message: "Auction already ended",
      });
    }
  } catch (error) {
    res.status(500).json({
      Error: error,
    });
  }
});
export default router;
