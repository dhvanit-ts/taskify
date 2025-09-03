import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiHelpers";
import jwt, { JwtPayload } from "jsonwebtoken";
import handleError from "../utils/HandleError";
import { env } from "../conf/env";
import User from "../models/user.model";
import Admin from "../models/admin.model";
import { toObjectId } from "../utils/toObjectId";

const verifyUserJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.__accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");
    }

    const decodedToken = jwt.verify(
      token,
      env.ACCESS_TOKEN_SECRET
    ) as JwtPayload;

    if (!decodedToken || typeof decodedToken == "string") {
      throw new ApiError(401, "Invalid Access Token", "UNAUTHORIZED");
    }

    const user = await User.findById(toObjectId(decodedToken.id));

    if (!user) {
      throw new ApiError(401, "Invalid Access Token", "UNAUTHORIZED");
    }

    if (!user.refreshToken) {
      throw new ApiError(
        401,
        "Refresh token session is not valid",
        "UNAUTHORIZED"
      );
    }

    const mappedUser = {
      ...user,
      password: null,
      refresh_token: null,
    };

    req.user = mappedUser;
    next();
  } catch (error) {
    handleError(error, res, "Invalid Access Token", "UNAUTHORIZED");
  }
};

const verifyAdminJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.__adminAccessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token)
      throw new ApiError(401, "Admin access token not found", "UNAUTHORIZED");

    if (!env.ADMIN_ACCESS_TOKEN_SECRET)
      throw new ApiError(
        500,
        "Admin access token secret not found",
        "UNAUTHORIZED"
      );
      
      const decodedToken = jwt.verify(
        token,
        env.ADMIN_ACCESS_TOKEN_SECRET
      ) as JwtPayload;
    
    const admin = await Admin.findById(toObjectId(decodedToken?.id))
    .select("-password")
      .lean();

    if (!admin) {
      throw new ApiError(401, "Invalid Admin Access Token", "UNAUTHORIZED");
    }

    req.admin = {
      _id: admin._id,
    };

    next();
  } catch (error) {
    handleError(error, res, "Invalid Admin Access Token", "UNAUTHORIZED");
  }
};

export { verifyUserJWT, verifyAdminJWT };
