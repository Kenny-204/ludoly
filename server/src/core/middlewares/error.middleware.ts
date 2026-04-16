import type { NextFunction, Request, Response } from "express";
import AppError from "../errors/application.error.js";

function sendErrorDev(err: AppError, res: Response) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err: err,
    stack: err.stack,
  });
}
function sendErrorProd(err: AppError, res: Response) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log(err);
    res.status(500).json({
      status: "Error",
      message: "Something went wrong",
    });
  }
}
export default (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Something went wrong";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = err;
    sendErrorProd(error, res);
  }

  next();
};
