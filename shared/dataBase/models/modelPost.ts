import { Model, DataTypes } from "sequelize";
import dbInstance from "shared/dataBase/connexion";
import { PostBase } from "@src/Posts/domains/entities";
import { UserModel } from "./modelUser";

export class PostModel extends Model<PostBase> implements PostBase {
  public id!: number;
  public post_id!: string;
  public user_id!: string;
  public shortName!: string;
  public postTitle!: string;
  public website_id!: string;
  public status!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PostModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
    },
    post_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: UserModel,
        key: "user_id",
      },
    },
    shortName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    website_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "deleted"),
      allowNull: false,
      defaultValue: "active",
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
  },
  {
    sequelize: dbInstance,
    tableName: "posts",
    modelName: "Post",
    indexes: [
      {
        unique: true,
        fields: ["post_id"],
      },
    ],
  }
);
