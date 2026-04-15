import User from "../../core/models/user.model.js";
import catchAsync from "../../core/utils/catchAsync.js";

class UserService {
  public async createUser(newUser: {
    username: string;
    password: string;
    passwordConfirm: string;
    email: string;
  }) {
    try {
      const createdUser = await User.create({
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        passwordConfirm: newUser.passwordConfirm,
      });

      return createdUser;
    } catch (err) {
      console.error(err);
    }
  }

  public async findUser(email: string) {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (err) {
      console.error(err);
    }
  }
}



export const userService = new UserService()