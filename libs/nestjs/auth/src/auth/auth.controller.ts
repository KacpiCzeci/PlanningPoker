import { LoginDto } from './../dto/login.dto';
import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Get,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private users: UsersService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Body() data: LoginDto) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Request() req, @Body() data: LoginDto) {
    return this.authService.register(data.username, data.password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req) {
    return await this.users.findId(req.user.userId);
  }
}
