import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { levelId: true }
    });

    return this.prisma.category.findMany({
      select: {
        categoryId: true,
        description: true,
        progress: true,
      },
    });
  }
} 
