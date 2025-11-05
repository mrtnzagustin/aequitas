import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from '../../students/entities/student.entity';

export enum PathStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED',
}

@Entity('learning_paths')
export class LearningPath {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  studentId: string;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column({ type: 'varchar', length: 100 })
  subject: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  estimatedCompletionDate: Date;

  @Column({ type: 'varchar', length: 255 })
  currentNode: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  completionPercentage: number;

  @Column({ type: 'int', default: 5 })
  difficultyLevel: number; // 1-10

  @Column({ type: 'int', default: 0 })
  adaptationCount: number;

  @Column({ type: 'enum', enum: PathStatus, default: PathStatus.ACTIVE })
  status: PathStatus;
}
