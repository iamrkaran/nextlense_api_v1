import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, IsEnum } from 'class-validator';
import { PostStatus } from './post-status.enum';

export class CreatePostDto {
  @ApiProperty({
    example: 'Example Title',
    description: 'The title of the post',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Example Content',
    description: 'The content of the post',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    example: 'user_id',
    description: 'Reference to the user who created the post',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'URL or file path to an associated image',
  })
  @IsString()
  image?: string;

  @ApiProperty({
    example: ['user_id1', 'user_id2'],
    description: 'Array of user IDs who liked the post',
  })
  @IsArray()
  likes: string[];

  @ApiProperty({
    example: ['comment_id1', 'comment_id2'],
    description: 'Array of comment IDs associated with the post',
  })
  @IsArray()
  comments: string[];

  @ApiProperty({
    example: PostStatus.PUBLIC,
    enum: Object.values(PostStatus),
    description: 'The status of the post (PUBLIC, PRIVATE, etc.)',
  })
  @IsEnum(PostStatus)
  status: PostStatus;
}
