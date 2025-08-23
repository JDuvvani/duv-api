import { requiredTypeError } from "@/utils/requiredTypeError";
import { object, output, string } from "zod";

export const IdParamSchema = object({
  body: object({}).optional(),
  query: object({}).optional(),
  params: object({
    id: string({
      error: (issue) => requiredTypeError(issue.input, "Id", "string"),
    }),
  }),
});

export type RequestById = output<typeof IdParamSchema>;
export type Id = output<typeof IdParamSchema.shape.params.shape.id>;
