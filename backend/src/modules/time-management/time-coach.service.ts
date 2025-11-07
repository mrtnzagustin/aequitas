import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { StudentSchedule, ScheduledTask, TimeEstimationPattern, ScheduleCreatedBy } from './entities/schedule.entity';

@Injectable()
export class TimeCoachService {
  constructor(
    @InjectRepository(StudentSchedule)
    private scheduleRepository: Repository<StudentSchedule>,
    @InjectRepository(ScheduledTask)
    private scheduledTaskRepository: Repository<ScheduledTask>,
    @InjectRepository(TimeEstimationPattern)
    private patternRepository: Repository<TimeEstimationPattern>,
  ) {}

  async generateDailySchedule(
    studentId: string,
    date: Date,
    tasks: Array<{ id: string; subject: string; estimatedMinutes: number }>,
  ): Promise<StudentSchedule> {
    // Get student's patterns
    const patterns = await this.patternRepository.find({ where: { studentId } });

    // Create schedule
    const schedule = this.scheduleRepository.create({
      studentId,
      date,
      createdBy: ScheduleCreatedBy.AI,
    });

    const savedSchedule = await this.scheduleRepository.save(schedule);

    // Get optimal time blocks (simplified - would use AI)
    const startHour = 14; // 2 PM
    let currentTime = new Date(date);
    currentTime.setHours(startHour, 0, 0, 0);

    for (const task of tasks) {
      // Apply correction factor
      const pattern = patterns.find((p) => p.subject === task.subject);
      const correctionFactor = pattern?.recommendedCorrectionFactor || 1.0;
      const adjustedMinutes = Math.round(task.estimatedMinutes * correctionFactor);

      const scheduledTask = this.scheduledTaskRepository.create({
        scheduleId: savedSchedule.id,
        taskId: task.id,
        scheduledStart: new Date(currentTime),
        scheduledEnd: new Date(currentTime.getTime() + adjustedMinutes * 60000),
        estimatedMinutes: adjustedMinutes,
      });

      await this.scheduledTaskRepository.save(scheduledTask);

      // Add task duration + 10 min break
      currentTime = new Date(currentTime.getTime() + (adjustedMinutes + 10) * 60000);
    }

    return this.getScheduleWithTasks(savedSchedule.id);
  }

  async getScheduleWithTasks(scheduleId: string): Promise<StudentSchedule> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId },
      relations: ['plannedTasks'],
    });

    if (!schedule) {
      throw new Error(`Schedule with id ${scheduleId} not found`);
    }

    return schedule;
  }

  async recordTaskCompletion(
    taskId: string,
    actualMinutes: number,
  ): Promise<void> {
    const task = await this.scheduledTaskRepository.findOne({
      where: { id: taskId },
      relations: ['schedule'],
    });

    if (!task) return;

    task.completed = true;
    task.actualMinutes = actualMinutes;
    await this.scheduledTaskRepository.save(task);

    // Update estimation pattern
    await this.updateEstimationPattern(
      task.schedule.studentId,
      task.taskId,
      task.estimatedMinutes,
      actualMinutes,
    );
  }

  private async updateEstimationPattern(
    studentId: string,
    taskId: string,
    estimated: number,
    actual: number,
  ): Promise<void> {
    // Simplified - would fetch task subject in production
    const subject = 'General';

    let pattern = await this.patternRepository.findOne({
      where: { studentId, subject },
    });

    if (!pattern) {
      pattern = this.patternRepository.create({
        studentId,
        subject,
        estimationAccuracy: 100,
        recommendedCorrectionFactor: 1.0,
      });
    }

    // Calculate error
    const error = actual - estimated;
    const errorPercent = (error / estimated) * 100;

    // Update pattern (simple moving average)
    if (error > 0) {
      pattern.averageUnderestimate = Math.round(
        (pattern.averageUnderestimate * 0.8 + error * 0.2),
      );
    } else {
      pattern.averageOverestimate = Math.round(
        (pattern.averageOverestimate * 0.8 + Math.abs(error) * 0.2),
      );
    }

    // Update accuracy
    pattern.estimationAccuracy = Math.max(0, 100 - Math.abs(errorPercent));

    // Calculate correction factor
    if (pattern.averageUnderestimate > 5) {
      pattern.recommendedCorrectionFactor = 1 + (pattern.averageUnderestimate / estimated);
    } else if (pattern.averageOverestimate > 5) {
      pattern.recommendedCorrectionFactor = 1 - (pattern.averageOverestimate / estimated);
    }

    await this.patternRepository.save(pattern);
  }

  async getStudentPatterns(studentId: string): Promise<TimeEstimationPattern[]> {
    return this.patternRepository.find({ where: { studentId } });
  }

  async suggestOptimalSchedule(
    studentId: string,
    date: Date,
  ): Promise<{
    recommendedStartTime: string;
    recommendedBreakInterval: number;
    estimatedCompletionTime: string;
  }> {
    // Simplified - would analyze historical data
    return {
      recommendedStartTime: '14:00',
      recommendedBreakInterval: 25, // Pomodoro
      estimatedCompletionTime: '17:30',
    };
  }
}
