import ICommentRepository from "../domains/interface";
import { CommentsResponse, CommentsCreate } from "../domains/entities";
import {
  transformMapToEntity,
  transformMapToJson,
  checkIfNaN,
} from "../domains/service";

class CommentService {
  private repository: ICommentRepository;
  private _responseObject: CommentsResponse;

  constructor(repository: ICommentRepository) {
    this.repository = repository;
    this._responseObject = {
      success: false,
      statusCode: 404,
      message: "",
    };
  }

  private set response(value: CommentsResponse) {
    this._responseObject = value;
  }

  async fetchComments(
    id: string,
    queryOptions: { includeChildren: string; page: number; limit: number }
  ): Promise<CommentsResponse> {
    let results = [];
    let transformedResults = [];

    if (checkIfNaN(queryOptions.page) || checkIfNaN(queryOptions.limit)) {
      return {
        success: false,
        statusCode: 400,
        message: "Invalid query options type value not a number",
      };
    }

    if (queryOptions.includeChildren === "true") {
      results = await this.repository.getCommentsWithChildren(id);
    } else {
      results = await this.repository.getComments(
        id,
        queryOptions.page,
        queryOptions.limit
      );
    }

    if (!results?.length) {
      return {
        success: false,
        statusCode: 404,
        message: "No comment found",
      };
    }

    transformedResults = results.map(transformMapToEntity);

    return { success: true, statusCode: 200, data: transformedResults };
  }

  async fetchChildComments(id: string): Promise<CommentsResponse> {
    const results = await this.repository.getChildComments(id);

    if (!results?.length) {
      this.response = {
        success: false,
        statusCode: 404,
        message: "No comment found",
      };
    } else {
      const transformedResults = results.map(transformMapToEntity);
      this.response = {
        success: true,
        statusCode: 200,
        data: transformedResults,
      };
    }

    return this._responseObject;
  }

  async createComment(data: CommentsCreate): Promise<CommentsResponse> {
    const convertMapToJson = transformMapToJson(data);
    const result = await this.repository.addComment(convertMapToJson);

    if (!result) {
      this.response = {
        success: false,
        statusCode: 404,
        message: "Failed to add comment",
      };
    } else {
      this.response = {
        success: true,
        statusCode: 200,
        message: "Comment added successfully",
      };
    }

    return this._responseObject;
  }

  async modifyComment(
    id: string,
    data: CommentsCreate
  ): Promise<CommentsResponse> {
    const result = await this.repository.updateComment(id, data);

    if (!result) {
      this.response = {
        success: false,
        statusCode: 404,
        message: "Failed to update comment",
      };
    } else {
      this.response = {
        success: true,
        statusCode: 200,
        message: "Comment updated successfully",
      };
    }

    return this._responseObject;
  }

  async adjustCommentLikesAndDislikes(
    id: string,
    data: { dislikes: number; likes: number }
  ): Promise<CommentsResponse> {
    if (checkIfNaN(data.dislikes) || checkIfNaN(data.likes)) {
      return {
        success: false,
        statusCode: 400,
        message: "Invalid query options type value not a number",
      };
    }

    const result = await this.repository.updateDislikeAndLike(id, data);
    if (!result) {
      return {
        success: false,
        statusCode: 404,
        message: "Failed to update comment",
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: "Comment updated successfully",
    };
  }

  async removeComment(id: string, status: string): Promise<CommentsResponse> {
    if (!["active", "deleted"].includes(status)) {
      return {
        success: false,
        statusCode: 400,
        message: "Invalid status",
      };
    }
    
    const result = await this.repository.deleteComment(id, status);
    if (!result) {
      this.response = {
        success: false,
        statusCode: 404,
        message: "Failed to delete comment",
      };
    } else {
      this.response = {
        success: true,
        statusCode: 200,
        message: "Comment deleted",
      };
    }
    return this._responseObject;
  }
}

export default CommentService;
