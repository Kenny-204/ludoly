import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { authService } from "./auth.service.js";
import catchAsync from "../../core/utils/catchAsync.js";
import { userService } from "../user/user.service.js";

const authRouter = express.Router();

authRouter.post("/signup", catchAsync(authService.signup));
authRouter.post("/login", catchAsync(authService.login));


export default authRouter;
