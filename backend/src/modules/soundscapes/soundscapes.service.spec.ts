import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SoundscapesService } from './soundscapes.service';
import { Soundscape, SoundscapeType } from './entities/soundscape.entity';
import { StudentSoundPreference } from './entities/student-sound-preference.entity';
import { NotFoundException } from '@nestjs/common';

describe('SoundscapesService', () => {
  let service: SoundscapesService;
  let soundscapeRepository: Repository<Soundscape>;
  let preferenceRepository: Repository<StudentSoundPreference>;

  const mockSoundscape: any = {
    id: 'soundscape-1',
    name: 'Rain Sounds',
    description: 'Gentle rain',
    type: SoundscapeType.NATURE,
    audioUrl: 'https://example.com/rain.mp3',
    duration: 0,
    focusBoost: 4,
    calmingEffect: 5,
    recommendedFor: ['ADHD', 'ANXIETY'],
    tags: ['rain', 'calm'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPreference: any = {
    id: 'pref-1',
    studentId: 'student-1',
    favoriteSoundscapes: ['soundscape-1'],
    effectivenessRatings: [],
    autoPlayEnabled: false,
    defaultVolume: 70,
    lastPlayedSoundscapeId: null,
    lastPlayedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSoundscapeRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockPreferenceRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SoundscapesService,
        {
          provide: getRepositoryToken(Soundscape),
          useValue: mockSoundscapeRepository,
        },
        {
          provide: getRepositoryToken(StudentSoundPreference),
          useValue: mockPreferenceRepository,
        },
      ],
    }).compile();

    service = module.get<SoundscapesService>(SoundscapesService);
    soundscapeRepository = module.get<Repository<Soundscape>>(
      getRepositoryToken(Soundscape),
    );
    preferenceRepository = module.get<Repository<StudentSoundPreference>>(
      getRepositoryToken(StudentSoundPreference),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllSoundscapes', () => {
    it('should return all active soundscapes', async () => {
      mockSoundscapeRepository.find.mockResolvedValue([mockSoundscape]);

      const result = await service.getAllSoundscapes();

      expect(result).toEqual([mockSoundscape]);
      expect(mockSoundscapeRepository.find).toHaveBeenCalledWith({
        where: { isActive: true },
        order: { name: 'ASC' },
      });
    });
  });

  describe('getSoundscapesByType', () => {
    it('should return soundscapes by type', async () => {
      mockSoundscapeRepository.find.mockResolvedValue([mockSoundscape]);

      const result = await service.getSoundscapesByType(SoundscapeType.NATURE);

      expect(result).toEqual([mockSoundscape]);
      expect(mockSoundscapeRepository.find).toHaveBeenCalledWith({
        where: { type: SoundscapeType.NATURE, isActive: true },
        order: { name: 'ASC' },
      });
    });
  });

  describe('getSoundscape', () => {
    it('should return a soundscape by id', async () => {
      mockSoundscapeRepository.findOne.mockResolvedValue(mockSoundscape);

      const result = await service.getSoundscape('soundscape-1');

      expect(result).toEqual(mockSoundscape);
    });

    it('should throw if soundscape not found', async () => {
      mockSoundscapeRepository.findOne.mockResolvedValue(null);

      await expect(service.getSoundscape('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getRecommendedSoundscapes', () => {
    it('should return soundscapes recommended for conditions', async () => {
      mockSoundscapeRepository.find.mockResolvedValue([mockSoundscape]);

      const result = await service.getRecommendedSoundscapes(['ADHD']);

      expect(result).toHaveLength(1);
      expect(result[0].recommendedFor).toContain('ADHD');
    });

    it('should return empty array if no matches', async () => {
      mockSoundscapeRepository.find.mockResolvedValue([mockSoundscape]);

      const result = await service.getRecommendedSoundscapes(['DYSLEXIA']);

      expect(result).toHaveLength(0);
    });
  });

  describe('getOrCreatePreferences', () => {
    it('should return existing preferences', async () => {
      mockPreferenceRepository.findOne.mockResolvedValue(mockPreference);

      const result = await service.getOrCreatePreferences('student-1');

      expect(result).toEqual(mockPreference);
    });

    it('should create new preferences if not exist', async () => {
      mockPreferenceRepository.findOne.mockResolvedValue(null);
      mockPreferenceRepository.create.mockReturnValue(mockPreference);
      mockPreferenceRepository.save.mockResolvedValue(mockPreference);

      const result = await service.getOrCreatePreferences('student-2');

      expect(mockPreferenceRepository.create).toHaveBeenCalled();
      expect(result).toEqual(mockPreference);
    });
  });

  describe('updatePreferences', () => {
    it('should update preferences', async () => {
      mockPreferenceRepository.findOne.mockResolvedValue(mockPreference);
      mockPreferenceRepository.save.mockResolvedValue({
        ...mockPreference,
        defaultVolume: 80,
        autoPlayEnabled: true,
      });

      const dto = {
        defaultVolume: 80,
        autoPlayEnabled: true,
      };

      const result = await service.updatePreferences('student-1', dto);

      expect(result.defaultVolume).toBe(80);
      expect(result.autoPlayEnabled).toBe(true);
    });
  });

  describe('addToFavorites', () => {
    it('should add soundscape to favorites', async () => {
      mockPreferenceRepository.findOne.mockResolvedValue({
        ...mockPreference,
        favoriteSoundscapes: [],
      });
      mockSoundscapeRepository.findOne.mockResolvedValue(mockSoundscape);
      mockPreferenceRepository.save.mockResolvedValue({
        ...mockPreference,
        favoriteSoundscapes: ['soundscape-2'],
      });

      const result = await service.addToFavorites('student-1', 'soundscape-2');

      expect(result.favoriteSoundscapes).toContain('soundscape-2');
    });

    it('should not duplicate if already in favorites', async () => {
      mockPreferenceRepository.findOne.mockResolvedValue(mockPreference);
      mockSoundscapeRepository.findOne.mockResolvedValue(mockSoundscape);

      const result = await service.addToFavorites('student-1', 'soundscape-1');

      expect(mockPreferenceRepository.save).not.toHaveBeenCalled();
      expect(result.favoriteSoundscapes).toEqual(['soundscape-1']);
    });
  });

  describe('removeFromFavorites', () => {
    it('should remove soundscape from favorites', async () => {
      mockPreferenceRepository.findOne.mockResolvedValue(mockPreference);
      mockPreferenceRepository.save.mockResolvedValue({
        ...mockPreference,
        favoriteSoundscapes: [],
      });

      const result = await service.removeFromFavorites(
        'student-1',
        'soundscape-1',
      );

      expect(result.favoriteSoundscapes).not.toContain('soundscape-1');
    });
  });

  describe('trackPlayback', () => {
    it('should track playback and update effectiveness', async () => {
      mockPreferenceRepository.findOne.mockResolvedValue(mockPreference);
      mockPreferenceRepository.save.mockResolvedValue({
        ...mockPreference,
        lastPlayedSoundscapeId: 'soundscape-1',
        effectivenessRatings: [
          {
            soundscapeId: 'soundscape-1',
            rating: 0,
            timesPlayed: 1,
            totalFocusMinutes: 30,
          },
        ],
      });

      await service.trackPlayback('student-1', 'soundscape-1', 30);

      expect(mockPreferenceRepository.save).toHaveBeenCalled();
    });
  });

  describe('rateSoundscape', () => {
    it('should rate a soundscape', async () => {
      mockPreferenceRepository.findOne.mockResolvedValue(mockPreference);
      mockPreferenceRepository.save.mockResolvedValue({
        ...mockPreference,
        effectivenessRatings: [
          {
            soundscapeId: 'soundscape-1',
            rating: 5,
            timesPlayed: 0,
            totalFocusMinutes: 0,
          },
        ],
      });

      const result = await service.rateSoundscape('student-1', 'soundscape-1', 5);

      expect(result.effectivenessRatings[0].rating).toBe(5);
    });
  });

  describe('getPersonalizedRecommendations', () => {
    it('should return personalized recommendations', async () => {
      const mockPrefWithRatings = {
        ...mockPreference,
        effectivenessRatings: [
          {
            soundscapeId: 'soundscape-1',
            rating: 5,
            timesPlayed: 10,
            totalFocusMinutes: 300,
          },
        ],
      };

      mockPreferenceRepository.findOne.mockResolvedValue(mockPrefWithRatings);
      mockSoundscapeRepository.find.mockResolvedValue([mockSoundscape]);

      const result = await service.getPersonalizedRecommendations('student-1');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('soundscape-1');
    });
  });
});
