import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type LikeDocument = Like & Document;

@Schema({ timestamps: true })
export class Like {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post', required: true })
  postId: string;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
