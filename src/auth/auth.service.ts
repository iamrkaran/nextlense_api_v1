import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserInfoDto } from 'src/users/dto/user-info.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<void> {
    await this.userService.registerUser(createUserDto);
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userService.loginUser(loginDto);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = this.generateToken(user);
    return { accessToken };
  }

  generateToken(user: UserInfoDto): string {
    const payload = { sub: user._id, email: user.email };
    return this.jwtService.sign(payload);
  }

  async validateUser(payload: any): Promise<UserInfoDto> {
    return await this.userService.findUserById(payload);
  }
}
