import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import CommentsRepository from "./implements_model_base";
import CommentService from "../application/comment_use_case";
import CommentController from "./implements_service";
import dbInstance from "shared/dataBase/connexion";
import {
  FetchCommentsRequest,
  CreateCommentRequest,
  ModifyCommentRequest,
  UpdateDislikeAndLikeRequest,
  RemoveCommentRequest,
} from "./types";
import {
  responseSchema,
  bodyJsonSchemaRegisterComment,
  bodyJsonSchemaUpdateComment,
  commentsGetSchema,
  querystringJsonUpdateDislikeAndLike,
  responseSchemaGetChildrenTwoThousand,
} from "./schemas";

const serviceComment = async (): Promise<CommentService> => {
  await dbInstance.sync();
  const repository = new CommentsRepository();
  const commentApiService = new CommentService(repository);
  return commentApiService;
};

const apiComments = async (server: FastifyInstance): Promise<void> => {
  const service = await serviceComment();
  const controller = new CommentController(service);

  server.addHook("onRoute", (routeOptions) => {
    if (!routeOptions.schema) routeOptions.schema = {};
    const routeSchema = routeOptions.schema;
    routeSchema.tags = routeSchema.tags
      ? [...routeSchema.tags, "Comments"]
      : ["Comments"];
    // routeSchema.description
  });

  server.get(
    "/comments/:id",
    {
      schema: commentsGetSchema,
      onRequest: [server.authenticate],
    },
    async (
      request: FastifyRequest<FetchCommentsRequest>,
      reply: FastifyReply
    ) => {
      return controller.apiFetchComments(request, reply);
    }
  );

  server.get(
    "/comments/child/:id",
    {
      onRequest: [server.authenticate],
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
        },
        response: {
          ...responseSchema,
          200: responseSchemaGetChildrenTwoThousand,
        },
      },
    },
    async (
      request: FastifyRequest<FetchCommentsRequest>,
      reply: FastifyReply
    ) => {
      return controller.apiFetchChildComments(request, reply);
    }
  );

  server.post(
    "/comments",
    {
      schema: bodyJsonSchemaRegisterComment,
      onRequest: [server.authenticate],
    },
    async (
      request: FastifyRequest<CreateCommentRequest>,
      reply: FastifyReply
    ) => {
      return controller.apiCreateComment(request, reply);
    }
  );

  server.put(
    "/comments/update/:id",
    {
      schema: bodyJsonSchemaUpdateComment,
      onRequest: [server.authenticate],
    },
    async (
      request: FastifyRequest<ModifyCommentRequest>,
      reply: FastifyReply
    ) => {
      return controller.apiUpdateComment(request, reply);
    }
  );

  server.patch(
    "/comments/reactions/:id",
    {
      onRequest: [server.authenticate],
      schema: querystringJsonUpdateDislikeAndLike,
    },
    async (
      request: FastifyRequest<UpdateDislikeAndLikeRequest>,
      reply: FastifyReply
    ) => {
      return controller.apiUpdateDislikeAndLike(request, reply);
    }
  );

  server.delete(
    "/comments/delete/:id",
    {
      onRequest: [server.authenticate],
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
        },
        querystring: {
          type: "object",
          properties: {
            status: { type: "string" },
          },
        },
        response: responseSchema,
      },
    },
    async (
      request: FastifyRequest<RemoveCommentRequest>,
      reply: FastifyReply
    ) => {
      return controller.apiDeleteComment(request, reply);
    }
  );
};

export default apiComments;
