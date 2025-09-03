// src/types/express/index.d.ts

import "express"
import { IUser } from "../IUser"
import { Types } from "mongoose"

declare global {
  namespace Express {
    interface Request {
      user?: IUser
      admin?: {
        _id: string | Types.ObjectId
      }
    }
  }
}
