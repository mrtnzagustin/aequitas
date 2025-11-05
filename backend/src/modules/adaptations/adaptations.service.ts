import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskAdaptation } from './entities/task-adaptation.entity';

@Injectable()
export class AdaptationsService {
  constructor(
    @InjectRepository(TaskAdaptation)
    private readonly adaptationRepository: Repository<TaskAdaptation>,
  ) {}

  async findByStudentId(studentId: string): Promise<TaskAdaptation[]> {
    return this.adaptationRepository.find({
      where: { studentId },
      order: { createdAt: 'DESC' },
    });
  }
}
