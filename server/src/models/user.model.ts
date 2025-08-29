import { env } from "../conf/env";
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    authProvider: {
      type: String,
      enum: ["manual", "google"],
      default: "manual",
    },
    password: {
      type: String,
      required: function (this: any): boolean {
        return this.authProvider === "local";
      },
      default: null,
    },
    refreshToken: {
        type: String,
        default: null
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      isVerified: this.isVerified,
    },
    env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: `${parseInt(env.ACCESS_TOKEN_EXPIRY)}m`,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: `${parseInt(env.REFRESH_TOKEN_EXPIRY)}d`,
    }
  );
};

const userModel = mongoose.model("User", userSchema);

export default userModel;