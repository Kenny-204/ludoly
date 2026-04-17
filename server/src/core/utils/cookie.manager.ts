import type { Response } from "express";

class CookieManager {
  public sendCookie(name:string, value:any, res:Response) {
    return res.cookie(name, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
  }
}

export const cookieManager = new CookieManager()