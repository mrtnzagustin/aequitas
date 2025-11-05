import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FocusSession } from './focus-session.entity';

export enum DistractionType {
  TAB_SWITCH = 'TAB_SWITCH',
  PROLONGED_INACTIVITY = 'PROLONGED_INACTIVITY',
  WINDOW_BLUR = 'WINDOW_BLUR',
  NOTIFICATION_CHECK = 'NOTIFICATION_CHECK',
}

@Entity('distraction_events')
export class DistractionEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  sessionId: string;

  @ManyToOne(() => FocusSession, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sessionId' })
  session: FocusSession;

  @CreateDateColumn()
  timestamp: Date;

  @Column({
    type: 'enum',
    enum: DistractionType,
  })
  type: DistractionType;

  @Column({ type: 'int', default: 0 })
  duration: number; // seconds
}
