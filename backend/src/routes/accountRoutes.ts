import { Router } from "express";
import { userAuth } from "../middleware/userMiddleware.js";
import { accountController } from "../controllers/account.controller.js";

const router: Router = Router();

router.get("/balance", userAuth,accountController.getUserBalance);
router.post("/transfer", userAuth,accountController.transferAmount);
export default router;
