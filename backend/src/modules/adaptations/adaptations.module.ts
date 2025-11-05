import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdaptationsService } from './adaptations.service';
import { AdaptationsController } from './adaptations.controller';
import { TaskAdaptation } from './entities/task-adaptation.entity';
import { RefinementHistory } from './entities/refinement-history.entity';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskAdaptation, RefinementHistory]),
    AiModule,
  ],
  controllers: [AdaptationsController],
  providers: [AdaptationsService],
  exports: [AdaptationsService],
})
export class AdaptationsModule {}
