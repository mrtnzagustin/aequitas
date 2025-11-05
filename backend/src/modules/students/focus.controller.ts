import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FocusService } from './focus.service';
import { CreateFocusSessionDto } from './dto/create-focus-session.dto';
import { EndFocusSessionDto } from './dto/end-focus-session.dto';
import { RecordDistractionDto } from './dto/record-distraction.dto';
import { FocusSession } from './entities/focus-session.entity';
import { DistractionEvent } from './entities/distraction-event.entity';

@ApiTags('Focus Sessions')
@Controller('api/focus')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FocusController {
  constructor(private readonly focusService: FocusService) {}

  @Post('sessions')
  @ApiOperation({ summary: 'Start a new focus session' })
  @ApiResponse({
    status: 201,
    description: 'Focus session started successfully',
  })
  async startSession(
    @Body() createDto: CreateFocusSessionDto,
  ): Promise<FocusSession> {
    return this.focusService.startSession(createDto);
  }

  @Patch('sessions/:id/end')
  @ApiOperation({ summary: 'End a focus session' })
  @ApiResponse({
    status: 200,
    description: 'Focus session ended successfully',
  })
  async endSession(
    @Param('id') sessionId: string,
    @Body() endDto: EndFocusSessionDto,
  ): Promise<FocusSession> {
    return this.focusService.endSession(sessionId, endDto);
  }

  @Post('sessions/:id/distractions')
  @ApiOperation({ summary: 'Record a distraction event' })
  @ApiResponse({
    status: 201,
    description: 'Distraction recorded successfully',
  })
  async recordDistraction(
    @Param('id') sessionId: string,
    @Body() distractionDto: RecordDistractionDto,
  ): Promise<DistractionEvent> {
    return this.focusService.recordDistraction(sessionId, distractionDto);
  }

  @Get('students/:studentId/sessions')
  @ApiOperation({ summary: 'Get focus sessions for a student' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Focus sessions retrieved successfully',
  })
  async getStudentSessions(
    @Param('studentId') studentId: string,
    @Query('limit') limit?: number,
  ): Promise<FocusSession[]> {
    return this.focusService.getStudentSessions(studentId, limit);
  }

  @Get('sessions/:id')
  @ApiOperation({ summary: 'Get session details with distractions' })
  @ApiResponse({
    status: 200,
    description: 'Session details retrieved successfully',
  })
  async getSessionDetails(@Param('id') sessionId: string): Promise<{
    session: FocusSession;
    distractions: DistractionEvent[];
  }> {
    return this.focusService.getSessionDetails(sessionId);
  }

  @Get('students/:studentId/patterns')
  @ApiOperation({ summary: 'Get focus patterns for a student' })
  @ApiResponse({
    status: 200,
    description: 'Focus patterns retrieved successfully',
  })
  async getStudentPatterns(@Param('studentId') studentId: string): Promise<{
    averageSessionLength: number;
    averageDistractions: number;
    completionRate: number;
    averageFocusScore: number;
    totalSessions: number;
    optimalTimeOfDay?: string;
  }> {
    return this.focusService.getStudentFocusPatterns(studentId);
  }
}
