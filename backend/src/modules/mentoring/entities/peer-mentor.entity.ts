import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Student } from '../../students/entities/student.entity';

@Entity('peer_mentors')
export class PeerMentor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  studentId: string;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column({ type: 'jsonb', default: [] })
  strengths: string[];

  @Column({ type: 'jsonb', default: [] })
  challengesOvercome: string[];

  @Column({ type: 'jsonb', default: [] })
  availability: string[];

  @Column({ type: 'int', default: 0 })
  mentoringCount: number;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0.0 })
  rating: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
