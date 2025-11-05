import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ItemCategory {
  BODY = 'BODY',
  HAIR = 'HAIR',
  EYES = 'EYES',
  CLOTHES = 'CLOTHES',
  ACCESSORY = 'ACCESSORY',
  BACKGROUND = 'BACKGROUND',
}

export enum ItemRarity {
  COMMON = 'COMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
}

@Entity('cosmetic_items')
export class CosmeticItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ItemCategory,
  })
  category: ItemCategory;

  @Column({ type: 'int', default: 0 })
  pointCost: number; // Points needed to unlock (0 = free/default)

  @Column({ type: 'uuid', nullable: true })
  requiredBadgeId: string; // Optional badge requirement

  @Column({ type: 'varchar' })
  imageUrl: string;

  @Column({
    type: 'enum',
    enum: ItemRarity,
    default: ItemRarity.COMMON,
  })
  rarity: ItemRarity;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
