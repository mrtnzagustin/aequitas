import { Module } from '@nestjs/common';
import { BiometricTrackerService } from './biometric-tracker.service';
@Module({ providers: [BiometricTrackerService], exports: [BiometricTrackerService] })
export class BiometricTrackerModule {}
