import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { StudentAssignment } from '../../students/entities/student-assignment.entity';
import { Note } from '../../notes/entities/note.entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  THERAPIST = 'THERAPIST',
  TEACHER = 'TEACHER',
  PARENT = 'PARENT',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ default: 'es-AR' })
  locale: string;

  @Column()
  @Exclude()
  passwordHash: string;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  createdBy: string;

  // Relations
  @OneToMany(() => StudentAssignment, (assignment) => assignment.user)
  studentAssignments: StudentAssignment[];

  @OneToMany(() => Note, (note) => note.author)
  notes: Note[];
}
