import type { NextFunction, Request, Response } from "express";

class AuthService {
  public async signup(req: Request, res: Response, next: NextFunction) {
    const newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    };

    // const createUser = UserS
  }
}
