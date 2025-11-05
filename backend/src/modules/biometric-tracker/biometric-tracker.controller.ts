import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/entities/user.entity';
import { BiometricTrackerService } from './biometric-tracker.service';
import { StartSessionDto } from './dto/start-session.dto';
import { RecordMetricDto } from './dto/record-metric.dto';

@Controller('focus')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BiometricTrackerController {
  constructor(private readonly biometricTrackerService: BiometricTrackerService) {}

  @Post('start-session')
  @Roles(Role.STUDENT)
  async startSession(@Body() dto: StartSessionDto) {
    return this.biometricTrackerService.startSession(dto);
  }

  @Post('end-session/:id')
  @Roles(Role.STUDENT)
  async endSession(@Param('id') sessionId: string) {
    return this.biometricTrackerService.endSession(sessionId);
  }

  @Post('record-metric')
  @Roles(Role.STUDENT)
  async recordMetric(@Body() dto: RecordMetricDto) {
    return this.biometricTrackerService.recordMetric(dto);
  }

  @Get('student/:studentId/sessions')
  @Roles(Role.STUDENT, Role.TEACHER, Role.THERAPIST, Role.PARENT)
  async getStudentSessions(@Param('studentId') studentId: string) {
    return this.biometricTrackerService.getStudentSessions(studentId);
  }

  @Get('student/:studentId/patterns')
  @Roles(Role.STUDENT, Role.TEACHER, Role.THERAPIST, Role.PARENT)
  async getStudentPattern(@Param('studentId') studentId: string) {
    return this.biometricTrackerService.getStudentPattern(studentId);
  }

  @Get('session/:sessionId/metrics')
  @Roles(Role.STUDENT, Role.TEACHER, Role.THERAPIST)
  async getSessionMetrics(@Param('sessionId') sessionId: string) {
    return this.biometricTrackerService.getSessionMetrics(sessionId);
  }

  @Get('session/:sessionId/recommendation')
  @Roles(Role.STUDENT)
  async getCurrentRecommendation(@Param('sessionId') sessionId: string) {
    return this.biometricTrackerService.getCurrentRecommendation(sessionId);
  }
}
