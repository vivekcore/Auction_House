import { Router, type Request, type Response } from "express";
import { userAuth } from "../middleware/userMiddleware.js";
import { auctionController } from "../controllers/auction.controller.js";

const router: Router = Router();

router.post("/create", userAuth,auctionController.createAuction);
router.get("/list", userAuth,auctionController.allActiveAuctions);
router.get("/my", userAuth,auctionController.myAuctons);
router.get("/:id", userAuth, auctionController.findAuctionById);
router.post("/:id/end", userAuth,auctionController.mannualEndAuction);
export default router;
