import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { UserRole } from '../user-role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop()
  _id: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: String, enum: Object.values(UserRole), default: UserRole.USER })
  role: UserRole;

  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;

  @Prop()
  profilePicture?: string;

  @Prop()
  coverPicture?: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Post' }],
    default: [],
  })
  savedPosts: string[];

  @Prop()
  followers: string[]; // Array of user IDs

  @Prop()
  following: string[]; // Array of user IDs

  @Prop()
  bio?: string;

  @Prop()
  website?: string;

  @Prop({ default: false })
  isDeleted: boolean;

  // Onboarding Fields
  @Prop({ default: false })
  isOnBoardingComplete: boolean;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: false })
  isOAuthUser: boolean;

  @Prop({
    type: String,
    required: function () {
      return !this.isOAuthUser;
    },
  })
  password?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
