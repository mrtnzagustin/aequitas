import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StudyRoom } from './study-room.entity';
import { Student } from '../../students/entities/student.entity';

export enum ParticipantRole {
  PARTICIPANT = 'PARTICIPANT',
  MODERATOR = 'MODERATOR',
}

@Entity('room_participants')
export class RoomParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  roomId: string;

  @ManyToOne(() => StudyRoom)
  @JoinColumn({ name: 'roomId' })
  room: StudyRoom;

  @Column({ type: 'uuid' })
  studentId: string;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column({ type: 'timestamp' })
  joinedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  leftAt?: Date;

  @Column({ type: 'boolean', default: false })
  isMuted: boolean;

  @Column({ type: 'boolean', default: false })
  isVideoOn: boolean;

  @Column({ type: 'enum', enum: ParticipantRole, default: ParticipantRole.PARTICIPANT })
  role: ParticipantRole;

  @Column({ type: 'int', default: 0 })
  totalTimeMinutes: number;
}
