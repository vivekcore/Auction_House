import z from "zod";
import ApiError from "../utils/apiError.js";
import { formatZodError } from "../utils/zodError.js";
import { UserModel } from "../models/userModel.js";
import type mongoose from "mongoose";

export const userService = {

  async updateuser(id: mongoose.Types.ObjectId, userData: any) {
    const user = z.object({
      name: z.string().min(3, "Name must be at least 3 characters").optional(),
      username: z.string().min(3, "Username must be at least 3 characters").optional(),
    });

    const zodResponse = user.safeParse(userData);

    if (zodResponse.error) {
      throw new ApiError(400, formatZodError(zodResponse.error));
    }

    const updateData: { username?: string; name?: string } = {};

    if (userData.username) {
      const isExist = await UserModel.find({ username: userData.username });

      if (isExist.length !== 0) {
        throw new ApiError(409, "Username is already taken. Please choose a different one.");
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

  async getAllUsers() {
    const allUsers = await UserModel.find();
    if (!allUsers || allUsers.length === 0) {
      throw new ApiError(404, "No users found");
    }
    return allUsers;
  },

  async searchUser(userData: any) {
    if (!userData.name || userData.name.trim() === "") {
      throw new ApiError(400, "Search query is required");
    }

    const searchedUsers = await UserModel.find({
      $or: [
        { username: { $regex: userData.name, $options: "i" } },
        { name: { $regex: userData.name, $options: "i" } },
      ],
    });

    if(!searchedUsers || searchedUsers.length === 0){
        throw new ApiError(404, "No users found matching your search");
    }
    return searchedUsers;
  },
};
