import { env } from "../conf/env";
import { Request, Response } from "express";
import UserModel from "../models/user.model";
import { ApiError, ApiResponse } from "../utils/ApiHelpers";
import mongoose from "mongoose";
import { hashOTP } from "../utils/cryptographer";
import jwt, { JwtPayload } from "jsonwebtoken";
import sendMail from "../utils/sendMail";
import axios from "axios";
import UserService from "../services/user.service";
import handleError from "../utils/HandleError";
import nodeCache from "../services/cache.service";
import BoardModel from "../models/board.model";
import bcrypt from "bcryptjs";
import { toObjectId } from "../utils/toObjectId";

const userService = new UserService();

export const heartbeat = async (req: Request, res: Response) => {
  const token = req.cookies?.__accessToken;
  if (!token) return res.json({ success: false });

  try {
    const decodedToken = jwt.verify(
      token,
      env.ACCESS_TOKEN_SECRET
    ) as JwtPayload;

    if (!decodedToken || typeof decodedToken == "string") {
      throw new ApiError(401, "Invalid Access Token");
    }
    res.status(200).json({ success: true });
  } catch {
    res.status(401).json({ success: false });
  }
};

export const googleCallback = async (req: Request, res: Response) => {
  const code = req.query.code;

  try {
    // 🔄 Exchange code for tokens
    const { data } = await axios.post(
      "https://oauth2.googleapis.com/token",
      null,
      {
        params: {
          code,
          client_id: env.GOOGLE_OAUTH_CLIENT_ID,
          client_secret: env.GOOGLE_OAUTH_CLIENT_SECRET,
          redirect_uri: `${env.SERVER_BASE_URI}/api/public/v1/users/google/callback`,
          grant_type: "authorization_code",
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = data;

    // 🙋 Get user info
    const userInfoRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const user = userInfoRes.data;

    const existingUser = await UserModel.findOne({ email: user.email });

    if (existingUser) {
      const { accessToken, refreshToken } =
        await userService.generateAccessAndRefreshToken(existingUser._id);

      return res
        .status(200)
        .cookie("__accessToken", accessToken, {
          ...userService.options,
          maxAge: userService.accessTokenExpiry,
        })
        .cookie("__refreshToken", refreshToken, {
          ...userService.options,
          maxAge: userService.refreshTokenExpiry,
        })
        .redirect(env.ACCESS_CONTROL_ORIGIN);
    }

    res.redirect(
      `${env.ACCESS_CONTROL_ORIGIN}/auth/oauth/callback?email=${user.email}`
    );
  } catch (err) {
    handleError(
      err as ApiError,
      res,
      "Failed to login with Google",
      "GOOGLE_LOGIN_ERROR"
    );
  }
};

export const handleUserOAuth = async (req: Request, res: Response) => {
  try {
    const { email, username } = req.body;
    if (!email) throw new ApiError(400, "Email is required");

    const createdUser = await UserModel.create({
      username,
      authProvider: "google",
      email,
    });

    if (!createdUser) throw new ApiError(500, "Failed to create user");

    const { accessToken, refreshToken } =
      await userService.generateAccessAndRefreshToken(createdUser._id);

    if (!accessToken || !refreshToken) {
      res
        .status(500)
        .json({ error: "Failed to generate access and refresh token" });
      return;
    }

    res
      .status(201)
      .cookie("__accessToken", accessToken, {
        ...userService.options,
        maxAge: userService.accessTokenExpiry,
      })
      .cookie("__refreshToken", refreshToken, {
        ...userService.options,
        maxAge: userService.refreshTokenExpiry,
      })
      .json({
        message: "Form submitted successfully!",
        data: {
          ...createdUser,
          refreshToken: null,
          password: null,
          email: null,
        },
      });
  } catch (error) {
    handleError(
      error as ApiError,
      res,
      "Failed to register user",
      "REGISTER_USER_ERROR"
    );
  }
};

export const initializeUser = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username)
      throw new ApiError(400, "All fields are required");

    if (await UserModel.findOne({ email }))
      throw new ApiError(400, "User with this email already exists");

    const user = {
      password,
      email,
      username,
      authProvider: "manual",
    };

    const pendingUserCacheSuccess = nodeCache.set(
      `pending:${email}`,
      user,
      300
    );

    if (!pendingUserCacheSuccess) {
      throw new ApiError(500, "Failed to set user in Redis");
    }

    res.status(201).json({
      message: "User initialized successfully and OTP sent",
      email,
    });
  } catch (error) {
    handleError(
      error as ApiError,
      res,
      "Failed to initialize user",
      "INIT_USER_ERROR"
    );
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) throw new ApiError(400, "Email is required");

    const user = nodeCache.get(`pending:${email}`);
    if (!user) throw new ApiError(400, "User not found");

    const { username, password } = user as {
      password: String;
      username: String;
    };

    const createdUser = await UserModel.create({
      username,
      email,
      password,
    });

    if (!createdUser) {
      res.status(400).json({ error: "Failed to create user" });
      return;
    }

    const { accessToken, refreshToken } =
      await userService.generateAccessAndRefreshToken(createdUser._id);

    if (!accessToken || !refreshToken) {
      res
        .status(500)
        .json({ error: "Failed to generate access and refresh token" });
      return;
    }

    nodeCache.del(`pending:${email}`);
    nodeCache.del(`otp:${email}`);

    res
      .status(201)
      .cookie("__accessToken", accessToken, {
        ...userService.options,
        maxAge: userService.accessTokenExpiry,
      })
      .cookie("__refreshToken", refreshToken, {
        ...userService.options,
        maxAge: userService.refreshTokenExpiry,
      })
      .json({
        message: "Form submitted successfully!",
        data: {
          ...createdUser,
          refreshToken: null,
          password: null,
          email: null,
        },
      });
  } catch (error) {
    console.log(error);
    handleError(
      error as ApiError,
      res,
      "Failed to create a user",
      "User with this email already exists"
    );
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });

    if (!existingUser) throw new ApiError(400, "User not found");
    if (!existingUser.password)
      throw new ApiError(
        400,
        "User has no password",
        "NO_PASSWORD_FOUND_ERROR"
      );

    if (!(await bcrypt.compare(password, existingUser.password)))
      throw new ApiError(400, "Invalid password");

    const { accessToken, refreshToken } =
      await userService.generateAccessAndRefreshToken(existingUser._id);

    if (!accessToken || !refreshToken) {
      res
        .status(400)
        .json({ error: "Failed to generate access and refresh token" });
      return;
    }

    res
      .status(200)
      .cookie("__accessToken", accessToken, {
        ...userService.options,
        maxAge: userService.accessTokenExpiry,
      })
      .cookie("__refreshToken", refreshToken, {
        ...userService.options,
        maxAge: userService.refreshTokenExpiry,
      })
      .json({
        message: "User logged in successfully!",
        data: {
          ...existingUser,
          refreshToken: null,
          password: null,
          email: null,
        },
      });
  } catch (error) {
    handleError(error as ApiError, res, "Failed to login", "LOGIN_ERROR");
  }
};

export const getUserData = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    const user = {
      ...req.user,
      password: null,
      refreshToken: null,
    };

    res
      .status(200)
      .json({ message: "User fetched successfully!", data: user || "" });
  } catch (error) {
    handleError(error, res, "Failed to fetch a user", "GET_USER_ERROR");
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) throw new ApiError(401, "Unauthorized request");

    const boards = await BoardModel.find({
      user: toObjectId(req.user._id),
    });

    res.status(200).json({
      message: "User profile fetched successfully!",
      data: {
        ...req.user,
        boards,
      },
    });
  } catch (error) {
    handleError(
      error as ApiError,
      res,
      "Failed to get user profile",
      "GET_USER_PROFILE_ERROR"
    );
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) throw new ApiError(401, "Unauthorized request");

    const { username } = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(
      toObjectId(req.user._id),
      { username }
    );

    if (!updatedUser) throw new ApiError(404, "User not found");

    res
      .status(200)
      .json({ message: "User updated successfully", data: updatedUser });
  } catch (error) {
    handleError(
      error as ApiError,
      res,
      "Failed to update user",
      "UPDATE_USER_ERROR"
    );
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      throw new ApiError(400, "User not found");
    }

    const user = await UserModel.findById(req.user._id);
    if (!user) {
      throw new ApiError(400, "User not found");
    }

    user.refreshToken = "";
    await user.save();

    res
      .status(200)
      .clearCookie("__accessToken", { ...userService.options, maxAge: 0 })
      .clearCookie("__refreshToken", { ...userService.options, maxAge: 0 })
      .json({ message: "User logged out successfully" });
  } catch (error) {
    handleError(error as ApiError, res, "Failed to logout", "LOGOUT_ERROR");
  }
};

export const initializeForgotPassword = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email) throw new ApiError(400, "Username is required");

    const user = await UserModel.findOne({ email });
    if (!user) throw new ApiError(400, "User not found");

    const mailResponse = await sendMail(email, "OTP");
    if (!mailResponse.success)
      throw new ApiError(500, mailResponse.error || "Failed to send OTP");
    if (!mailResponse.otpCode) throw new ApiError(500, "Failed to send OTP");

    const hashedOTP = await hashOTP(mailResponse.otpCode);
    if (!hashedOTP) throw new ApiError(500, "Failed to encrypt OTP");

    const encryptedPassword = await bcrypt.hash(password, 12);

    const passwordResponse = nodeCache.set(
      `password:${user.email}`,
      encryptedPassword,
      300
    );

    if (!passwordResponse) {
      throw new ApiError(500, "Failed to set password in Redis");
    }

    const otpResponse = nodeCache.set(`otp:${user.email}`, hashedOTP, 65);

    if (!otpResponse) {
      throw new ApiError(500, "Failed to set OTP in Redis");
    }

    res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    handleError(
      error as ApiError,
      res,
      "Failed to forgot password",
      "INITIALIZE_FORGOT_PASSWORD_ERROR"
    );
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) throw new ApiError(400, "Username is required");

    const storedPassword: string | undefined = nodeCache.get(
      `password:${email}`
    );
    if (!storedPassword) throw new ApiError(400, "Password not found");

    const user = await UserModel.findOne({ email });
    if (!user) throw new ApiError(400, "User not found");

    const { accessToken, refreshToken } =
      await userService.generateAccessAndRefreshToken(user._id);

    user.refreshToken = refreshToken;
    user.password = storedPassword;
    await user.save({ validateBeforeSave: false });

    nodeCache.del(`forgot:${user.email}`);

    res
      .status(200)
      .cookie("__accessToken", accessToken, {
        ...userService.options,
        maxAge: userService.accessTokenExpiry,
      })
      .cookie("__refreshToken", refreshToken, {
        ...userService.options,
        maxAge: userService.refreshTokenExpiry,
      })
      .json({
        message: "Password updated successfully",
      });
  } catch (error) {
    handleError(
      error as ApiError,
      res,
      "Failed to forgot password",
      "FORGOT_PASSWORD_ERROR"
    );
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const incomingRefreshToken =
      req.cookies.__refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken)
      throw new ApiError(401, "Unauthorized request", "UNAUTHORIZED_REQUEST");

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      env.REFRESH_TOKEN_SECRET
    );

    if (!decodedToken || typeof decodedToken == "string") {
      throw new ApiError(401, "Invalid Access Token");
    }

    const user = await UserModel.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    const { accessToken, refreshToken } =
      await userService.generateAccessAndRefreshToken(
        user._id as mongoose.Types.ObjectId
      );

    user.refreshToken = refreshToken;
    await user.save();

    res
      .status(200)
      .cookie("__accessToken", accessToken, {
        ...userService.options,
        maxAge: userService.accessTokenExpiry,
      })
      .cookie("__refreshToken", refreshToken, {
        ...userService.options,
        maxAge: userService.refreshTokenExpiry,
      })
      .json({ message: "Access token refreshed successfully" });
  } catch (error) {
    handleError(
      error as ApiError,
      res,
      "Failed to refresh access token",
      "REFRESH_ACCESS_TOKEN_ERROR"
    );
  }
};

export const sendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email is required");

  try {
    const mailResponse = await sendMail(email, "OTP");

    if (!mailResponse.success)
      throw new ApiError(500, mailResponse.error || "Failed to send OTP");
    if (!mailResponse.otpCode) throw new ApiError(500, "Failed to send OTP");

    const hashedOTP = await hashOTP(mailResponse.otpCode);
    if (!hashedOTP) throw new ApiError(500, "Failed to encrypt OTP");

    const response = nodeCache.set(`otp:${email}`, hashedOTP, 65);

    if (!response) {
      console.error("Failed to set OTP in Redis:", res);
      throw new ApiError(500, "Failed to set OTP in Redis");
    }

    res.status(200).json({
      messageId: mailResponse.messageId,
      message: "OTP sent successfully",
    });
  } catch (error) {
    handleError(error as ApiError, res, "Failed to send OTP", "SEND_OTP_ERROR");
  }
};

const OtpVerifier = async (email: string, otp: string) => {
  try {
    const storedOtp = nodeCache.get(`otp:${email}`);

    const hashedOTP = await hashOTP(otp);

    if (storedOtp === hashedOTP) {
      nodeCache.del(`otp:${email}`);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) throw new ApiError(400, "Email and OTP are required");
    const result = await OtpVerifier(email, otp);

    if (result) {
      res
        .status(200)
        .json({ message: "OTP verified successfully", isVerified: true });
    } else {
      res.status(400).json({ message: "Invalid OTP", isVerified: false });
    }
  } catch (error) {
    handleError(
      error as ApiError,
      res,
      "Failed to verify OTP",
      "VERIFY_OTP_ERROR"
    );
  }
};

export const searchUsers = async (req: Request, res: Response)=>{
  try {
    
    const { search } = req.params;
    const users = await UserModel.find({
      email: new RegExp(search, "i"),
    });

    const options = users.map((user) => {
      return {
        value: user._id,
        label: user.email,
      };
    });

    res.status(200).json({ message: "Users fetched successfully!", data: options });

  } catch (error) {
     handleError(
      error as ApiError,
      res,
      "Failed to verify OTP",
      "VERIFY_OTP_ERROR"
    );
  }
}