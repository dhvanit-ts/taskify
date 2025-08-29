import { Request, Response, NextFunction } from "express";
import { ApiResponse, AsyncHandler } from "../utils/ApiHelpers";
import { ITask } from "../types/ITask";
import taskModel from "../models/task.model";

const createTask = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, priority, status, dueDate, assignedTo } =
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

export { createTask };
