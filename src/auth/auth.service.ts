
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { randomUUID } from 'node:crypto';

import { Role, AuthenticatedUser } from './auth.model.js';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
  private users: AuthenticatedUser[] = [];

  constructor(private readonly jwtService: JwtService) {
    console.log('AuthService initialized');
  }

  async register(dto: RegisterDto) {
    const existingUser = this.users.find(
      (user) => user.email === dto.email,
    );

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await argon2.hash(dto.password);

    const newUser: AuthenticatedUser = {
      id: randomUUID(),
      username: dto.username,
      email: dto.email,
      passwordHash,
      role: Role.STUDENT,
    };

    this.users.push(newUser);

    console.log('REGISTERED:', dto.email, 'Users:', this.users.length);

    const { passwordHash: _, ...safeUser } = newUser;

    return {
      message: 'User registered successfully',
      user: safeUser,
    };
  }

  private async generateTokens(user: AuthenticatedUser) {
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret:
        process.env.JWT_REFRESH_SECRET ||
        'classroom-refresh-secret-change-me',
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async login(email: string, password: string) {
    console.log('LOGIN:', email, 'Users:', this.users.length);

    const user = this.users.find(
      (item) => item.email === email,
    );

    if (
      !user ||
      !(await argon2.verify(user.passwordHash, password))
    ) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateTokens(user);

    user.refreshTokenHash = await argon2.hash(tokens.refreshToken);

    const {
      passwordHash: _,
      refreshTokenHash: __,
      ...safeUser
    } = user;

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      user: safeUser,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = this.users.find(
      (item) => item.id === userId,
    );

    if (
      !user ||
      !user.refreshTokenHash ||
      !(await argon2.verify(user.refreshTokenHash, refreshToken))
    ) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.generateTokens(user);

    user.refreshTokenHash = await argon2.hash(tokens.refreshToken);

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }

  async logout(userId: string) {
    const user = this.users.find(
      (item) => item.id === userId,
    );

    if (user) {
      user.refreshTokenHash = undefined;
    }

    return { message: 'Logged out successfully' };
  }
}
