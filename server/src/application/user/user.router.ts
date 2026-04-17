import express from "express";
import authRouter from "../auth/auth.router.js";
import { authService } from "../auth/auth.service.js";
import { userService } from "./user.service.js";
import catchAsync from "../../core/utils/catchAsync.js";

const userRouter = express.Router();

userRouter.get(
  "/me",
  catchAsync(authService.protect),
  catchAsync(userService.getUser),
);


export default userRouter