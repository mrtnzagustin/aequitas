import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningStyleService } from './learning-style.service';
import { LearningStyleController } from './learning-style.controller';
import { LearningStyleProfile } from './entities/learning-style-profile.entity';
import { StyleEvidence } from './entities/style-evidence.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LearningStyleProfile, StyleEvidence])],
  controllers: [LearningStyleController],
  providers: [LearningStyleService],
  exports: [LearningStyleService],
})
export class LearningStyleModule {}
