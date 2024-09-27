import { RouteGenericInterface } from "fastify";
import { PostBase, PostCreate } from "../domains/entities";

export interface FetchPostsRequest extends RouteGenericInterface {
  Querystring: {
    page: number;
    limit: number;
  };
  Headers: {
    "X-Translate-Enabled": string;
  };
}

export interface FetchPostRequest extends RouteGenericInterface {
  Params: {
    id: string;
    value: string;
  };
  Headers: {
    "X-Translate-Enabled": string;
  };
}

export interface CreatePostRequest extends RouteGenericInterface {
  Body: PostCreate;
  Headers: {
    "X-Translate-Enabled": string;
  };
}

export interface ModifyPostRequest extends RouteGenericInterface {
  Params: {
    id: string;
  };
  Body: PostCreate;
  Headers: {
    "X-Translate-Enabled": string;
  };
}

export interface RemovePostRequest extends RouteGenericInterface {
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
