import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LangchainService } from './services/langchain.service';
import { OcrService } from './services/ocr.service';

@Module({
  imports: [ConfigModule],
  providers: [LangchainService, OcrService],
  exports: [LangchainService, OcrService],
})
export class AiModule {}
