import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { PostStatus } from './post-status.enum';

export class CreatePostDto {
  @ApiProperty({
    example: 'Example Title',
    description: 'The title of the post',
  })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Example Content',
    description: 'The content of the post',
  })
  @IsOptional()
  @IsString()
  content: string;

  @ApiProperty({
    example: 'user_id',
    description: 'Reference to the user who created the post',
  })
  @IsNotEmpty()
  @IsString()
  user: string;

  @ApiProperty({
    example: PostStatus.PUBLIC,
    enum: Object.values(PostStatus),
    description: 'The status of the post (PUBLIC, PRIVATE, etc.)',
  })
  @IsEnum(PostStatus)
  status: PostStatus = PostStatus.PUBLIC;
}
