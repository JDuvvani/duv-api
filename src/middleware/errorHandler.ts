import logger from "@/utils/logger";
import { Fail } from "@/utils/responseFormat";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(err);

  const status = err.status || 500;
  const message = err.message || "Internal server error";

  return res.status(status).json(Fail(message, err?.stack));
};
