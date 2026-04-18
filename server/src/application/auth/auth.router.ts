import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { authController } from "./auth.controller.js";
import catchAsync from "../../core/utils/catchAsync.js";
import { userService } from "../user/user.service.js";

const authRouter = express.Router();

authRouter.post("/signup", catchAsync(authController.signup));
authRouter.post("/login", catchAsync(authController.login));


export default authRouter;
