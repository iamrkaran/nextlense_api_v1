import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { PostStatus } from '../dto/post-status.enum';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  caption?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop()
  image?: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Like' }] })
  likes?: string[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Comment' }] })
  comments?: string[];

  @Prop()
  location?: string;

  @Prop({
    type: String,
    enum: Object.values(PostStatus),
    default: PostStatus.PUBLIC,
  })
  status: PostStatus;
}

export const PostSchema = SchemaFactory.createForClass(Post);
