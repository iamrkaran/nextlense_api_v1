import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
  @Prop({ type: [String], required: true })
  members: string[];

  @Prop({
    type: [{ senderId: String, message: String, createdAt: Date }],
    default: [],
  })
  messages: { senderId: string; message: string; createdAt: Date }[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
