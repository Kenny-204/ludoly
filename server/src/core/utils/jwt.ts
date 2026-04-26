import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config/config.js";
import { promisify } from "util";

type AppJwtPayload = JwtPayload & {
  _id: string;
};

export class Jwt {
  constructor(private secret: string) {
    this.secret = secret;
  }
  public signToken(id: string) {
    return jwt.sign({ id }, this.secret, {
      expiresIn: config.auth.JWT_EXPIRES_IN as any,
    });
  }
  public async decodeToken(token: string): Promise<AppJwtPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secret, (err: any, decoded: any) => {
        if (err) return reject(err);
        resolve(decoded as AppJwtPayload);
      });
    });
  }
}
