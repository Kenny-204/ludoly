import express, { type NextFunction, type Request, type Response } from "express";
import globalErrorHandler from "./core/middlewares/error.middleware.js";
import authRouter from "./application/auth/auth.router.js";
import AppError from "./core/errors/application.error.js";
import userRouter from "./application/user/user.router.js";
import cookieParser from "cookie-parser";
import { redisClient } from "./core/providers/redis.js";
import cors from "cors";
import config from "./core/config/config.js";
import { WebSocketManager } from "./sockets/ws.server.js";

const app = express();

redisClient.connect();

// console.log(redisClient);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://ludoly.vercel.app",
    credentials: true,
  }),
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

app.use("/{*any}", function (req:Request, res:Response, next:NextFunction) {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});
app.use(globalErrorHandler);

export default app;
