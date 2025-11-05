import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/entities/user.entity';
import { StudyRoomsService } from './study-rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('study-rooms')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudyRoomsController {
  constructor(private readonly studyRoomsService: StudyRoomsService) {}

  @Post('create')
  @Roles(Role.STUDENT, Role.TEACHER, Role.THERAPIST)
  async createRoom(@Body() dto: CreateRoomDto) {
    return this.studyRoomsService.createRoom(dto);
  }

  @Get('available')
  @Roles(Role.STUDENT, Role.TEACHER, Role.THERAPIST)
  async getAvailableRooms() {
    return this.studyRoomsService.getAvailableRooms();
  }

  @Post(':id/join')
  @Roles(Role.STUDENT, Role.TEACHER, Role.THERAPIST)
  async joinRoom(@Param('id') roomId: string, @Body('studentId') studentId: string) {
    return this.studyRoomsService.joinRoom(roomId, studentId);
  }

  @Post(':id/leave')
  @Roles(Role.STUDENT, Role.TEACHER, Role.THERAPIST)
  async leaveRoom(@Param('id') roomId: string, @Body('studentId') studentId: string) {
    await this.studyRoomsService.leaveRoom(roomId, studentId);
    return { message: 'Left room successfully' };
  }

  @Get(':id/participants')
  @Roles(Role.STUDENT, Role.TEACHER, Role.THERAPIST)
  async getParticipants(@Param('id') roomId: string) {
    return this.studyRoomsService.getParticipants(roomId);
  }

  @Post(':id/message')
  @Roles(Role.STUDENT, Role.TEACHER, Role.THERAPIST)
  async sendMessage(@Param('id') roomId: string, @Body() dto: SendMessageDto) {
    return this.studyRoomsService.sendMessage({ ...dto, roomId });
  }

  @Get(':id/messages')
  @Roles(Role.STUDENT, Role.TEACHER, Role.THERAPIST)
  async getMessages(@Param('id') roomId: string, @Query('limit') limit?: number) {
    return this.studyRoomsService.getMessages(roomId, limit);
  }

  @Get(':id/whiteboard')
  @Roles(Role.STUDENT, Role.TEACHER, Role.THERAPIST)
  async getWhiteboard(@Param('id') roomId: string) {
    return this.studyRoomsService.getWhiteboard(roomId);
  }

  @Post(':id/whiteboard/save')
  @Roles(Role.STUDENT, Role.TEACHER, Role.THERAPIST)
  async saveWhiteboard(@Param('id') roomId: string, @Body('data') data: any) {
    return this.studyRoomsService.saveWhiteboard(roomId, data);
  }
}
