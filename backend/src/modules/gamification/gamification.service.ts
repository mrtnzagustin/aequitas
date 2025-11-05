import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentPoints } from './entities/student-points.entity';
import { PointTransaction } from './entities/point-transaction.entity';
import { StudentBadge, BadgeType } from './entities/student-badge.entity';

@Injectable()
export class GamificationService {
  constructor(
    @InjectRepository(StudentPoints)
    private readonly studentPointsRepository: Repository<StudentPoints>,
    @InjectRepository(PointTransaction)
    private readonly pointTransactionRepository: Repository<PointTransaction>,
    @InjectRepository(StudentBadge)
    private readonly studentBadgeRepository: Repository<StudentBadge>,
  ) {}

  async awardPoints(
    studentId: string,
    points: number,
    reason: string,
    relatedEntity?: string,
  ): Promise<StudentPoints> {
    // Create transaction
    const transaction = this.pointTransactionRepository.create({
      studentId,
      points,
      reason,
      relatedEntity,
    });
    await this.pointTransactionRepository.save(transaction);

    // Update student points
    let studentPoints = await this.studentPointsRepository.findOne({
      where: { studentId },
    });

    if (!studentPoints) {
      studentPoints = this.studentPointsRepository.create({
        studentId,
        totalPoints: 0,
        weeklyPoints: 0,
        level: 1,
      });
    }

    studentPoints.totalPoints += points;
    studentPoints.weeklyPoints += points;
    studentPoints.level = this.calculateLevel(studentPoints.totalPoints);

    return this.studentPointsRepository.save(studentPoints);
  }

  async getStudentPoints(studentId: string): Promise<StudentPoints> {
    let studentPoints = await this.studentPointsRepository.findOne({
      where: { studentId },
    });

    if (!studentPoints) {
      studentPoints = this.studentPointsRepository.create({
        studentId,
        totalPoints: 0,
        weeklyPoints: 0,
        level: 1,
      });
      await this.studentPointsRepository.save(studentPoints);
    }

    return studentPoints;
  }

  async awardBadge(studentId: string, badge: BadgeType, description?: string): Promise<StudentBadge> {
    // Check if already earned
    const existing = await this.studentBadgeRepository.findOne({
      where: { studentId, badge },
    });

    if (existing) {
      return existing;
    }

    const studentBadge = this.studentBadgeRepository.create({
      studentId,
      badge,
      description,
    });

    return this.studentBadgeRepository.save(studentBadge);
  }

  async getStudentBadges(studentId: string): Promise<StudentBadge[]> {
    return this.studentBadgeRepository.find({
      where: { studentId },
      order: { earnedAt: 'DESC' },
    });
  }

  async getLeaderboard(limit: number = 10): Promise<StudentPoints[]> {
    return this.studentPointsRepository.find({
      order: { weeklyPoints: 'DESC' },
      take: limit,
    });
  }

  async resetWeeklyPoints(): Promise<void> {
    await this.studentPointsRepository.update({}, { weeklyPoints: 0 });
  }

  private calculateLevel(totalPoints: number): number {
    // Simple level calculation: 100 points per level
    return Math.floor(totalPoints / 100) + 1;
  }

  async checkAndAwardBadges(studentId: string): Promise<StudentBadge[]> {
    const awarded: StudentBadge[] = [];

    // Get transaction count for First Steps badge
    const transactionCount = await this.pointTransactionRepository.count({
      where: { studentId },
    });

    if (transactionCount >= 1) {
      const badge = await this.awardBadge(
        studentId,
        BadgeType.FIRST_STEPS,
        'Completed your first task!',
      );
      if (badge) awarded.push(badge);
    }

    return awarded;
  }
}
