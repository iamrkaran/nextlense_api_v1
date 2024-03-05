import {
  Controller,
  Post,
  Param,
  Get,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { LikeService } from './like.service';

import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import {
  ApiResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Like } from './entities/like.entity';
import { CreateLikeDto } from './dto/create-like.dto';
import { GetUser } from 'src/users/decorator/get-user.decorator';
import { User } from 'src/users/entities/user.entity';

@ApiTags('Like')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Secret1234')
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @ApiResponse({
    type: CreateLikeDto,
    status: 201,
    description: 'Like created successfully',
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new like' })
  @Post('/:postId')
  createLike(
    @GetUser() user: User,
    @Param('postId') postId: string,
  ): Promise<Like> {
    const createLikeDto = new CreateLikeDto();
    createLikeDto.userId = user._id;
    createLikeDto.postId = postId;
    return this.likeService.createLike(createLikeDto);
  }

  @ApiResponse({
    status: 201,
    description: 'Like deleted successfully',
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new like' })
  @Delete('/:postId')
  deleteLike(
    @GetUser() user: User,
    @Param('postId') postId: string,
  ): Promise<Like> {
    const createLikeDto = new CreateLikeDto();
    createLikeDto.userId = user._id;
    createLikeDto.postId = postId;
    return this.likeService.deleteLike(createLikeDto);
  }

  @ApiResponse({
    type: CreateLikeDto,
    status: 200,
    description: 'Get likes by post ID',
  })
  @ApiOperation({ summary: 'Get likes by post ID' })
  @Get('/:postId')
  getLikesByPostId(@Param('postId') postId: string): Promise<Like[]> {
    return this.likeService.getLikesByPostId(postId);
  }
}
