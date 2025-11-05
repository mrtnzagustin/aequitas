import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StoryComment } from './story-comment.entity';

export enum AuthorType {
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
  THERAPIST = 'THERAPIST',
}

export enum ContentType {
  TEXT = 'TEXT',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
}

export enum StoryVisibility {
  PUBLIC = 'PUBLIC',
  PLATFORM_ONLY = 'PLATFORM_ONLY',
  ANONYMOUS = 'ANONYMOUS',
}

export enum StoryStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export interface OutcomeMetrics {
  beforeScore: number;
  afterScore: number;
  timeframe: string;
}

export interface Reaction {
  emoji: string;
  count: number;
}

@Entity('success_stories')
export class SuccessStory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  authorId: string;

  @Column({
    type: 'enum',
    enum: AuthorType,
  })
  authorType: AuthorType;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  summary: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: ContentType,
    default: ContentType.TEXT,
  })
  contentType: ContentType;

  @Column({ type: 'varchar', nullable: true })
  mediaUrl: string | null;

  @Column({ type: 'jsonb', default: [] })
  challenges: string[]; // ['ADHD', 'Dyslexia', 'Anxiety']

  @Column({ type: 'jsonb', nullable: true })
  outcomeMetrics: OutcomeMetrics | null;

  @Column({
    type: 'enum',
    enum: StoryVisibility,
    default: StoryVisibility.PLATFORM_ONLY,
  })
  visibility: StoryVisibility;

  @Column({ type: 'boolean', default: false })
  featured: boolean;

  @Column({ type: 'uuid', nullable: true })
  approvedBy: string | null;

  @Column({
    type: 'enum',
    enum: StoryStatus,
    default: StoryStatus.PENDING,
  })
  status: StoryStatus;

  @Column({ type: 'jsonb', default: [] })
  reactions: Reaction[];

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ type: 'int', default: 0 })
  shareCount: number;

  @OneToMany(() => StoryComment, (comment) => comment.story)
  comments: StoryComment[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date | null;

  @UpdateDateColumn()
  updatedAt: Date;
}
