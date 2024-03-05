import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCommentDto } from './create-comment.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @ApiProperty({
    description: 'Comment content',
    example: 'This is a great post!',
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}
