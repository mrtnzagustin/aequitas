import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { LearningPath } from './learning-path.entity';

export enum NodeStatus {
  LOCKED = 'LOCKED',
  UNLOCKED = 'UNLOCKED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED',
}

@Entity('path_nodes')
export class PathNode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  pathId: string;

  @ManyToOne(() => LearningPath)
  @JoinColumn({ name: 'pathId' })
  path: LearningPath;

  @Column({ type: 'int' })
  sequence: number;

  @Column({ type: 'varchar', length: 255 })
  conceptId: string;

  @Column({ type: 'int' })
  difficulty: number;

  @Column({ type: 'int' })
  estimatedDuration: number; // minutes

  @Column({ type: 'jsonb', default: [] })
  prerequisites: string[];

  @Column({ type: 'enum', enum: NodeStatus, default: NodeStatus.LOCKED })
  status: NodeStatus;

  @Column({ type: 'int', nullable: true })
  masteryScore?: number;

  @Column({ type: 'int', default: 0 })
  attemptsCount: number;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;
}
