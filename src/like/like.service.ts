import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument } from './entities/like.entity';
import { CreateLikeDto } from './dto/create-like.dto';

@Injectable()
export class LikeService {
  constructor(@InjectModel(Like.name) private likeModel: Model<LikeDocument>) {}

  async createLike(createLikeDto: CreateLikeDto): Promise<Like> {
    const createdLike = new this.likeModel(createLikeDto);
    return createdLike.save();
  }

  async getLikesByPostId(postId: string): Promise<Like[]> {
    return this.likeModel.find({ postId }).exec();
  }
}
