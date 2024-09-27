import IPostRepository from "../domains/interfaces";
import ModelRepository from "shared/dataBase/repository_base";
import { PostModel } from "shared/dataBase/models/modelPost";
import { PostBase, PostCreate } from "../domains/entities";

class PostRepository
  extends ModelRepository<PostModel>
  implements IPostRepository
{
  constructor() {
    super(PostModel, "postsView");
  }

  async getPosts(page: number, limit: number): Promise<PostBase[]> {
    try {
      const posts = await this.retrieveCountAll(page, limit);
      return posts;
    } catch (error) {
      return [];
    }
  }

  async getPost(
    postIdentifier: string,
    value: string
  ): Promise<PostBase | null> {
    try {
      const post = await this.retrieveById(value, postIdentifier);

      return post;
    } catch (error) {
      return null;
    }
  }

  async addPost(post: PostBase): Promise<boolean> {
    try {
      const newPost = await this.insert(post);

      return newPost?.post_id ? true : false;
    } catch (error) {
      return false;
    }
  }

  async updatePost(postIdentifier: string, post: PostCreate): Promise<boolean> {
    try {
      const results = await this.modify(postIdentifier, post);
      return results > 0;
    } catch (error) {
      return false;
    }
  }

  async deletePost(postIdentifier: string, status: string): Promise<boolean> {
    try {
      const results = await this.deactivate(postIdentifier, status);
      return results > 0;
    } catch (error) {
      return false;
    }
  }
}

export default PostRepository;
