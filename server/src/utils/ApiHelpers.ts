import { Request, Response, NextFunction } from "express";

export class ApiError extends Error {
  statusCode: number;
  data: any;
  message: string;
  success: boolean;
  code: string;
  errors: any[];

  constructor(
      statusCode: number,
      message = "Something went wrong",
      code: string = "GENERIC_ERROR",
      errors = [],
      stack = ""
  ) {
      super(message)
      this.statusCode = statusCode
      this.data = null
      this.message = message
      this.code = code
      this.success = false
      this.errors = errors

      if (stack) {
          this.stack = stack
      } else {
          (Error as any).captureStackTrace(this, this.constructor)
      }
  }
}

export class ApiResponse {
  statusCode: number;
  data: any;
  message: string;
  success: boolean;

  constructor(statusCode: number, data: any, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export const AsyncHandler = (
  requestHandler: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      return await requestHandler(req, res, next);
    } catch (error: any) {
      res.status(error.code || 500).json({
        success: false,
        message: error.message,
      });
    }
  };
};