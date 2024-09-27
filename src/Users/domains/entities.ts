interface UserEntity {
  id: number;
  user_id: string;
  username: string;
  email: string;
  password: string;
  website_id: string;
  role: string;
  apiKey: string;
  token: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UserBase {
  username: string;
  email: string;
  website_id: string;
  role: string;
}

interface UserCreate extends UserBase {
  password: string;
}

interface UserRequest extends UserCreate {}
interface UserResponseData extends Omit<UserEntity, "password"> {}

interface UserResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: UserBase | UserCreate | UserEntity | UserResponseData | UserResponseData[]
}

export {
  UserEntity,
  UserBase,
  UserCreate,
  UserRequest,
  UserResponse,
  UserResponseData,
};
