export interface INotification {
  _id: string;
  seen: boolean;
  title: string;
  message: string;
  type: "task_assigned" | "task_updated" | "task_moved";
  actor: string;
  board: string;
  task: string;
  createdAt?: Date;
  updatedAt?: Date;
}
