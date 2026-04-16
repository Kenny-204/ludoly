import jwt from "jsonwebtoken";
import config from "../config/config.js";

export class Jwt {
  constructor(private secret: string) {
    this.secret = secret;
  }
  public signToken(id: string) {
    return jwt.sign({ id }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN as any,
    });
  }
}


