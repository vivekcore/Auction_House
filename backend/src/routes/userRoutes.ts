import { Router } from "express";
import type { Request, Response } from "express";
import * as z from "zod";
import dotenv from "dotenv";
import { userAuth } from "../middleware/userMiddleware.js";
import { UserModel } from "../models/userModel.js";
dotenv.config();
const router: Router = Router();

router.put("/update", userAuth, async (req, res) => {
  const userData = req.body;

  const user = z.object({
    name: z.string().min(3).optional(),
    username: z.string().min(3).optional(),
  });
  const response = user.safeParse(userData);
  if (response.error) {
    res.json({
      msg:
        "Error: " +
        response.error.issues.map((i) => {
          Path: i.path;
          Message: i.message;
        }),
    });
    return;
  }
  try {
    const updateData: { username?: string; name?: string } = {};

    if (userData.username) {
      const isExist = await UserModel.find({ username: userData.username });

      if (isExist.length !== 0) {
        return res.json({
          message: "Username alredy taken try different username!",
        });
      }
      updateData.username = userData.username;
    }

    if (userData.name) updateData.name = userData.name;

    const response = await UserModel.updateOne(
      { _id: req.userId },
      { $set: updateData },
    );
    res.json({
      msg: "updated",
      response,
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.get("/bulk", userAuth, async (req: Request, res: Response) => {
  try {
    const response = await UserModel.find();
    console.log(response);
    res.json({
      msg: response,
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.get("/search", userAuth, async (req: Request, res: Response) => {
  const { name } = req.query;
  console.log(name);
  if (!name) {
    return res.json({
      msg: "name field required",
    });
  }
  try {
    const response = await UserModel.find({
      $or: [
        { username: { $regex: name, $options: "i" } },
        { name: { $regex: name, $options: "i" } },
      ],
    } as any);
    console.log(response);
    res.json({
      msg: response,
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

export default router;
