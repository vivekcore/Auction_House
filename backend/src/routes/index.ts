import { Router } from "express"
import userRouter from "./userRoutes.js";
import accountRouter from "./accountRoutes.js";

const router:Router = Router();
router.use("/user",userRouter);

router.use("/account",accountRouter);
export default router