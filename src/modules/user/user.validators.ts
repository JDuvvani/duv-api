import { requiredTypeError } from "@/utils/requiredTypeError";
import { object, string, output } from "zod";

const name = string({
  error: (issue) => requiredTypeError(issue.input, "Name", "string"),
})
  .min(1, "Username is required")
  .max(50, "Name must be at most 50 characters long")
  .regex(
    /^(?! )[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)*(?<! )$/,
    "Name must only contain letters and spaces, with no leading/trailing or multiple spaces"
  );

const username = string({
  error: (issue) => requiredTypeError(issue.input, "Username", "string"),
})
  .min(1, "Username is required")
  .max(20, "Username must be at most 20 characters long")
  .regex(
    /^(?![._])(?!.*[._]{2})[a-zA-Z0-9._]{3,20}(?<![._])$/,
    "Username can only contain letters, numbers, underscores, and periods, without consecutive special characters or starting/ending with them"
  );

const password = string({
  error: (issue) => requiredTypeError(issue.input, "Password", "string"),
})
  .min(8, "Password must be at least 8 characters long")
  .max(64, "Password must be at most 64 characters long")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  );

export const createUserSchema = object({
  body: object({
    name,
    username,
    password,
  }),
  query: object({}).optional(),
  params: object({}).optional(),
});

export const userLoginSchema = object({
  body: object({ username, password }),
});

export type CreateUserRequest = output<typeof createUserSchema>;

export type CreateUserData = output<typeof createUserSchema.shape.body>;

export type IUserLogin = output<typeof userLoginSchema.shape.body>;
