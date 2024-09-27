import { CommentsBase, CommentsCreate } from "./entities";

interface ICommentRepository {
  getComments(id: string, page: number, limit: number): Promise<CommentsBase[]>;
  getCommentsWithChildren(id: string): Promise<CommentsBase[]>;
  getChildComments(id: string): Promise<CommentsBase[] | null>;
  addComment(comment: CommentsBase): Promise<boolean>;
  updateComment(id: string, comment: CommentsCreate): Promise<boolean>;
  updateDislikeAndLike(
    id: string,
    comment: { dislikes: number; likes: number }
  ): Promise<boolean>;
  deleteComment(id: string,status:string): Promise<boolean>;
}

export default ICommentRepository;
