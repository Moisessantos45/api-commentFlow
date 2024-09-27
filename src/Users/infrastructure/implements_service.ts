import { FastifyReply, FastifyRequest, FastifyInstance } from "fastify";
import { config } from "dotenv";
import UserService from "../application/user_user_cases";
import {
  FetchUserRequest,
  CreateUserRequest,
  LoginUserRequest,
  LogoutUserRequest,
  modifyUserRequest,
  ModifyPasswordRequest,
  RemoveUserRequest,
} from "./types";
import { UserEntity, UserResponseData } from "../domains/entities";

config();

class UserController {
  private service: UserService;
  private secretKey: string;
  private fastify: FastifyInstance;

  constructor(service: UserService, fastify: FastifyInstance) {
    this.service = service;
    this.secretKey = process.env.API_SECRET_KEY ?? "";
    this.fastify = fastify;
  }

  async apiFetchUsers(request: FastifyRequest, reply: FastifyReply) {
    const role = request.user.role;
    const validated = this.service.validateUserRole(role);

    if (!validated.success) {
      return reply.code(validated.statusCode).send(validated);
    }

    const results = await this.service.fetchUsers();
    if (!results.success) {
      return reply.code(results.statusCode).send(results);
    }

    return reply.status(results.statusCode).send(results);
  }

  async apiFetchUser(
    request: FastifyRequest<FetchUserRequest>,
    reply: FastifyReply
  ) {
    const { id, value } = request.params;
    const results = await this.service.fetchUser(id, value);

    if (!results.success) {
      return reply.code(results.statusCode).send(results);
    }

    return reply.status(results.statusCode).send(results);
  }

  async apiCreateUser(
    request: FastifyRequest<CreateUserRequest>,
    reply: FastifyReply
  ) {
    try {
      const clave = this.secretKey;
      const password = request.body.password;
      const hashedPassword = await this.fastify.bcrypt.hash(password);

      const results = await this.service.createUser(
        { ...request.body, password: hashedPassword },
        clave
      );

      if (!results.success) {
        return reply.code(results.statusCode).send(results);
      }

      return reply.status(results.statusCode).send(results);
    } catch (error) {
      return reply.code(500).send({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
      });
    }
  }

  async apiValidateUser(request: FastifyRequest, reply: FastifyReply) {
    const email = request.user.email;
    const results = await this.service.validateUser(email);

    if (!results.success) {
      return reply.code(results.statusCode).send(results);
    }

    return reply.status(results.statusCode).send(results);
  }

  async apiLoginUser(
    request: FastifyRequest<LoginUserRequest>,
    reply: FastifyReply
  ) {
    try {
      const { email, password } = request.body;
      const findUser = await this.service.fetchUserWithPassword("email", email);

      if (!findUser.success) {
        return reply.code(findUser.statusCode).send(findUser);
      }

      const dataUser = findUser.data as UserEntity;

      if (!dataUser.isVerified) {
        return reply.code(401).send({
          success: false,
          statusCode: 401,
          message: "User not verified please check your email",
        });
      }

      const passwordMatch = await this.fastify.bcrypt.compare(
        password,
        dataUser.password
      );

      if (!passwordMatch) {
        return reply.code(401).send({
          success: false,
          statusCode: 401,
          message: "Unauthorized",
        });
      }

      const results = await this.service.loginUser(email, password);

      if (!results.success) {
        return reply.code(results.statusCode).send(results);
      }

      const data = results.data as UserResponseData;

      const signedJwt = this.fastify.jwt.sign(
        {
          email: data.email,
          role: data.role,
          token: data.token,
        },
        {
          expiresIn: "15d",
        }
      );

      return reply.status(results.statusCode).send({ ...results, signedJwt });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
      });
    }
  }

  async apiLogoutUser(
    request: FastifyRequest<LogoutUserRequest>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const results = await this.service.logoutUser(id);
    if (!results.success) {
      return reply.code(results.statusCode).send(results);
    }

    return reply.status(results.statusCode).send(results);
  }

  async apiModifyUser(
    request: FastifyRequest<modifyUserRequest>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const results = await this.service.modifyUser(id, request.body);
    if (!results.success) {
      return reply.code(results.statusCode).send(results);
    }

    return reply.status(results.statusCode).send(results);
  }

  apiRequestPasswordReset = async (
    request: FastifyRequest<{ Body: { email: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { email } = request.body;
      const results = await this.service.fetchUser("email", email);

      if (!results.success) {
        return reply.code(results.statusCode).send(results);
      }
      const data = results.data as UserResponseData;
      const token = this.fastify.jwt.sign(
        { email, role: data.role, token: data.token },
        {
          expiresIn: "5m",
        }
      );

      return reply.status(results.statusCode).send({
        success: false,
        statusCode: 200,
        message: "Token generated",
        data: token,
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
      });
    }
  };

  async apiModifyPassword(
    request: FastifyRequest<ModifyPasswordRequest>,
    reply: FastifyReply
  ) {
    try {
      const { password } = request.body;
      const id = request.user.email;

      const hashedPassword = await this.fastify.bcrypt.hash(password);

      const results = await this.service.modifyPassword(id, hashedPassword);
      if (!results.success) {
        return reply.code(results.statusCode).send(results);
      }

      return reply.status(results.statusCode).send(results);
    } catch (error) {
      return reply.code(500).send({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
      });
    }
  }

  async apiRemoveUser(
    request: FastifyRequest<RemoveUserRequest>,
    reply: FastifyReply
  ) {
    const { id } = request.params;

    const results = await this.service.removeUser(id);
    if (!results.success) {
      return reply.code(results.statusCode).send(results);
    }

    return reply.status(results.statusCode).send(results);
  }
}

export default UserController;
