import type { UserDocument } from "../../application/user/user.service.js";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}
