import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LearningStyleService } from './learning-style.service';
import {
  LearningStyleProfile,
  LearningStyle,
} from './entities/learning-style-profile.entity';
import {
  StyleEvidence,
  EvidenceType,
} from './entities/style-evidence.entity';

describe('LearningStyleService', () => {
  let service: LearningStyleService;
  let profileRepository: Repository<LearningStyleProfile>;
  let evidenceRepository: Repository<StyleEvidence>;

  const mockProfile: any = {
    id: 'profile-1',
    studentId: 'student-1',
    visualScore: 25,
    auditoryScore: 25,
    kinestheticScore: 25,
    readingWritingScore: 25,
    primaryStyle: LearningStyle.VISUAL,
    secondaryStyle: LearningStyle.AUDITORY,
    confidence: 0,
    evidence: [],
    createdAt: new Date(),
    lastUpdated: new Date(),
  };

  const mockEvidence: any = {
    id: 'evidence-1',
    profileId: 'profile-1',
    evidenceType: EvidenceType.CONTENT_INTERACTION,
    dataPoint: { contentType: 'video', duration: 300 },
    weight: 1.0,
    recordedAt: new Date(),
  };

  const mockProfileRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockEvidenceRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LearningStyleService,
        {
          provide: getRepositoryToken(LearningStyleProfile),
          useValue: mockProfileRepository,
        },
        {
          provide: getRepositoryToken(StyleEvidence),
          useValue: mockEvidenceRepository,
        },
      ],
    }).compile();

    service = module.get<LearningStyleService>(LearningStyleService);
    profileRepository = module.get<Repository<LearningStyleProfile>>(
      getRepositoryToken(LearningStyleProfile),
    );
    evidenceRepository = module.get<Repository<StyleEvidence>>(
      getRepositoryToken(StyleEvidence),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrCreateProfile', () => {
    it('should return existing profile', async () => {
      mockProfileRepository.findOne.mockResolvedValue(mockProfile);

      const result = await service.getOrCreateProfile('student-1');

      expect(result).toEqual(mockProfile);
      expect(mockProfileRepository.findOne).toHaveBeenCalledWith({
        where: { studentId: 'student-1' },
        relations: ['evidence'],
      });
    });

    it('should create new profile if not exists', async () => {
      mockProfileRepository.findOne.mockResolvedValue(null);
      mockProfileRepository.create.mockReturnValue(mockProfile);
      mockProfileRepository.save.mockResolvedValue(mockProfile);

      const result = await service.getOrCreateProfile('student-2');

      expect(mockProfileRepository.create).toHaveBeenCalledWith({
        studentId: 'student-2',
        visualScore: 25,
        auditoryScore: 25,
        kinestheticScore: 25,
        readingWritingScore: 25,
        primaryStyle: LearningStyle.VISUAL,
        confidence: 0,
      });
      expect(mockProfileRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockProfile);
    });
  });

  describe('recordEvidence', () => {
    it('should record evidence and update profile', async () => {
      const dto = {
        evidenceType: EvidenceType.CONTENT_INTERACTION,
        dataPoint: { contentType: 'video', duration: 300 },
        weight: 1.0,
      };

      mockProfileRepository.findOne.mockResolvedValue(mockProfile);
      mockEvidenceRepository.create.mockReturnValue(mockEvidence);
      mockEvidenceRepository.save.mockResolvedValue(mockEvidence);
      mockEvidenceRepository.find.mockResolvedValue([mockEvidence]);
      mockProfileRepository.save.mockResolvedValue(mockProfile);

      const result = await service.recordEvidence('student-1', dto);

      expect(mockEvidenceRepository.create).toHaveBeenCalledWith({
        profileId: mockProfile.id,
        evidenceType: dto.evidenceType,
        dataPoint: dto.dataPoint,
        weight: dto.weight,
      });
      expect(mockEvidenceRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockEvidence);
    });

    it('should use default weight if not provided', async () => {
      const dto = {
        evidenceType: EvidenceType.TIME_SPENT,
        dataPoint: { contentType: 'audio', duration: 600 },
      };

      mockProfileRepository.findOne.mockResolvedValue(mockProfile);
      mockEvidenceRepository.create.mockReturnValue(mockEvidence);
      mockEvidenceRepository.save.mockResolvedValue(mockEvidence);
      mockEvidenceRepository.find.mockResolvedValue([]);
      mockProfileRepository.save.mockResolvedValue(mockProfile);

      await service.recordEvidence('student-1', dto);

      expect(mockEvidenceRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          weight: 1.0,
        }),
      );
    });
  });

  describe('updateProfileScores', () => {
    it('should update profile scores based on evidence', async () => {
      const evidenceList = [
        {
          ...mockEvidence,
          evidenceType: EvidenceType.CONTENT_INTERACTION,
          dataPoint: { contentType: 'video' },
          weight: 1.0,
        },
        {
          ...mockEvidence,
          id: 'evidence-2',
          evidenceType: EvidenceType.CONTENT_INTERACTION,
          dataPoint: { contentType: 'video' },
          weight: 1.0,
        },
        {
          ...mockEvidence,
          id: 'evidence-3',
          evidenceType: EvidenceType.CONTENT_INTERACTION,
          dataPoint: { contentType: 'audio' },
          weight: 1.0,
        },
      ];

      mockProfileRepository.findOne.mockResolvedValue(mockProfile);
      mockEvidenceRepository.find.mockResolvedValue(evidenceList);
      mockProfileRepository.save.mockResolvedValue({
        ...mockProfile,
        visualScore: 100,
        auditoryScore: 50,
        primaryStyle: LearningStyle.VISUAL,
        secondaryStyle: LearningStyle.AUDITORY,
        confidence: expect.any(Number),
      });

      const result = await service.updateProfileScores('profile-1');

      expect(mockEvidenceRepository.find).toHaveBeenCalledWith({
        where: { profileId: 'profile-1' },
        order: { recordedAt: 'DESC' },
        take: 100,
      });
      expect(mockProfileRepository.save).toHaveBeenCalled();
      expect(result.visualScore).toBeGreaterThan(0);
    });

    it('should return profile unchanged if no evidence', async () => {
      mockProfileRepository.findOne.mockResolvedValue(mockProfile);
      mockEvidenceRepository.find.mockResolvedValue([]);

      const result = await service.updateProfileScores('profile-1');

      expect(result).toEqual(mockProfile);
    });

    it('should throw error if profile not found', async () => {
      mockProfileRepository.findOne.mockResolvedValue(null);

      await expect(service.updateProfileScores('non-existent')).rejects.toThrow(
        'Profile not found',
      );
    });

    it('should calculate confidence based on evidence count and score separation', async () => {
      const evidenceList = Array(30).fill({
        ...mockEvidence,
        evidenceType: EvidenceType.CONTENT_INTERACTION,
        dataPoint: { contentType: 'video' },
        weight: 1.0,
      });

      mockProfileRepository.findOne.mockResolvedValue(mockProfile);
      mockEvidenceRepository.find.mockResolvedValue(evidenceList);
      mockProfileRepository.save.mockImplementation((profile) => {
        expect(profile.confidence).toBeGreaterThan(0);
        return Promise.resolve(profile);
      });

      await service.updateProfileScores('profile-1');
    });
  });

  describe('getProfile', () => {
    it('should return profile for student', async () => {
      mockProfileRepository.findOne.mockResolvedValue(mockProfile);

      const result = await service.getProfile('student-1');

      expect(result).toEqual(mockProfile);
    });
  });

  describe('getRecommendations', () => {
    it('should return recommendations for visual learners', async () => {
      mockProfileRepository.findOne.mockResolvedValue({
        ...mockProfile,
        primaryStyle: LearningStyle.VISUAL,
      });

      const result = await service.getRecommendations('student-1');

      expect(result.studyMethods).toContain('Use diagrams and mind maps');
      expect(result.contentFormats).toContain('video');
      expect(result.tipOfTheDay).toBeTruthy();
    });

    it('should return recommendations for auditory learners', async () => {
      mockProfileRepository.findOne.mockResolvedValue({
        ...mockProfile,
        primaryStyle: LearningStyle.AUDITORY,
      });

      const result = await service.getRecommendations('student-1');

      expect(result.studyMethods).toContain('Listen to podcasts or audiobooks');
      expect(result.contentFormats).toContain('audio');
    });

    it('should return recommendations for kinesthetic learners', async () => {
      mockProfileRepository.findOne.mockResolvedValue({
        ...mockProfile,
        primaryStyle: LearningStyle.KINESTHETIC,
      });

      const result = await service.getRecommendations('student-1');

      expect(result.studyMethods).toContain('Use hands-on experiments');
      expect(result.contentFormats).toContain('interactive');
    });

    it('should return recommendations for reading/writing learners', async () => {
      mockProfileRepository.findOne.mockResolvedValue({
        ...mockProfile,
        primaryStyle: LearningStyle.READING_WRITING,
      });

      const result = await service.getRecommendations('student-1');

      expect(result.studyMethods).toContain('Take detailed written notes');
      expect(result.contentFormats).toContain('article');
    });
  });

  describe('getEvidenceHistory', () => {
    it('should return evidence history with default limit', async () => {
      const evidenceList = [mockEvidence];
      mockProfileRepository.findOne.mockResolvedValue(mockProfile);
      mockEvidenceRepository.find.mockResolvedValue(evidenceList);

      const result = await service.getEvidenceHistory('student-1');

      expect(result).toEqual(evidenceList);
      expect(mockEvidenceRepository.find).toHaveBeenCalledWith({
        where: { profileId: mockProfile.id },
        order: { recordedAt: 'DESC' },
        take: 50,
      });
    });

    it('should respect custom limit', async () => {
      mockProfileRepository.findOne.mockResolvedValue(mockProfile);
      mockEvidenceRepository.find.mockResolvedValue([]);

      await service.getEvidenceHistory('student-1', 10);

      expect(mockEvidenceRepository.find).toHaveBeenCalledWith({
        where: { profileId: mockProfile.id },
        order: { recordedAt: 'DESC' },
        take: 10,
      });
    });
  });

  describe('evidence analysis methods', () => {
    it('should analyze performance evidence correctly', async () => {
      const performanceEvidence = [
        {
          ...mockEvidence,
          evidenceType: EvidenceType.PERFORMANCE,
          dataPoint: { contentType: 'video', score: 90 },
          weight: 1.0,
        },
        {
          ...mockEvidence,
          id: 'evidence-2',
          evidenceType: EvidenceType.PERFORMANCE,
          dataPoint: { contentType: 'audio', score: 60 },
          weight: 1.0,
        },
      ];

      mockProfileRepository.findOne.mockResolvedValue(mockProfile);
      mockEvidenceRepository.find.mockResolvedValue(performanceEvidence);
      mockProfileRepository.save.mockImplementation((profile) => {
        // Visual should score higher due to better performance
        expect(profile.visualScore).toBeGreaterThanOrEqual(
          profile.auditoryScore,
        );
        return Promise.resolve(profile);
      });

      await service.updateProfileScores('profile-1');
    });

    it('should handle explicit preferences with higher weight', async () => {
      const explicitPreference = [
        {
          ...mockEvidence,
          evidenceType: EvidenceType.EXPLICIT_PREFERENCE,
          dataPoint: { preference: 'KINESTHETIC' },
          weight: 1.0,
        },
      ];

      mockProfileRepository.findOne.mockResolvedValue(mockProfile);
      mockEvidenceRepository.find.mockResolvedValue(explicitPreference);
      mockProfileRepository.save.mockImplementation((profile) => {
        expect(profile.kinestheticScore).toBeGreaterThan(0);
        return Promise.resolve(profile);
      });

      await service.updateProfileScores('profile-1');
    });
  });
});
