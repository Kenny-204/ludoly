import express from "express";
import authRouter from "../auth/auth.router.js";
import { authController } from "../auth/auth.controller.js";
import catchAsync from "../../core/utils/catchAsync.js";
import { userController } from "./user.controller.js";

const userRouter = express.Router();

userRouter.get(
  "/me",
  catchAsync(authController.protect),
  catchAsync(userController.getUser),
);

export default userRouter;
