import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunicationHubService } from './communication-hub.service';
import { CommunicationHubController } from './communication-hub.controller';
import { ParentTeacherMessage } from './entities/parent-teacher-message.entity';
import { SharedObservation } from './entities/shared-observation.entity';
import { ObservationComment } from './entities/observation-comment.entity';
import { WeeklyProgressReport } from './entities/weekly-progress-report.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ParentTeacherMessage,
      SharedObservation,
      ObservationComment,
      WeeklyProgressReport,
    ]),
  ],
  controllers: [CommunicationHubController],
  providers: [CommunicationHubService],
  exports: [CommunicationHubService],
})
export class CommunicationHubModule {}
