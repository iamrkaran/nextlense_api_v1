import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UserInfoDto {
  @ApiProperty()
  readonly _id: string;

  @ApiProperty()
  readonly username: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly role: string;

  @ApiProperty()
  readonly firstName?: string;

  @ApiProperty()
  readonly lastName?: string;

  @ApiProperty()
  readonly profilePicture?: string;

  @ApiProperty()
  readonly coverPicture?: string;

  @ApiProperty()
  readonly savedPosts: string[];

  @ApiProperty()
  readonly followers: string[];

  @ApiProperty()
  readonly following: string[];

  @ApiProperty()
  readonly bio?: string;

  @ApiProperty()
  readonly website?: string;

  @ApiProperty()
  readonly isDeleted: boolean;

  @ApiProperty()
  readonly isOnBoardingComplete: boolean;

  @ApiProperty()
  readonly isVerified: boolean;

  @ApiProperty()
  readonly isOAuthUser: boolean;

  constructor({
    _id,
    username,
    email,
    role,
    firstName,
    lastName,
    profilePicture,
    coverPicture,
    savedPosts,
    followers,
    following,
    bio,
    website,
    isDeleted,
    isOnBoardingComplete,
    isVerified,
    isOAuthUser,
  }: User) {
    this._id = _id;
    this.username = username;
    this.email = email;
    this.role = role;
    this.firstName = firstName;
    this.lastName = lastName;
    this.profilePicture = profilePicture;
    this.coverPicture = coverPicture;
    this.savedPosts = savedPosts;
    this.followers = followers;
    this.following = following;
    this.bio = bio;
    this.website = website;
    this.isDeleted = isDeleted;
    this.isOnBoardingComplete = isOnBoardingComplete;
    this.isVerified = isVerified;
    this.isOAuthUser = isOAuthUser;
  }
}
