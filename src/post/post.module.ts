import { Module, forwardRef } from '@nestjs/common';
import { PostService } from './post.service';
import { AwsS3Service } from './aws-s3.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entities/post.entity';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    forwardRef(() => UsersModule),
  ],
  controllers: [PostController],
  providers: [PostService, AwsS3Service],
  exports: [PostService],
})
export class PostModule {}
