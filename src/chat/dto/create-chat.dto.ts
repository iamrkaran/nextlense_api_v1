import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({ description: 'The ID of the current user' })
  @IsString()
  senderId: string;

  @ApiProperty({ description: 'The ID of the user to chat with' })
  @IsString()
  receiverId: string;

  @ApiProperty({ description: 'Message' })
  @IsString()
  message: string;
}
