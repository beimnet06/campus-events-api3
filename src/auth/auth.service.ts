
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, AuthenticatedUser } from './auth.model.js';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // Demo users for the classroom assignment
  private users: AuthenticatedUser[] = [
    { id: 'user-1', username: 'admin', role: Role.ADMIN },
    { id: 'user-10', username: 'organizer1', role: Role.ORGANIZER },
    { id: 'user-20', username: 'organizer2', role: Role.ORGANIZER },
    { id: 'user-30', username: 'student1', role: Role.STUDENT },
  ];

  async login(username: string) {
    const user = this.users.find(
      (item) => item.username === username,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid username');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user,
    };
  }
}
