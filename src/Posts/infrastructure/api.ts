import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import PostRepository from "./implements_model_database";
import PostService from "../application/post_use_cases";
import PostController from "./implements_service";
import dbInstance from "shared/dataBase/connexion";
import {
  FetchPostsRequest,
  FetchPostRequest,
  CreatePostRequest,
  ModifyPostRequest,
  RemovePostRequest,
} from "./types";
import {
  getPostsJsonSchema,
  getPostJsonSchema,
  createPostJsonSchema,
  modifyPostJsonSchema,
  removePostJsonSchema,
} from "./schemas";

const servicePost = async (): Promise<PostService> => {
  await dbInstance.sync();
  const repository = new PostRepository();
  const postApiService = new PostService(repository);
  return postApiService;
};

const apiPost = async (server: FastifyInstance): Promise<void> => {
  const service = await servicePost();
  const controller = new PostController(service);

  server.addHook("onRoute", (routeOptions) => {
    if (!routeOptions.schema) routeOptions.schema = {};
    const routeSchema = routeOptions.schema;
    routeSchema.tags = routeSchema.tags
      ? [...routeSchema.tags, "Posts"]
      : ["Posts"];
  });

  server.get(
    "/posts",
    {
      schema: getPostsJsonSchema,
    },
    async (request: FastifyRequest<FetchPostsRequest>, reply: FastifyReply) => {
      return controller.apiFetchPosts(request, reply);
    }
  );

  server.get(
    "/posts/:id",
    {
      schema: getPostJsonSchema,
    },
    async (request: FastifyRequest<FetchPostRequest>, reply: FastifyReply) => {
      return controller.apiFetchPost(request, reply);
    }
  );

  server.post(
    "/posts/create",
    {
      schema: createPostJsonSchema,
    },
    async (request: FastifyRequest<CreatePostRequest>, reply: FastifyReply) => {
      return controller.apiCreatePost(request, reply);
    }
  );

  server.put(
    "/posts/modify/:id",
    {
      schema: modifyPostJsonSchema,
    },
    async (request: FastifyRequest<ModifyPostRequest>, reply: FastifyReply) => {
      return controller.apiModifyPost(request, reply);
    }
  );

  server.delete(
    "/post/remove/:id",
    {
      schema: removePostJsonSchema,
    },
    async (request: FastifyRequest<RemovePostRequest>, reply: FastifyReply) => {
      return controller.apiRemovePost(request, reply);
    }
  );
};

export default apiPost;
