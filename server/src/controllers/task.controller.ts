import { Request, Response, NextFunction } from "express";
import { ApiResponse, AsyncHandler } from "../utils/ApiHelpers";
import { ITask } from "../types/ITask";
import taskModel from "../models/task.model";
import { toObjectId } from "../utils/toObjectId";

const createTask = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, priority, status, dueDate, assignedTo, board } =
      req.body;

    if (!title)
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "All fields are required"));

    const task: ITask = {
      title,
      description: description ?? "",
      priority: priority ?? "low",
      status: status ?? "to-do",
      board,
    };

    if (dueDate) task.dueDate = new Date(dueDate);
    if (assignedTo) task.assignedTo = assignedTo;

    const newTask = await taskModel.create(task);

    if (!newTask)
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Failed to create a task"));

    return res
      .status(201)
      .json(new ApiResponse(201, newTask, "Task created successfully!"));
  }
);

const updateTask = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) throw new ApiResponse(400, {}, "Task id is required");

    const { title, description, priority, status, dueDate, assignedTo, board } =
      req.body;

    if (!title)
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "All fields are required"));

    const task: ITask = {
      title,
      description: description ?? "",
      priority: priority ?? "low",
      status: status ?? "to-do",
      board,
    };

    if (dueDate) task.dueDate = new Date(dueDate);
    if (assignedTo) task.assignedTo = assignedTo;

    const updatedTask = await taskModel.findByIdAndUpdate(
      toObjectId(id),
      task,
      {
        new: true,
      }
    );

    if (!updatedTask)
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Failed to update a task"));

    return res
      .status(200)
      .json(new ApiResponse(200, updatedTask, "Task updated successfully!"));
  }
);

const getTodosById = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) throw new ApiResponse(400, {}, "Task id is required");

    const tasks = await taskModel.find({
      board: toObjectId(id),
    });

    return res
      .status(200)
      .json(new ApiResponse(200, tasks, "Tasks fetched successfully!"));
  }
);

export { createTask, updateTask, getTodosById };
