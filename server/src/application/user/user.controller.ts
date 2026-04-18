import type { NextFunction, Request, Response } from "express";

class UserController {
  public async getUser(req: Request, res: Response, next: NextFunction) {
    const user = req.user;

    res.status(200).json({
      status: "success",
      user,
    });
  }
}

export const userController = new UserController();
