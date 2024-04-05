import { Injectable, NotFoundException } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResponseDto } from './dto/post-response.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsRecommendationService {
  constructor(
    private readonly postService: PostService,
    private readonly usersService: UsersService,
  ) {}
  async getPostsRecommendations(userId: string): Promise<PostResponseDto[]> {
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Fetch posts from users that the current user is following
    const followingPosts = await this.postService.getPostsByUsers(
      user.following,
    );

    // Fetch posts similar to the posts the user has saved
    const similarPosts = [];
    for (const postId of user.savedPosts) {
      const postDto = await this.postService.getPostById(postId);
      const similar = await this.postService.getSimilarPosts(postDto);
      similarPosts.push(...similar);
    }

    // Combine the two arrays and remove duplicates
    const recommendedPosts = [...new Set([...followingPosts, ...similarPosts])];

    return recommendedPosts;
  }
}
