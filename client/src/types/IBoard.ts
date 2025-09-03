import { IUser } from "./IUser";

export interface IBoard {
    _id: string;
    name: string;
    members: IUser[];
    createdAt?: Date;
    updatedAt?: Date;
}