import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Student } from '../students/entities/student.entity';
import { FocusSession } from '../students/entities/focus-session.entity';
import { MoodCheckIn } from '../mood-checkins/entities/mood-checkin.entity';
import { StudentPoints } from '../gamification/entities/student-points.entity';
import { StudentBadge } from '../gamification/entities/student-badge.entity';

export interface ProgressMetrics {
  // Overall
  studentName: string;
  totalPointsLifetime: number;
  currentLevel: number;
  badgesEarned: number;

  // Focus & Productivity
  avgFocusScore: number;
  totalFocusMinutes: number;
  focusSessionsCount: number;
  optimalTimeOfDay: string;

  // Emotional Wellbeing
  avgMoodScore: number;
  moodCheckinsCount: number;
  recentMoodTrend: string; // 'improving', 'stable', 'declining'

  // Learning Progress
  tasksCompleted: number;
  quizzesCompleted: number;
  avgQuizScore: number;
  streakDays: number;

  // Skill Levels
  skillLevels: Array<{ skill: string; level: number; progress: number }>;

  // Trends (last 30 days)
  dailyActivity: Array<{ date: string; points: number; focusMinutes: number }>;
  weeklyProgress: Array<{ week: string; improvement: number }>;
}

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(FocusSession)
    private focusSessionRepository: Repository<FocusSession>,
    @InjectRepository(MoodCheckIn)
    private moodCheckInRepository: Repository<MoodCheckIn>,
    @InjectRepository(StudentPoints)
    private pointsRepository: Repository<StudentPoints>,
    @InjectRepository(StudentBadge)
    private badgeRepository: Repository<StudentBadge>,
  ) {}

  async getStudentProgress(studentId: string): Promise<ProgressMetrics> {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new Error(`Student with id ${studentId} not found`);
    }

    const points = await this.pointsRepository.findOne({
      where: { studentId },
    });

    const badges = await this.badgeRepository.find({
      where: { studentId },
    });

    const focusSessions = await this.focusSessionRepository.find({
      where: { studentId },
    });

    const moodCheckins = await this.moodCheckInRepository.find({
      where: { studentId },
      order: { createdAt: 'DESC' },
      take: 30,
    });

    // Calculate metrics
    const avgFocusScore = focusSessions.length > 0
      ? focusSessions.reduce((sum, s) => sum + s.focusScore, 0) / focusSessions.length
      : 0;

    const totalFocusMinutes = focusSessions.reduce(
      (sum, s) => sum + s.actualDuration,
      0,
    );

    const avgMoodScore = moodCheckins.length > 0
      ? moodCheckins.reduce((sum, m) => sum + m.intensity, 0) / moodCheckins.length
      : 0;

    const recentMoodTrend = this.calculateMoodTrend(moodCheckins);

    // Get optimal time of day
    const optimalTimeOfDay = this.getOptimalTimeOfDay(focusSessions);

    // Calculate skill levels (example skills)
    const skillLevels = this.calculateSkillLevels(studentId);

    // Daily activity (last 30 days)
    const dailyActivity = await this.getDailyActivity(studentId, 30);

    return {
      studentName: `${student.firstName} ${student.lastName}`,
      totalPointsLifetime: points?.totalPoints || 0,
      currentLevel: points?.level || 1,
      badgesEarned: badges.length,
      avgFocusScore: Math.round(avgFocusScore),
      totalFocusMinutes,
      focusSessionsCount: focusSessions.length,
      optimalTimeOfDay,
      avgMoodScore: Math.round(avgMoodScore * 10) / 10,
      moodCheckinsCount: moodCheckins.length,
      recentMoodTrend,
      tasksCompleted: 0, // Would fetch from task system
      quizzesCompleted: 0, // Would fetch from quiz system
      avgQuizScore: 0,
      streakDays: this.calculateStreakDays(moodCheckins),
      skillLevels,
      dailyActivity,
      weeklyProgress: [],
    };
  }

  private calculateMoodTrend(moodCheckins: MoodCheckIn[]): string {
    if (moodCheckins.length < 7) return 'stable';

    const recentWeek = moodCheckins.slice(0, 7);
    const previousWeek = moodCheckins.slice(7, 14);

    if (previousWeek.length === 0) return 'stable';

    const recentAvg = recentWeek.reduce((sum, m) => sum + m.intensity, 0) / recentWeek.length;
    const previousAvg = previousWeek.reduce((sum, m) => sum + m.intensity, 0) / previousWeek.length;

    if (recentAvg > previousAvg + 0.5) return 'improving';
    if (recentAvg < previousAvg - 0.5) return 'declining';
    return 'stable';
  }

  private getOptimalTimeOfDay(sessions: FocusSession[]): string {
    if (sessions.length === 0) return 'any time';

    const hourScores: Record<number, number[]> = {};

    sessions.forEach((session) => {
      const hour = new Date(session.startedAt).getHours();
      if (!hourScores[hour]) hourScores[hour] = [];
      hourScores[hour].push(session.focusScore);
    });

    let bestHour = 0;
    let bestAvg = 0;

    Object.entries(hourScores).forEach(([hour, scores]) => {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (avg > bestAvg) {
        bestAvg = avg;
        bestHour = parseInt(hour);
      }
    });

    if (bestHour < 12) return 'morning';
    if (bestHour < 17) return 'afternoon';
    return 'evening';
  }

  private calculateStreakDays(moodCheckins: MoodCheckIn[]): number {
    if (moodCheckins.length === 0) return 0;

    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < moodCheckins.length - 1; i++) {
      const current = new Date(moodCheckins[i].createdAt);
      const next = new Date(moodCheckins[i + 1].createdAt);

      current.setHours(0, 0, 0, 0);
      next.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  private calculateSkillLevels(studentId: string): Array<{ skill: string; level: number; progress: number }> {
    // Example skills - would calculate from actual data
    return [
      { skill: 'Focus & Concentration', level: 5, progress: 75 },
      { skill: 'Time Management', level: 4, progress: 60 },
      { skill: 'Problem Solving', level: 6, progress: 85 },
      { skill: 'Reading Comprehension', level: 5, progress: 70 },
      { skill: 'Math Skills', level: 4, progress: 50 },
    ];
  }

  private async getDailyActivity(
    studentId: string,
    days: number,
  ): Promise<Array<{ date: string; points: number; focusMinutes: number }>> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const sessions = await this.focusSessionRepository.find({
      where: {
        studentId,
        startedAt: Between(startDate, new Date()),
      },
    });

    // Group by date
    const activityByDate: Record<string, { points: number; focusMinutes: number }> = {};

    sessions.forEach((session) => {
      const dateKey = session.startedAt.toISOString().split('T')[0];
      if (!activityByDate[dateKey]) {
        activityByDate[dateKey] = { points: 0, focusMinutes: 0 };
      }
      activityByDate[dateKey].focusMinutes += session.actualDuration;
      activityByDate[dateKey].points += session.focusScore; // Points earned from focus
    });

    return Object.entries(activityByDate).map(([date, data]) => ({
      date,
      ...data,
    }));
  }
}
