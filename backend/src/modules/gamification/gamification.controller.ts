import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { BadgeType } from './entities/student-badge.entity';

@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('student/:studentId/points')
  async getStudentPoints(@Param('studentId') studentId: string) {
    return this.gamificationService.getStudentPoints(studentId);
  }

  @Post('student/:studentId/award-points')
  async awardPoints(
    @Param('studentId') studentId: string,
    @Body() body: { points: number; reason: string; relatedEntity?: string },
  ) {
    return this.gamificationService.awardPoints(
      studentId,
      body.points,
      body.reason,
      body.relatedEntity,
    );
  }

  @Get('student/:studentId/badges')
  async getStudentBadges(@Param('studentId') studentId: string) {
    return this.gamificationService.getStudentBadges(studentId);
  }

  @Post('student/:studentId/award-badge')
  async awardBadge(
    @Param('studentId') studentId: string,
    @Body() body: { badge: BadgeType; description?: string },
  ) {
    return this.gamificationService.awardBadge(studentId, body.badge, body.description);
  }

  @Get('leaderboard')
  async getLeaderboard() {
    return this.gamificationService.getLeaderboard(10);
  }
}
