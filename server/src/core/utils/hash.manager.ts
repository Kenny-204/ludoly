import bcrypt from "bcryptjs";
import { hash, verify } from "argon2";

class HashManager {
  public async hashPassword(plainPassword: string) {
    return await hash(plainPassword);
  }
  public async comparePassword(plainPassword: string, hashedPassword: string) {
    return await verify(hashedPassword, plainPassword);
  }
}

export const hashManager = new HashManager();
