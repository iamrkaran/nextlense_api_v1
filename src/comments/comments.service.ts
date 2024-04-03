import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment, CommentDocument } from './entities/comment.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async createComment(
    createCommentDto: CreateCommentDto,
  ): Promise<CommentDocument> {
    const createdComment = new this.commentModel(createCommentDto);
    return createdComment.save();
  }

  async findAll(): Promise<CommentDocument[]> {
    return this.commentModel.find().exec();
  }

  //fetch comments by post id
  async fetchComments(postId: string): Promise<CommentDocument[]> {
    return this.commentModel.find({ postId }).exec();
  }
  // const comments = await this.commentsService.fetchComments(post._id.toString());

  async findCommentById(id: string): Promise<CommentDocument> {
    return this.commentModel.findById(id).exec();
  }

  async updateComment(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<CommentDocument> {
    return this.commentModel.findByIdAndUpdate(id, updateCommentDto, {
      new: true,
    });
  }

  async deleteComment(id: string): Promise<CommentDocument> {
    return this.commentModel.findByIdAndDelete(id);
  }
}
