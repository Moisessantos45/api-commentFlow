import { UserEntity, UserCreate } from "./entities";

interface IUserRepository {
  getUsers(): Promise<UserEntity[]>;
  getUser(userId: string, value: string): Promise<UserEntity | null>;
  addUser(user: UserCreate): Promise<boolean>;
  updateUser(
    userId: string,
    user: UserCreate | { [key: string]: any }
  ): Promise<boolean>;
  loginUser(
    email: string,
    password: string,
    data: { [key: string]: any }
  ): Promise<UserEntity | null>;
  // logoutUser(userId: string): Promise<boolean>;
  deleteUser(userId: string): Promise<boolean>;
}

export default IUserRepository;
