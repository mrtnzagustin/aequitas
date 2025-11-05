import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';

@Entity('weekly_progress_reports')
export class WeeklyProgressReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  studentId: string;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column({ type: 'date' })
  weekOf: Date; // Start date of the week

  @Column({ type: 'int', default: 0 })
  tasksCompleted: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0.0 })
  averageMood: number; // 0-5 scale

  @Column({ type: 'int', default: 0 })
  badgesEarned: number;

  @Column({ type: 'int', default: 0 })
  focusMinutes: number;

  @Column({ type: 'jsonb', default: [] })
  focusAreas: string[]; // Areas to focus on

  @Column({ type: 'jsonb', default: [] })
  suggestedActivities: string[]; // Recommended home activities

  @Column({ type: 'text', nullable: true })
  teacherNotes: string | null;

  @Column({ type: 'boolean', default: false })
  sentToParents: boolean;

  @Column({ type: 'timestamp', nullable: true })
  sentAt: Date | null;

  @CreateDateColumn()
  generatedAt: Date;
}
