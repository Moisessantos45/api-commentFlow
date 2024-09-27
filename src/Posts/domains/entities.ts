interface PostBase {
  id: number;
  post_id: string;
  user_id: string;
  shortName: string;
  postTitle: string;
  website_id: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PostCreate
  extends Omit<
    PostBase,
    "id" | "post_id" | "createdAt" | "updatedAt" | "status"
  > {}

interface PostResponse {
  success: boolean;
  message?: string;
  statusCode: number;
  data?: PostBase[] | PostBase;
}

export { PostBase, PostCreate, PostResponse };
