import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';

export enum BadgeType {
  FIRST_STEPS = 'FIRST_STEPS',
  CONSISTENCY_KING = 'CONSISTENCY_KING',
  CHALLENGE_ACCEPTED = 'CHALLENGE_ACCEPTED',
  MOOD_MASTER = 'MOOD_MASTER',
  SPEEDSTER = 'SPEEDSTER',
  PERFECTIONIST = 'PERFECTIONIST',
}

@Entity('student_badges')
export class StudentBadge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  studentId: string;

  @Column({ type: 'enum', enum: BadgeType })
  badge: BadgeType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  earnedAt: Date;

  // Relations
  @ManyToOne(() => Student)
  @JoinColumn({ name: 'studentId' })
  student: Student;
}
