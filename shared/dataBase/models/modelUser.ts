import { Model, DataTypes } from "sequelize";
import dbInstance from "shared/dataBase/connexion";
import { UserEntity } from "@src/Users/domains/entities";

export class UserModel extends Model<UserEntity> implements UserEntity {
  public id!: number;
  public user_id!: string;
  public username!: string;
  public email!: string;
  public password!: string;
  public website_id!: string;
  public role!: string;
  public apiKey!: string;
  public token!: string;
  public isVerified!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    website_id: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apiKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    tableName: "users",
    modelName: "User",
    indexes: [
      {
        unique: true,
        fields: ["email"],
      },
    ],
  }
);
