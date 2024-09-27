import { FastifySchema } from "fastify";

// Respuestas comunes
const successResponse = (statusCode: number = 200) => ({
  type: "object",
  properties: {
    success: { type: "boolean", default: true },
    message: { type: "string" },
    statusCode: { type: "number", default: statusCode },
  },
});

const errorResponse = (statusCode: number, message: string = "") => ({
  type: "object",
  properties: {
    success: { type: "boolean", default: false },
    message: { type: "string", default: message },
    statusCode: { type: "number", default: statusCode },
  },
});

// Propiedades comunes del usuario
const propertiesEntity = {
  type: "object",
  properties: {
    id: { type: "string" },
    user_id: { type: "string" },
    username: { type: "string" },
    email: { type: "string" },
    website_id: { type: "string" },
    role: { type: "number" },
    apiKey: { type: "number" },
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
    token: { type: "string" },
  },
};

// Respuesta de éxito con datos
const dataResponse = (statusCode: number = 200, dataSchema: object) => ({
  type: "object",
  properties: {
    success: { type: "boolean", default: true },
    statusCode: { type: "number", default: statusCode },
    message: { type: "string" },
    data: dataSchema,
  },
});

const requestHeaders = {
  type: "object",
  properties: {
    authorization: { type: "string" },
  },
};

// Esquemas reutilizables
const responseSchema = {
  200: successResponse(200),
  404: errorResponse(404, "Not Found"),
  400: errorResponse(400, "Bad Request"),
  500: errorResponse(500, "Internal Server Error"),
};

// Schemas
const getUsersSchema: FastifySchema = {
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean", default: true },
        statusCode: { type: "number", default: 200 },
        message: { type: "string" },
        data: {
          type: "array",
          items: propertiesEntity,
        },
      },
    },
    404: responseSchema[404],
  },
};

const getUserSchema: FastifySchema = {
  params: {
    type: "object",
    properties: {
      id: { type: "string" },
    },
  },
  headers: requestHeaders,
  response: {
    200: dataResponse(200, propertiesEntity),
    400: responseSchema[400],
    404: responseSchema[404],
  },
};

const createUserSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["email", "password", "role", "website_id"],
    properties: {
      email: { type: "string" },
      password: { type: "string" },
      role: { type: "string" },
      website_id: { type: "string" },
    },
  },
  response: {
    200: dataResponse(200, propertiesEntity),
    404: responseSchema[404],
    500: responseSchema[500],
  },
};

const modifyUserSchema: FastifySchema = {
  params: {
    type: "object",
    properties: {
      id: { type: "string" },
    },
  },
  body: {
    type: "object",
    properties: {
      email: { type: "string" },
      password: { type: "string" },
      role: { type: "string" },
    },
  },
  headers: requestHeaders,
  response: {
    200: dataResponse(200, propertiesEntity),
    404: responseSchema[404],
    500: responseSchema[500],
  },
};

const loginSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string" },
      password: { type: "string" },
    },
  },
  response: {
    200: dataResponse(200, propertiesEntity),
    404: responseSchema[404],
    401: errorResponse(401, "Unauthorized"),
    500: responseSchema[500],
  },
};

const logoutSchema: FastifySchema = {
  params: {
    type: "object",
    properties: {
      id: { type: "string" },
    },
  },
  headers: requestHeaders,
  response: responseSchema,
};

const modifyPasswordSchema: FastifySchema = {
  body: {
    type: "object",
    properties: {
      password: { type: "string" },
    },
  },
  headers: requestHeaders,
  response: responseSchema,
};

const requestPasswordResetSchema: FastifySchema = {
  headers: requestHeaders,
  body: {
    type: "object",
    properties: {
      email: { type: "string" },
    },
  },
  response: {
    200: {
      ...successResponse(200),
      properties: {
        ...successResponse(200).properties,
        token: { type: "string" },
      },
    },
    404: errorResponse(404, "Not Found"),
    500: errorResponse(500, "Internal Server Error"),
  },
};

const tokenValidation:FastifySchema={
  headers:requestHeaders,
}

const deleteUserSchema: FastifySchema = {
  headers: requestHeaders,
  params: {
    type: "object",
    properties: {
      id: { type: "string" },
    },
  },
  response: responseSchema,
};

export {
  getUsersSchema,
  getUserSchema,
  createUserSchema,
  modifyUserSchema,
  modifyPasswordSchema,
  deleteUserSchema,
  loginSchema,
  logoutSchema,
  tokenValidation,
  requestPasswordResetSchema,
};
