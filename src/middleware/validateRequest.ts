import { NextFunction, Request, RequestHandler, Response } from "express";
import { z, ZodObject, ZodType } from "zod";

// export const makeSchema = (shapes: {
//   body?: ZodType<any>;
//   query?: ZodType<any>;
//   params?: ZodType<any>;
// }) => {
//   return object({
//     body: shapes.body ?? object({}),
//     query: shapes.query ?? object({}),
//     params: shapes.params ?? object({}),
//   });
// };

export type ValidatedRequest<T extends ZodObject> = Request & {
  validated: z.infer<T>;
};

export const validateRequest =
  <
    T extends ZodObject<{
      body: ZodType<any>;
      query: ZodType<any>;
      params: ZodType<any>;
    }>
  >(
    schema: T
  ): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    (req as ValidatedRequest<T>).validated = result.data;

    next();
  };
