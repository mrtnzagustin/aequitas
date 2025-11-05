import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Student } from '../../students/entities/student.entity';

export enum NoteType {
  THERAPEUTIC = 'THERAPEUTIC',
  ACADEMIC = 'ACADEMIC',
  FAMILY = 'FAMILY',
}

export enum NoteVisibility {
  THERAPIST_ONLY = 'THERAPIST_ONLY', // Only therapists and admins
  TEAM = 'TEAM', // Therapists, teachers
  ALL = 'ALL', // Everyone including parents
}

export interface Grade {
  subject: string;
  score: string;
  maxScore?: string;
}

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  studentId: string;

  @Column()
  authorId: string;

  @Column({ type: 'enum', enum: NoteType })
  type: NoteType;

  @Column('text')
  content: string; // Rich text (HTML)

  @Column('text', { array: true, default: [] })
  tags: string[];

  @Column({ type: 'json', nullable: true })
  grade: Grade; // Only for ACADEMIC notes

  @Column({ type: 'enum', enum: NoteVisibility, default: NoteVisibility.ALL })
  visibility: NoteVisibility;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Student, (student) => student.notes)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @ManyToOne(() => User, (user) => user.notes)
  @JoinColumn({ name: 'authorId' })
  author: User;
}
