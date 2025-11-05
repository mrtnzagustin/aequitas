import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum ScheduleCreatedBy {
  AI = 'AI',
  STUDENT = 'STUDENT',
  THERAPIST = 'THERAPIST',
}

@Entity('student_schedules')
export class StudentSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  studentId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'int', default: 0 })
  actualCompletion: number; // percentage 0-100

  @Column({
    type: 'enum',
    enum: ScheduleCreatedBy,
    default: ScheduleCreatedBy.AI,
  })
  createdBy: ScheduleCreatedBy;

  @Column({ type: 'int', default: 0 })
  adherenceScore: number; // 0-100

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ScheduledTask, (task) => task.schedule)
  plannedTasks: ScheduledTask[];
}

@Entity('scheduled_tasks')
export class ScheduledTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  scheduleId: string;

  @Column(() => StudentSchedule)
  schedule: StudentSchedule;

  @Column('uuid')
  taskId: string;

  @Column({ type: 'timestamp' })
  scheduledStart: Date;

  @Column({ type: 'timestamp' })
  scheduledEnd: Date;

  @Column({ type: 'int' })
  estimatedMinutes: number;

  @Column({ type: 'int', default: 0 })
  actualMinutes: number;

  @Column({ type: 'boolean', default: false })
  completed: boolean;

  @Column({ type: 'text', nullable: true })
  reasonSkipped: string | null;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('time_estimation_patterns')
export class TimeEstimationPattern {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  studentId: string;

  @Column({ type: 'varchar', length: 100 })
  subject: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 100 })
  estimationAccuracy: number; // percentage

  @Column({ type: 'int', default: 0 })
  averageOverestimate: number; // minutes

  @Column({ type: 'int', default: 0 })
  averageUnderestimate: number; // minutes

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 1.0 })
  recommendedCorrectionFactor: number; // multiply by this

  @UpdateDateColumn()
  updatedAt: Date;
}
