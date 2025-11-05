import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CognitiveLoadService } from './cognitive-load.service';
import { CognitiveLoadController } from './cognitive-load.controller';
import { CognitiveLoadMeasurement } from './entities/cognitive-load-measurement.entity';
import { LoadPattern } from './entities/load-pattern.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CognitiveLoadMeasurement, LoadPattern])],
  controllers: [CognitiveLoadController],
  providers: [CognitiveLoadService],
  exports: [CognitiveLoadService],
})
export class CognitiveLoadModule {}
