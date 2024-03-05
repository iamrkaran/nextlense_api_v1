import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Like, LikeSchema } from './entities/like.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
  ],

  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
