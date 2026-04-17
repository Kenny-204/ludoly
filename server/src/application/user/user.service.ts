import type { Document } from "mongoose";
import User from "../../core/models/user.model.js";
import catchAsync from "../../core/utils/catchAsync.js";
import AppError from "../../core/errors/application.error.js";
import type { NextFunction, Request, Response } from "express";

type CreateUserInput = {
  username: string;
  password: string;
  passwordConfirm: string;
  email: string;
};
export type UserDocument = Document & CreateUserInput;

class UserService {
  public async createUser(newUser: CreateUserInput): Promise<UserDocument> {
    try {
      const createdUser = await User.create({
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        passwordConfirm: newUser.passwordConfirm,
      });

      return createdUser;
    } catch (err: any) {
      if (err.code === 11000) {
        throw new AppError("This user already exists, please login", 409);
      }
      throw err;
    }
  }

  public async findUser(email: string): Promise<UserDocument | null> {
    try {
      const user = await User.findOne({ email }).select("+password");
      return user;
    } catch (err) {
      throw err;
    }
  }
  public async getUser(req: Request, res: Response, next: NextFunction) {
    const user = req.user;

    res.status(200).json({
      status: "success",
      user,
    });
  }
}

export const userService = new UserService();
