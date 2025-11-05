import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Student } from './student.entity';

@Entity('student_assignments')
export class StudentAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  studentId: string;

  @Column()
  assignedBy: string; // User ID of assigner

  @CreateDateColumn()
  assignedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.studentAssignments)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Student, (student) => student.assignments)
  @JoinColumn({ name: 'studentId' })
  student: Student;
}
