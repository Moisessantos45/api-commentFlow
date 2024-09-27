import { FastifySchema } from "fastify";

const responseSchema = {
  200: {
    type: "object",
    properties: {
      success: { type: "boolean", default: true },
      message: { type: "string" },
      statusCode: { type: "number", default: 200 },
    },
  },
  404: {
    type: "object",
    properties: {
      success: { type: "boolean", default: false },
      message: { type: "string" },
      statusCode: { type: "number", default: 404 },
    },
  },
};

const responseSchemaGetChildrenTwoThousand = {
  type: "object",
  description: "The atrribute children is optional",
  properties: {
    success: { type: "boolean", default: true },
    statusCode: { type: "number", default: 200 },
    message: {
      type: "string",
    },
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          comment_id: { type: "string" },
          post_id: { type: "string" },
          user_id: { type: "string" },
          comment: { type: "string" },
          parent_id: { type: "string" },
          like: { type: "number" },
          dislikes: { type: "number" },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
          children: {
            type: "array",
            items: { type: "object" },
          },
        },
      },
    },
  },
};

const requestHeaders = {
  type: "object",
  properties: {
    authorization: { type: "string" },
  },
};

const commentsGetSchema: FastifySchema = {
  headers:requestHeaders,
  params: {
    type: "object",
    properties: {
      id: { type: "string" },
    },
  },
  querystring: {
    type: "object",
    properties: {
      page: { type: "number" },
      limit: { type: "number" },
      includeChildren: { type: "string", default: "false" },
    },
  },
  response: {
    200: responseSchemaGetChildrenTwoThousand,
    400: {
      type: "object",
      properties: {
        success: { type: "boolean", default: false },
        statusCode: { type: "number", default: 400 },
        message: {
          type: "string",
        },
      },
    },
    404: {
      type: "object",
      properties: {
        success: { type: "boolean", default: false },
        statusCode: { type: "number", default: 404 },
        message: {
          type: "string",
        },
      },
    },
  },
};

const bodyJsonSchemaRegisterComment: FastifySchema = {
  headers:requestHeaders,
  body: {
    type: "object",
    properties: {
      post_id: { type: "string" },
      user_id: { type: "string" },
      comment: { type: "string" },
      parent_id: { type: "string" },
    },
  },
  response: responseSchema,
};

const bodyJsonSchemaUpdateComment: FastifySchema = {
  headers:requestHeaders,
  params: {
    type: "object",
    properties: {
      id: { type: "string" },
    },
  },
  body: {
    type: "object",
    properties: {
      post_id: { type: "string" },
      user_id: { type: "string" },
      comment: { type: "string" },
      parent_id: { type: "string" },
    },
  },
  response: responseSchema,
};

const querystringJsonUpdateDislikeAndLike: FastifySchema = {
  headers:requestHeaders,
  params: {
    type: "object",
    properties: {
      id: { type: "string" },
    },
  },
  body: {
    type: "object",
    properties: {
      like: { type: "number" },
      dislikes: { type: "number" },
    },
  },
  response: {
    ...responseSchema,
    400: {
      type: "object",
      properties: {
        success: { type: "boolean", default: false },
        message: { type: "string" },
        statusCode: { type: "number", default: 400 },
      },
    },
  },
};

export {
  responseSchema,
  responseSchemaGetChildrenTwoThousand,
  commentsGetSchema,
  bodyJsonSchemaRegisterComment,
  bodyJsonSchemaUpdateComment,
  querystringJsonUpdateDislikeAndLike,
};
