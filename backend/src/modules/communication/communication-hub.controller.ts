import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommunicationHubService } from './communication-hub.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateObservationDto } from './dto/create-observation.dto';
import { AddObservationCommentDto } from './dto/add-observation-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('communication')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommunicationHubController {
  constructor(
    private readonly communicationHubService: CommunicationHubService,
  ) {}

  // MESSAGES

  @Post('messages/:senderId')
  @Roles(UserRole.THERAPIST, UserRole.ADMIN, UserRole.PARENT)
  sendMessage(
    @Param('senderId') senderId: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.communicationHubService.sendMessage(senderId, dto);
  }

  @Get('messages/:userId')
  @Roles(UserRole.THERAPIST, UserRole.ADMIN, UserRole.PARENT)
  getMessages(
    @Param('userId') userId: string,
    @Query('studentId') studentId?: string,
  ) {
    return this.communicationHubService.getMessagesForUser(userId, studentId);
  }

  @Get('messages/detail/:messageId')
  @Roles(UserRole.THERAPIST, UserRole.ADMIN, UserRole.PARENT)
  getMessage(@Param('messageId') messageId: string) {
    return this.communicationHubService.getMessage(messageId);
  }

  @Put('messages/:messageId/read/:userId')
  @Roles(UserRole.THERAPIST, UserRole.ADMIN, UserRole.PARENT)
  markAsRead(
    @Param('messageId') messageId: string,
    @Param('userId') userId: string,
  ) {
    return this.communicationHubService.markAsRead(messageId, userId);
  }

  @Put('messages/:messageId/archive')
  @Roles(UserRole.THERAPIST, UserRole.ADMIN, UserRole.PARENT)
  archiveMessage(@Param('messageId') messageId: string) {
    return this.communicationHubService.archiveMessage(messageId);
  }

  // OBSERVATIONS

  @Post('observations/:authorId')
  @Roles(UserRole.THERAPIST, UserRole.ADMIN, UserRole.PARENT)
  createObservation(
    @Param('authorId') authorId: string,
    @Body() dto: CreateObservationDto,
  ) {
    return this.communicationHubService.createObservation(authorId, dto);
  }

  @Get('observations/:studentId/:userId')
  @Roles(UserRole.THERAPIST, UserRole.ADMIN, UserRole.PARENT)
  getObservations(
    @Param('studentId') studentId: string,
    @Param('userId') userId: string,
  ) {
    return this.communicationHubService.getObservationsForStudent(
      studentId,
      userId,
    );
  }

  @Post('observations/:observationId/comments/:authorId')
  @Roles(UserRole.THERAPIST, UserRole.ADMIN, UserRole.PARENT)
  addObservationComment(
    @Param('observationId') observationId: string,
    @Param('authorId') authorId: string,
    @Body() dto: AddObservationCommentDto,
  ) {
    return this.communicationHubService.addObservationComment(
      observationId,
      authorId,
      dto,
    );
  }

  // WEEKLY REPORTS

  @Post('reports/:studentId/generate')
  @Roles(UserRole.THERAPIST, UserRole.ADMIN)
  generateWeeklyReport(
    @Param('studentId') studentId: string,
    @Body('weekOf') weekOf: Date,
  ) {
    return this.communicationHubService.generateWeeklyReport(studentId, weekOf);
  }

  @Get('reports/:studentId/:weekOf')
  @Roles(UserRole.THERAPIST, UserRole.ADMIN, UserRole.PARENT)
  getWeeklyReport(
    @Param('studentId') studentId: string,
    @Param('weekOf') weekOf: Date,
  ) {
    return this.communicationHubService.getWeeklyReport(studentId, weekOf);
  }

  @Put('reports/:reportId/send')
  @Roles(UserRole.THERAPIST, UserRole.ADMIN)
  sendReportToParents(@Param('reportId') reportId: string) {
    return this.communicationHubService.sendReportToParents(reportId);
  }

  @Get('reports/:studentId/recent')
  @Roles(UserRole.THERAPIST, UserRole.ADMIN, UserRole.PARENT)
  getRecentReports(
    @Param('studentId') studentId: string,
    @Query('limit') limit?: number,
  ) {
    return this.communicationHubService.getRecentReports(studentId, limit);
  }

  // STATISTICS

  @Get('stats/:studentId')
  @Roles(UserRole.THERAPIST, UserRole.ADMIN, UserRole.PARENT)
  getCommunicationStats(@Param('studentId') studentId: string) {
    return this.communicationHubService.getCommunicationStats(studentId);
  }
}
