import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { UserInfoDto } from './dto/user-info.dto';
import { LoginDto } from '../auth/dto/login.dto';
import mongoose, { Model } from 'mongoose';
import { AwsS3Service } from 'src/post/aws-s3.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  async registerUser(createUserDto: CreateUserDto): Promise<UserInfoDto> {
    const { email, password, username } = createUserDto;

    // Check if email is already in use
    const existingEmailUser = await this.userModel.findOne({ email });
    if (existingEmailUser) {
      throw new ConflictException('Email is already in use');
    }

    // Check if username is already in use
    const existingUsernameUser = await this.userModel.findOne({ username });
    if (existingUsernameUser) {
      throw new ConflictException('Username is already in use');
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a new user ID
    const newUser = new mongoose.Types.ObjectId();

    // Create a new user instance with the hashed password
    const user = new this.userModel({
      _id: newUser,
      ...createUserDto,
      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();
    // return { message: 'User registered successfully' };
    // // Map the user data to UserInfoDto
    return this.mapToUserInfo(
      await this.userModel.findOne({ email: createUserDto.email }),
    );
  }

  async loginUser(loginDto: LoginDto): Promise<UserInfoDto> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new NotFoundException('Invalid credentials');
    }
    return this.mapToUserInfo(user);
  }

  async getUserProfile(email: string): Promise<UserInfoDto> {
    const user = await this.findUserByEmail(email);
    return this.mapToUserInfo(user);
  }

  async updateUserProfile(
    email: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserInfoDto> {
    const user = await this.findUserByEmail(email);

    Object.assign(user, updateUserDto);
    await user.save();

    return this.mapToUserInfo(user);
  }

  async deleteUserAccount(email: string): Promise<void> {
    const user = await this.findUserByEmail(email);
    //soft delete
    user.isDeleted = true;

    await user.save();
  }

  async searchForUsers(keyword: string): Promise<UserInfoDto[]> {
    const users = await this.userModel
      .find({
        $or: [
          { username: { $regex: keyword, $options: 'i' } },
          { email: { $regex: keyword, $options: 'i' } },
        ],
      })
      .exec();

    return users.map((user) => this.mapToUserInfo(user));
  }

  async followUnfollowUser(
    currentUserEmail: string,
    userId: string,
  ): Promise<void> {
    const currentUser = await this.findUserByEmail(currentUserEmail);
    const targetUser = await this.findUserById(userId);

    if (currentUser.following.includes(userId)) {
      currentUser.following = currentUser.following.filter(
        (id) => id !== userId,
      );
      targetUser.followers = targetUser.followers.filter(
        (id) => id !== currentUser.id,
      );
    } else {
      currentUser.following.push(userId);
      targetUser.followers.push(currentUser.id);
    }

    await Promise.all([currentUser.save(), targetUser.save()]);
  }

  private async findUserByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found by email');
    }
    return user;
  }

  async findUserById(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw new NotFoundException('User not found by id');
    }
    return user;
  }

  async updateProfilePicture(
    file: Express.Multer.File,
    user: User,
  ): Promise<UserInfoDto> {
    const findUser = await this.findUserByEmail(user.email);
    const hashedUser = user._id;
    const profilePicture = await this.awsS3Service.uploadImage(
      file,
      file.originalname,
      file.mimetype,
      hashedUser,
    );
    findUser.profilePicture = profilePicture;
    await findUser.save();
    return this.mapToUserInfo(findUser);
  }

  async fetchUserByUsername(username: string): Promise<UserInfoDto> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException('User not found by username');
    }
    return this.mapToUserInfo(user);
  }

  private mapToUserInfo(user: UserDocument): UserInfoDto {
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
      coverPicture: user.coverPicture,
      savedPosts: user.savedPosts,
      followers: user.followers,
      following: user.following,
      bio: user.bio,
      website: user.website,
      isDeleted: user.isDeleted,
      isOnBoardingComplete: user.isOnBoardingComplete,
      isVerified: user.isVerified,
      isOAuthUser: user.isOAuthUser,
    };
  }
}
