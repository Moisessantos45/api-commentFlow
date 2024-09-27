import { FastifySchema } from "fastify";

const postSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    post_id: { type: "string" },
    user_id: { type: "string" },
    shortName: { type: "string" },
    postTitle: { type: "string" },
    website_id: { type: "string" },
    status: { type: "string" },
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
  },
};

// Respuesta genérica para éxito
const successResponse = (
  statusCode: number = 200,
  dataSchema: object = {}
) => ({
  type: "object",
  properties: {
    success: { type: "boolean", default: true },
    message: { type: "string" },
    statusCode: { type: "number", default: statusCode },
    data: dataSchema,
  },
});

// Respuesta genérica para errores
const errorResponse = (statusCode: number, description: string = "") => ({
  type: "object",
  description,
  properties: {
    success: { type: "boolean", default: false },
    message: { type: "string" },
    statusCode: { type: "number", default: statusCode },
  },
});

// Esquema de respuesta para múltiples posts
const responseSchemaPosts = successResponse(200, {
  type: "array",
  description: "Array of posts",
  items: postSchema,
});

// Esquema de respuesta para un solo post
const responseSchemaPost = successResponse(200, postSchema);

// Esquema genérico de respuestas
const responseSchema = {
  200: successResponse(200),
  404: errorResponse(404, "Not found"),
  400: errorResponse(400, "Invalid request"),
};

const requestHeaders = {
  type: "object",
  properties: {
    authorization: { type: "string" },
  },
};

// Esquema para obtener múltiples posts
const getPostsJsonSchema: FastifySchema = {
  response: {
    ...responseSchema,
    200: responseSchemaPosts,
  },
  headers: requestHeaders,
};

// Esquema para obtener un solo post por ID
const getPostJsonSchema: FastifySchema = {
  params: {
    type: "object",
    description: "Fetch post by id",
    properties: {
      id: { type: "string" },
    },
  },
  response: {
    ...responseSchema,
    200: responseSchemaPost,
  },
  headers: requestHeaders,
};

// Esquema para crear un post
const createPostJsonSchema: FastifySchema = {
  headers: requestHeaders,
  body: {
    type: "object",
    description: "Create a new post",
    required: ["user_id", "shortName", "postTitle", "website_id"],
    properties: {
      user_id: { type: "string" },
      shortName: { type: "string" },
      postTitle: { type: "string" },
      website_id: { type: "string" },
    },
  },
  response: {
    ...responseSchema,
    200: responseSchemaPost,
  },
};

// Esquema para modificar un post
const modifyPostJsonSchema: FastifySchema = {
  headers: requestHeaders,
  body: {
    type: "object",
    description: "Modify post by id",
    properties: {
      user_id: { type: "string" },
      shortName: { type: "string" },
      postTitle: { type: "string" },
      website_id: { type: "string" },
    },
  },
  params: {
    type: "object",
    description: "Modify post by id",
    properties: {
      id: { type: "string" },
    },
  },
  response: {
    ...responseSchema,
    200: responseSchemaPost,
  },
};

// Esquema para eliminar un post
const removePostJsonSchema: FastifySchema = {
  headers: requestHeaders,
  params: {
    type: "object",
    description: "Remove post by id",
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
  response: {
    ...responseSchema,
    400: errorResponse(400, "Invalid status"),
  },
};

export {
  getPostsJsonSchema,
  getPostJsonSchema,
  createPostJsonSchema,
  modifyPostJsonSchema,
  removePostJsonSchema,
};
