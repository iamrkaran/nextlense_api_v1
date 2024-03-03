// auth.dto.ts
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class AuthCredentialsDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
