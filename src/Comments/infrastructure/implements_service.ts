import { FastifyRequest, FastifyReply } from "fastify";
import CommentService from "../application/comment_use_case";
import {
  FetchCommentsRequest,
  FetchChildCommentsRequest,
  CreateCommentRequest,
  ModifyCommentRequest,
  UpdateDislikeAndLikeRequest,
  RemoveCommentRequest,
} from "./types";

class CommentController {
  private service: CommentService;

  constructor(service: CommentService) {
    this.service = service;
  }

  async apiFetchComments(
    request: FastifyRequest<FetchCommentsRequest>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const { page = 1, limit = 10, includeChildren = "false" } = request.query;

    const results = await this.service.fetchComments(id, {
      page,
      limit,
      includeChildren,
    });

    if (!results.success) {
      return reply.code(results.statusCode).send(results);
    }

    return reply.status(results.statusCode).send(results);
  }

  async apiFetchChildComments(
    request: FastifyRequest<FetchChildCommentsRequest>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const results = await this.service.fetchChildComments(id);

    if (!results.success) {
      return reply.code(results.statusCode).send(results);
    }

    return reply.status(results.statusCode).send(results);
  }

  async apiCreateComment(
    request: FastifyRequest<CreateCommentRequest>,
    reply: FastifyReply
  ) {
    const { body } = request;
    const results = await this.service.createComment(body);

    if (!results.success) {
      return reply.code(results.statusCode).send(results);
    }

    return reply.status(results.statusCode).send(results);
  }

  async apiUpdateComment(
    request: FastifyRequest<ModifyCommentRequest>,
    reply: FastifyReply
  ) {
    const { body } = request;
    const { id } = request.params;

    const results = await this.service.modifyComment(id, body);

    if (!results.success) {
      return reply.code(results.statusCode).send(results);
    }

    return reply.status(results.statusCode).send(results);
  }

  async apiUpdateDislikeAndLike(
    request: FastifyRequest<UpdateDislikeAndLikeRequest>,
    reply: FastifyReply
  ) {
    const { body } = request;
    const { id } = request.params;
    const results = await this.service.adjustCommentLikesAndDislikes(id, body);

    if (!results.success) {
      return reply.code(results.statusCode).send(results);
    }

    return reply.status(results.statusCode).send(results);
  }

  async apiDeleteComment(
    request: FastifyRequest<RemoveCommentRequest>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const { status } = request.query;
    const results = await this.service.removeComment(id, status);

    if (!results.success) {
      return reply.code(results.statusCode).send({ message: results.message });
    }

    return reply.status(results.statusCode).send(results.data);
  }
}

export default CommentController;
