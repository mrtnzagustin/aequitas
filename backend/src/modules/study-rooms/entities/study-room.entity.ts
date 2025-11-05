import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum RoomPrivacy {
  PUBLIC = 'PUBLIC',
  INVITE_ONLY = 'INVITE_ONLY',
  SUPERVISED = 'SUPERVISED',
}

export enum RoomStatus {
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
}

@Entity('study_rooms')
export class StudyRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  topic: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'uuid' })
  creatorId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @Column({ type: 'enum', enum: RoomPrivacy })
  privacy: RoomPrivacy;

  @Column({ type: 'int' })
  maxParticipants: number;

  @Column({ type: 'timestamp', nullable: true })
  scheduledStart?: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualStart?: Date;

  @Column({ type: 'timestamp', nullable: true })
  endedAt?: Date;

  @Column({ type: 'enum', enum: RoomStatus })
  status: RoomStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  recordingUrl?: string;

  @Column({ type: 'jsonb', nullable: true })
  whiteboardData?: any;

  @CreateDateColumn()
  createdAt: Date;
}
