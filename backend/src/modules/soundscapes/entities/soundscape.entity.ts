import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SoundscapeType {
  NATURE = 'NATURE',
  NOISE = 'NOISE',
  BINAURAL = 'BINAURAL',
  MUSIC = 'MUSIC',
  CUSTOM = 'CUSTOM',
}

@Entity('soundscapes')
export class Soundscape {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    type: 'enum',
    enum: SoundscapeType,
  })
  type: SoundscapeType;

  @Column({ type: 'varchar' })
  audioUrl: string; // URL to audio file or streaming service

  @Column({ type: 'int' })
  duration: number; // Duration in seconds (0 = infinite loop)

  @Column({ type: 'int', default: 3 })
  focusBoost: number; // 1-5 rating

  @Column({ type: 'int', default: 3 })
  calmingEffect: number; // 1-5 rating

  @Column({ type: 'jsonb', default: [] })
  recommendedFor: string[]; // ['ADHD', 'ANXIETY', 'DYSLEXIA']

  @Column({ type: 'jsonb', default: [] })
  tags: string[]; // ['rain', 'forest', 'focus', 'calm']

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
