import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateChatDto } from './create-chat.dto';

export class UpdateChatDto extends PartialType(CreateChatDto) {
  @ApiProperty({ description: 'The new name of the chat', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'The new photo of the group chat',
    required: false,
  })
  @IsString()
  @IsOptional()
  groupPhoto?: string;
}
