import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { StyleEvidence } from './style-evidence.entity';

export enum LearningStyle {
  VISUAL = 'VISUAL',
  AUDITORY = 'AUDITORY',
  KINESTHETIC = 'KINESTHETIC',
  READING_WRITING = 'READING_WRITING',
}

@Entity('learning_style_profiles')
export class LearningStyleProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  studentId: string;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column({ type: 'int', default: 25 })
  visualScore: number; // 0-100

  @Column({ type: 'int', default: 25 })
  auditoryScore: number; // 0-100

  @Column({ type: 'int', default: 25 })
  kinestheticScore: number; // 0-100

  @Column({ type: 'int', default: 25 })
  readingWritingScore: number; // 0-100

  @Column({
    type: 'enum',
    enum: LearningStyle,
    default: LearningStyle.VISUAL,
  })
  primaryStyle: LearningStyle;

  @Column({
    type: 'enum',
    enum: LearningStyle,
    nullable: true,
  })
  secondaryStyle: LearningStyle;

  @Column({ type: 'int', default: 0 })
  confidence: number; // 0-100, how certain the AI is

  @OneToMany(() => StyleEvidence, (evidence) => evidence.profile)
  evidence: StyleEvidence[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  lastUpdated: Date;
}
