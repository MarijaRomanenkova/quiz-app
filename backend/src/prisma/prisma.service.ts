import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  UserCreateInput,
  UserUpdateInput,
  UserWhereUniqueInput,
} from '../types/prisma.types';

type User = {
  id: string;
  email: string;
  password: string;
  username: string;
  emailVerified: boolean;
  verificationToken: string | null;
  verificationTokenExpires: Date | null;
  resetToken: string | null;
  resetTokenExpiry: Date | null;
  levelId: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async checkConnection() {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Prisma connection error:', error);
      try {
        await this.$connect();
        return true;
      } catch (reconnectError) {
        console.error('Failed to reconnect to database:', reconnectError);
        return false;
      }
    }
  }

  async findUser(where: UserWhereUniqueInput): Promise<User | null> {
    return this.$queryRaw`SELECT * FROM "User" WHERE ${where}`;
  }

  async createUser(data: UserCreateInput): Promise<User> {
    return this.$queryRaw`INSERT INTO "User" (${Object.keys(data)}) VALUES (${Object.values(data)}) RETURNING *`;
  }

  async updateUser(
    where: UserWhereUniqueInput,
    data: UserUpdateInput,
  ): Promise<User> {
    return this.$queryRaw`UPDATE "User" SET ${data} WHERE ${where} RETURNING *`;
  }
}
