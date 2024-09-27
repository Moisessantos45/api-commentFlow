import { RouteGenericInterface } from "fastify";
import { CommentsBase, CommentsCreate } from "../domains/entities";

export interface FetchCommentsRequest extends RouteGenericInterface {
  Params: {
    id: string;
  };
  Querystring: {
    page: number;
    limit: number;
    includeChildren: string;
  };
  Headers:{
    "X-Translate-Enabled":string
  }
}

export interface FetchChildCommentsRequest extends RouteGenericInterface {
  Params: {
    id: string;
  };
  Headers:{
    "X-Translate-Enabled":string
  }
}

export interface CreateCommentRequest extends RouteGenericInterface {
  Body: CommentsCreate;
}

export interface ModifyCommentRequest extends RouteGenericInterface {
  Params: {
    id: string;
  };
  Body: CommentsCreate;
  Headers:{
    "X-Translate-Enabled":string
  }
}

export interface UpdateDislikeAndLikeRequest extends RouteGenericInterface {
  Params: {
    id: string;
  };
  Body: {
    dislikes: number;
    likes: number;
  };
  Headers:{
    "X-Translate-Enabled":string
  }
}

export interface RemoveCommentRequest extends RouteGenericInterface {
  Params: {
    id: string;
  };
  Querystring: {
    status: string;
  }
  Headers:{
    "X-Translate-Enabled":string
  }
}
