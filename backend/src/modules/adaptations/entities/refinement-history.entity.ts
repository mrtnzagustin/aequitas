import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TaskAdaptation } from './task-adaptation.entity';

@Entity('refinement_history')
export class RefinementHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  adaptationId: string;

  @Column('text')
  userMessage: string; // User's refinement request

  @Column('text')
  aiResponse: string; // AI's updated adaptation

  @Column()
  version: number; // Incremental version (1, 2, 3...)

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => TaskAdaptation, (adaptation) => adaptation.refinements)
  @JoinColumn({ name: 'adaptationId' })
  adaptation: TaskAdaptation;
}
