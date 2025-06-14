import { Prisma } from '@prisma/client';

export type UserCreateInput = {
  email: string;
  password: string;
  username: string;
  levelId: string;
  emailVerified?: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetToken?: string;
  resetTokenExpiry?: Date;
};

export type UserUpdateInput = {
  email?: string;
  password?: string;
  username?: string;
  levelId?: string;
  emailVerified?: boolean;
  verificationToken?: string | null;
  verificationTokenExpires?: Date | null;
  resetToken?: string | null;
  resetTokenExpiry?: Date | null;
};

export type UserWhereUniqueInput = {
  id?: string;
  email?: string;
  username?: string;
  verificationToken?: string;
  resetToken?: string;
};

export type UserWhereInput = {
  id?: string;
  email?: string;
  username?: string;
  levelId?: string;
  emailVerified?: boolean;
};

export type UserSelect = {
  id?: boolean;
  email?: boolean;
  username?: boolean;
  levelId?: boolean;
  emailVerified?: boolean;
  createdAt?: boolean;
  updatedAt?: boolean;
};

// Add more type definitions as needed
