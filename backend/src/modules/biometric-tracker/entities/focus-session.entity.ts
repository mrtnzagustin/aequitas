import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';

@Entity('focus_sessions')
export class FocusSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  studentId: string;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column({ type: 'timestamp' })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  endedAt?: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  averageFocusScore: number; // 0-100

  @Column({ type: 'varchar', length: 10, nullable: true })
  peakFocusTime?: string; // HH:MM format

  @Column({ type: 'int', default: 0 })
  lowFocusPeriods: number;

  @Column({ type: 'int', default: 0 })
  breaksCount: number;

  @Column({ type: 'int', default: 0 })
  totalDuration: number; // seconds

  @Column({ type: 'varchar', length: 255, nullable: true })
  taskId?: string;
}
