import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLikeDto {
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
}
