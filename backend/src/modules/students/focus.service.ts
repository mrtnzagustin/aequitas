import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FocusSession } from './entities/focus-session.entity';
import { DistractionEvent } from './entities/distraction-event.entity';
import { CreateFocusSessionDto } from './dto/create-focus-session.dto';
import { EndFocusSessionDto } from './dto/end-focus-session.dto';
import { RecordDistractionDto } from './dto/record-distraction.dto';

@Injectable()
export class FocusService {
  constructor(
    @InjectRepository(FocusSession)
    private focusSessionRepository: Repository<FocusSession>,
    @InjectRepository(DistractionEvent)
    private distractionEventRepository: Repository<DistractionEvent>,
  ) {}

  /**
   * Start a new focus session
   */
  async startSession(createDto: CreateFocusSessionDto): Promise<FocusSession> {
    const session = this.focusSessionRepository.create(createDto);
    return this.focusSessionRepository.save(session);
  }

  /**
   * End a focus session
   */
  async endSession(
    sessionId: string,
    endDto: EndFocusSessionDto,
  ): Promise<FocusSession> {
    const session = await this.focusSessionRepository.findOne({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Focus session not found');
    }

    session.endedAt = new Date();
    session.completedSuccessfully = endDto.completedSuccessfully;
    session.actualDuration = endDto.actualDuration;
    session.focusScore = endDto.focusScore;

    return this.focusSessionRepository.save(session);
  }

  /**
   * Record a distraction event
   */
  async recordDistraction(
    sessionId: string,
    distractionDto: RecordDistractionDto,
  ): Promise<DistractionEvent> {
    const session = await this.focusSessionRepository.findOne({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Focus session not found');
    }

    // Create distraction event
    const distraction = this.distractionEventRepository.create({
      sessionId,
      type: distractionDto.type,
      duration: distractionDto.duration,
    });

    await this.distractionEventRepository.save(distraction);

    // Increment distraction count on session
    session.distractionsCount += 1;
    await this.focusSessionRepository.save(session);

    return distraction;
  }

  /**
   * Get all sessions for a student
   */
  async getStudentSessions(
    studentId: string,
    limit: number = 20,
  ): Promise<FocusSession[]> {
    return this.focusSessionRepository.find({
      where: { studentId },
      order: { startedAt: 'DESC' },
      take: limit,
    });
  }

  /**
   * Get session details with distractions
   */
  async getSessionDetails(sessionId: string): Promise<{
    session: FocusSession;
    distractions: DistractionEvent[];
  }> {
    const session = await this.focusSessionRepository.findOne({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Focus session not found');
    }

    const distractions = await this.distractionEventRepository.find({
      where: { sessionId },
      order: { timestamp: 'ASC' },
    });

    return { session, distractions };
  }

  /**
   * Get focus patterns for a student
   */
  async getStudentFocusPatterns(studentId: string): Promise<{
    averageSessionLength: number;
    averageDistractions: number;
    completionRate: number;
    averageFocusScore: number;
    totalSessions: number;
    optimalTimeOfDay?: string;
  }> {
    const sessions = await this.focusSessionRepository.find({
      where: { studentId },
    });

    if (sessions.length === 0) {
      return {
        averageSessionLength: 0,
        averageDistractions: 0,
        completionRate: 0,
        averageFocusScore: 0,
        totalSessions: 0,
      };
    }

    const totalDuration = sessions.reduce(
      (sum, s) => sum + s.actualDuration,
      0,
    );
    const totalDistractions = sessions.reduce(
      (sum, s) => sum + s.distractionsCount,
      0,
    );
    const completedCount = sessions.filter(
      (s) => s.completedSuccessfully,
    ).length;
    const totalFocusScore = sessions.reduce((sum, s) => sum + s.focusScore, 0);

    // Calculate optimal time of day (simplified)
    const hourCounts: Record<number, { count: number; avgScore: number }> = {};
    sessions.forEach((s) => {
      const hour = new Date(s.startedAt).getHours();
      if (!hourCounts[hour]) {
        hourCounts[hour] = { count: 0, avgScore: 0 };
      }
      hourCounts[hour].count += 1;
      hourCounts[hour].avgScore += s.focusScore;
    });

    let optimalHour = 0;
    let maxScore = 0;
    Object.entries(hourCounts).forEach(([hour, data]) => {
      const avgScore = data.avgScore / data.count;
      if (avgScore > maxScore) {
        maxScore = avgScore;
        optimalHour = parseInt(hour);
      }
    });

    const optimalTimeOfDay =
      optimalHour < 12
        ? 'morning'
        : optimalHour < 17
          ? 'afternoon'
          : 'evening';

    return {
      averageSessionLength: Math.round(totalDuration / sessions.length),
      averageDistractions: Math.round(
        (totalDistractions / sessions.length) * 10,
      ) / 10,
      completionRate: Math.round((completedCount / sessions.length) * 100),
      averageFocusScore: Math.round(totalFocusScore / sessions.length),
      totalSessions: sessions.length,
      optimalTimeOfDay,
    };
  }
}
