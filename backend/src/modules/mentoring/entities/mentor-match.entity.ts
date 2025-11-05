import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum MatchStatus {
  PROPOSED = 'PROPOSED',
  ACCEPTED = 'ACCEPTED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  DECLINED = 'DECLINED',
}

@Entity('mentor_matches')
export class MentorMatch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  mentorId: string;

  @Column({ type: 'uuid' })
  menteeId: string;

  @Column({ type: 'varchar' })
  focusArea: string;

  @Column({ type: 'int', default: 0 })
  matchScore: number; // 0-100

  @Column({ type: 'enum', enum: MatchStatus, default: MatchStatus.PROPOSED })
  status: MatchStatus;

  @Column({ type: 'int', default: 0 })
  sessionsCount: number;

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  endedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
