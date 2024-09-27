"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const entities_1 = __importDefault(require("./Comments/domains/entities"));
const server = (0, fastify_1.default)({ logger: true });
server.get("/", (_req, _res) => __awaiter(void 0, void 0, void 0, function* () {
    return { hello: "world" };
}));
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield server.listen({
            port: 4000,
        });
        (0, entities_1.default)();
        server.log.info(`Server listening on ${server.server.address()}`);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
});
start();
