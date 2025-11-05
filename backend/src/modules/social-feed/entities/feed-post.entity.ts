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
import { FeedComment } from './feed-comment.entity';
import { FeedReaction } from './feed-reaction.entity';

export enum PostType {
  ACHIEVEMENT = 'ACHIEVEMENT',
  MILESTONE = 'MILESTONE',
  REFLECTION = 'REFLECTION',
  CELEBRATION = 'CELEBRATION',
}

export enum PostVisibility {
  PRIVATE = 'PRIVATE',
  CLASS = 'CLASS',
  PUBLIC = 'PUBLIC',
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  PENDING_MODERATION = 'PENDING_MODERATION',
  PUBLISHED = 'PUBLISHED',
  FLAGGED = 'FLAGGED',
  REJECTED = 'REJECTED',
}

@Entity('feed_posts')
export class FeedPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  studentId: string;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column({
    type: 'enum',
    enum: PostType,
  })
  type: PostType;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'uuid', nullable: true })
  badgeId: string; // Reference to earned badge

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string;

  @Column({
    type: 'enum',
    enum: PostVisibility,
    default: PostVisibility.PUBLIC,
  })
  visibility: PostVisibility;

  @Column({ type: 'int', default: 0 })
  highFivesCount: number;

  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.PENDING_MODERATION,
  })
  status: PostStatus;

  @Column({ type: 'uuid', nullable: true })
  moderatedBy: string | null; // Therapist who moderated

  @Column({ type: 'text', nullable: true })
  moderationNotes: string | null;

  @OneToMany(() => FeedComment, (comment) => comment.post)
  comments: FeedComment[];

  @OneToMany(() => FeedReaction, (reaction) => reaction.post)
  reactions: FeedReaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
