import { Router } from "express";
import { userAuth } from "../middleware/userMiddleware.js";
import { userController } from "../controllers/user.controller.js";
const router: Router = Router();

router.put("/update", userAuth, userController.updateUser);
router.get("/bulk", userAuth, userController.getAllUsers);
router.get("/search", userAuth, userController.searchUser);

export default router;
