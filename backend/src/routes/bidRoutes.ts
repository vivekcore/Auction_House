import { Router, type Request, type Response } from "express";
import { userAuth } from "../middleware/userMiddleware.js";
import { bidController } from "../controllers/bid.controller.js";

const router: Router = Router();

router.post("/place", userAuth, bidController.placeBid);
router.get("/my", userAuth,bidController.myBids);
router.get("/:auctionId", userAuth,bidController.getAllBidsOnAuction);

export default router;
