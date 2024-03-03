import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { PostStatus } from '../dto/post-status.enum';

export type PostDocument = Post & Document;

@Schema({ timestamps: true }) // Automatically adds createdAt and updatedAt timestamps
export class Post {
  @Prop({ required: true })
  title?: string;

  @Prop({ required: true })
  content?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string; // Reference to the user who created the post

  @Prop()
  image?: string; // URL or file path to an associated image

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  likes: string[]; // Array of user IDs who liked the post

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  comments: string[]; // Array of comment IDs associated with the post

  @Prop({
    type: String,
    enum: Object.values(PostStatus),
    default: PostStatus.PUBLIC,
  })
  status: PostStatus;
}

export const PostSchema = SchemaFactory.createForClass(Post);
