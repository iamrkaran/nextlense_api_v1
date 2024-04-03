import { PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { PostStatus } from './post-status.enum';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiPropertyOptional({
    example: 'Updated Content',
    description: 'The updated content of the post',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    example: 'user_id',
    description: 'Reference to the user who created the post',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiPropertyOptional({
    example: 'https://example.com/updated-image.jpg',
    description: 'Updated URL or file path to an associated image',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    example: 'Lucknow India',
    description: 'The location of the post',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    example: PostStatus.PRIVATE,
    enum: Object.values(PostStatus),
    description: 'The updated status of the post (PUBLIC, PRIVATE, etc.)',
  })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;
}
