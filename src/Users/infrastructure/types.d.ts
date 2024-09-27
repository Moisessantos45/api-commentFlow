import { RouteGenericInterface } from "fastify";
import { UserCreate } from "../domains/entities";

export interface FetchUserRequest extends RouteGenericInterface {
  Params: {
    id: string;
    value: string;
  };
  Headers: {
    "X-Translate-Enabled": string;
  };
}

export interface CreateUserRequest extends RouteGenericInterface {
  Body: UserCreate;
}

export interface LoginUserRequest extends RouteGenericInterface {
  Body: {
    email: string;
    password: string;
  };
}

export interface LogoutUserRequest extends RouteGenericInterface {
  Params: {
    id: string;
  };
  Headers: {
    "X-Translate-Enabled": string;
  };
}

export interface modifyUserRequest extends RouteGenericInterface {
  Params: {
    id: string;
  };
  Body: UserCreate;
  Headers: {
    "X-Translate-Enabled": string;
  };
}

export interface ModifyPasswordRequest extends RouteGenericInterface {
  Body: {
    password: string;
  };
  Headers: {
    "X-Translate-Enabled": string;
  };
}

export interface RemoveUserRequest extends RouteGenericInterface {
  Params: {
    id: string;
  };
  Querystring: {
    status: string;
  };
  Headers: {
    "X-Translate-Enabled": string;
  };
}
