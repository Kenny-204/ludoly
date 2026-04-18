import express from "express";
import globalErrorHandler from "./core/middlewares/error.middleware.js";
import authRouter from "./application/auth/auth.router.js";
import AppError from "./core/errors/application.error.js";
import userRouter from "./application/user/user.router.js";
import cookieParser from 'cookie-parser'

const app = express();

app.use(express.json());
app.use(cookieParser())


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);


app.use("/{*any}", function (req, res, next) {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});
app.use(globalErrorHandler);

export default app;
