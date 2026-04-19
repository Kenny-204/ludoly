import type { NextFunction, Request, Response } from "express";
import AppError from "../errors/application.error.js";
import { Jwt } from "../utils/jwt.js";
import config from "../config/config.js";
import { userService } from "../../application/user/user.service.js";

class AuthMiddleware {
  public protect = async (req: Request, res: Response, next: NextFunction) => {
    const jwt = new Jwt(config.auth.JWT_SECRET);
    const token = req.cookies.jwt;

    if (!token) {
      return next(
        new AppError("You are not logged in. Login to gain access", 401),
      );
    }

    const decoded = await jwt.decodeToken(token);
    const currentUser = await userService.findUserById(decoded.id);

    if (!currentUser) {
      return next(new AppError("There is no user for this token", 401));
    }

    req.user = currentUser;

    next();
  };
}


export const authMiddleware = new AuthMiddleware()