import { IUserRepo } from "@/modules/user/user.repo";
import { CreateUserData } from "@/modules/user/user.validators";
import { IUser } from "@/modules/user/user.model";
import { Id } from "@/validators/id.validator";

export class UserService {
  constructor(private readonly userRepo: IUserRepo) {}

  signup = async (userData: CreateUserData): Promise<IUser> => {
    const exists = await this.userRepo.findByUsername(userData.username);

    if (exists) throw new Error("User already exists");
    return this.userRepo.create(userData);
  };

  getUserById = async (id: Id): Promise<IUser | null> => {
    const user = await this.userRepo.findById(id);

    if (!user) throw new Error("User not found");
    return user;
  };

  getUserByUsername = async (username: string): Promise<IUser | null> => {
    const user = await this.userRepo.findByUsername(username);

    if (!user) throw new Error("User not found");
    return user;
  };

  deleteUser = async (id: Id): Promise<IUser | null> => {
    const user = await this.userRepo.findById(id);

    if (!user) throw new Error("User not found");

    await this.userRepo.delete(id);
    return user;
  };
}
