import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
  @Prop({ type: [String], required: true })
  members: string[];

  @Prop({
    type: [{ senderId: String, message: String, createdAt: Date }],
    default: [],
  })
  messages: {
    _id?: Types.ObjectId;
    senderId: string;
    message: string;
    createdAt: Date;
  }[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
