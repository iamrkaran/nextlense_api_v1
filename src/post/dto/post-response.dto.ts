import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { PostStatus } from './post-status.enum';
import { Like } from 'src/like/entities/like.entity';
import { Comment } from 'src/comments/entities/comment.entity';

export class PostResponseDto {
  @ApiProperty({
    example: 'Example Title',
    description: 'The title of the post',
  })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiProperty({
    example: 'user_id',
    description: 'Reference to the user who created the post',
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    example: 'Lucknow India',
    description: 'The location of the post',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    example: PostStatus.PUBLIC,
    enum: Object.values(PostStatus),
    description: 'The status of the post (PUBLIC, PRIVATE, etc.)',
  })
  @IsEnum(PostStatus)
  status: PostStatus = PostStatus.PUBLIC;

  //likes
  @ApiProperty({
    example: ['user_id', 'user_id2'],
    description: 'Reference to the users who liked the post',
  })
  @IsOptional()
  likes?: Like[];

  //comments
  @ApiProperty({
    example: ['comment_id', 'comment_id2'],
    description: 'Reference to the comments on the post',
  })
  @IsOptional()
  comments?: Comment[];
}
