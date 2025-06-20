import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Prisma, User } from '@prisma/client';

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
      await this.$connect();
      return true;
    } catch (error) {
      console.error('Prisma connection error:', error);
      return false;
    }
  }

  async findUser(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    try {
      return await this.user.findUnique({
        where,
      });
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    try {
      return await this.user.create({
        data,
      });
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    try {
      return await this.user.update({
        where,
        data,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
}
