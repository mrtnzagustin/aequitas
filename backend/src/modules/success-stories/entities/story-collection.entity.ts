import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('story_collections')
export class StoryCollection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'uuid' })
  curatedBy: string; // Admin/Therapist ID

  @Column({ type: 'jsonb', default: [] })
  storyIds: string[];

  @Column({ type: 'jsonb', default: [] })
  tags: string[];

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string | null;

  @Column({ type: 'boolean', default: true })
  isPublic: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
