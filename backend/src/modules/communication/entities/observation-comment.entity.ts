import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { SharedObservation } from './shared-observation.entity';

@Entity('observation_comments')
export class ObservationComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  observationId: string;

  @ManyToOne(() => SharedObservation, (obs) => obs.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'observationId' })
  observation: SharedObservation;

  @Column({ type: 'uuid' })
  authorId: string; // User ID

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
