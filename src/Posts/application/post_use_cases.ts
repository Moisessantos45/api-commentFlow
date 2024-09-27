import IPostRepository from "../domains/interfaces";
import { PostResponse, PostCreate } from "../domains/entities";
import {
  transformMapToEntity,
  //   transformMapToJson,
  checkIfNaN,
  transformMapToJson,
} from "../domains/services";

class PostService {
  private serviceRepository: IPostRepository;
  private _objectResponse: PostResponse;

  constructor(repository: IPostRepository) {
    this.serviceRepository = repository;
    this._objectResponse = {
      success: false,
      statusCode: 404,
      message: "",
    };
  }

  private set response(value: PostResponse) {
    this._objectResponse = value;
  }

  async fetchPosts(page: number, limit: number): Promise<PostResponse> {
    if (checkIfNaN(page) || checkIfNaN(limit)) {
      return {
        success: false,
        statusCode: 400,
        message: "Invalid page or limit",
      };
    }

    const response = await this.serviceRepository.getPosts(page, limit);

    if (!response.length) {
      this.response = {
        success: false,
        statusCode: 404,
        message: "No post found",
      };
    } else {
      const data = response.map(transformMapToEntity);
      this.response = {
        success: true,
        statusCode: 200,
        message: "Posts fetched successfully",
        data,
      };
    }

    return this._objectResponse;
  }

  async fetchPostById(id: string, value: string): Promise<PostResponse> {
    const response = await this.serviceRepository.getPost(id, value);

    if (!response) {
      this.response = {
        success: false,
        statusCode: 404,
        message: "Post not found",
      };
    } else {
      const data = transformMapToEntity(response);
      this.response = {
        success: true,
        statusCode: 200,
        message: "Post fetched successfully",
        data,
      };
    }

    return this._objectResponse;
  }

  async createPost(post: PostCreate): Promise<PostResponse> {
    const searchPost = await this.serviceRepository.getPost(
      "shortName",
      post.shortName
    );

    if (!searchPost?.id) {
      return {
        success: false,
        statusCode: 404,
        message: "Post not found",
      };
    }

    const transformMap = transformMapToJson(searchPost);
    const response = await this.serviceRepository.addPost(transformMap);

    if (!response) {
      this.response = {
        success: false,
        statusCode: 404,
        message: "Post not created",
      };
    } else {
      this.response = {
        success: true,
        statusCode: 200,
        message: "Post created successfully",
      };
    }

    return this._objectResponse;
  }

  async modifyPost(id: string, post: PostCreate): Promise<PostResponse> {
    const transformMap = transformMapToJson(post);
    const response = await this.serviceRepository.updatePost(id, transformMap);

    if (!response) {
      this.response = {
        success: false,
        statusCode: 404,
        message: "Post not updated",
      };
    } else {
      this.response = {
        success: true,
        statusCode: 200,
        message: "Post updated successfully",
      };
    }

    return this._objectResponse;
  }

  async removePost(id: string, status: string): Promise<PostResponse> {
    if (!["active", "inactive", "deleted"].includes(status)) {
      return {
        success: false,
        statusCode: 400,
        message: "Invalid status",
      };
    }

    const response = await this.serviceRepository.deletePost(id, status);

    if (!response) {
      this.response = {
        success: false,
        statusCode: 404,
        message: "Post not deleted",
      };
    } else {
      this.response = {
        success: true,
        statusCode: 200,
        message: "Post deleted successfully",
      };
    }

    return this._objectResponse;
  }
}

export default PostService;
