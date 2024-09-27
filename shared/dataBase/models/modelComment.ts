import { Model, DataTypes } from "sequelize";
import dbInstance from "../connexion";
import { UserModel } from "./modelUser";
import { PostModel } from "./modelPost";
import { CommentsBase } from "@src/Comments/domains/entities";

export class CommentsModel extends Model<CommentsBase> implements CommentsBase {
  public id!: number;
  public comment_id!: string;
  public post_id!: string;
  public user_id!: string;
  public comment!: string;
  public parent_id!: string;
  public dislikes!: number;
  public likes!: number;
  public created_at!: Date;
  public updated_at!: Date;
  public status?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CommentsModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
    },
    comment_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    post_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: PostModel,
        key: "post_id",
      },
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: UserModel,
        key: "user_id",
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    parent_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: CommentsModel,
        key: "comment_id",
      },
    },
    dislikes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM("active", "deleted"),
      allowNull: true,
      defaultValue: "active",
    },
  },
  {
    sequelize: dbInstance,
    tableName: "comments",
    modelName: "CommentsModel",
    indexes: [
      {
        fields: ["comment_id"],
        unique: true,
      },
    ],
  }
);
