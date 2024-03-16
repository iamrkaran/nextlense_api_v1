import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ValidationPipe,
} from '@nestjs/common';

import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('POST')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Secret1234')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiResponse({
    type: CreatePostDto,
    status: 200,
    description: 'Success',
  })
  @ApiOperation({ summary: 'Get all posts' })
  @Get('/')
  getAllPosts(): Promise<CreatePostDto[]> {
    return this.postService.getAllPosts();
  }

  @ApiResponse({
    type: CreatePostDto,
    status: 200,
    description: 'Success',
  })
  @ApiOperation({ summary: 'Get post by ID' })
  @Get('/:postId')
  getPostById(@Param('postId') postId: string): Promise<CreatePostDto> {
    return this.postService.getPostById(postId);
  }

  @ApiBody({
    type: CreatePostDto,
    description: 'Post creation request payload',
    required: true,
  })
  @ApiResponse({
    type: CreatePostDto,
    status: 201,
    description: 'Post created successfully',
  })
  @ApiOperation({ summary: 'Create a new post' })
  @Post('/')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'string',
        },
        title: {
          type: 'string',
        },
        content: {
          type: 'string',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async createPost(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe()) createPostDto: CreatePostDto,
  ) {
    const newPost = await this.postService.createPost(createPostDto, file);
    return newPost;
  }

  @ApiResponse({
    type: CreatePostDto, // Replace with your actual response DTO
    status: 200,
    description: 'Post updated successfully',
  })
  @ApiOperation({ summary: 'Update a post by ID' })
  @Patch('/:postId')
  updatePost(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<CreatePostDto> {
    return this.postService.updatePost(postId, updatePostDto);
  }

  @ApiResponse({
    type: CreatePostDto, // Replace with your actual response DTO
    status: 200,
    description: 'Post deleted successfully',
  })
  @ApiOperation({ summary: 'Delete a post by ID' })
  @Delete('/:postId')
  deletePost(@Param('postId') postId: string): Promise<CreatePostDto> {
    return this.postService.deletePost(postId);
  }
}