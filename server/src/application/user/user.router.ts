import express from "express";
import catchAsync from "../../core/utils/catchAsync.js";
import { userController } from "./user.controller.js";
import { authMiddleware } from "../../core/middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.get(
  "/me",
  catchAsync(authMiddleware.protect),
  catchAsync(userController.getUser),
);

export default userRouter;
