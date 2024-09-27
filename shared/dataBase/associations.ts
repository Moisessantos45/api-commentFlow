import { UserModel } from "./models/modelUser";
import { CommentsModel } from "./models/modelComment";
import { PostModel } from "./models/modelPost";

// relationships the model User has many posts
UserModel.hasMany(PostModel, {
  foreignKey: "user_id",
  as: "posts",
  onDelete: "CASCADE",
});

PostModel.belongsTo(UserModel, {
  foreignKey: "user_id",
  as: "user",
});

// relationships the model User has many comments
UserModel.hasMany(CommentsModel, {
  foreignKey: "user_id",
  as: "comments_user",
  onDelete: "CASCADE",
});

CommentsModel.belongsTo(UserModel, {
  foreignKey: "user_id",
  as: "user",
});

// relationships the model Post has many comments
PostModel.hasMany(CommentsModel, {
  foreignKey: "post_id",
  as: "comments_post",
  onDelete: "CASCADE",
});

CommentsModel.belongsTo(PostModel, {
  foreignKey: "post_id",
  as: "post",
});

// relationships the model Comment has many children comments
CommentsModel.hasMany(CommentsModel, {
  foreignKey: "parent_id",
  as: "children",
  onDelete: "CASCADE",
});

CommentsModel.belongsTo(CommentsModel, {
  foreignKey: "parent_id",
  as: "parent",
});

