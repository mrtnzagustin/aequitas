import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';

export enum MoodType {
  HAPPY = 'HAPPY',
  OKAY = 'OKAY',
  SAD = 'SAD',
  ANXIOUS = 'ANXIOUS',
  FRUSTRATED = 'FRUSTRATED',
  ENERGETIC = 'ENERGETIC',
}

@Entity('mood_checkins')
export class MoodCheckIn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  studentId: string;

  @Column({ type: 'enum', enum: MoodType })
  mood: MoodType;

  @Column({ type: 'int', nullable: true })
  intensity: number; // 1-5 scale

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column('text', { array: true, default: [] })
  triggers: string[]; // Tags: homework, social, family, test

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => Student)
  @JoinColumn({ name: 'studentId' })
  student: Student;
}
