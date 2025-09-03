import { env } from "../conf/env";
import { randomUUID } from "crypto";
import { ApiError } from "../utils/ApiHelpers";
import { Request } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { IUser } from "../types/IUser";
import { Types } from "mongoose";

class UserService {
  options: null | {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "none" | "lax";
    domain: string;
  } = null;
  adminAccessTokenExpiry =
    60 * 1000 * parseInt(env.ADMIN_ACCESS_TOKEN_EXPIRY || "0");
  accessTokenExpiry = 60 * 1000 * parseInt(env.ACCESS_TOKEN_EXPIRY || "0"); // In minutes
  refreshTokenExpiry =
    60 * 60 * 1000 * 24 * parseInt(env.REFRESH_TOKEN_EXPIRY || "0"); // In days

  constructor() {
    this.options = {
      httpOnly: true,
      secure: env.ENVIRONMENT === "production",
      domain:
        env.ENVIRONMENT === "production"
          ? env.ACCESS_CONTROL_ORIGIN || "localhost"
          : "localhost",
      sameSite:
        env.ENVIRONMENT === "production"
          ? ("none" as "none")
          : ("lax" as "lax"),
    };
  }

  generateAccessToken(id: string, username: string, isAdmin: boolean = false) {
    return jwt.sign(
      {
        id,
        username,
      },
      isAdmin ? env.ADMIN_ACCESS_TOKEN_SECRET : env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: `${parseInt(isAdmin ? env.ADMIN_ACCESS_TOKEN_EXPIRY :  env.ACCESS_TOKEN_EXPIRY || "0")}m`,
      }
    );
  }

  generateRefreshToken(id: string, username: string) {
    return jwt.sign(
      {
        id,
        username,
      },
      env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: `${parseInt(env.REFRESH_TOKEN_EXPIRY || "0")}d`,
      }
    );
  }

  async generateAccessAndRefreshToken(
    userId: Types.ObjectId,
    isAdmin: boolean = false
  ) {
    try {
      const user = (await User.findById(userId)) as IUser | null;

      if (!user) throw new ApiError(404, "User not found");

      const accessToken = this.generateAccessToken(
        user._id.toString(),
        user.username,
        isAdmin
      );
      const refreshToken = this.generateRefreshToken(
        user._id.toString(),
        user.username
      );

      user.refreshToken = refreshToken;

      await User.findByIdAndUpdate(user._id, {
        refresh_token: user.refreshToken,
      });

      return { accessToken, refreshToken };
    } catch (error) {
      console.log(error);
      throw new ApiError(
        500,
        "Something went wrong while generating access and refresh token"
      );
    }
  }
}

export default UserService;
