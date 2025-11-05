import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { User } from '../../users/entities/user.entity';
import { RefinementHistory } from './refinement-history.entity';

export enum TaskSource {
  IMAGE = 'IMAGE',
  PDF = 'PDF',
  TEXT = 'TEXT',
  PHOTO = 'PHOTO',
}

export enum AdaptationStatus {
  DRAFT = 'DRAFT',
  CONFIRMED = 'CONFIRMED',
  ARCHIVED = 'ARCHIVED',
}

@Entity('task_adaptations')
export class TaskAdaptation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  studentId: string;

  @Column('text')
  originalTask: string; // Original task content (plain text or HTML)

  @Column({ type: 'enum', enum: TaskSource })
  originalTaskSource: TaskSource;

  @Column({ nullable: true })
  originalTaskUrl: string; // S3 URL if image/PDF was uploaded

  @Column('text')
  adaptedTask: string; // Final adapted task content (HTML)

  @Column('text')
  explanation: string; // AI's explanation of changes

  @Column({ type: 'enum', enum: AdaptationStatus, default: AdaptationStatus.DRAFT })
  status: AdaptationStatus;

  @Column({ nullable: true })
  subject: string; // e.g., "Math", "Reading"

  @Column({ nullable: true })
  difficulty: string; // e.g., "Easy", "Medium", "Hard"

  @Column()
  createdBy: string; // User ID

  @Column({ nullable: true })
  confirmedBy: string; // User ID (if different from creator)

  @Column({ nullable: true })
  confirmedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Student, (student) => student.adaptations)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  @OneToMany(() => RefinementHistory, (refinement) => refinement.adaptation)
  refinements: RefinementHistory[];
}
