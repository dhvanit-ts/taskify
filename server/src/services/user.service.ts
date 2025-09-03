import { env } from "../conf/env";
import { ApiError } from "../utils/ApiHelpers";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { IUser } from "../types/IUser";
import { IAdmin } from "../types/IAdmin";
import { Document, Types } from "mongoose";
import adminModel from "../models/admin.model";

type IUserDocument = Document<
  unknown,
  {},
  {
    createdAt: NativeDate;
    updatedAt: NativeDate;
  } & IUser,
  {},
  {
    timestamps: true;
  }
> & {
  createdAt: NativeDate;
  updatedAt: NativeDate;
} & IUser & {
  _id: Types.ObjectId;
} & {
  __v: number;
};

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
        expiresIn: `${parseInt(
          isAdmin
            ? env.ADMIN_ACCESS_TOKEN_EXPIRY
            : env.ACCESS_TOKEN_EXPIRY || "0"
        )}m`,
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
      let user: null | IAdmin | IUserDocument = null;
      if (isAdmin) {
        user = (await adminModel.findById(userId)) as IAdmin | null;
        if (!user) throw new ApiError(404, "Admin not found");
      } else {
        user = await User.findById(userId) as IUserDocument | null;
        if (!user) throw new ApiError(404, "User not found");
      }

      const accessToken = this.generateAccessToken(
        user._id.toString(),
        user.username,
        isAdmin
      );
      const refreshToken = this.generateRefreshToken(
        user._id.toString(),
        user.username
      );

      if (typeof user === "object" && user !== null && "refreshToken" in user) {
        user.refreshToken = refreshToken;
        await user.save();
      }

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
