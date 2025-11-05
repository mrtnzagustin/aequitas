import { Module } from '@nestjs/common';
import { StudyCompanionService } from './study-companion.service';
@Module({ providers: [StudyCompanionService], exports: [StudyCompanionService] })
export class StudyCompanionModule {}
