import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@WebSocketGateway({ cors: true })
export class MessagesGateway {
  
  @WebSocketServer() server: Server;
  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('message')
  async create(@MessageBody() createMessageDto: CreateMessageDto) {
    const newMessage = await this.messagesService.create(createMessageDto);
    this.server.emit('message', newMessage);
  }

  //socket.emit('getMessages', user?._id)}>
  @SubscribeMessage('getMessages')
  async findAll(@MessageBody() userId: string) {
    const messages = await this.messagesService.findAll(userId);
    this.server.emit('getMessages', messages);
  }
}
