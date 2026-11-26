export enum Role {
  ADMIN = 'ADMIN',
  ORGANIZER = 'ORGANIZER',
  STUDENT = 'STUDENT',
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: Role;
  refreshTokenHash?: string;
}