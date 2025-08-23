import { Request, Response } from "express";
import { UserService } from "@/modules/user/user.service";
import { Fail, Success } from "@/utils/responseFormat";
import logger from "@/utils/logger";
import { Id } from "@/validators/id.validator";

export class UserController {
  constructor(private UserService: UserService) {}

  create = async (req: Request, res: Response) => {
    try {
      const user = await this.UserService.signup(req.body);
      return res.status(201).json(Success("User created", user));
    } catch (err) {
      logger.error(err, "Error creating user");
      res.status(500).json(Fail("Error creating user", err));
    }
  };

  findById = async (req: Request<{ id: Id }>, res: Response) => {
    try {
      const user = await this.UserService.getUserById(req.params.id);
      return res.status(200).json(Success("", user));
    } catch (err) {
      logger.error(err, "Error getting user");
      res.status(500).json(Fail("Error getting user", err));
    }
  };

  delete = async (req: Request<{ id: Id }>, res: Response) => {
    try {
      await this.UserService.deleteUser(req.params.id);
      return res.status(204).json(Success("User deleted successfully"));
    } catch (err: any) {
      logger.error(err, "Error deleting user");
      res.status(500).json(Fail("Error deleting user", err.message));
    }
  };
}
