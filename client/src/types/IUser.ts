export type TAuthProvider ="manual" | "google"

export interface IUser {
  _id: string;
  email: string;
  username: string;
  authProvider: TAuthProvider;
  refreshToken?: string
  password?: string
  createdAt?: Date;
  updatedAt?: Date;
}
