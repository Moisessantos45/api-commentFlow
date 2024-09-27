import { CommentsBase, CommentsResponse } from "./entities";

const transformMapToJson = (data: { [key: string]: any }): any => {
  const dataKeys: { [key: string]: any } = {
    user_id: data["user_id"],
    post_id: data["post_id"],
    parent_id: data["parent_id"] || null,
    comment: data["comment"],
    dislikes: data["dislikes"],
    likes: data["likes"],
    status: "active",
  };

  if (data["children"]) {
    dataKeys["children"] = data["children"];
  }

  return dataKeys;
};

const transformMapToEntity = (data: { [key: string]: any }): CommentsBase => {
  return {
    id: data["id"],
    comment_id: data["comment_id"],
    user_id: data["user_id"],
    post_id: data["post_id"],
    parent_id: data["parent_id"],
    comment: data["comment"],
    createdAt: data["created_at"],
    updatedAt: data["updated_at"],
    dislikes: data["dislikes"],
    likes: data["likes"],
  };
};

const checkIfNaN = (data: any): boolean => {
  return Number.isNaN(Number(data));
};

const objectResponse = (data: CommentsResponse) => {
  return {
    ...data,
  };
};

export { transformMapToJson, transformMapToEntity, checkIfNaN, objectResponse };
