import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ReminderEventType {
  TASK_DUE = 'TASK_DUE',
  MOOD_CHECKIN = 'MOOD_CHECKIN',
  BREAK_TIME = 'BREAK_TIME',
  SESSION_START = 'SESSION_START',
  FOCUS_SESSION = 'FOCUS_SESSION',
}

export enum DeliveryMethod {
  PUSH = 'PUSH',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  IN_APP = 'IN_APP',
}

export enum ReminderTone {
  GENTLE = 'GENTLE',
  NEUTRAL = 'NEUTRAL',
  URGENT = 'URGENT',
}

@Entity('reminder_rules')
export class ReminderRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: ReminderEventType,
  })
  eventType: ReminderEventType;

  @Column({ type: 'int' })
  advanceMinutes: number; // How many minutes before event to remind

  @Column({
    type: 'enum',
    enum: DeliveryMethod,
    default: DeliveryMethod.PUSH,
  })
  deliveryMethod: DeliveryMethod;

  @Column({
    type: 'enum',
    enum: ReminderTone,
    default: ReminderTone.NEUTRAL,
  })
  tone: ReminderTone;

  @Column({ type: 'int', default: 0 })
  effectiveness: number; // 0-100 based on response rate

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('reminder_deliveries')
export class ReminderDelivery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  ruleId: string;

  @ManyToOne(() => ReminderRule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ruleId' })
  rule: ReminderRule;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'uuid', nullable: true })
  relatedEntityId: string | null; // Task ID, Session ID, etc.

  @CreateDateColumn()
  sentAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  openedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  actedUponAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  dismissedAt: Date | null;
}
