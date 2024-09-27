import fastify from "fastify";
import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "@fastify/jwt";
import bcrypt from "fastify-bcrypt";
import swagger from "@fastify/swagger";
import swagger_ui from "@fastify/swagger-ui";
import { config } from "dotenv";
import dbInstance from "shared/dataBase/connexion";
// import { UserModel } from "shared/models/modelUser";
// import { CommentsModel } from "shared/models/modelComment";
// import { PostModel } from "shared/models/modelPost";
import apiComments from "@Comments/infrastructure/api";
import apiPost from "@Posts/infrastructure/api";
import apiUsers from "@Users/infrastructure/api";
import { serviceTranslate } from "shared/google-translate/serviceTranslate";
import { sendEmail } from "shared/send_email/services_email";

config();

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      idUser: string;
      email: string;
      role: string;
    };
  }
}

const server = fastify({ logger: true });

const secretKey = process.env.SECRET_KEY || "secret";

server.register(swagger, {
  openapi: {
    info: {
      title: "API Comments",
      description: "API Comments",
      version: "1.0.0",
    },
    tags: [
      {
        name: "Comments",
        description: "Comments API",
      },
      {
        name: "Posts",
        description: "Posts API",
      },
      {
        name: "Users",
        description: "Users API",
      },
    ],
  },
});

server.register(swagger_ui, {
  routePrefix: "/docs",
});

server.register(jwt, { secret: secretKey });
server.register(bcrypt, {
  saltWorkFactor: 10,
});

server.decorate(
  "authenticate",
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      reply.status(404).send({ message: "Unauthorized" });
    }
  }
);

server.addHook("onSend", async (request, _reply, payload: string | Buffer) => {
  const translateEnabled = request.headers["x-translate-enabled"] === "true";

  if (!translateEnabled || !payload) {
    return payload;
  }

  try {
    let jsonPayload: any;

    if (typeof payload === "string") {
      jsonPayload = JSON.parse(payload);
    } else if (Buffer.isBuffer(payload)) {
      jsonPayload = JSON.parse(payload.toString());
    } else {
      throw new Error("Payload is neither string nor Buffer");
    }

    if (jsonPayload.message) {
      const response = await serviceTranslate(jsonPayload.message);
      jsonPayload.message = response || jsonPayload.message;
    }

    return JSON.stringify(jsonPayload);
  } catch (error) {
    return payload;
  }
});

server.get("/", async (request, _reply) => {
  const token = server.jwt.sign({ idUser: "user" });
  const key = request.headers["x-api-key"];
  console.log("key", key);
  return { hello: "world", token, key };
});

server.register(apiComments, { prefix: "/api/v1.0" });
server.register(apiPost, { prefix: "/api/v1.0" });
server.register(apiUsers, { prefix: "/api/v1.0" });

const start = async () => {
  try {
    await dbInstance.authenticate();

    await server.listen({
      port: 4000,
    });

    await sendEmail("santosxphdz34@gmail.com");

    console.log("Connection has been established successfully.");
    // await UserModel.sync({ force: true });
    // await CommentsModel.sync({ force: true });
    // await PostModel.sync({ force: true });

    server.log.info(`Server listening on ${server.server.address()}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
start();
