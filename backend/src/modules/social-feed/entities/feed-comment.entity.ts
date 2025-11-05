import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { FeedPost } from './feed-post.entity';
import { Student } from '../../students/entities/student.entity';

export enum ModerationStatus {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

@Entity('feed_comments')
export class FeedComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  postId: string;

  @ManyToOne(() => FeedPost, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: FeedPost;

  @Column({ type: 'uuid' })
  authorId: string;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: Student;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: ModerationStatus,
    default: ModerationStatus.PENDING,
  })
  moderationStatus: ModerationStatus;

  @Column({ type: 'uuid', nullable: true })
  moderatedBy: string | null;

  @Column({ type: 'text', nullable: true })
  moderationNotes: string | null;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.0 })
  sentimentScore: number; // AI sentiment analysis score (-1 to 1)

  @CreateDateColumn()
  createdAt: Date;
}
