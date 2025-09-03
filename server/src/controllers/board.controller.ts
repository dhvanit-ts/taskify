import { Request, Response, NextFunction } from "express";
import { ApiError, ApiResponse, AsyncHandler } from "../utils/ApiHelpers";
import BoardModel from "../models/board.model";
import { toObjectId } from "../utils/toObjectId";

const getAllBoards = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

    if(!req.user) throw new ApiError(404, "Unauthorized")
    const adminId = req.user._id

    const boards = await BoardModel.find({
        admin: toObjectId(adminId)
    })

    const boardsWithMemberCount = Array.from(boards).map(board => ({...board, membersCount: board.members.length}))

    return res
      .status(200)
      .json(new ApiResponse(200, boardsWithMemberCount, "Boards fetched!"));
  }
);

const createBoard = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    if (!name) throw new ApiResponse(400, {}, "Board name is required");

    const existingBoard = await BoardModel.findOne({ name });
    if (existingBoard) throw new ApiResponse(400, {}, "Board already exists");

    const newBoard = await BoardModel.create({ name });
    return res
      .status(200)
      .json(new ApiResponse(200, newBoard, "Board created!"));
  }
);

export { getAllBoards, createBoard };
