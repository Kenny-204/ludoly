import type { NextFunction, Request, Response } from "express";
import { userService } from "../user/user.service.js";
import AppError from "../../core/errors/application.error.js";
import { Jwt } from "../../core/utils/jwt.js";
import config from "../../core/config/config.js";
import { hashManager } from "../../core/utils/hash.manager.js";

class AuthService {
  private tokens;
  constructor() {
    this.tokens = new Jwt(config.JWT_SECRET);
  }
  public signup = async (req: Request, res: Response, next: NextFunction) => {
    const newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    };

    const createdUser = await userService.createUser(newUser);
    const token = this.tokens.signToken(String(createdUser._id));

    res.status(201).json({
      status: "success",
      token,
      createdUser,
    });
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide your email and password", 401));
    }

    const user = await userService.findUser(email);

    if (!user || !(await hashManager.comparePassword( password,user.password))) {
      return next(new AppError("Email or password is incorrect, ", 401));
    }

    const token = this.tokens.signToken(String(user._id));

    res.status(200).json({
      status: "success",
      token,
    });
  };
}

export const authService = new AuthService();
