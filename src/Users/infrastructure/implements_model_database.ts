import ModelRepository from "shared/dataBase/repository_base";
import IUserRepository from "../domains/interface";
import { UserModel } from "shared/dataBase/models/modelUser";
import { UserEntity, UserCreate } from "../domains/entities";

class UserRepository
  extends ModelRepository<UserModel>
  implements IUserRepository
{
  constructor() {
    super(UserModel, "users");
  }

  async getUsers(): Promise<UserEntity[]> {
    try {
      const users = await this.retrieveAll();
      return users;
    } catch (error) {
      return [];
    }
  }

  async getUser(userId: string, value: string): Promise<UserEntity | null> {
    try {
      const user = await this.retrieveById(value, userId);
      return user;
    } catch (error) {
      return null;
    }
  }

  async loginUser(
    email: string,
    password: string,
    data: { [key: string]: any }
  ): Promise<UserEntity | null> {
    try {
      const user = await this.model.findOne({
        where: {
          email,
          password,
        },
      });

      if (!user) return null;

      const response = await this.modify(user.user_id, data);

      return response > 0 ? user : null;
    } catch (error) {
      return null;
    }
  }

  async addUser(user: UserCreate): Promise<boolean> {
    try {
      const newUser = await this.insert(user);
      return newUser?.user_id ? true : false;
    } catch (error) {
      return false;
    }
  }

  async updateUser(
    userId: string,
    user: UserCreate | { [key: string]: any }
  ): Promise<boolean> {
    try {
      const results = await this.modify(userId, user);
      return results > 0;
    } catch (error) {
      return false;
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      const results = await this.deactivate(userId, "inactive");
      return results > 0;
    } catch (error) {
      return false;
    }
  }
}

export default UserRepository;
