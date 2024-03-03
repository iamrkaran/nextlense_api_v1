import { PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsArray, IsEnum, IsOptional } from 'class-validator';
import { PostStatus } from './post-status.enum';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiPropertyOptional({
    example: 'Updated Title',
    description: 'The updated title of the post',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 'Updated Content',
    description: 'The updated content of the post',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/updated-image.jpg',
    description: 'Updated URL or file path to an associated image',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    example: ['user_id3', 'user_id4'],
    description: 'Updated array of user IDs who liked the post',
  })
  @IsOptional()
  @IsArray()
  likes?: string[];

  @ApiPropertyOptional({
    example: ['comment_id3', 'comment_id4'],
    description: 'Updated array of comment IDs associated with the post',
  })
  @IsOptional()
  @IsArray()
  comments?: string[];

  @ApiPropertyOptional({
    example: PostStatus.PRIVATE,
    enum: Object.values(PostStatus),
    description: 'The updated status of the post (PUBLIC, PRIVATE, etc.)',
  })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;
}
