import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessibilityService } from './accessibility.service';
import { AccessibilityProfile, AccessibilityFont } from './entities/accessibility-profile.entity';
import { NotFoundException } from '@nestjs/common';

describe('AccessibilityService', () => {
  let service: AccessibilityService;
  let repository: Repository<AccessibilityProfile>;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessibilityService,
        {
          provide: getRepositoryToken(AccessibilityProfile),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AccessibilityService>(AccessibilityService);
    repository = module.get<Repository<AccessibilityProfile>>(
      getRepositoryToken(AccessibilityProfile),
    );

    // Clear mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return existing profile', async () => {
      const userId = 'user-123';
      const existingProfile = {
        id: 'profile-123',
        userId,
        font: AccessibilityFont.DEFAULT,
        fontSize: 100,
        lineSpacing: 100,
        backgroundColor: '#ffffff',
        highContrast: false,
        textToSpeechEnabled: false,
        speechRate: 1.0,
        magnifierEnabled: false,
        magnification: 1.0,
        focusModeEnabled: false,
        readingRulerEnabled: false,
        reduceAnimations: false,
        preferredVoice: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(existingProfile);

      const result = await service.getProfile(userId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(result).toEqual(existingProfile);
    });

    it('should create default profile if not exists', async () => {
      const userId = 'user-123';
      const newProfile = {
        userId,
        font: AccessibilityFont.DEFAULT,
        fontSize: 100,
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(newProfile);
      mockRepository.save.mockResolvedValue(newProfile);

      const result = await service.getProfile(userId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(mockRepository.create).toHaveBeenCalledWith({ userId });
      expect(mockRepository.save).toHaveBeenCalledWith(newProfile);
      expect(result).toEqual(newProfile);
    });
  });

  describe('updateProfile', () => {
    it('should update existing profile', async () => {
      const userId = 'user-123';
      const existingProfile = {
        id: 'profile-123',
        userId,
        font: AccessibilityFont.DEFAULT,
        fontSize: 100,
      };
      const updateDto = {
        font: AccessibilityFont.OPENDYSLEXIC,
        fontSize: 120,
        lineSpacing: 150,
      };
      const updatedProfile = { ...existingProfile, ...updateDto };

      mockRepository.findOne.mockResolvedValue(existingProfile);
      mockRepository.save.mockResolvedValue(updatedProfile);

      const result = await service.updateProfile(userId, updateDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateDto),
      );
      expect(result).toEqual(updatedProfile);
    });

    it('should create new profile if not exists', async () => {
      const userId = 'user-123';
      const updateDto = {
        font: AccessibilityFont.OPENDYSLEXIC,
        fontSize: 120,
      };
      const newProfile = { userId, ...updateDto };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(newProfile);
      mockRepository.save.mockResolvedValue(newProfile);

      const result = await service.updateProfile(userId, updateDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(mockRepository.create).toHaveBeenCalledWith({
        userId,
        ...updateDto,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(newProfile);
      expect(result).toEqual(newProfile);
    });
  });

  describe('resetProfile', () => {
    it('should reset profile to defaults', async () => {
      const userId = 'user-123';
      const existingProfile = {
        id: 'profile-123',
        userId,
        font: AccessibilityFont.OPENDYSLEXIC,
        fontSize: 150,
        highContrast: true,
      };
      const resetProfile = {
        id: 'profile-123',
        userId,
        font: AccessibilityFont.DEFAULT,
        fontSize: 100,
      };

      mockRepository.findOne.mockResolvedValue(existingProfile);
      mockRepository.create.mockReturnValue(resetProfile);
      mockRepository.save.mockResolvedValue(resetProfile);

      const result = await service.resetProfile(userId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(mockRepository.create).toHaveBeenCalledWith({
        id: existingProfile.id,
        userId: existingProfile.userId,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(resetProfile);
      expect(result).toEqual(resetProfile);
    });

    it('should throw NotFoundException if profile does not exist', async () => {
      const userId = 'user-123';

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.resetProfile(userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { userId },
      });
    });
  });

  describe('getSuggestedSettings', () => {
    it('should return dyslexia settings', async () => {
      const result = await service.getSuggestedSettings('DYSLEXIA');

      expect(result).toEqual({
        font: AccessibilityFont.OPENDYSLEXIC,
        fontSize: 120,
        lineSpacing: 150,
        backgroundColor: '#fefae0',
        textToSpeechEnabled: true,
        speechRate: 0.9,
        reduceAnimations: true,
      });
    });

    it('should return ADHD settings', async () => {
      const result = await service.getSuggestedSettings('ADHD');

      expect(result).toEqual({
        fontSize: 110,
        lineSpacing: 130,
        focusModeEnabled: true,
        reduceAnimations: true,
        highContrast: false,
      });
    });

    it('should return visual impairment settings', async () => {
      const result = await service.getSuggestedSettings('VISUAL_IMPAIRMENT');

      expect(result).toEqual({
        fontSize: 150,
        lineSpacing: 180,
        highContrast: true,
        textToSpeechEnabled: true,
        magnifierEnabled: true,
        magnification: 2.0,
      });
    });

    it('should return autism settings', async () => {
      const result = await service.getSuggestedSettings('AUTISM');

      expect(result).toEqual({
        reduceAnimations: true,
        focusModeEnabled: true,
        backgroundColor: '#f0f0f0',
      });
    });

    it('should return empty object for unknown condition', async () => {
      const result = await service.getSuggestedSettings('UNKNOWN_CONDITION');

      expect(result).toEqual({});
    });

    it('should be case-insensitive', async () => {
      const result = await service.getSuggestedSettings('dyslexia');

      expect(result).toEqual({
        font: AccessibilityFont.OPENDYSLEXIC,
        fontSize: 120,
        lineSpacing: 150,
        backgroundColor: '#fefae0',
        textToSpeechEnabled: true,
        speechRate: 0.9,
        reduceAnimations: true,
      });
    });
  });
});
