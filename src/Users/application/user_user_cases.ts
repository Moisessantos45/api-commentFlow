import IUserRepository from "../domains/interface";
import { UserResponse, UserCreate } from "../domains/entities";
import {
  convertDataToUserBase,
  convertUserWithPassword,
  convertToUser,
  generateApiKey,
  generateRandomToken,
} from "../domains/service";

class UserService {
  private repository: IUserRepository;
  private _objectResponse: UserResponse;

  constructor(repository: IUserRepository) {
    this.repository = repository;
    this._objectResponse = {
      success: false,
      statusCode: 404,
      message: "",
    };
  }

  private set response(value: UserResponse) {
    this._objectResponse = value;
  }

  validateUserRole(role: string): UserResponse {
    if (role !== "admin") {
      this.response = {
        success: false,
        statusCode: 401,
        message: "Unauthorized",
      };
    } else {
      this.response = {
        success: true,
        statusCode: 200,
        message: "Authorized",
      };
    }
    return this._objectResponse;
  }

  async fetchUsers(): Promise<UserResponse> {
    const response = await this.repository.getUsers();
    if (!response.length) {
      this.response = {
        success: false,
        statusCode: 404,
        message: "No user found",
      };
    } else {
      const data = response.map(convertDataToUserBase);
      this.response = {
        success: true,
        statusCode: 200,
        message: "Users fetched successfully",
        data,
      };
    }

    return this._objectResponse;
  }

  async fetchUser(userId: string, value: string): Promise<UserResponse> {
    const response = await this.repository.getUser(userId, value);

    if (!response?.id) {
      this.response = {
        success: false,
        statusCode: 404,
        message: "User not found",
      };
    } else {
      const data = convertDataToUserBase(response);
      this.response = {
        success: true,
        statusCode: 200,
        message: "User fetched successfully",
        data,
      };
    }

    return this._objectResponse;
  }

  async fetchUserWithPassword(
    userId: string,
    value: string
  ): Promise<UserResponse> {
    const response = await this.repository.getUser(userId, value);

    if (!response?.id) {
      this.response = {
        success: false,
        statusCode: 404,
        message: "User not found",
      };
    } else {
      this.response = {
        success: true,
        statusCode: 200,
        message: "User fetched successfully",
        data: response,
      };
    }

    return this._objectResponse;
  }

  async loginUser(email: string, password: string): Promise<UserResponse> {
    const token = generateRandomToken();

    const user = await this.repository.updateUser(email, { token });

    if (!user) {
      this.response = {
        success: false,
        statusCode: 404,
        message: "Error at login",
      };
    }

    const response = await this.repository.loginUser(email, password, {
      token,
    });

    if (!response?.id) {
      this.response = {
        success: false,
        statusCode: 404,
        message: "User not found",
      };
    } else {
      const data = convertDataToUserBase(response);
      this.response = {
        success: true,
        statusCode: 200,
        message: "User logged in successfully",
        data,
      };
    }

    return this._objectResponse;
  }

  async logoutUser(userId: string): Promise<UserResponse> {
    const response = await this.repository.updateUser(userId, { token: "" });
    if (!response) {
      this.response = {
        success: false,
        statusCode: 404,
        message: "Error at logout",
      };
    } else {
      this.response = {
        success: true,
        statusCode: 200,
        message: "User logged out successfully",
      };
    }

    return this._objectResponse;
  }

  async createUser(user: UserCreate, clave: string): Promise<UserResponse> {
    const findUser = await this.repository.getUser("email", user.email);
    if (findUser?.id) {
      return {
        success: false,
        statusCode: 404,
        message: "User already exist",
      };
    }

    let apiKey = "";
    if (user.role === "admin") {
      apiKey = generateApiKey({ id: user.email, role: user.role }, clave);
    }
    const newUser = convertUserWithPassword({ ...user, apiKey });
    const response = await this.repository.addUser(newUser);

    if (!response) {
      this.response = {
        success: false,
        statusCode: 404,
        message: "Error creating user",
      };
    } else {
      const { password, ...data } = newUser;
      this.response = {
        success: true,
        statusCode: 200,
        message: "User created successfully",
        data,
      };
    }

    return this._objectResponse;
  }

  async validateUser(userId: string): Promise<UserResponse> {
    const findUser = await this.repository.getUser("email", userId);
    if (!findUser?.id) {
      return {
        success: false,
        statusCode: 404,
        message: "User not found",
      };
    }
    const response = await this.repository.updateUser(userId, {
      isVerified: true,
    });

    if (!response) {
      this.response = {
        success: false,
        statusCode: 404,
        message: "Error validating user",
      };
    } else {
      this.response = {
        success: true,
        statusCode: 200,
        message: "User validated successfully",
      };
    }

    return this._objectResponse;
  }

  async modifyUser(userId: string, user: UserCreate): Promise<UserResponse> {
    const existingUser = await this.repository.getUser("email", userId);
    if (!existingUser?.id) {
      return {
        success: false,
        statusCode: 404,
        message: "User not found",
      };
    }

    const convertedUser = convertToUser(user);
    const response = await this.repository.updateUser(userId, convertedUser);

    if (!response) {
      this.response = {
        success: false,
        statusCode: 404,
        message: "Error updating user",
      };
    } else {
      this.response = {
        success: true,
        statusCode: 200,
        message: "User updated successfully",
        data: convertedUser,
      };
    }

    return this._objectResponse;
  }

  async modifyPassword(
    userId: string,
    password: string
  ): Promise<UserResponse> {
    const findUser = await this.repository.getUser("email", userId);
    if (!findUser?.id) {
      return {
        success: false,
        statusCode: 404,
        message: "User not found",
      };
    }

    const response = await this.repository.updateUser(userId, { password });
    if (!response) {
      this.response = {
        success: false,
        statusCode: 404,
        message: "Error updating password",
      };
    } else {
      this.response = {
        success: true,
        statusCode: 200,
        message: "Password updated successfully",
      };
    }

    return this._objectResponse;
  }

  async removeUser(userId: string): Promise<UserResponse> {
    const response = await this.repository.deleteUser(userId);
    if (!response) {
      this.response = {
        success: false,
        statusCode: 404,
        message: "Error deleting user",
      };
    } else {
      this.response = {
        success: true,
        statusCode: 200,
        message: "User deleted successfully",
      };
    }

    return this._objectResponse;
  }
}

export default UserService;
