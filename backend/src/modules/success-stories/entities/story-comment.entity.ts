import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { SuccessStory } from './success-story.entity';

@Entity('story_comments')
export class StoryComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  storyId: string;

  @ManyToOne(() => SuccessStory, (story) => story.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'storyId' })
  story: SuccessStory;

  @Column({ type: 'uuid' })
  authorId: string;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'boolean', default: false })
  moderated: boolean;

  @Column({ type: 'boolean', default: false })
  approved: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
