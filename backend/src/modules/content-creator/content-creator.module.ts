import { Module } from '@nestjs/common';
import { ContentCreatorService } from './content-creator.service';
@Module({ providers: [ContentCreatorService], exports: [ContentCreatorService] })
export class ContentCreatorModule {}
