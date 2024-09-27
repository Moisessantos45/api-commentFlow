import { QueryTypes } from "sequelize";
import ModelRepository from "shared/dataBase/repository_base";
import { CommentsModel } from "shared/dataBase/models/modelComment";
import { CommentsBase, CommentsCreate } from "../domains/entities";
import ICommentRepository from "../domains/interface";
import dbInstance from "shared/dataBase/connexion";

class CommentsRepository
  extends ModelRepository<CommentsModel>
  implements ICommentRepository
{
  constructor() {
    super(CommentsModel, "commentsView");
  }

  async getComments(
    id: string,
    page: number,
    limit: number
  ): Promise<CommentsBase[]> {
    try {
      const query = `
      SELECT * FROM commentsView
      WHERE post_id = :postId AND parent_id IS NULL AND status = 'active'
      LIMIT :limit OFFSET :offset
    `;

      const replacements: { [key: string]: any } = {
        postId: id,
        limit: limit,
        offset: (page - 1) * limit,
      };

      const [comments] = await dbInstance.query(query, {
        replacements,
        type: QueryTypes.SELECT,
      });

      return comments as CommentsBase[];
    } catch (error) {
      return [];
    }
  }

  async getCommentsWithChildren(id: string): Promise<CommentsBase[]> {
    try {
      const comments = await CommentsModel.findAll({
        where: { post_id: id, status: "active" },
        include: [
          {
            model: CommentsModel,
            as: "children",
            include: [
              {
                model: CommentsModel,
                as: "children",
              },
            ],
          },
        ],
      });

      return comments as CommentsBase[];
    } catch (error) {
      return [];
    }
  }

  async getChildComments(id: string): Promise<CommentsBase[] | null> {
    try {
      const query = `
      SELECT * FROM commentsView
      WHERE parent_id = :parentId AND status = 'active'
    `;
      const replacements: { [key: string]: any } = { parentId: id };
      const [comments] = await dbInstance.query(query, {
        replacements,
        type: QueryTypes.SELECT,
      });

      return comments as CommentsBase[];
    } catch (error) {
      return null;
    }
  }

  async addComment(comment: CommentsBase): Promise<boolean> {
    try {
      await CommentsModel.create(comment);
      return true;
    } catch (error) {
      return false;
    }
  }

  async updateComment(id: string, comment: CommentsCreate): Promise<boolean> {
    try {
      const [result] = await CommentsModel.update(comment, {
        where: { id },
      });

      return result > 0;
    } catch (error) {
      return false;
    }
  }

  async updateDislikeAndLike(
    id: string,
    comment: { dislikes: number; likes: number }
  ): Promise<boolean> {
    try {
      const result = await this.modify(id, comment);

      return result > 0;
    } catch (error) {
      return false;
    }
  }

  async deleteComment(id: string, status: string): Promise<boolean> {
    try {
      const result = await this.deactivate(id, status);

      return result > 0;
    } catch (error) {
      return false;
    }
  }
}

export default CommentsRepository;
