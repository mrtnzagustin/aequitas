import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';

export interface EffectivenessRating {
  soundscapeId: string;
  rating: number; // 1-5
  timesPlayed: number;
  totalFocusMinutes: number;
}

@Entity('student_sound_preferences')
export class StudentSoundPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  studentId: string;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column({ type: 'jsonb', default: [] })
  favoriteSoundscapes: string[]; // Array of soundscape IDs

  @Column({ type: 'jsonb', default: [] })
  effectivenessRatings: EffectivenessRating[];

  @Column({ type: 'boolean', default: false })
  autoPlayEnabled: boolean;

  @Column({ type: 'int', default: 70 })
  defaultVolume: number; // 0-100

  @Column({ type: 'uuid', nullable: true })
  lastPlayedSoundscapeId: string | null;

  @Column({ type: 'timestamp', nullable: true })
  lastPlayedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
