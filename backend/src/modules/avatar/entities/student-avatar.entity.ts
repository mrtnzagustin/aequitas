import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { AvatarOutfit } from './avatar-outfit.entity';

export enum AvatarStyle {
  CARTOON = 'CARTOON',
  PIXEL = 'PIXEL',
  REALISTIC = 'REALISTIC',
}

export interface AvatarComponents {
  body: string;
  hair: string;
  eyes: string;
  clothes: string;
  accessories: string[];
}

@Entity('student_avatars')
export class StudentAvatar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  studentId: string;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column({
    type: 'enum',
    enum: AvatarStyle,
    default: AvatarStyle.CARTOON,
  })
  style: AvatarStyle;

  @Column({ type: 'jsonb', default: {} })
  components: AvatarComponents;

  @Column({ type: 'jsonb', default: [] })
  unlockedItems: string[]; // IDs of unlocked cosmetic items

  @OneToMany(() => AvatarOutfit, (outfit) => outfit.avatar)
  savedOutfits: AvatarOutfit[];

  @Column({ type: 'varchar', nullable: true })
  backgroundTheme: string;

  @Column({ type: 'jsonb', default: [] })
  interests: string[];

  @Column({ type: 'varchar', nullable: true })
  pronouns: string;

  @Column({ type: 'varchar', nullable: true })
  bannerUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
