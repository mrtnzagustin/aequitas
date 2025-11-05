import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';

@Entity('student_focus_patterns')
export class StudentFocusPattern {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  studentId: string;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column({ type: 'int' })
  optimalSessionLength: number; // minutes

  @Column({ type: 'varchar', length: 10 })
  bestTimeOfDay: string; // HH:MM format

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  averageFocusDuration: number; // minutes

  @Column({ type: 'int' })
  recommendedBreakFrequency: number; // minutes

  @Column({ type: 'jsonb', default: [] })
  focusTriggers: string[]; // What helps focus

  @Column({ type: 'jsonb', default: [] })
  distractionTriggers: string[]; // What hurts focus

  @UpdateDateColumn()
  updatedAt: Date;
}
