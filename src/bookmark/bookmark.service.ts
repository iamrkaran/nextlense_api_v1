// bookmark.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bookmark, BookmarkDocument } from './entities/bookmark.entity';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectModel(Bookmark.name) private bookmarkModel: Model<BookmarkDocument>,
  ) {}

  async createBookmark(userId: string, postId: string): Promise<Bookmark> {
    const newBookmark = new this.bookmarkModel({ userId, postId });
    return newBookmark.save();
  }

  async deleteBookmark(userId: string, postId: string): Promise<Bookmark> {
    return this.bookmarkModel.findOneAndDelete({ userId, postId }).exec();
  }

  async findBookmarksByUserId(userId: string): Promise<Bookmark[]> {
    return this.bookmarkModel.find({ userId }).exec();
  }

  async findBookmarksByUserName(userName: string): Promise<Bookmark> {
    return this.bookmarkModel.findOne({ userName }).exec();
  }
}
