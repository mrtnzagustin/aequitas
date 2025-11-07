import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { CognitiveLoadService } from './cognitive-load.service';
import { RecordMeasurementDto } from './dto/record-measurement.dto';

@Controller('cognitive-load')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CognitiveLoadController {
  constructor(private readonly cognitiveLoadService: CognitiveLoadService) {}

  @Post('measurement')
  @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.THERAPIST, UserRole.PARENT)
  async recordMeasurement(@Body() dto: RecordMeasurementDto) {
    return this.cognitiveLoadService.recordMeasurement(dto);
  }

  @Get('current/:studentId')
  @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.THERAPIST, UserRole.PARENT)
  async getCurrentLoad(@Param('studentId') studentId: string) {
    return this.cognitiveLoadService.getCurrentLoad(studentId);
  }

  @Get('patterns/:studentId')
  @Roles(UserRole.TEACHER, UserRole.THERAPIST, UserRole.PARENT)
  async getPatterns(
    @Param('studentId') studentId: string,
    @Query('subject') subject?: string,
  ) {
    return this.cognitiveLoadService.getPatterns(studentId, subject);
  }

  @Get('recommendations/:studentId')
  @Roles(UserRole.TEACHER, UserRole.THERAPIST, UserRole.PARENT)
  async getRecommendations(@Param('studentId') studentId: string) {
    return this.cognitiveLoadService.getRecommendations(studentId);
  }
}
