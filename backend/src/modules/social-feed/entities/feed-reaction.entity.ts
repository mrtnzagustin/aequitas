import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Unique,
} from 'typeorm';
import { FeedPost } from './feed-post.entity';
import { Student } from '../../students/entities/student.entity';

export enum ReactionType {
  CLAP = '👏',
  PARTY = '🎉',
  MUSCLE = '💪',
  HEART = '❤️',
  FIRE = '🔥',
  STAR = '⭐',
}

@Entity('feed_reactions')
@Unique(['postId', 'userId', 'emoji']) // One reaction type per user per post
export class FeedReaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  postId: string;

  @ManyToOne(() => FeedPost, (post) => post.reactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: FeedPost;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Student;

  @Column({ type: 'varchar', length: 10 })
  emoji: string; // emoji character

  @CreateDateColumn()
  createdAt: Date;
}
