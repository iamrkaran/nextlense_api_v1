import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

import { LoginDto } from './dto/login.dto';

import { UsersService } from 'src/users/users.service';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
  })
  @ApiOperation({ summary: 'Register a new user' })
  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.authService.register(createUserDto);
  }

  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
  })
  @ApiBody({
    type: LoginDto,
  })
  @ApiOperation({ summary: 'Log in a user' })
  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
