import { CreateUserData } from "@/modules/user/user.validators";
import User, { IUser } from "@/modules/user/user.model";

export interface IUserRepo {
  create(userData: CreateUserData): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  findByUsername(username: string): Promise<IUser | null>;
  delete(id: string): Promise<IUser | null>;
}

export class UserRepo implements IUserRepo {
  create = async (userData: CreateUserData): Promise<IUser> => {
    return await User.create(userData);
  };

  findById = async (id: string): Promise<IUser | null> => {
    return await User.findById(id);
  };

  findByUsername = async (username: string): Promise<IUser | null> => {
    return await User.findOne({ username });
  };

  delete = async (id: string): Promise<IUser | null> => {
    return await User.findByIdAndDelete(id);
  };
}
