import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { LearningStyleProfile } from './learning-style-profile.entity';

export enum EvidenceType {
  CONTENT_INTERACTION = 'CONTENT_INTERACTION', // clicked video vs text
  TIME_SPENT = 'TIME_SPENT', // time on different formats
  PERFORMANCE = 'PERFORMANCE', // quiz scores by content type
  COMPLETION = 'COMPLETION', // completion rates by format
  EXPLICIT_PREFERENCE = 'EXPLICIT_PREFERENCE', // student-stated preference
}

@Entity('style_evidence')
export class StyleEvidence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  profileId: string;

  @ManyToOne(() => LearningStyleProfile, (profile) => profile.evidence, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profileId' })
  profile: LearningStyleProfile;

  @Column({
    type: 'enum',
    enum: EvidenceType,
  })
  evidenceType: EvidenceType;

  @Column({ type: 'jsonb' })
  dataPoint: {
    contentType?: string; // 'video', 'text', 'audio', 'interactive'
    duration?: number; // seconds
    score?: number; // quiz/task score
    completed?: boolean;
    preference?: string; // explicit style preference
    metadata?: Record<string, any>;
  };

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 1.0 })
  weight: number; // importance of this evidence (0.0-1.0)

  @CreateDateColumn()
  recordedAt: Date;
}
