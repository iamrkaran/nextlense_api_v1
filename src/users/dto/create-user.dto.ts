import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { UserRole } from '../user-role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe', description: 'The username of the user' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'The email of the user',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    enum: Object.values(UserRole),
    example: UserRole.USER,
    description: 'The role of the user',
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiPropertyOptional({
    example: 'John',
    description: 'The first name of the user',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Doe',
    description: 'The last name of the user',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    example: 'profile.jpg',
    description: 'URL or file path to the profile picture',
  })
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiPropertyOptional({
    example: 'cover.jpg',
    description: 'URL or file path to the cover picture',
  })
  @IsOptional()
  @IsString()
  coverPicture?: string;

  @ApiPropertyOptional({
    example: ['post_id1', 'post_id2'],
    description: 'Array of post IDs saved by the user',
  })
  @IsOptional()
  @IsArray()
  savedPosts?: string[];

  @ApiPropertyOptional({
    example: ['user_id1', 'user_id2'],
    description: 'Array of user IDs following the user',
  })
  @IsOptional()
  @IsArray()
  followers?: string[];

  @ApiPropertyOptional({
    example: ['user_id1', 'user_id2'],
    description: 'Array of user IDs followed by the user',
  })
  @IsOptional()
  @IsArray()
  following?: string[];

  @ApiPropertyOptional({
    example: 'Bio of the user',
    description: 'The bio of the user',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    example: 'https://example.com',
    description: 'The website of the user',
  })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({
    example: false,
    description: 'Indicates whether the user is deleted',
  })
  @IsBoolean()
  isDeleted: boolean;

  @ApiProperty({
    example: false,
    description: 'Indicates whether the onboarding process is complete',
  })
  @IsBoolean()
  isOnBoardingComplete: boolean;

  @ApiProperty({
    example: false,
    description: 'Indicates whether the user is verified',
  })
  @IsBoolean()
  isVerified: boolean;

  @ApiProperty({
    example: false,
    description: 'Indicates whether the user is an OAuth user',
  })
  @IsBoolean()
  isOAuthUser: boolean;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
