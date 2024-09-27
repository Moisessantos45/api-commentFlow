interface CommentsBase {
  id: number;
  comment_id: string;
  post_id: string;
  user_id: string;
  comment: string;
  parent_id: string | null;
  dislikes: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  status?: string;
  children?: CommentsBase[];
}

interface CommentsCreate
  extends Omit<
    CommentsBase,
    "id" | "comment_id" | "createdAt" | "updatedAt" | "dislikes" | "likes"
  > {}

interface CommentsResponse {
  success: boolean;
  message?: string;
  statusCode: number;
  data?: CommentsBase[];
}

export { CommentsBase, CommentsCreate, CommentsResponse };
