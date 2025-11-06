import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskBreakdown, MicroTask, MicroTaskStatus, MicroTaskDifficulty } from './entities/task-breakdown.entity';

@Injectable()
export class TaskBreakdownService {
  constructor(
    @InjectRepository(TaskBreakdown)
    private breakdownRepository: Repository<TaskBreakdown>,
    @InjectRepository(MicroTask)
    private microTaskRepository: Repository<MicroTask>,
  ) {}

  async createBreakdown(
    originalTaskId: string,
    studentId: string,
    taskDescription: string,
  ): Promise<TaskBreakdown> {
    // AI-powered breakdown (simplified - would use GPT-4 in production)
    const microTasks = this.generateMicroTasks(taskDescription);

    const breakdown = this.breakdownRepository.create({
      originalTaskId,
      studentId,
      totalEstimatedMinutes: microTasks.reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0),
      difficultyScore: this.calculateDifficulty(microTasks),
      aiRationale: 'Task broken down into manageable steps based on complexity',
    });

    const savedBreakdown = await this.breakdownRepository.save(breakdown);

    // Create micro tasks
    for (const [index, taskData] of microTasks.entries()) {
      const microTask = this.microTaskRepository.create({
        ...taskData,
        breakdownId: savedBreakdown.id,
        sequence: index + 1,
        status: index === 0 ? MicroTaskStatus.AVAILABLE : MicroTaskStatus.LOCKED,
      });
      await this.microTaskRepository.save(microTask);
    }

    return this.getBreakdownWithTasks(savedBreakdown.id);
  }

  async getBreakdownWithTasks(breakdownId: string): Promise<TaskBreakdown> {
    const breakdown = await this.breakdownRepository.findOne({
      where: { id: breakdownId },
      relations: ['microTasks'],
    });

    if (!breakdown) {
      throw new NotFoundException('Task breakdown not found');
    }

    return breakdown;
  }

  async completeMicroTask(microTaskId: string): Promise<MicroTask> {
    const microTask = await this.microTaskRepository.findOne({
      where: { id: microTaskId },
    });

    if (!microTask) {
      throw new NotFoundException('Micro task not found');
    }

    microTask.status = MicroTaskStatus.COMPLETED;
    microTask.completedAt = new Date();
    await this.microTaskRepository.save(microTask);

    // Unlock next tasks
    await this.unlockDependentTasks(microTask.breakdownId, microTaskId);

    return microTask;
  }

  private async unlockDependentTasks(breakdownId: string, completedTaskId: string): Promise<void> {
    const allTasks = await this.microTaskRepository.find({
      where: { breakdownId },
    });

    for (const task of allTasks) {
      if (task.status === MicroTaskStatus.LOCKED && task.dependencies.includes(completedTaskId)) {
        // Check if all dependencies are met
        const allDependenciesMet = task.dependencies.every((depId) =>
          allTasks.find((t) => t.id === depId && t.status === MicroTaskStatus.COMPLETED),
        );

        if (allDependenciesMet) {
          task.status = MicroTaskStatus.AVAILABLE;
          await this.microTaskRepository.save(task);
        }
      }
    }
  }

  private generateMicroTasks(description: string): Partial<MicroTask>[] {
    // Simplified breakdown logic (would use AI in production)
    const steps = [
      { title: 'Review task requirements', estimatedMinutes: 5, difficulty: MicroTaskDifficulty.EASY },
      { title: 'Gather necessary materials', estimatedMinutes: 10, difficulty: MicroTaskDifficulty.EASY },
      { title: 'Complete main work', estimatedMinutes: 30, difficulty: MicroTaskDifficulty.MEDIUM },
      { title: 'Review and check work', estimatedMinutes: 10, difficulty: MicroTaskDifficulty.MEDIUM },
      { title: 'Final polish and submission', estimatedMinutes: 5, difficulty: MicroTaskDifficulty.EASY },
    ];

    return steps.map((step) => ({
      title: step.title,
      description: `Step: ${step.title}`,
      estimatedMinutes: step.estimatedMinutes,
      difficulty: step.difficulty,
      dependencies: [],
      resources: [],
    }));
  }

  private calculateDifficulty(tasks: Partial<MicroTask>[]): number {
    const avgDifficulty = tasks.reduce((sum, t) => {
      const difficultyValue = t.difficulty === MicroTaskDifficulty.EASY ? 3
        : t.difficulty === MicroTaskDifficulty.MEDIUM ? 5
        : 8;
      return sum + difficultyValue;
    }, 0) / tasks.length;

    return Math.round(avgDifficulty);
  }

  async getStudentBreakdowns(studentId: string): Promise<TaskBreakdown[]> {
    return this.breakdownRepository.find({
      where: { studentId },
      relations: ['microTasks'],
      order: { generatedAt: 'DESC' },
    });
  }
}
