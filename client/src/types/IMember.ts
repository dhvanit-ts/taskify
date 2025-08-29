export interface IMember {
  _id: string;
  user: string;
  board: string;
  role: "admin" | "user";
  createdAt?: Date;
  updatedAt?: Date;
}
