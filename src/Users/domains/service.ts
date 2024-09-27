import { UserResponseData } from "./entities";
import crypto from "crypto";

const convertToUser = (data: { [key: string]: any }) => {
  return {
    username: data["username"],
    email: data["email"],
    website_id: data["website_id"],
    role: data["role"],
    apiKey: data["apiKey"],
    token: data["token"] ?? "",
  };
};

const convertUserWithPassword = (data: { [key: string]: any }) => {
  return {
    username: data["username"],
    email: data["email"],
    password: data["password"],
    website_id: data["website_id"],
    role: data["role"],
    apiKey: data["apiKey"],
    token: data["token"] ?? "",
  };
};

const convertDataToUserBase = (data: {
  [key: string]: any;
}): UserResponseData => {
  return {
    id: data["id"],
    user_id: data["user_id"],
    username: data["username"],
    email: data["email"],
    website_id: data["website_id"],
    role: data["role"],
    apiKey: data["apiKey"],
    token: data["token"],
    isVerified: data["isVerified"],
    createdAt: data["createdAt"],
    updatedAt: data["updatedAt"],
  };
};

const generateRandomToken = () => {
  return crypto.randomBytes(16).toString("hex");
};

const generateApiKey = (data: { id: string; role: string }, clave: string) => {
  const secretKey = Buffer.from(clave, "hex");
  const vi = crypto.randomBytes(16);
  const fromToJson = JSON.stringify(data);
  const cipher = crypto.createCipheriv("aes-256-cbc", secretKey, vi);
  let encrypted = cipher.update(fromToJson, "utf8", "hex");
  encrypted += cipher.final("hex");

  const apiKey = {
    iv: vi.toString("hex"),
    encryptedData: encrypted,
  };

  return JSON.stringify(apiKey);
};

const decryptApiKey = (
  data: { iv: string; encryptedData: string },
  clave: string
) => {
  const secretKey = Buffer.from(clave, "hex");
  const iv = Buffer.from(data.iv, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", secretKey, iv);
  let decrypted = decipher.update(data.encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return JSON.parse(decrypted);
};

export {
  convertToUser,
  convertUserWithPassword,
  convertDataToUserBase,
  generateApiKey,
  decryptApiKey,
  generateRandomToken,
};
