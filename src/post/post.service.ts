import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './entities/post.entity';
import { AwsS3Service } from './aws-s3.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  async getAllPosts(): Promise<CreatePostDto[]> {
    const posts = await this.postModel.find().exec();
    return posts.map((post) => this.mapToPostInfo(post));
  }

  async getPostById(postId: string): Promise<CreatePostDto> {
    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return this.mapToPostInfo(post);
  }

  async createPost(
    createPostDto: CreatePostDto,
    file: Express.Multer.File,
    userId: string,
  ): Promise<any> {
    try {
      const hashedUser = userId.replace(/[^a-zA-Z0-9]/g, '');
      const imageUrl = await this.awsS3Service.uploadImage(
        file,
        file.originalname,
        file.mimetype,
        hashedUser,
      );

      const { title, content } = createPostDto;

      const newPost = new this.postModel({
        user: userId,
        title,
        content,
        image: imageUrl,
      });
      await newPost.save();

      return this.mapToPostInfo(newPost);
    } catch (error) {
      console.error('Error creating post:', error);
      throw new InternalServerErrorException('Failed to create the post');
    }
  }

  async updatePost(
    postId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<CreatePostDto> {
    const post = await this.postModel
      .findByIdAndUpdate(postId, updatePostDto, { new: true })
      .exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return this.mapToPostInfo(post);
  }

  async deletePost(postId: string): Promise<CreatePostDto> {
    const post = await this.postModel.findByIdAndDelete(postId).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return this.mapToPostInfo(post);
  }

  private mapToPostInfo(post: PostDocument): CreatePostDto {
    return post.toObject() as CreatePostDto;
  }
}
