import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'User ID',
    example: '5f8a17a4d4d320001f4ae1c9',
  })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Post ID',
    example: '5f8a17a4d4d320001f4ae1c9',
  })
  @IsNotEmpty()
  postId: string;

  @ApiProperty({
    description: 'Comment content',
    example: 'This is a great post!',
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}
