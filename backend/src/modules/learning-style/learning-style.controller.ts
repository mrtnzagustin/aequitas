import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LearningStyleService } from './learning-style.service';
import { RecordEvidenceDto } from './dto/record-evidence.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('learning-style')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LearningStyleController {
  constructor(private readonly learningStyleService: LearningStyleService) {}

  @Get('profile/:studentId')
  @Roles(UserRole.THERAPIST, UserRole.ADMIN, UserRole.STUDENT)
  getProfile(@Param('studentId') studentId: string) {
    return this.learningStyleService.getProfile(studentId);
  }

  @Post('evidence/:studentId')
  @Roles(UserRole.THERAPIST, UserRole.ADMIN, UserRole.STUDENT)
  recordEvidence(
    @Param('studentId') studentId: string,
    @Body() dto: RecordEvidenceDto,
  ) {
    return this.learningStyleService.recordEvidence(studentId, dto);
  }

  @Get('recommendations/:studentId')
  @Roles(UserRole.THERAPIST, UserRole.ADMIN, UserRole.STUDENT)
  getRecommendations(@Param('studentId') studentId: string) {
    return this.learningStyleService.getRecommendations(studentId);
  }

  @Get('evidence/:studentId')
  @Roles(UserRole.THERAPIST, UserRole.ADMIN)
  getEvidenceHistory(
    @Param('studentId') studentId: string,
    @Query('limit') limit?: number,
  ) {
    return this.learningStyleService.getEvidenceHistory(studentId, limit);
  }

  @Post('update/:studentId')
  @Roles(UserRole.THERAPIST, UserRole.ADMIN)
  async updateProfile(@Param('studentId') studentId: string) {
    const profile = await this.learningStyleService.getOrCreateProfile(
      studentId,
    );
    return this.learningStyleService.updateProfileScores(profile.id);
  }
}
