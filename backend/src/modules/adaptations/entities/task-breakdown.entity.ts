import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum MicroTaskDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export enum MicroTaskStatus {
  LOCKED = 'LOCKED',
  AVAILABLE = 'AVAILABLE',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

@Entity('task_breakdowns')
export class TaskBreakdown {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  originalTaskId: string;

  @Column('uuid')
  studentId: string;

  @Column({ type: 'int', default: 0 })
  totalEstimatedMinutes: number;

  @Column({ type: 'int', default: 5 })
  difficultyScore: number; // 1-10

  @Column({ type: 'uuid', nullable: true })
  approvedBy: string | null;

  @Column({ type: 'text', nullable: true })
  aiRationale: string;

  @CreateDateColumn()
  generatedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => MicroTask, (microTask) => microTask.breakdown)
  microTasks: MicroTask[];
}

@Entity('micro_tasks')
export class MicroTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  breakdownId: string;

  @Column({ type: 'int' })
  sequence: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int' })
  estimatedMinutes: number;

  @Column({ type: 'int', default: 0 })
  actualMinutes: number;

  @Column({
    type: 'enum',
    enum: MicroTaskDifficulty,
    default: MicroTaskDifficulty.MEDIUM,
  })
  difficulty: MicroTaskDifficulty;

  @Column({ type: 'jsonb', default: [] })
  dependencies: string[]; // Array of MicroTask IDs

  @Column({
    type: 'enum',
    enum: MicroTaskStatus,
    default: MicroTaskStatus.LOCKED,
  })
  status: MicroTaskStatus;

  @Column({ type: 'jsonb', default: [] })
  resources: string[]; // URLs or resource IDs

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column(() => TaskBreakdown)
  breakdown: TaskBreakdown;
}
