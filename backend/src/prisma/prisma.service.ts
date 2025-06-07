import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import type { User } from '@prisma/client';
import {
  UserCreateInput,
  UserUpdateInput,
  UserWhereUniqueInput,
} from '../types/prisma.types';

declare module '@prisma/client' {
  interface PrismaClient {
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    $queryRaw<T = unknown>(
      query: TemplateStringsArray | string,
      ...values: any[]
    ): Promise<T>;
  }
}

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['error', 'warn'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
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
    return await this.user.findUnique({ where });
  }

  async createUser(data: UserCreateInput): Promise<User> {
    return await this.user.create({ data });
  }

  async updateUser(
    where: UserWhereUniqueInput,
    data: UserUpdateInput,
  ): Promise<User> {
    return await this.user.update({ where, data });
  }
}
