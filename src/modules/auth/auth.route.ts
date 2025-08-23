import { Router } from "express";
import { UserRepo } from "@/modules/user/user.repo";
import { UserService } from "@/modules/user/user.service";
import { AuthService } from "@/modules/auth/auth.service";
import { AuthController } from "@/modules/auth/auth.controller";
import { AuthMiddleware } from "@/middleware/auth.middleware";
import { validateRequest } from "@/middleware/validateRequest";
import { createUserSchema } from "@/modules/user/user.validators";

const authRouter = Router();
const userRepo = new UserRepo();

const userService = new UserService(userRepo);
const authService = new AuthService(userRepo, userService);
const authController = new AuthController(authService);
const authMiddleware = new AuthMiddleware(userRepo);

authRouter.post(
  "/signup",
  validateRequest(createUserSchema),
  authController.signup
);
authRouter.post("/login", authController.login);
authRouter.post("/refresh-token", authController.refresh);
authRouter.post("/logout", authMiddleware.authenticate, authController.logout);
authRouter.get(
  "/me",
  authMiddleware.authenticate,
  authController.getCurrentUser
);

export default authRouter;
