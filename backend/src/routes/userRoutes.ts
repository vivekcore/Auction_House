import {  Router } from "express";
import type { Request, Response } from "express";
import models from "../db/db.js";
import * as z from "zod";
import { hash, compare } from "bcrypt";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { userAuth } from "../middleware/userMiddleware.js";

dotenv.config();
const router: Router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  const userData = req.body;
  const user = z.object({
    username: z.string().min(3).max(20),
    firstname: z.string().max(50),
    lastname: z.string().max(50),
    password: z.string().min(6),
  });
  const response = user.safeParse(userData);
  if (!response.success) {
    res.json({
      msg: "Error: " + response.error.issues.map((i) => i.message),
    });
    return;
  }
  try {
    const password = await hash(userData.password, 10);
    const flag = await models.userModel.findOne({
      username: userData.username,
    });
    if (flag) {
      res.json({
        mag: "Username already taken",
      });
      return;
    }
    const response = await models.userModel?.create({
      username: userData.username,
      firstname: userData.firstname,
      lastname: userData.lastname,
      password: password,
    });
    const payload = { userId: response._id.toString() };
    const token = Jwt.sign(payload, process.env.JWT_SECRET as string);

    const Givebalance = await models.accountsModel.create({
      userId: response._id,
      balance: 1 + Math.random() * 10000
    })
    res.json({
      msg: "Signup sucessfully",
      token,
      response,
      balanceGivne:Givebalance,
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/signin", async (req: Request, res: Response) => {
  const userData = req.body;
  const user = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(6),
  });
  const response = user.safeParse(userData);
  if (!response.success) {
    res.json({
      msg: "Error: " + response.error.issues.map((i) => i.message),
    });
  }
  try {
    const user = await models.userModel.findOne({
      username: userData.username,
    });
    if (!user || !user.password) {
      res.json({
        msg: "Invalid username or password",
      });
      return;
    }
    const response = await compare(userData.password, user?.password);
    if (!response) {
      res.json({
        msg: "Incorrect password",
      });
      return;
    }
    const token = Jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET as string,
    );
    res.json({
      msg: "login sucessfully",
      token,
    });
  } catch (error) {
    res.json({
      msg: error
    })
  }
});

router.put("/update", userAuth, async (req, res) => {
  const userData = req.body;

  const user = z.object({
    firstname: z.string().min(3).optional(),
    lastname: z.string().min(3).optional(),
    password: z.string().min(8).optional(),
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
   const updateData:{password?:string, firstname?:string, lastname?: string} = {};
   if(userData.password){
    const password = await hash(userData.password, 10);
    updateData.password = password;
   } 
   if(userData.firstname) updateData.firstname = userData.firstname;
   if(userData.lastname) updateData.lastname = userData.lastname;
      
      const response = await models.userModel.updateOne(
        //@ts-ignore
        { _id: req.userId },
        {$set:updateData}
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

router.get("/bulk",userAuth,async(req:Request,res:Response) => {
    const {name} = req.query ;

    console.log(name)
    if(!name){
      return res.json({
        msg:"name field required"
      });
    }
    try {
      const response = await models.userModel.find({
        $or: [
          {firstname: {$regex: String(name), $options: "i"}},
          {lastname: {$regex: String(name), $options: "i"}}
        ]
      });
      console.log(response);
      res.json({
        msg: response.map((i) => ({
          usrname: i.username,
          firstname: i.firstname,
          lastname: i.lastname,
          _id: i._id 
        }))
      })
    } catch (error) {
      res.json({
        msg: error
      })
    }
})

export default router;