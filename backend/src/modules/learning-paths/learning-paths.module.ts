import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningPathsService } from './learning-paths.service';
import { LearningPath } from './entities/learning-path.entity';
import { PathNode } from './entities/path-node.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LearningPath, PathNode])],
  providers: [LearningPathsService],
  exports: [LearningPathsService],
})
export class LearningPathsModule {}
