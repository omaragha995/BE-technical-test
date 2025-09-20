import { Request, Response, NextFunction } from "express";
import { ZodError, ZodObject, ZodRawShape } from "zod";
import { ValidationError } from "../errors/ValidationError";

// Generic validation middleware
export const validate =
  (schema: ZodObject<ZodRawShape>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse and validate request
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (err: any) {
      // Forward validation errors to global error handler
      next(new ValidationError(err.issues[0].message));
    }
  };
