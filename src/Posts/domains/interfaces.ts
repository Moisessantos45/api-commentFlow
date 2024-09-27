import { PostBase, PostCreate } from "./entities";

interface IPostRepository {
  getPosts(page: number, limit: number): Promise<PostBase[]>;
  getPost(postIdentifier: string, value: string): Promise<PostBase | null>;
  addPost(post: PostBase): Promise<boolean>;
  updatePost(postIdentifier: string, post: PostCreate): Promise<boolean>;
  deletePost(postIdentifier: string, status: string): Promise<boolean>;
}

export default IPostRepository;
