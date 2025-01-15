import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { HttpStatusCodes } from "../types/HttpError";

export const handleValidationErrors =
  (customMessage?: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const defaultMessage = errors
        .array()
        .map((err) => err.msg)
        .join(", ");
      const message = customMessage || defaultMessage;
      res.status(HttpStatusCodes.BAD_REQUEST).json({ message });
    } else {
      next();
    }
  };
