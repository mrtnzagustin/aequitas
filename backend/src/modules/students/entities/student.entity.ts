import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { StudentAssignment } from './student-assignment.entity';
import { Note } from '../../notes/entities/note.entity';
import { TaskAdaptation } from '../../adaptations/entities/task-adaptation.entity';

export enum StudentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column()
  condition: string; // Primary condition (e.g., "Dyslexia")

  @Column('text', { array: true, default: [] })
  interests: string[]; // Array of interests

  @Column('text', { array: true, default: [] })
  learningPreferences: string[]; // Array of learning preferences

  @Column({ nullable: true })
  photoUrl: string; // S3/storage URL

  @Column({ type: 'enum', enum: StudentStatus, default: StudentStatus.ACTIVE })
  status: StudentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  createdBy: string; // User ID

  // Relations
  @OneToMany(() => StudentAssignment, (assignment) => assignment.student)
  assignments: StudentAssignment[];

  @OneToMany(() => Note, (note) => note.student)
  notes: Note[];

  @OneToMany(() => TaskAdaptation, (adaptation) => adaptation.student)
  adaptations: TaskAdaptation[];
}
