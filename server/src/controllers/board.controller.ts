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
    }).populate("members");

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

const updateBoard = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.admin) throw new ApiError(404, "Unauthorized");

    const { id } = req.params;
    if (!id) throw new ApiResponse(400, {}, "Board id is required");

    const { name, members } = req.body;
    if (!name) throw new ApiResponse(400, {}, "Board name is required");

    const adminId = req.admin._id;

    const updatedBoard = await BoardModel.findByIdAndUpdate(
      toObjectId(id.toString()),
      {
        name,
        members: members ?? [],
        admin: adminId,
      },
      { new: true }
    );
    if (!updatedBoard)
      throw new ApiError(400, "Failed to update board");

    return res
      .status(200)
      .json(new ApiResponse(200, updatedBoard, "Board updated!"));
  }
);

export { getAllBoards, createBoard, updateBoard };
