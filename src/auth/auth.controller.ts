
import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { Public } from './decorators/public.decorator.js';

import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  // Register a new user - Public
  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // Login - Public
  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(
      loginDto.email,
      loginDto.password,
    );
  }

  // Refresh tokens - Public
  @Public()
  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    try {
      const payload = await this.jwtService.verifyAsync(
        dto.refresh_token,
        {
          secret:
            process.env.JWT_REFRESH_SECRET ||
            'classroom-refresh-secret-change-me',
        },
      );

      return this.authService.refreshTokens(
        payload.sub,
        dto.refresh_token,
      );
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // Logout - Protected
  @Post('logout')
  async logout(@Body() dto: RefreshTokenDto) {
    try {
      const payload = await this.jwtService.verifyAsync(
        dto.refresh_token,
        {
          secret:
            process.env.JWT_REFRESH_SECRET ||
            'classroom-refresh-secret-change-me',
        },
      );

      return this.authService.logout(payload.sub);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // Get current authenticated user - Protected
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: Request) {
    return req.user;
  }
}
