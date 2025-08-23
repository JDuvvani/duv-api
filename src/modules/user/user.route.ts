import { Router } from "express";
import { UserRepo } from "@/modules/user/user.repo";
import { UserService } from "@/modules/user/user.service";
import { UserController } from "@/modules/user/user.controller";
import { validateRequest } from "@/middleware/validateRequest";
import { createUserSchema } from "@/modules/user/user.validators";
import { IdParamSchema } from "@/validators/id.validator";

const userRouter = Router();

const userRepo = new UserRepo();
const userService = new UserService(userRepo);
const userController = new UserController(userService);

userRouter.post("/", validateRequest(createUserSchema), userController.create);
userRouter.get("/:id", validateRequest(IdParamSchema), userController.findById);
userRouter.delete(
  "/:id",
  validateRequest(IdParamSchema),
  userController.delete
);

export default userRouter;
