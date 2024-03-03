import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './entities/post.entity';
import { UserInfoDto } from 'src/users/dto/user-info.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

  async getAllPosts(): Promise<UserInfoDto[]> {
    const posts = await this.postModel.find().exec();
    return posts.map((post) => this.mapToUserInfo(post));
  }

  async getPostById(postId: string): Promise<UserInfoDto> {
    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return this.mapToUserInfo(post);
  }

  async createPost(createPostDto: CreatePostDto): Promise<UserInfoDto> {
    const post = new this.postModel(createPostDto);
    await post.save();
    return this.mapToUserInfo(post);
  }

  async updatePost(
    postId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<UserInfoDto> {
    const post = await this.postModel
      .findByIdAndUpdate(postId, updatePostDto, { new: true })
      .exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return this.mapToUserInfo(post);
  }

  async deletePost(postId: string): Promise<UserInfoDto> {
    const post = await this.postModel.findByIdAndDelete(postId).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return this.mapToUserInfo(post);
  }

  private mapToUserInfo(post: PostDocument): UserInfoDto {
    // Map your PostDocument to UserInfoDto as needed
    // Example: return new UserInfoDto(post.username, post.email, ...);
    return post.toObject() as UserInfoDto;
  }
}
