import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';

import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserInfoDto } from 'src/users/dto/user-info.dto';

@ApiTags('POST')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Secret1234')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiResponse({
    type: UserInfoDto, // Replace with your actual response DTO
    status: 200,
    description: 'Success',
  })
  @ApiOperation({ summary: 'Get all posts' })
  @Get('/')
  getAllPosts(): Promise<UserInfoDto[]> {
    return this.postService.getAllPosts();
  }

  @ApiResponse({
    type: UserInfoDto, // Replace with your actual response DTO
    status: 200,
    description: 'Success',
  })
  @ApiOperation({ summary: 'Get post by ID' })
  @Get('/:postId')
  getPostById(@Param('postId') postId: string): Promise<UserInfoDto> {
    return this.postService.getPostById(postId);
  }

  @ApiResponse({
    type: UserInfoDto, // Replace with your actual response DTO
    status: 201,
    description: 'Post created successfully',
  })
  @ApiOperation({ summary: 'Create a new post' })
  @Post('/')
  createPost(@Body() createPostDto: CreatePostDto): Promise<UserInfoDto> {
    return this.postService.createPost(createPostDto);
  }

  @ApiResponse({
    type: UserInfoDto, // Replace with your actual response DTO
    status: 200,
    description: 'Post updated successfully',
  })
  @ApiOperation({ summary: 'Update a post by ID' })
  @Patch('/:postId')
  updatePost(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<UserInfoDto> {
    return this.postService.updatePost(postId, updatePostDto);
  }

  @ApiResponse({
    type: UserInfoDto, // Replace with your actual response DTO
    status: 200,
    description: 'Post deleted successfully',
  })
  @ApiOperation({ summary: 'Delete a post by ID' })
  @Delete('/:postId')
  deletePost(@Param('postId') postId: string): Promise<UserInfoDto> {
    return this.postService.deletePost(postId);
  }
}
