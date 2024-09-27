import { FastifyReply, FastifyRequest } from "fastify";
import PostService from "../application/post_use_cases";
import {
  FetchPostsRequest,
  FetchPostRequest,
  CreatePostRequest,
  ModifyPostRequest,
  RemovePostRequest,
} from "./types";

class PostController {
  private service: PostService;

  constructor(service: PostService) {
    this.service = service;
  }

  async apiFetchPosts(
    request: FastifyRequest<FetchPostsRequest>,
    reply: FastifyReply
  ) {
    const { page = 1, limit = 10 } = request.query;
    const results = await this.service.fetchPosts(page, limit);

    if (!results.success) {
      return reply.code(results.statusCode).send(results);
    }

    return reply.status(results.statusCode).send(results);
  }

  async apiFetchPost(
    request: FastifyRequest<FetchPostRequest>,
    reply: FastifyReply
  ) {
    const { id, value } = request.params;
    const results = await this.service.fetchPostById(id, value);

    if (!results.success) {
      return reply.code(results.statusCode).send(results);
    }

    return reply.status(results.statusCode).send(results);
  }

  async apiCreatePost(
    request: FastifyRequest<CreatePostRequest>,
    reply: FastifyReply
  ) {
    const results = await this.service.createPost(request.body);
    if (!results.success) {
      return reply.code(results.statusCode).send(results);
    }

    return reply.status(results.statusCode).send(results);
  }

  async apiModifyPost(
    request: FastifyRequest<ModifyPostRequest>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const results = await this.service.modifyPost(id, request.body);

    if (!results.success) {
      return reply.code(results.statusCode).send(results);
    }

    return reply.status(results.statusCode).send(results);
  }

  async apiRemovePost(
    request: FastifyRequest<RemovePostRequest>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const { status } = request.query;
    const results = await this.service.removePost(id, status);

    if (!results.success) {
      return reply.code(results.statusCode).send(results);
    }

    return reply.status(results.statusCode).send(results);
  }
}

export default PostController;
