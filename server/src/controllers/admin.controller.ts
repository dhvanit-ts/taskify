import { Request, Response } from "express";
import AdminModel from "../models/admin.model";
import { ApiError } from "../utils/ApiHelpers";
import UserService from "../services/user.service";
import handleError from "../utils/HandleError";
import bcrypt from "bcryptjs";

const userService = new UserService();

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { password, username } = req.body;

    if (!password || !username)
      throw new ApiError(400, "All fields are required");

    const admin = {
      password,
      username,
    };

    const createdAdmin = await AdminModel.create(admin);

    if (!createdAdmin) {
      res.status(400).json({ error: "Failed to create admin" });
      return;
    }

    const { accessToken } =
      await userService.generateAccessAndRefreshToken(createdAdmin._id, true);

    if (!accessToken) {
      res
        .status(500)
        .json({ error: "Failed to generate access and refresh token" });
      return;
    }

    res
      .status(201)
      .cookie("__adminAccessToken", accessToken, {
        ...userService.options,
        maxAge: userService.accessTokenExpiry,
      })
      .json({
        message: "Form submitted successfully!",
        data: {
          ...createdAdmin,
          refreshToken: null,
          password: null,
        },
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

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const existingUser = await AdminModel.findOne({ username });

    if (!existingUser) throw new ApiError(400, "User not found");
    if (!existingUser.password)
      throw new ApiError(
        400,
        "User has no password",
        "NO_PASSWORD_FOUND_ERROR"
      );

    if (!(await bcrypt.compare(password, existingUser.password)))
      throw new ApiError(400, "Invalid password");

    const { accessToken } =
      await userService.generateAccessAndRefreshToken(existingUser._id);

    if (!accessToken) {
      res
        .status(400)
        .json({ error: "Failed to generate access and refresh token" });
      return;
    }

    res
      .status(200)
      .cookie("__adminAccessToken", accessToken, {
        ...userService.options,
        maxAge: userService.accessTokenExpiry,
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

export const getAdminData = async (req: Request, res: Response) => {
  try {
    if (!req.admin || !req.admin._id) {
      res.status(400).json({ error: "Admin not found" });
      return;
    }

    const admin = {
      ...req.admin,
      password: null,
    };

    res
      .status(200)
      .json({ message: "User fetched successfully!", data: admin || "" });
  } catch (error) {
    handleError(error, res, "Failed to fetch a user", "GET_USER_ERROR");
  }
};

export const logoutAdmin = async (req: Request, res: Response) => {
  try {
    if (!req.admin || !req.admin._id) {
      throw new ApiError(400, "User not found");
    }

    const admin = await AdminModel.findById(req.admin._id);
    if (!admin) {
      throw new ApiError(400, "User not found");
    }

    res
      .status(200)
      .clearCookie("__adminAccessToken", { ...userService.options, maxAge: 0 })
      .json({ message: "User logged out successfully" });
  } catch (error) {
    handleError(error as ApiError, res, "Failed to logout", "LOGOUT_ERROR");
  }
};