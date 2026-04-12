import type { NextFunction, Response, Request } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { userService } from "../services/user.services.js";


export const userController = {
  updateUser: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userData = req.body;
      const updatedUser = await userService.updateuser(req.userId, userData);
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      });
    },
  ),

  getAllUsers: catchAsync(async (req:Request,res:Response,next:NextFunction) => {
        const allUsers = await userService.getAllUsers();
        res.status(200).json({
            success:true,
            message: "All Users",
            data: allUsers,
        })
  }),

  searchUser: catchAsync(async (req:Request,res:Response,next:NextFunction) => {
    const userData = req.body;
    const serarchedUsers = await userService.searchUser(userData);
     res.status(200).json({
            success:true,
            message: "Users with your search query ",
            data: serarchedUsers,
        })
  })
};
