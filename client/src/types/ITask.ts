import { IBoard } from "./IBoard";

export type TPriority = "high" | "medium" | "low";
export type TStatus = "to-do" | "in-progress" | "done";

export interface ITask {
  _id: string;
  title: string;
  description: string;
  priority: TPriority;
  status: TStatus;
  dueDate: Date;
  board: string | IBoard;
  assignedTo: string;
  createdAt?: Date;
  updatedAt?: Date;
}
