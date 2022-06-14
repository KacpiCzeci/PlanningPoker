import { UserDTO } from './../dto/user.dto';
import { LoginDto } from './../dto/login.dto';
import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { JwtDTO } from '../dto/jwt.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private users: UsersService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOkResponse({ type: JwtDTO })
  async login(@Request() req, @Body() data: LoginDto) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @ApiOkResponse({ type: JwtDTO })
  async register(@Request() req, @Body() data: LoginDto) {
    return this.authService.register(data.username, data.password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  @ApiOkResponse({ type: UserDTO })
  async getProfile(@Request() req) {
    const user = await this.users.findId(req.user.userId);
    return {
      ...user,
      rooms: Array.from(user.rooms),
      roomsCreated: Array.from(user.roomsCreated),
    };
  }
}
