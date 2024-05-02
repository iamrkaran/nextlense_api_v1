import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const newMessage = new this.messageModel(createMessageDto);
    return newMessage.save();
  }

  async findAll(userId: string): Promise<Message[]> {
    return this.messageModel.find({ userId }).exec();
  }

  async findOne(id: string): Promise<Message> {
    return this.messageModel.findById(id).exec();
  }

  async update(
    id: string,
    createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    return this.messageModel
      .findByIdAndUpdate(id, createMessageDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Message> {
    return this.messageModel.findByIdAndDelete(id).exec();
  }
}
