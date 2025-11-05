import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { StudentAvatar, AvatarComponents } from './student-avatar.entity';

@Entity('avatar_outfits')
export class AvatarOutfit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  avatarId: string;

  @ManyToOne(() => StudentAvatar, (avatar) => avatar.savedOutfits, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'avatarId' })
  avatar: StudentAvatar;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'jsonb' })
  components: AvatarComponents;

  @CreateDateColumn()
  createdAt: Date;
}
