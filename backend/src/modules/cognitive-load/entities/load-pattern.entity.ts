import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';

@Entity('load_patterns')
export class LoadPattern {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  studentId: string;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column({ type: 'varchar', length: 100 })
  subject: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  averageLoad: number; // 0-100

  @Column({ type: 'varchar', length: 10 })
  peakLoadTime: string; // HH:MM format

  @Column({ type: 'int' })
  optimalSessionLength: number; // minutes

  @Column({ type: 'jsonb', default: [] })
  overloadTriggers: string[];

  @Column({ type: 'jsonb', default: [] })
  effectiveInterventions: string[];

  @UpdateDateColumn()
  updatedAt: Date;
}
