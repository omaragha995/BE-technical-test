import { Request, Response, NextFunction } from "express";
import { ApiError } from "./ApiError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // If error is an instance of ApiError (custom errors)
  if (err instanceof ApiError) {
    return res.status(err.getStatusCode()).json({
      code: err.getStatusCode(),
      type: err.constructor.name,
      message: err.getMessage(),
    });
  }

  console.log(err);

  // For unexpected errors
  return res.status(500).json({
    code: 500,
    type: "InternalServerError",
    message: "Something went wrong",
  });
};
