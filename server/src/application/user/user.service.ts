import type { Document } from "mongoose";
import User from "../../core/models/user.model.js";
import catchAsync from "../../core/utils/catchAsync.js";
import AppError from "../../core/errors/application.error.js";

type CreateUserInput = {
  username: string;
  password: string;
  passwordConfirm: string;
  email: string;
};
type UserDocument = Document & CreateUserInput;

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
}

export const userService = new UserService();
