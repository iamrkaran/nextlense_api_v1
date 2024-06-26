import {
  Controller,
  Get,
  Logger,
  Patch,
  Post,
  Query,
  Delete,
  UseGuards,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserInfoDto } from './dto/user-info.dto';
import { User } from './entities/user.entity';
import { GetUser } from './decorator/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('USER')
@UseGuards(AuthGuard())
@ApiBearerAuth('Secret1234')
@Controller('user')
export class UsersController {
  private logger = new Logger('UserController');

  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: UserInfoDto,
    status: 200,
    description: 'Success',
  })
  @ApiOperation({ summary: `Get user's profile` })
  @Get('/profile')
  getUserProfile(@GetUser() user: User): Promise<UserInfoDto> {
    this.logger.verbose(`User ${user.email} is accessing their profile`);
    return this.userService.getUserProfile(user.email);
  }

  @ApiResponse({
    type: UserInfoDto,
    status: 200,
    description: 'User profile updated successfully',
  })
  @ApiOperation({ summary: `Update user's profile` })
  @ApiBody({ type: UpdateUserDto })
  @Patch('/profile')
  updateUserProfile(
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserInfoDto> {
    return this.userService.updateUserProfile(user.email, updateUserDto);
  }

  @ApiResponse({
    status: 200,
    description: 'User account deleted successfully',
  })
  @ApiOperation({ summary: 'Delete user account' })
  @Delete('/delete')
  deleteUserAccount(@GetUser() user: User): Promise<void> {
    return this.userService.deleteUserAccount(user.email);
  }

  @ApiResponse({
    type: [UserInfoDto],
    status: 200,
    description: 'Success',
  })
  @ApiQuery({
    name: 'keyword',
    description: `Returns users whose username or email contains the keyword`,
    required: true,
  })
  @ApiOperation({ summary: 'Search for users' })
  @Get('/search')
  searchForUsers(@Query('keyword') keyword: string): Promise<UserInfoDto[]> {
    return this.userService.searchForUsers(keyword);
  }

  @ApiResponse({
    status: 200,
    description: 'User followed/unfollowed successfully',
  })
  @ApiOperation({ summary: 'Follow/Unfollow other users' })
  @Post('/follow')
  followUnfollowUser(
    @GetUser() user: User,
    @Query('userId') userId: string,
  ): Promise<void> {
    return this.userService.followUnfollowUser(user.email, userId);
  }

  @ApiResponse({
    type: UserInfoDto,
    status: 200,
    description: 'Success',
  })
  @ApiOperation({ summary: 'Fetch user by userId' })
  @Get('/')
  fetchUserById(@Query('userId') userId: string): Promise<UserInfoDto> {
    return this.userService.findUserById(userId);
  }

  //update profile picture
  @ApiResponse({
    type: UserInfoDto,
    status: 200,
    description: 'Success',
  })
  @ApiOperation({ summary: 'Update profile picture' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Patch('/profile-picture')
  updateProfilePicture(
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UserInfoDto> {
    return this.userService.updateProfilePicture(file, user);
  }

  //fetch profile by username
  @ApiResponse({
    type: UserInfoDto,
    status: 200,
    description: 'Success',
  })
  @ApiOperation({ summary: 'Fetch user by username' })
  @Get('/username')
  fetchUserByUsername(
    @Query('username') username: string,
  ): Promise<UserInfoDto> {
    return this.userService.fetchUserByUsername(username);
  }
}
