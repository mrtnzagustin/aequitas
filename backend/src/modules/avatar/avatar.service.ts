import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  StudentAvatar,
  AvatarStyle,
  AvatarComponents,
} from './entities/student-avatar.entity';
import { AvatarOutfit } from './entities/avatar-outfit.entity';
import { CosmeticItem, ItemCategory } from './entities/cosmetic-item.entity';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { SaveOutfitDto } from './dto/save-outfit.dto';
import { StudentPoints } from '../gamification/entities/student-points.entity';

@Injectable()
export class AvatarService {
  constructor(
    @InjectRepository(StudentAvatar)
    private avatarRepository: Repository<StudentAvatar>,
    @InjectRepository(AvatarOutfit)
    private outfitRepository: Repository<AvatarOutfit>,
    @InjectRepository(CosmeticItem)
    private cosmeticRepository: Repository<CosmeticItem>,
    @InjectRepository(StudentPoints)
    private pointsRepository: Repository<StudentPoints>,
  ) {}

  async getOrCreateAvatar(studentId: string): Promise<StudentAvatar> {
    let avatar = await this.avatarRepository.findOne({
      where: { studentId },
      relations: ['savedOutfits'],
    });

    if (!avatar) {
      // Create default avatar
      const defaultComponents: AvatarComponents = {
        body: 'default-body',
        hair: 'default-hair',
        eyes: 'default-eyes',
        clothes: 'default-clothes',
        accessories: [],
      };

      avatar = this.avatarRepository.create({
        studentId,
        style: AvatarStyle.CARTOON,
        components: defaultComponents,
        unlockedItems: [], // Will unlock default items
        interests: [],
      });

      avatar = await this.avatarRepository.save(avatar);

      // Unlock all default (free) items
      await this.unlockDefaultItems(avatar.id);
    }

    return avatar;
  }

  async updateAvatar(
    studentId: string,
    dto: UpdateAvatarDto,
  ): Promise<StudentAvatar> {
    const avatar = await this.getOrCreateAvatar(studentId);

    if (dto.style) {
      avatar.style = dto.style;
    }

    if (dto.components) {
      // Merge components
      avatar.components = {
        ...avatar.components,
        ...dto.components,
      };
    }

    if (dto.backgroundTheme !== undefined) {
      avatar.backgroundTheme = dto.backgroundTheme;
    }

    if (dto.interests) {
      avatar.interests = dto.interests;
    }

    if (dto.pronouns !== undefined) {
      avatar.pronouns = dto.pronouns;
    }

    if (dto.bannerUrl !== undefined) {
      avatar.bannerUrl = dto.bannerUrl;
    }

    return this.avatarRepository.save(avatar);
  }

  async unlockItem(studentId: string, itemId: string): Promise<StudentAvatar> {
    const avatar = await this.getOrCreateAvatar(studentId);
    const item = await this.cosmeticRepository.findOne({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Cosmetic item not found');
    }

    // Check if already unlocked
    if (avatar.unlockedItems.includes(itemId)) {
      throw new BadRequestException('Item already unlocked');
    }

    // Check badge requirement
    if (item.requiredBadgeId) {
      // TODO: Check if student has the required badge
      // For now, we'll skip this check
    }

    // Check points and deduct
    if (item.pointCost > 0) {
      const points = await this.pointsRepository.findOne({
        where: { studentId },
      });

      if (!points || points.totalPoints < item.pointCost) {
        throw new BadRequestException('Insufficient points');
      }

      points.totalPoints -= item.pointCost;
      await this.pointsRepository.save(points);
    }

    // Unlock item
    avatar.unlockedItems.push(itemId);
    return this.avatarRepository.save(avatar);
  }

  async saveOutfit(
    studentId: string,
    dto: SaveOutfitDto,
  ): Promise<AvatarOutfit> {
    const avatar = await this.getOrCreateAvatar(studentId);

    // Check if outfit name already exists
    const existing = await this.outfitRepository.findOne({
      where: { avatarId: avatar.id, name: dto.name },
    });

    if (existing) {
      throw new BadRequestException('Outfit name already exists');
    }

    const outfit = this.outfitRepository.create({
      avatarId: avatar.id,
      name: dto.name,
      components: dto.components,
    });

    return this.outfitRepository.save(outfit);
  }

  async loadOutfit(studentId: string, outfitId: string): Promise<StudentAvatar> {
    const avatar = await this.getOrCreateAvatar(studentId);
    const outfit = await this.outfitRepository.findOne({
      where: { id: outfitId, avatarId: avatar.id },
    });

    if (!outfit) {
      throw new NotFoundException('Outfit not found');
    }

    avatar.components = outfit.components;
    return this.avatarRepository.save(avatar);
  }

  async deleteOutfit(studentId: string, outfitId: string): Promise<void> {
    const avatar = await this.getOrCreateAvatar(studentId);
    const outfit = await this.outfitRepository.findOne({
      where: { id: outfitId, avatarId: avatar.id },
    });

    if (!outfit) {
      throw new NotFoundException('Outfit not found');
    }

    await this.outfitRepository.remove(outfit);
  }

  async getAvailableItems(
    studentId: string,
  ): Promise<{
    unlocked: CosmeticItem[];
    locked: CosmeticItem[];
  }> {
    const avatar = await this.getOrCreateAvatar(studentId);
    const allItems = await this.cosmeticRepository.find({
      where: { isActive: true },
      order: { rarity: 'ASC', pointCost: 'ASC' },
    });

    const unlocked = allItems.filter((item) =>
      avatar.unlockedItems.includes(item.id),
    );
    const locked = allItems.filter(
      (item) => !avatar.unlockedItems.includes(item.id),
    );

    return { unlocked, locked };
  }

  async getItemsByCategory(category: ItemCategory): Promise<CosmeticItem[]> {
    return this.cosmeticRepository.find({
      where: { category, isActive: true },
      order: { rarity: 'ASC', pointCost: 'ASC' },
    });
  }

  private async unlockDefaultItems(avatarId: string): Promise<void> {
    const avatar = await this.avatarRepository.findOne({
      where: { id: avatarId },
    });

    if (!avatar) return;

    const defaultItems = await this.cosmeticRepository.find({
      where: { pointCost: 0, isActive: true },
    });

    avatar.unlockedItems = defaultItems.map((item) => item.id);
    await this.avatarRepository.save(avatar);
  }
}
