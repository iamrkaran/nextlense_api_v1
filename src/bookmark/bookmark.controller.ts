// bookmark.controller.ts
import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  Get,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { Bookmark } from './entities/bookmark.entity';
import { GetUser } from 'src/users/decorator/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('bookmarks')
@ApiTags('bookmarks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Secret1234')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @ApiResponse({
    status: 201,
    description: 'Bookmark created successfully',
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new bookmark' })
  @Post('/:postId')
  createBookmark(
    @GetUser() user: User,
    @Param('postId') postId: string,
  ): Promise<Bookmark> {
    return this.bookmarkService.createBookmark(user._id, postId);
  }

  @ApiResponse({
    status: 201,
    description: 'Bookmark deleted successfully',
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a bookmark' })
  @Delete('/:postId')
  deleteBookmark(
    @GetUser() user: User,
    @Param('postId') postId: string,
  ): Promise<Bookmark> {
    return this.bookmarkService.deleteBookmark(user._id, postId);
  }

  @ApiResponse({
    status: 200,
    description: 'Bookmarks found successfully',
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find all bookmarks' })
  @Get()
  findBookmarks(@GetUser() user: User): Promise<Bookmark[]> {
    return this.bookmarkService.findBookmarksByUserId(user._id);
  }

  //find bookmark by userName
  @ApiResponse({
    status: 200,
    description: 'Bookmarks found successfully',
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find all bookmarks' })
  @Get('/:username')
  findBookmarksByUserName(
    @Param('username') username: string,
  ): Promise<Bookmark> {
    return this.bookmarkService.findBookmarksByUserName(username);
  }
}
