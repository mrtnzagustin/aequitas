import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { MentoringService } from './mentoring.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('mentoring')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MentoringController {
  constructor(private readonly mentoringService: MentoringService) {}

  @Post('mentors/:studentId')
  @Roles(UserRole.STUDENT, UserRole.ADMIN)
  registerMentor(@Param('studentId') studentId: string, @Body() data: any) {
    return this.mentoringService.registerMentor(studentId, data);
  }

  @Get('mentors/:focusArea')
  @Roles(UserRole.STUDENT, UserRole.THERAPIST, UserRole.ADMIN)
  findMentors(@Param('focusArea') focusArea: string) {
    return this.mentoringService.findMentors(focusArea);
  }

  @Post('matches')
  @Roles(UserRole.STUDENT, UserRole.THERAPIST, UserRole.ADMIN)
  createMatch(@Body() data: { mentorId: string; menteeId: string; focusArea: string }) {
    return this.mentoringService.createMatch(data.mentorId, data.menteeId, data.focusArea);
  }

  @Post('matches/:matchId/accept')
  @Roles(UserRole.STUDENT, UserRole.ADMIN)
  acceptMatch(@Param('matchId') matchId: string) {
    return this.mentoringService.acceptMatch(matchId);
  }

  @Get('matches/:studentId')
  @Roles(UserRole.STUDENT, UserRole.THERAPIST, UserRole.ADMIN)
  getMatches(@Param('studentId') studentId: string) {
    return this.mentoringService.getMatches(studentId);
  }
}
