import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentsService } from './comments.service';
import { GetUser } from 'src/users/decorator/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CommentDocument } from './entities/comment.entity';

@ApiTags('COMMENTS')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Secret1234')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @ApiResponse({
    type: CreateCommentDto,
    status: 201,
    description: 'Comment created successfully',
  })
  @ApiOperation({ summary: 'Create a new comment' })
  @Post('/')
  createComment(
    @GetUser() user: User,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentDocument> {
    createCommentDto.userId = user._id;
    return this.commentService.createComment(createCommentDto);
  }

  @ApiResponse({
    type: [CreateCommentDto],
    status: 200,
    description: 'Comments retrieved successfully',
  })
  @ApiOperation({ summary: 'Retrieve all comments' })
  @Get('/all')
  findAll(): Promise<CommentDocument[]> {
    return this.commentService.findAll();
  }

  @ApiResponse({
    type: CreateCommentDto,
    status: 200,
    description: 'Comment retrieved successfully',
  })
  @ApiOperation({ summary: 'Retrieve a comment by ID' })
  @Get('/:commentId')
  findCommentById(
    @Param('commentId') commentId: string,
  ): Promise<CommentDocument> {
    return this.commentService.findOne(commentId);
  }

  @ApiResponse({
    type: UpdateCommentDto,
    status: 200,
    description: 'Comment updated successfully',
  })
  @ApiOperation({ summary: 'Update a comment by ID' })
  @Patch('/:commentId')
  updateComment(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<CommentDocument> {
    return this.commentService.updateComment(commentId, updateCommentDto);
  }

  @ApiResponse({
    type: CreateCommentDto,
    status: 200,
    description: 'Comment deleted successfully',
  })
  @ApiOperation({ summary: 'Delete a comment by ID' })
  @Delete('/:commentId')
  deleteComment(
    @Param('commentId') commentId: string,
  ): Promise<CommentDocument> {
    return this.commentService.deleteComment(commentId);
  }
}
