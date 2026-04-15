import bcrypt from "bcryptjs";
import { hash, verify } from "argon2";

class HashManager {
  public async hashPassword(plainPassword: string) {
    return await hash(plainPassword);
  }
  public comparePassword(input: string, password: string) {}
}


export const hashManager = new HashManager()