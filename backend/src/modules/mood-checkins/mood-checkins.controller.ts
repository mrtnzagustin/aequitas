import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { MoodCheckInsService } from './mood-checkins.service';
import { CreateMoodCheckInDto } from './dto/create-mood-checkin.dto';

@Controller('mood-checkins')
export class MoodCheckInsController {
  constructor(private readonly moodCheckInsService: MoodCheckInsService) {}

  @Post()
  async create(@Body() createDto: CreateMoodCheckInDto) {
    return this.moodCheckInsService.create(createDto);
  }

  @Get('student/:studentId')
  async findByStudent(
    @Param('studentId') studentId: string,
    @Query('days') days?: string,
  ) {
    const daysNumber = days ? parseInt(days, 10) : 30;
    return this.moodCheckInsService.findByStudentId(studentId, daysNumber);
  }

  @Get('student/:studentId/trends')
  async getTrends(
    @Param('studentId') studentId: string,
    @Query('days') days?: string,
  ) {
    const daysNumber = days ? parseInt(days, 10) : 30;
    return this.moodCheckInsService.getTrends(studentId, daysNumber);
  }

  @Get('student/:studentId/has-checked-in-today')
  async hasCheckedInToday(@Param('studentId') studentId: string) {
    const hasCheckedIn = await this.moodCheckInsService.hasCheckedInToday(studentId);
    return { hasCheckedIn };
  }
}
