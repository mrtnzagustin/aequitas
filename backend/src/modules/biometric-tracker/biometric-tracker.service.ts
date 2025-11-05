import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FocusSession } from './entities/focus-session.entity';
import { FocusMetric, GazeDirection } from './entities/focus-metric.entity';
import { StudentFocusPattern } from './entities/student-focus-pattern.entity';
import { StartSessionDto } from './dto/start-session.dto';
import { RecordMetricDto } from './dto/record-metric.dto';

@Injectable()
export class BiometricTrackerService {
  constructor(
    @InjectRepository(FocusSession)
    private readonly sessionRepository: Repository<FocusSession>,
    @InjectRepository(FocusMetric)
    private readonly metricRepository: Repository<FocusMetric>,
    @InjectRepository(StudentFocusPattern)
    private readonly patternRepository: Repository<StudentFocusPattern>,
  ) {}

  async startSession(dto: StartSessionDto): Promise<FocusSession> {
    const session = this.sessionRepository.create({
      studentId: dto.studentId,
      taskId: dto.taskId,
      startedAt: new Date(),
    });

    return this.sessionRepository.save(session);
  }

  async endSession(sessionId: string): Promise<FocusSession> {
    const session = await this.sessionRepository.findOne({ where: { id: sessionId } });
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    session.endedAt = new Date();
    session.totalDuration = Math.floor((session.endedAt.getTime() - session.startedAt.getTime()) / 1000);

    // Calculate average focus score from metrics
    const metrics = await this.metricRepository.find({ where: { sessionId } });
    if (metrics.length > 0) {
      const totalScore = metrics.reduce((sum, m) => sum + m.focusScore, 0);
      session.averageFocusScore = totalScore / metrics.length;

      // Count low focus periods (score < 40)
      session.lowFocusPeriods = metrics.filter(m => m.focusScore < 40).length;

      // Find peak focus time
      const maxScore = Math.max(...metrics.map(m => m.focusScore));
      const peakMetric = metrics.find(m => m.focusScore === maxScore);
      if (peakMetric) {
        session.peakFocusTime = peakMetric.timestamp.toTimeString().substring(0, 5);
      }
    }

    const saved = await this.sessionRepository.save(session);

    // Update patterns asynchronously
    this.updatePatterns(session.studentId, saved);

    return saved;
  }

  async recordMetric(dto: RecordMetricDto): Promise<FocusMetric> {
    const session = await this.sessionRepository.findOne({ where: { id: dto.sessionId } });
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const metric = this.metricRepository.create(dto);
    return this.metricRepository.save(metric);
  }

  async getStudentSessions(studentId: string, limit: number = 10): Promise<FocusSession[]> {
    return this.sessionRepository.find({
      where: { studentId },
      order: { startedAt: 'DESC' },
      take: limit,
    });
  }

  async getStudentPattern(studentId: string): Promise<StudentFocusPattern | null> {
    return this.patternRepository.findOne({ where: { studentId } });
  }

  async getSessionMetrics(sessionId: string): Promise<FocusMetric[]> {
    return this.metricRepository.find({
      where: { sessionId },
      order: { timestamp: 'ASC' },
    });
  }

  async getCurrentRecommendation(sessionId: string): Promise<{ message: string; action: string }> {
    const recentMetrics = await this.metricRepository.find({
      where: { sessionId },
      order: { timestamp: 'DESC' },
      take: 10,
    });

    if (recentMetrics.length === 0) {
      return { message: 'Keep going!', action: 'CONTINUE' };
    }

    const avgFocus = recentMetrics.reduce((sum, m) => sum + m.focusScore, 0) / recentMetrics.length;

    if (avgFocus < 40) {
      return { message: 'Take a 5-minute break', action: 'BREAK' };
    } else if (avgFocus < 60) {
      return { message: 'Try a quick energizer', action: 'ENERGIZER' };
    } else {
      return { message: "You're in the zone!", action: 'CONTINUE' };
    }
  }

  private async updatePatterns(studentId: string, session: FocusSession): Promise<void> {
    let pattern = await this.patternRepository.findOne({ where: { studentId } });

    const allSessions = await this.sessionRepository.find({
      where: { studentId },
      order: { startedAt: 'DESC' },
      take: 20,
    });

    if (!pattern) {
      pattern = this.patternRepository.create({
        studentId,
        optimalSessionLength: 25,
        bestTimeOfDay: session.peakFocusTime || '10:00',
        averageFocusDuration: session.totalDuration / 60,
        recommendedBreakFrequency: 25,
        focusTriggers: [],
        distractionTriggers: [],
      });
    } else {
      // Update patterns based on recent sessions
      const avgDuration = allSessions.reduce((sum, s) => sum + (s.totalDuration || 0), 0) / allSessions.length;
      pattern.averageFocusDuration = avgDuration / 60;

      // Find best time of day (session with highest avg focus)
      const bestSession = allSessions.reduce((best, curr) => {
        return (curr.averageFocusScore || 0) > (best.averageFocusScore || 0) ? curr : best;
      });
      if (bestSession.peakFocusTime) {
        pattern.bestTimeOfDay = bestSession.peakFocusTime;
      }

      // Recommend breaks based on low focus periods
      const avgLowPeriods = allSessions.reduce((sum, s) => sum + s.lowFocusPeriods, 0) / allSessions.length;
      if (avgLowPeriods > 5) {
        pattern.recommendedBreakFrequency = 20; // More frequent breaks
      } else {
        pattern.recommendedBreakFrequency = 30;
      }
    }

    await this.patternRepository.save(pattern);
  }
}
