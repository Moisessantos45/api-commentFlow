import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import UserRepository from "./implements_model_database";
import UserService from "../application/user_user_cases";
import UserController from "./implements_service";
import {
  FetchUserRequest,
  CreateUserRequest,
  LoginUserRequest,
  LogoutUserRequest,
  modifyUserRequest,
  ModifyPasswordRequest,
  RemoveUserRequest,
} from "./types";
import {
  getUsersSchema,
  getUserSchema,
  createUserSchema,
  modifyUserSchema,
  modifyPasswordSchema,
  deleteUserSchema,
  loginSchema,
  logoutSchema,
  requestPasswordResetSchema,
  tokenValidation,
} from "./schemas";

const service = async (): Promise<UserService> => {
  const repository = new UserRepository();
  const userService = new UserService(repository);
  return userService;
};

const apiUsers = async (server: FastifyInstance): Promise<void> => {
  server.addHook("onRoute", (routeOptions) => {
    if (!routeOptions.schema) routeOptions.schema = {};
    const routeSchema = routeOptions.schema;
    routeSchema.tags = routeSchema.tags
      ? [...routeSchema.tags, "Users"]
      : ["Users"];
  });

  const serviceUser = await service();
  const controller = new UserController(serviceUser, server);

  server.get(
    "/users",
    {
      schema: getUsersSchema,
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      return controller.apiFetchUsers(_request, reply);
    }
  );

  server.get(
    "/users/:id/:value",
    {
      schema: getUserSchema,
      onRequest: [server.authenticate],
    },
    async (request: FastifyRequest<FetchUserRequest>, reply: FastifyReply) => {
      return controller.apiFetchUser(request, reply);
    }
  );

  server.post(
    "/users",
    {
      schema: createUserSchema,
    },
    async (request: FastifyRequest<CreateUserRequest>, reply: FastifyReply) => {
      return controller.apiCreateUser(request, reply);
    }
  );

  server.patch(
    "/users/validate",
    {
      onRequest: [server.authenticate],
      schema:tokenValidation
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return controller.apiValidateUser(request, reply);
    }
  );

  server.post(
    "/users/login",
    {
      onRequest: [server.authenticate],
      schema: loginSchema,
    },
    async (request: FastifyRequest<LoginUserRequest>, reply: FastifyReply) => {
      return controller.apiLoginUser(request, reply);
    }
  );

  server.post(
    "/users/logout/:id",
    {
      schema: logoutSchema,
      onRequest: [server.authenticate],
    },
    async (request: FastifyRequest<LogoutUserRequest>, reply: FastifyReply) => {
      return controller.apiLogoutUser(request, reply);
    }
  );

  server.put(
    "/users/:id",
    {
      schema: modifyUserSchema,
      onRequest: [server.authenticate],
    },
    async (request: FastifyRequest<modifyUserRequest>, reply: FastifyReply) => {
      return controller.apiModifyUser(request, reply);
    }
  );

  server.post(
    "/users/request-password-reset",
    {
      schema: requestPasswordResetSchema,
    },
    async (
      request: FastifyRequest<{ Body: { email: string } }>,
      reply: FastifyReply
    ) => {
      return controller.apiRequestPasswordReset(request, reply);
    }
  );

  server.patch(
    "/users/reset-password",
    {
      schema: modifyPasswordSchema,
    },
    async (
      request: FastifyRequest<ModifyPasswordRequest>,
      reply: FastifyReply
    ) => {
      return controller.apiModifyPassword(request, reply);
    }
  );

  server.delete(
    "/users/:id",
    {
      schema: deleteUserSchema,
      onRequest: [server.authenticate],
    },
    async (request: FastifyRequest<RemoveUserRequest>, reply: FastifyReply) => {
      return controller.apiRemoveUser(request, reply);
    }
  );
};

export default apiUsers;
