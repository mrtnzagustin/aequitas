import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdaptationsService } from './adaptations.service';

@ApiTags('adaptations')
@Controller('adaptations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdaptationsController {
  constructor(private readonly adaptationsService: AdaptationsService) {}

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get adaptations for a student' })
  async findByStudentId(@Param('studentId') studentId: string) {
    return this.adaptationsService.findByStudentId(studentId);
  }
}
