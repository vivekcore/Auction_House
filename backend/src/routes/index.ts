import { Router } from "express"
import userRouter from "./userRoutes.js";
import accountRouter from "./accountRoutes.js";
import auctionRouter from "./auctionRoutes.js";
import bidRouter from "./bidRoutes.js";
const router:Router = Router();
router.use("/user",userRouter);
router.use("/account",accountRouter);
router.use("/auction",auctionRouter);
router.use("/bid",bidRouter);
export default router