import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum AccessibilityFont {
  OPENDYSLEXIC = 'OPENDYSLEXIC',
  COMIC_SANS = 'COMIC_SANS',
  ARIAL = 'ARIAL',
  DEFAULT = 'DEFAULT',
}

@Entity('accessibility_profiles')
export class AccessibilityProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: AccessibilityFont,
    default: AccessibilityFont.DEFAULT,
  })
  font: AccessibilityFont;

  @Column({ type: 'int', default: 100 })
  fontSize: number; // percentage (50-200)

  @Column({ type: 'int', default: 100 })
  lineSpacing: number; // percentage (100-250)

  @Column({ type: 'varchar', length: 20, default: '#ffffff' })
  backgroundColor: string;

  @Column({ type: 'boolean', default: false })
  highContrast: boolean;

  @Column({ type: 'boolean', default: false })
  textToSpeechEnabled: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 1.0 })
  speechRate: number; // 0.5-2.0

  @Column({ type: 'boolean', default: false })
  magnifierEnabled: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 1.0 })
  magnification: number; // 1.5x, 2x, 3x

  @Column({ type: 'boolean', default: false })
  focusModeEnabled: boolean;

  @Column({ type: 'boolean', default: false })
  readingRulerEnabled: boolean;

  @Column({ type: 'boolean', default: false })
  reduceAnimations: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  preferredVoice: string; // TTS voice ID

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
