import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';

export interface LoadIndicators {
  interactionPace: number;
  errorRate: number;
  taskSwitches: number;
  reReadingCount: number;
  helpRequests: number;
  microPauses: number;
}

@Entity('cognitive_load_measurements')
export class CognitiveLoadMeasurement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  studentId: string;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column({ type: 'varchar', length: 255 })
  taskId: string;

  @CreateDateColumn()
  timestamp: Date;

  @Column({ type: 'int' })
  loadScore: number; // 0-100

  @Column({ type: 'jsonb' })
  indicators: LoadIndicators;

  @Column({ type: 'varchar', length: 255, nullable: true })
  interventionTriggered?: string;
}
