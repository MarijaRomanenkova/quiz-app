import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { CategoriesModule } from './categories/categories.module';
import { TopicsModule } from './topics/topics.module';
import { QuestionsModule } from './questions/questions.module';
import { ReadingTextsModule } from './reading-texts/reading-texts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    HealthModule,
    CategoriesModule,
    TopicsModule,
    QuestionsModule,
    ReadingTextsModule,
  ],
})
export class AppModule {}
