import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StudyRoom } from './study-room.entity';
import { User } from '../../users/entities/user.entity';

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
}

@Entity('room_messages')
export class RoomMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  roomId: string;

  @ManyToOne(() => StudyRoom)
  @JoinColumn({ name: 'roomId' })
  room: StudyRoom;

  @Column({ type: 'uuid' })
  senderId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'enum', enum: MessageType })
  type: MessageType;

  @Column({ type: 'boolean', default: false })
  flagged: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
