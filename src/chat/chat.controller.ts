import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@ApiTags('chats')
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new chat' })
  @ApiResponse({
    status: 201,
    description: 'The chat has been successfully created.',
  })
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto);
  }

  ///api/chats/${user._id}
  @Get(':id')
  @ApiOperation({ summary: 'Find all chat' })
  @ApiResponse({
    status: 200,
    description: 'All chat have been successfully found.',
  })
  findAll(@Param('id') id: string) {
    return this.chatService.findAll(id);
  }

  @Delete(':chatId/messages/:messageId')
  @ApiOperation({ summary: 'Delete a message from a chat' })
  @ApiResponse({
    status: 200,
    description: 'The message has been successfully deleted.',
  })
  async removeMessage(
    @Param('chatId') chatId: string,
    @Param('messageId') messageId: string,
  ) {
    return this.chatService.removeMessage(chatId, messageId);
  }
}
