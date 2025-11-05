import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ParentTeacherMessage } from './entities/parent-teacher-message.entity';
import {
  SharedObservation,
  ObservationContext,
} from './entities/shared-observation.entity';
import { ObservationComment } from './entities/observation-comment.entity';
import { WeeklyProgressReport } from './entities/weekly-progress-report.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateObservationDto } from './dto/create-observation.dto';
import { AddObservationCommentDto } from './dto/add-observation-comment.dto';

@Injectable()
export class CommunicationHubService {
  constructor(
    @InjectRepository(ParentTeacherMessage)
    private messageRepository: Repository<ParentTeacherMessage>,
    @InjectRepository(SharedObservation)
    private observationRepository: Repository<SharedObservation>,
    @InjectRepository(ObservationComment)
    private commentRepository: Repository<ObservationComment>,
    @InjectRepository(WeeklyProgressReport)
    private reportRepository: Repository<WeeklyProgressReport>,
  ) {}

  // ===== MESSAGES =====

  async sendMessage(
    senderId: string,
    dto: CreateMessageDto,
  ): Promise<ParentTeacherMessage> {
    const message = this.messageRepository.create({
      ...dto,
      senderId,
      readBy: [senderId], // Sender automatically marks as read
    });

    return this.messageRepository.save(message);
  }

  async getMessagesForUser(
    userId: string,
    studentId?: string,
  ): Promise<ParentTeacherMessage[]> {
    const whereConditions: any = {
      recipientIds: userId as any, // TypeORM jsonb contains
    };

    if (studentId) {
      whereConditions.studentId = studentId;
    }

    return this.messageRepository.find({
      where: whereConditions,
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async getMessage(messageId: string): Promise<ParentTeacherMessage> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['student'],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }

  async markAsRead(messageId: string, userId: string): Promise<ParentTeacherMessage> {
    const message = await this.getMessage(messageId);

    if (!message.readBy.includes(userId)) {
      message.readBy.push(userId);
      await this.messageRepository.save(message);
    }

    return message;
  }

  async archiveMessage(messageId: string): Promise<ParentTeacherMessage> {
    const message = await this.getMessage(messageId);
    message.archived = true;
    return this.messageRepository.save(message);
  }

  // ===== OBSERVATIONS =====

  async createObservation(
    authorId: string,
    dto: CreateObservationDto,
  ): Promise<SharedObservation> {
    const observation = this.observationRepository.create({
      ...dto,
      authorId,
    });

    return this.observationRepository.save(observation);
  }

  async getObservationsForStudent(
    studentId: string,
    userId: string,
  ): Promise<SharedObservation[]> {
    // Get observations where user has access
    const observations = await this.observationRepository.find({
      where: { studentId },
      relations: ['comments'],
      order: { createdAt: 'DESC' },
    });

    // Filter by access (user must be in sharedWith or be the author)
    return observations.filter(
      (obs) => obs.sharedWith.includes(userId) || obs.authorId === userId,
    );
  }

  async addObservationComment(
    observationId: string,
    authorId: string,
    dto: AddObservationCommentDto,
  ): Promise<ObservationComment> {
    const observation = await this.observationRepository.findOne({
      where: { id: observationId },
    });

    if (!observation) {
      throw new NotFoundException('Observation not found');
    }

    const comment = this.commentRepository.create({
      observationId,
      authorId,
      content: dto.content,
    });

    return this.commentRepository.save(comment);
  }

  // ===== WEEKLY REPORTS =====

  async generateWeeklyReport(
    studentId: string,
    weekOf: Date,
  ): Promise<WeeklyProgressReport> {
    // Check if report already exists
    const existing = await this.reportRepository.findOne({
      where: { studentId, weekOf },
    });

    if (existing) {
      return existing;
    }

    // Get week boundaries
    const weekStart = new Date(weekOf);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    // Generate report data (simplified - would fetch from other services)
    const report = this.reportRepository.create({
      studentId,
      weekOf: weekStart,
      tasksCompleted: 0, // Would fetch from task service
      averageMood: 0.0, // Would fetch from mood service
      badgesEarned: 0, // Would fetch from gamification service
      focusMinutes: 0, // Would fetch from focus service
      focusAreas: [],
      suggestedActivities: this.getSuggestedActivities(),
      sentToParents: false,
    });

    return this.reportRepository.save(report);
  }

  async getWeeklyReport(
    studentId: string,
    weekOf: Date,
  ): Promise<WeeklyProgressReport> {
    const report = await this.reportRepository.findOne({
      where: { studentId, weekOf },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return report;
  }

  async sendReportToParents(reportId: string): Promise<WeeklyProgressReport> {
    const report = await this.reportRepository.findOne({
      where: { id: reportId },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    report.sentToParents = true;
    report.sentAt = new Date();

    return this.reportRepository.save(report);
  }

  async getRecentReports(studentId: string, limit = 4): Promise<WeeklyProgressReport[]> {
    return this.reportRepository.find({
      where: { studentId },
      order: { weekOf: 'DESC' },
      take: limit,
    });
  }

  private getSuggestedActivities(): string[] {
    return [
      'Practice reading for 15 minutes daily',
      'Complete 2-3 math problems with breaks',
      'Use visual aids for homework',
      'Set up a quiet study space',
      'Review the weekly planner together',
    ];
  }

  // ===== STATISTICS =====

  async getCommunicationStats(studentId: string): Promise<{
    totalMessages: number;
    unreadMessages: number;
    totalObservations: number;
    recentActivity: number; // last 7 days
  }> {
    const messages = await this.messageRepository.find({
      where: { studentId },
    });

    const observations = await this.observationRepository.find({
      where: { studentId },
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentMessages = messages.filter(
      (m) => m.createdAt >= sevenDaysAgo,
    ).length;
    const recentObservations = observations.filter(
      (o) => o.createdAt >= sevenDaysAgo,
    ).length;

    return {
      totalMessages: messages.length,
      unreadMessages: 0, // Would need userId to calculate
      totalObservations: observations.length,
      recentActivity: recentMessages + recentObservations,
    };
  }
}
