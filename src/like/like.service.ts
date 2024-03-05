import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument } from './entities/like.entity';
import { CreateLikeDto } from './dto/create-like.dto';

@Injectable()
export class LikeService {
  constructor(@InjectModel(Like.name) private likeModel: Model<LikeDocument>) {}

  async createLike(createLikeDto: CreateLikeDto): Promise<Like> {
    const { userId, postId } = createLikeDto;
    const existingLike = await this.likeModel.findOne({ userId, postId });
    if (existingLike) {
      throw new Error('User has already liked the post');
    }
    const createdLike = new this.likeModel(createLikeDto);
    return createdLike.save();
  }

  async deleteLike(createLikeDto: CreateLikeDto): Promise<Like> {
    const { userId, postId } = createLikeDto;
    const existingLike = await this.likeModel.findOne({ userId, postId });
    if (!existingLike) {
      throw new Error('User has not liked the post');
    }
    return this.likeModel.findByIdAndDelete(existingLike._id);
  }

  async getLikesByPostId(postId: string): Promise<Like[]> {
    return this.likeModel.find({ postId }).exec();
  }
}
