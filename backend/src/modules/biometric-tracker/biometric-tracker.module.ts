import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BiometricTrackerService } from './biometric-tracker.service';
import { BiometricTrackerController } from './biometric-tracker.controller';
import { FocusSession } from './entities/focus-session.entity';
import { FocusMetric } from './entities/focus-metric.entity';
import { StudentFocusPattern } from './entities/student-focus-pattern.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FocusSession, FocusMetric, StudentFocusPattern])],
  controllers: [BiometricTrackerController],
  providers: [BiometricTrackerService],
  exports: [BiometricTrackerService],
})
export class BiometricTrackerModule {}
