import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from './student.entity';

export interface FocusEnvironmentSettings {
  soundscapeId?: string;
  timerDuration: number; // minutes
  strictMode: boolean;
}

@Entity('focus_sessions')
export class FocusSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  studentId: string;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column({ type: 'uuid', nullable: true })
  taskId?: string;

  @CreateDateColumn()
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  endedAt?: Date;

  @Column({ type: 'int' })
  plannedDuration: number; // minutes

  @Column({ type: 'int', default: 0 })
  actualDuration: number; // minutes

  @Column({ type: 'int', default: 0 })
  distractionsCount: number;

  @Column({ type: 'boolean', default: false })
  completedSuccessfully: boolean;

  @Column({ type: 'int', default: 0 })
  focusScore: number; // 0-100

  @Column({ type: 'jsonb', nullable: true })
  environmentSettings?: FocusEnvironmentSettings;
}
