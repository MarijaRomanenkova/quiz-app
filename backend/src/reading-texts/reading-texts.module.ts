import { Module } from '@nestjs/common';
import { ReadingTextsController } from './reading-texts.controller';
import { ReadingTextsService } from './reading-texts.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReadingTextsController],
  providers: [ReadingTextsService],
  exports: [ReadingTextsService],
})
export class ReadingTextsModule {} 
