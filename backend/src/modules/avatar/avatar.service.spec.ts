import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvatarService } from './avatar.service';
import {
  StudentAvatar,
  AvatarStyle,
  AvatarComponents,
} from './entities/student-avatar.entity';
import { AvatarOutfit } from './entities/avatar-outfit.entity';
import {
  CosmeticItem,
  ItemCategory,
  ItemRarity,
} from './entities/cosmetic-item.entity';
import { StudentPoints } from '../gamification/entities/student-points.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AvatarService', () => {
  let service: AvatarService;
  let avatarRepository: Repository<StudentAvatar>;
  let outfitRepository: Repository<AvatarOutfit>;
  let cosmeticRepository: Repository<CosmeticItem>;
  let pointsRepository: Repository<StudentPoints>;

  const mockComponents: AvatarComponents = {
    body: 'default-body',
    hair: 'default-hair',
    eyes: 'default-eyes',
    clothes: 'default-clothes',
    accessories: [],
  };

  const mockAvatar: any = {
    id: 'avatar-1',
    studentId: 'student-1',
    style: AvatarStyle.CARTOON,
    components: mockComponents,
    unlockedItems: ['item-1', 'item-2'],
    savedOutfits: [],
    backgroundTheme: null,
    interests: [],
    pronouns: null,
    bannerUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockItem: any = {
    id: 'item-3',
    name: 'Cool Hat',
    category: ItemCategory.ACCESSORY,
    pointCost: 100,
    requiredBadgeId: null,
    imageUrl: '/items/cool-hat.png',
    rarity: ItemRarity.RARE,
    isActive: true,
  };

  const mockOutfit: any = {
    id: 'outfit-1',
    avatarId: 'avatar-1',
    name: 'My Favorite',
    components: mockComponents,
    createdAt: new Date(),
  };

  const mockPoints: any = {
    id: 'points-1',
    studentId: 'student-1',
    totalPoints: 500,
    level: 5,
  };

  const mockAvatarRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockOutfitRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockCosmeticRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockPointsRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvatarService,
        {
          provide: getRepositoryToken(StudentAvatar),
          useValue: mockAvatarRepository,
        },
        {
          provide: getRepositoryToken(AvatarOutfit),
          useValue: mockOutfitRepository,
        },
        {
          provide: getRepositoryToken(CosmeticItem),
          useValue: mockCosmeticRepository,
        },
        {
          provide: getRepositoryToken(StudentPoints),
          useValue: mockPointsRepository,
        },
      ],
    }).compile();

    service = module.get<AvatarService>(AvatarService);
    avatarRepository = module.get<Repository<StudentAvatar>>(
      getRepositoryToken(StudentAvatar),
    );
    outfitRepository = module.get<Repository<AvatarOutfit>>(
      getRepositoryToken(AvatarOutfit),
    );
    cosmeticRepository = module.get<Repository<CosmeticItem>>(
      getRepositoryToken(CosmeticItem),
    );
    pointsRepository = module.get<Repository<StudentPoints>>(
      getRepositoryToken(StudentPoints),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrCreateAvatar', () => {
    it('should return existing avatar', async () => {
      mockAvatarRepository.findOne.mockResolvedValue(mockAvatar);

      const result = await service.getOrCreateAvatar('student-1');

      expect(result).toEqual(mockAvatar);
      expect(mockAvatarRepository.findOne).toHaveBeenCalledWith({
        where: { studentId: 'student-1' },
        relations: ['savedOutfits'],
      });
    });

    it('should create new avatar if not exists', async () => {
      mockAvatarRepository.findOne.mockResolvedValue(null);
      mockAvatarRepository.create.mockReturnValue(mockAvatar);
      mockAvatarRepository.save.mockResolvedValue(mockAvatar);
      mockCosmeticRepository.find.mockResolvedValue([]);

      const result = await service.getOrCreateAvatar('student-2');

      expect(mockAvatarRepository.create).toHaveBeenCalledWith({
        studentId: 'student-2',
        style: AvatarStyle.CARTOON,
        components: expect.objectContaining({
          body: 'default-body',
          hair: 'default-hair',
          eyes: 'default-eyes',
          clothes: 'default-clothes',
        }),
        unlockedItems: [],
        interests: [],
      });
      expect(mockAvatarRepository.save).toHaveBeenCalled();
    });

    it('should unlock default items on creation', async () => {
      const defaultItem = { ...mockItem, id: 'default-1', pointCost: 0 };
      mockAvatarRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ ...mockAvatar, unlockedItems: [] });
      mockAvatarRepository.create.mockReturnValue(mockAvatar);
      mockAvatarRepository.save.mockResolvedValue(mockAvatar);
      mockCosmeticRepository.find.mockResolvedValue([defaultItem]);

      await service.getOrCreateAvatar('student-3');

      expect(mockCosmeticRepository.find).toHaveBeenCalledWith({
        where: { pointCost: 0, isActive: true },
      });
    });
  });

  describe('updateAvatar', () => {
    it('should update avatar style', async () => {
      mockAvatarRepository.findOne.mockResolvedValue(mockAvatar);
      mockAvatarRepository.save.mockResolvedValue({
        ...mockAvatar,
        style: AvatarStyle.PIXEL,
      });

      const result = await service.updateAvatar('student-1', {
        style: AvatarStyle.PIXEL,
      });

      expect(result.style).toBe(AvatarStyle.PIXEL);
      expect(mockAvatarRepository.save).toHaveBeenCalled();
    });

    it('should update avatar components', async () => {
      mockAvatarRepository.findOne.mockResolvedValue(mockAvatar);
      mockAvatarRepository.save.mockResolvedValue({
        ...mockAvatar,
        components: { ...mockComponents, hair: 'new-hair' },
      });

      const result = await service.updateAvatar('student-1', {
        components: { hair: 'new-hair' },
      });

      expect(result.components.hair).toBe('new-hair');
    });

    it('should update interests and pronouns', async () => {
      mockAvatarRepository.findOne.mockResolvedValue(mockAvatar);
      mockAvatarRepository.save.mockResolvedValue({
        ...mockAvatar,
        interests: ['coding', 'music'],
        pronouns: 'they/them',
      });

      const result = await service.updateAvatar('student-1', {
        interests: ['coding', 'music'],
        pronouns: 'they/them',
      });

      expect(result.interests).toEqual(['coding', 'music']);
      expect(result.pronouns).toBe('they/them');
    });
  });

  describe('unlockItem', () => {
    it('should unlock free item', async () => {
      const freeItem = { ...mockItem, id: 'free-item-1', pointCost: 0 };
      mockAvatarRepository.findOne.mockResolvedValue(mockAvatar);
      mockCosmeticRepository.findOne.mockResolvedValue(freeItem);
      mockAvatarRepository.save.mockResolvedValue({
        ...mockAvatar,
        unlockedItems: [...mockAvatar.unlockedItems, freeItem.id],
      });

      const result = await service.unlockItem('student-1', freeItem.id);

      expect(result.unlockedItems).toContain(freeItem.id);
    });

    it('should unlock paid item and deduct points', async () => {
      mockAvatarRepository.findOne.mockResolvedValue(mockAvatar);
      mockCosmeticRepository.findOne.mockResolvedValue(mockItem);
      mockPointsRepository.findOne.mockResolvedValue(mockPoints);
      mockPointsRepository.save.mockResolvedValue({
        ...mockPoints,
        totalPoints: 400,
      });
      mockAvatarRepository.save.mockResolvedValue({
        ...mockAvatar,
        unlockedItems: [...mockAvatar.unlockedItems, mockItem.id],
      });

      const result = await service.unlockItem('student-1', mockItem.id);

      expect(result.unlockedItems).toContain(mockItem.id);
      expect(mockPointsRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          totalPoints: 400,
        }),
      );
    });

    it('should throw if item not found', async () => {
      mockAvatarRepository.findOne.mockResolvedValue(mockAvatar);
      mockCosmeticRepository.findOne.mockResolvedValue(null);

      await expect(
        service.unlockItem('student-1', 'non-existent'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw if item already unlocked', async () => {
      mockAvatarRepository.findOne.mockResolvedValue(mockAvatar);
      mockCosmeticRepository.findOne.mockResolvedValue({
        ...mockItem,
        id: 'item-1',
      });

      await expect(service.unlockItem('student-1', 'item-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if insufficient points', async () => {
      mockAvatarRepository.findOne.mockResolvedValue(mockAvatar);
      mockCosmeticRepository.findOne.mockResolvedValue(mockItem);
      mockPointsRepository.findOne.mockResolvedValue({
        ...mockPoints,
        totalPoints: 50,
      });

      await expect(service.unlockItem('student-1', mockItem.id)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('saveOutfit', () => {
    it('should save new outfit', async () => {
      mockAvatarRepository.findOne.mockResolvedValue(mockAvatar);
      mockOutfitRepository.findOne.mockResolvedValue(null);
      mockOutfitRepository.create.mockReturnValue(mockOutfit);
      mockOutfitRepository.save.mockResolvedValue(mockOutfit);

      const dto = {
        name: 'My Favorite',
        components: mockComponents,
      };

      const result = await service.saveOutfit('student-1', dto);

      expect(result).toEqual(mockOutfit);
      expect(mockOutfitRepository.create).toHaveBeenCalledWith({
        avatarId: mockAvatar.id,
        name: dto.name,
        components: dto.components,
      });
    });

    it('should throw if outfit name exists', async () => {
      mockAvatarRepository.findOne.mockResolvedValue(mockAvatar);
      mockOutfitRepository.findOne.mockResolvedValue(mockOutfit);

      const dto = {
        name: 'My Favorite',
        components: mockComponents,
      };

      await expect(service.saveOutfit('student-1', dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('loadOutfit', () => {
    it('should load outfit and update avatar', async () => {
      mockAvatarRepository.findOne.mockResolvedValue(mockAvatar);
      mockOutfitRepository.findOne.mockResolvedValue(mockOutfit);
      mockAvatarRepository.save.mockResolvedValue({
        ...mockAvatar,
        components: mockOutfit.components,
      });

      const result = await service.loadOutfit('student-1', 'outfit-1');

      expect(result.components).toEqual(mockOutfit.components);
      expect(mockAvatarRepository.save).toHaveBeenCalled();
    });

    it('should throw if outfit not found', async () => {
      mockAvatarRepository.findOne.mockResolvedValue(mockAvatar);
      mockOutfitRepository.findOne.mockResolvedValue(null);

      await expect(
        service.loadOutfit('student-1', 'non-existent'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteOutfit', () => {
    it('should delete outfit', async () => {
      mockAvatarRepository.findOne.mockResolvedValue(mockAvatar);
      mockOutfitRepository.findOne.mockResolvedValue(mockOutfit);
      mockOutfitRepository.remove.mockResolvedValue(mockOutfit);

      await service.deleteOutfit('student-1', 'outfit-1');

      expect(mockOutfitRepository.remove).toHaveBeenCalledWith(mockOutfit);
    });

    it('should throw if outfit not found', async () => {
      mockAvatarRepository.findOne.mockResolvedValue(mockAvatar);
      mockOutfitRepository.findOne.mockResolvedValue(null);

      await expect(
        service.deleteOutfit('student-1', 'non-existent'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAvailableItems', () => {
    it('should return unlocked and locked items', async () => {
      const item1 = { ...mockItem, id: 'item-1' };
      const item2 = { ...mockItem, id: 'item-2' };
      const item3 = { ...mockItem, id: 'item-3' };

      mockAvatarRepository.findOne.mockResolvedValue({
        ...mockAvatar,
        unlockedItems: ['item-1', 'item-2'],
      });
      mockCosmeticRepository.find.mockResolvedValue([item1, item2, item3]);

      const result = await service.getAvailableItems('student-1');

      expect(result.unlocked).toHaveLength(2);
      expect(result.locked).toHaveLength(1);
      expect(result.unlocked.map((i) => i.id)).toContain('item-1');
      expect(result.locked.map((i) => i.id)).toContain('item-3');
    });
  });

  describe('getItemsByCategory', () => {
    it('should return items by category', async () => {
      const items = [
        { ...mockItem, category: ItemCategory.HAIR },
        { ...mockItem, id: 'item-4', category: ItemCategory.HAIR },
      ];

      mockCosmeticRepository.find.mockResolvedValue(items);

      const result = await service.getItemsByCategory(ItemCategory.HAIR);

      expect(result).toHaveLength(2);
      expect(mockCosmeticRepository.find).toHaveBeenCalledWith({
        where: { category: ItemCategory.HAIR, isActive: true },
        order: { rarity: 'ASC', pointCost: 'ASC' },
      });
    });
  });
});
