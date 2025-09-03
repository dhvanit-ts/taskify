import { Request, Response, NextFunction } from "express";
import { ApiError, ApiResponse, AsyncHandler } from "../utils/ApiHelpers";
import BoardModel from "../models/board.model";
import { toObjectId } from "../utils/toObjectId";

const getAllBoards = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.admin) throw new ApiError(404, "Unauthorized");
    const adminId = req.admin._id;

    const boards = await BoardModel.find({
      admin: toObjectId(adminId),
    });

    return res
      .status(200)
      .json(new ApiResponse(200, boards, "Boards fetched!"));
  }
);

const createBoard = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.admin) throw new ApiError(404, "Unauthorized");

    const { name, members } = req.body;
    if (!name) throw new ApiResponse(400, {}, "Board name is required");

    const adminId = req.admin._id;

    const existingBoard = await BoardModel.findOne({
      name,
      members: members ?? [],
      admin: adminId,
    });
    if (existingBoard) throw new ApiResponse(400, {}, "Board already exists");

    const newBoard = await BoardModel.create({ name, admin: adminId });
    return res
      .status(200)
      .json(new ApiResponse(200, newBoard, "Board created!"));
  }
);

export { getAllBoards, createBoard };
