import z from "zod";
import ApiError from "../utils/apiError.js";
import { UserModel } from "../models/userModel.js";
import type mongoose from "mongoose";

export const userService = {

  //Update user function
  async updateuser(id: mongoose.Types.ObjectId, userData: any) {
    const user = z.object({
      name: z.string().min(3).optional(),
      username: z.string().min(3).optional(),
    });

    const zodResponse = user.safeParse(userData);

    if (zodResponse.error) {
      throw new ApiError(400, "Invalid inputs");
    }

    const updateData: { username?: string; name?: string } = {};

    if (userData.username) {
      const isExist = await UserModel.find({ username: userData.username });

      if (isExist.length !== 0) {
        throw new ApiError(409, "Username already taken");
      }
      updateData.username = userData.username;
    }

    if (userData.name) updateData.name = userData.name;

    const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      throw new ApiError(404, "User not found");
    }

    return updateData;
  },

  //Get All users function
  async getAllUsers() {
    const allUsers = await UserModel.find();
    if (!allUsers) {
      throw new ApiError(404, "Users not found");
    }
    return allUsers;
  },

  //All users wiht matching searh query
  async searchUser(userData: any) {
    if (!userData.name) {
      throw new ApiError(400, "Name is missing");
    }

    const searchedUsers = await UserModel.find({
      $or: [
        { username: { $regex: userData.name, $options: "i" } },
        { name: { $regex: userData.name, $options: "i" } },
      ],
    });

    if(!searchedUsers){
        throw new ApiError(400,"users not found");
    }
    return searchedUsers;
  },
};
