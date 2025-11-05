import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { FocusSession } from './focus-session.entity';

export enum GazeDirection {
  ON_SCREEN = 'ON_SCREEN',
  AWAY = 'AWAY',
}

export enum HeadPose {
  UPRIGHT = 'UPRIGHT',
  SLOUCHED = 'SLOUCHED',
}

export enum EmotionDetected {
  ENGAGED = 'ENGAGED',
  CONFUSED = 'CONFUSED',
  FRUSTRATED = 'FRUSTRATED',
  BORED = 'BORED',
}

@Entity('focus_metrics')
export class FocusMetric {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  sessionId: string;

  @ManyToOne(() => FocusSession)
  @JoinColumn({ name: 'sessionId' })
  session: FocusSession;

  @CreateDateColumn()
  timestamp: Date;

  @Column({ type: 'int' })
  focusScore: number; // 0-100

  @Column({ type: 'enum', enum: GazeDirection })
  gazeDirection: GazeDirection;

  @Column({ type: 'int' })
  blinkRate: number; // blinks per minute

  @Column({ type: 'enum', enum: HeadPose })
  headPose: HeadPose;

  @Column({ type: 'enum', enum: EmotionDetected })
  emotionDetected: EmotionDetected;
}
