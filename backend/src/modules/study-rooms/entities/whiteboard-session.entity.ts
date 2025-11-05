import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StudyRoom } from './study-room.entity';

@Entity('whiteboard_sessions')
export class WhiteboardSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  roomId: string;

  @ManyToOne(() => StudyRoom)
  @JoinColumn({ name: 'roomId' })
  room: StudyRoom;

  @Column({ type: 'jsonb' })
  data: any; // Canvas state

  @Column({ type: 'varchar', length: 255, nullable: true })
  snapshotUrl?: string;

  @Column({ type: 'timestamp' })
  savedAt: Date;
}
