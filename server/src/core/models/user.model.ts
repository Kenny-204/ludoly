import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import { hashManager } from "../utils/hash.manager.js";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide your email"],
    lowercase: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "Please provide a valid email",
    },
  },

  username: {
    type: String,
    required: [true, "Please tell us your name"],
    minLength: [4, "Your username should be at least 4 characters"],
    maxLength: [24, "Your username should be at most 24 characters"],
  },

  password: {
    type: String,
    required: [true, "Please provie a password"],
    minLength: [8, "Your password should be at least 8 characters"],
    select: false,
  },

  passwordConfirm: {
    type: String ,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (val: string) {
        return val === this.password;
      },
      message: "Passwords are not the same",
    },
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await hashManager.hashPassword(this.password);
  this.passwordConfirm = undefined;
});

const User = mongoose.model("users", userSchema);

export default User;
