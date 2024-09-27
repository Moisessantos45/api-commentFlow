import { PostBase } from "./entities";

const transformMapToJson = (data: { [key: string]: any }): any => {
  return {
    user_id: data["user_id"],
    shortName: data["shortName"],
    postTitle: data["postTitle"],
  };
};

const transformMapToEntity = (data: { [key: string]: any }): PostBase => {
  return {
    id: data["id"],
    post_id: data["post_id"],
    user_id: data["user_id"],
    shortName: data["shortName"],
    postTitle: data["postTitle"],
    createdAt: data["createdAt"],
    updatedAt: data["updatedAt"],
    website_id: data["website_id"],
    status: data["status"],
  };
};

const checkIfNaN = (data: any): boolean => {
  return Number.isNaN(Number(data));
};

export { transformMapToJson, transformMapToEntity, checkIfNaN };
