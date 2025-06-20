import { User } from '@prisma/client';

export interface UserPayload {
  sub: string;
  email: string;
}

export type UserWithVerification = User;
