import type { Request, Response, NextFunction } from "express";
import * as z from "zod";
import Jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();
export const userAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    res.status(401).json({
      msg: "Headers missing",
    });
    return;
  }
  const token = authHeader.split(" ")[1];
  if(!token){
    return  res.status(401).json({
      msg: "token missing",
    });
  }
  const verify = Jwt.verify(token,process.env.JWT_SECRET as string);
  console.log(verify);
  if(!verify){
    res.json({
        msg: "Unauthrized",
    })
    return;
  }
  //@ts-ignore
  req.userId = verify.userId;
 // const userData = req.body;
 

  next();
};
