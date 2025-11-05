import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { CognitiveLoadMeasurement, LoadIndicators } from './entities/cognitive-load-measurement.entity';
import { LoadPattern } from './entities/load-pattern.entity';
import { RecordMeasurementDto } from './dto/record-measurement.dto';

@Injectable()
export class CognitiveLoadService {
  constructor(
    @InjectRepository(CognitiveLoadMeasurement)
    private readonly measurementRepository: Repository<CognitiveLoadMeasurement>,
    @InjectRepository(LoadPattern)
    private readonly patternRepository: Repository<LoadPattern>,
  ) {}

  async recordMeasurement(dto: RecordMeasurementDto): Promise<CognitiveLoadMeasurement> {
    const loadScore = this.calculateLoadScore(dto.indicators);

    const measurement = this.measurementRepository.create({
      studentId: dto.studentId,
      taskId: dto.taskId,
      loadScore,
      indicators: dto.indicators,
    });

    // Check if intervention needed
    if (loadScore >= 80) {
      const recentHighLoad = await this.checkSustainedHighLoad(dto.studentId, dto.taskId);
      if (recentHighLoad) {
        measurement.interventionTriggered = 'SIMPLIFY_AND_BREAK';
      }
    }

    const saved = await this.measurementRepository.save(measurement);

    // Update patterns asynchronously
    this.updatePatterns(dto.studentId, dto.taskId, saved);

    return saved;
  }

  calculateLoadScore(indicators: LoadIndicators): number {
    // Weighted average of normalized indicators
    const weights = {
      interactionPace: 0.2,
      errorRate: 0.25,
      taskSwitches: 0.15,
      reReadingCount: 0.15,
      helpRequests: 0.15,
      microPauses: 0.1,
    };

    // Normalize indicators to 0-100 scale
    const normalizedPace = Math.min(100, (indicators.interactionPace / 10) * 100); // assuming 10+ seconds is max
    const normalizedErrors = indicators.errorRate * 100;
    const normalizedSwitches = Math.min(100, indicators.taskSwitches * 20);
    const normalizedReading = Math.min(100, indicators.reReadingCount * 10);
    const normalizedHelp = Math.min(100, indicators.helpRequests * 25);
    const normalizedPauses = Math.min(100, indicators.microPauses * 5);

    const score =
      weights.interactionPace * normalizedPace +
      weights.errorRate * normalizedErrors +
      weights.taskSwitches * normalizedSwitches +
      weights.reReadingCount * normalizedReading +
      weights.helpRequests * normalizedHelp +
      weights.microPauses * normalizedPauses;

    return Math.round(Math.min(100, Math.max(0, score)));
  }

  async getCurrentLoad(studentId: string): Promise<{ loadScore: number; recommendation: string }> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const recentMeasurements = await this.measurementRepository.find({
      where: {
        studentId,
        timestamp: MoreThan(fiveMinutesAgo),
      },
      order: { timestamp: 'DESC' },
      take: 10,
    });

    if (recentMeasurements.length === 0) {
      return { loadScore: 0, recommendation: 'No recent activity' };
    }

    const avgLoad = recentMeasurements.reduce((sum, m) => sum + m.loadScore, 0) / recentMeasurements.length;

    let recommendation = 'Continue at current pace';
    if (avgLoad >= 80) {
      recommendation = 'Take a 10-minute break and simplify content';
    } else if (avgLoad >= 60) {
      recommendation = 'Consider a short break soon';
    } else if (avgLoad < 30) {
      recommendation = 'Could increase task complexity';
    }

    return { loadScore: Math.round(avgLoad), recommendation };
  }

  async getPatterns(studentId: string, subject?: string): Promise<LoadPattern[]> {
    const where: any = { studentId };
    if (subject) {
      where.subject = subject;
    }

    return this.patternRepository.find({ where });
  }

  async getRecommendations(studentId: string): Promise<any> {
    const patterns = await this.patternRepository.find({ where: { studentId } });

    if (patterns.length === 0) {
      return {
        message: 'Not enough data yet',
        recommendations: [],
      };
    }

    const recommendations = patterns.map(pattern => ({
      subject: pattern.subject,
      optimalSessionLength: `${pattern.optimalSessionLength} minutes`,
      peakLoadTime: pattern.peakLoadTime,
      triggers: pattern.overloadTriggers,
      interventions: pattern.effectiveInterventions,
    }));

    return {
      message: 'Personalized recommendations based on patterns',
      recommendations,
    };
  }

  private async checkSustainedHighLoad(studentId: string, taskId: string): Promise<boolean> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const recentMeasurements = await this.measurementRepository.find({
      where: {
        studentId,
        taskId,
        timestamp: MoreThan(fiveMinutesAgo),
      },
    });

    if (recentMeasurements.length < 3) {
      return false;
    }

    // Check if all recent measurements show high load
    return recentMeasurements.every(m => m.loadScore >= 80);
  }

  private async updatePatterns(studentId: string, taskId: string, measurement: CognitiveLoadMeasurement): Promise<void> {
    // Extract subject from taskId (simplified)
    const subject = taskId.split('-')[0] || 'general';

    let pattern = await this.patternRepository.findOne({
      where: { studentId, subject },
    });

    if (!pattern) {
      pattern = this.patternRepository.create({
        studentId,
        subject,
        averageLoad: measurement.loadScore,
        peakLoadTime: new Date().toTimeString().substring(0, 5),
        optimalSessionLength: 30,
        overloadTriggers: [],
        effectiveInterventions: [],
      });
    } else {
      // Update average load (moving average)
      pattern.averageLoad = (pattern.averageLoad * 0.9 + measurement.loadScore * 0.1);

      // Track triggers
      if (measurement.loadScore >= 80 && measurement.interventionTriggered) {
        const trigger = `High ${this.findDominantIndicator(measurement.indicators)}`;
        if (!pattern.overloadTriggers.includes(trigger)) {
          pattern.overloadTriggers.push(trigger);
        }

        if (!pattern.effectiveInterventions.includes(measurement.interventionTriggered)) {
          pattern.effectiveInterventions.push(measurement.interventionTriggered);
        }
      }
    }

    await this.patternRepository.save(pattern);
  }

  private findDominantIndicator(indicators: LoadIndicators): string {
    const normalized = {
      interactionPace: indicators.interactionPace / 10,
      errorRate: indicators.errorRate,
      taskSwitches: indicators.taskSwitches / 5,
      reReadingCount: indicators.reReadingCount / 10,
      helpRequests: indicators.helpRequests / 4,
      microPauses: indicators.microPauses / 20,
    };

    const max = Math.max(...Object.values(normalized));
    const dominant = Object.entries(normalized).find(([_, val]) => val === max);

    return dominant ? dominant[0] : 'unknown';
  }
}
