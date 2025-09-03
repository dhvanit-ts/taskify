import { IBoard } from "./IBoard";

export interface ITask {
  title: string;
  description: string
  priority: "high" | "medium" | "low";
  status: "to-do" | "in-progress" | "done";
  dueDate?: Date;
  board: string | IBoard;
  assignedTo?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
