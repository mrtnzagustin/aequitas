import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { ObservationComment } from './observation-comment.entity';

export enum ObservationContext {
  HOME = 'HOME',
  SCHOOL = 'SCHOOL',
  THERAPY = 'THERAPY',
}

@Entity('shared_observations')
export class SharedObservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  studentId: string;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column({ type: 'uuid' })
  authorId: string; // User ID (parent, therapist, teacher)

  @Column({
    type: 'enum',
    enum: ObservationContext,
  })
  context: ObservationContext;

  @Column({ type: 'text' })
  observation: string;

  @Column({ type: 'jsonb', default: [] })
  concerns: string[]; // List of concerns

  @Column({ type: 'jsonb', default: [] })
  victories: string[]; // Positive observations

  @Column({ type: 'jsonb', default: [] })
  sharedWith: string[]; // User IDs with access

  @OneToMany(() => ObservationComment, (comment) => comment.observation)
  comments: ObservationComment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
