import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { Message, MessageDocument } from './entities/message.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from './entities/chat.entity';
import { Model, Types } from 'mongoose';
import * as Pusher from 'pusher';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private readonly usersService: UsersService,
  ) {}

  async create(createChatDto: CreateChatDto) {
    const { senderId, receiverId, message } = createChatDto;

    try {
      // Check if a chat already exists between the sender and receiver
      let chat = await this.chatModel.findOne({
        members: { $all: [senderId, receiverId] },
      });

      if (!chat) {
        // Create a new chat if it doesn't exist
        chat = await this.chatModel.create({
          members: [senderId, receiverId],
          messages: [{ message, senderId }],
        });
      } else {
        // Add the new message to the existing chat
        const newObjectId = new Types.ObjectId();
        // const _id = new ObjectId().toString();
        console.log('newObjectId', newObjectId);
        chat.messages.push({
          _id: newObjectId,
          message,
          senderId,
          createdAt: new Date(),
        });
        console.log(chat.messages);
        await chat.save();
      }
      // Initialize Pusher with your credentials
      const pusher = new Pusher({
        appId: process.env.PUSHER_APP_ID || '1794714',
        key: process.env.PUSHER_APP_KEY || '0318fca772f7c1aed7aa',
        secret: process.env.PUSHER_SECRET || 'ff2148157e43baf16970',
        cluster: 'ap2',
      });

      // Trigger a Pusher event for each member to notify about the new message
      // Function to trigger a new messag

      chat.members.forEach(async (member) => {
        await pusher.trigger(member.toString(), 'new-message', {
          message,
          senderId,
        });
      });

      return chat;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw new Error('Chat creation failed');
    }
  }

  async findAll(id: string) {
    try {
      // Find all chats where the user is a member
      const chats = await this.chatModel.find({ members: id });
      return chats;
    } catch (error) {
      console.error('Error finding chat:', error);
      throw new Error('Chat not found');
    }
  }

  async remove(id: string): Promise<Chat> {
    const chat = await this.chatModel.findById(id);
    if (!chat) {
      throw new NotFoundException(`Chat with id ${id} not found`);
    }
    return this.chatModel.findByIdAndDelete(id);
  }

  async removeMessage(chatId: string, messageId: string): Promise<Message> {
    const chat = await this.chatModel.findById(chatId);
    if (!chat) {
      throw new NotFoundException(`Chat with id ${chatId} not found`);
    }
    // console.log('chat', chat.messages);
    const message = chat.messages.find((message) =>
      message?._id.equals(messageId),
    );

    if (!message) {
      throw new NotFoundException(`Message with id ${messageId} not found`);
    } else {
      chat.messages = chat.messages.filter((msg) => !msg._id.equals(messageId));
      await chat.save();

      // Initialize Pusher with your credentials
      const pusher = new Pusher({
        appId: process.env.PUSHER_APP_ID || '1794714',
        key: process.env.PUSHER_APP_KEY || '0318fca772f7c1aed7aa',
        secret: process.env.PUSHER_SECRET || 'ff2148157e43baf16970',
        cluster: 'ap2',
      });

      // Trigger a Pusher event for each member to notify about the deleted message
      chat.members.forEach(async (member) => {
        await pusher.trigger(member.toString(), 'delete-message', message);
      });

      return message;
    }
  }
  kd;
}
