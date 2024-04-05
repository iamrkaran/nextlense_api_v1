import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './entities/post.entity';
import { AwsS3Service } from './aws-s3.service';
import { UsersService } from 'src/users/users.service';
import { LikeService } from 'src/like/like.service';
import { CommentsService } from 'src/comments/comments.service';
import { PostResponseDto } from './dto/post-response.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly awsS3Service: AwsS3Service,
    private readonly likeService: LikeService,
    private readonly commentsService: CommentsService,
  ) {}

  async getAllPosts(): Promise<PostResponseDto[]> {
    const posts = await this.postModel.find().exec();

    // Map over each post
    const postsWithLikesAndComments = await Promise.all(
      posts.map(async (post) => {
        // Find likes and comments associated with the post
        const likes = await this.likeService.getLikesByPostId(
          post._id.toString(),
        );
        const comments = await this.commentsService.fetchComments(
          post._id.toString(),
        );

        // Map the post to a PostInfo object and add the likes and comments
        const postInfo = this.mapToPostInfo(post);
        postInfo.likes = likes; // Add likes to the post
        postInfo.comments = comments.map((comment) => ({
          _id: comment._id,
          userId: comment.userId,
          postId: comment.postId,
          content: comment.content,
          createdAt: comment.createdAt,
        }));
        // console.log('postInfo:', postInfo);

        return postInfo;
      }),
    );

    return postsWithLikesAndComments;
  }

  async getPostById(postId: string): Promise<PostResponseDto> {
    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Find likes and comments associated with the post
    const likes = await this.likeService.getLikesByPostId(post._id.toString());
    const comments = await this.commentsService.fetchComments(
      post._id.toString(),
    );

    // Map the post to a PostInfo object and add the likes and comments
    const postInfo = this.mapToPostInfo(post);
    postInfo.likes = likes; // Add likes to the post
    postInfo.comments = comments.map((comment) => ({
      _id: comment._id,
      userId: comment.userId,
      postId: comment.postId,
      content: comment.content,
      createdAt: comment.createdAt,
    }));

    // console.log('postInfo:', postInfo);

    return postInfo;
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

      const { caption, location } = createPostDto;

      const newPost = new this.postModel({
        userId,
        caption,
        location,
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

  async getAllPostsByUsername(username: string): Promise<CreatePostDto[]> {
    //get username from userservice
    const user = await this.usersService.fetchUserByUsername(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const posts = await this.postModel.find({ userId: user._id }).exec();
    return posts.map((post) => this.mapToPostInfo(post));
  }

  // fetchSavedPostsByUsername
  async fetchSavedPostsByUsername(username: string): Promise<CreatePostDto[]> {
    //savedposts[] in usermodel relation with postId, it have postId[]
    const user = await this.usersService.fetchUserByUsername(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const posts = await this.postModel
      .find({ _id: { $in: user.savedPosts } })
      .exec();

    return posts.map((post) => this.mapToPostInfo(post));
  }

  async savePost(postId: string, user: any): Promise<CreatePostDto> {
    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    //check if post already saved by user
    const isSaved = user.savedPosts.includes(postId);
    if (isSaved) {
      throw new NotFoundException('Post already saved');
    }

    //save post in user model
    user.savedPosts.push(postId);
    await user.save();

    return this.mapToPostInfo(post);
  }

  async unsavePost(postId: string, user: any): Promise<CreatePostDto> {
    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    //check if post already saved by user
    const isSaved = user.savedPosts.includes(postId);
    if (!isSaved) {
      throw new NotFoundException('Post not saved');
    }

    //remove post from user model
    user.savedPosts = user.savedPosts.filter((id) => id !== postId);
    await user.save();

    return this.mapToPostInfo(post);
  }

  async getPostsByUsers(userIds: string[]): Promise<PostDocument[]> {
    return this.postModel.find({ userId: { $in: userIds } }).exec();
  }

  async getSimilarPosts(post: PostResponseDto): Promise<PostDocument[]> {
    return this.postModel
      .find({
        $or: [{ caption: post.caption }, { location: post.location }],
      })
      .exec();
  }

  private mapToPostInfo(post: PostDocument): CreatePostDto {
    return post.toObject() as CreatePostDto;
  }
}
