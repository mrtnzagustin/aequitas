import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';

@Entity('point_transactions')
export class PointTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  studentId: string;

  @Column({ type: 'int' })
  points: number; // Can be positive or negative

  @Column()
  reason: string; // "Task completed", "Mood check-in", etc.

  @Column({ nullable: true })
  relatedEntity: string; // taskId, moodCheckInId, etc.

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => Student)
  @JoinColumn({ name: 'studentId' })
  student: Student;
}
