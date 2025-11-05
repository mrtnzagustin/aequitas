import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoodCheckInsService } from './mood-checkins.service';
import { MoodCheckIn, MoodType } from './entities/mood-checkin.entity';
import { CreateMoodCheckInDto } from './dto/create-mood-checkin.dto';

describe('MoodCheckInsService', () => {
  let service: MoodCheckInsService;
  let repository: Repository<MoodCheckIn>;

  const mockMoodCheckIn: any = {
    id: 'mood-1',
    studentId: 'student-1',
    mood: MoodType.HAPPY,
    intensity: 4,
    note: 'Had a great day!',
    triggers: ['homework', 'social'],
    createdAt: new Date(),
    student: null,
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoodCheckInsService,
        {
          provide: getRepositoryToken(MoodCheckIn),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MoodCheckInsService>(MoodCheckInsService);
    repository = module.get<Repository<MoodCheckIn>>(getRepositoryToken(MoodCheckIn));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a mood check-in', async () => {
      const createDto: CreateMoodCheckInDto = {
        studentId: 'student-1',
        mood: MoodType.HAPPY,
        intensity: 4,
        note: 'Great day!',
        triggers: ['homework'],
      };

      mockRepository.create.mockReturnValue(mockMoodCheckIn);
      mockRepository.save.mockResolvedValue(mockMoodCheckIn);

      const result = await service.create(createDto);

      expect(result).toEqual(mockMoodCheckIn);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('findByStudentId', () => {
    it('should return mood check-ins for a student', async () => {
      mockRepository.find.mockResolvedValue([mockMoodCheckIn]);

      const result = await service.findByStudentId('student-1', 30);

      expect(result).toEqual([mockMoodCheckIn]);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('hasCheckedInToday', () => {
    it('should return true if student has checked in today', async () => {
      mockRepository.count.mockResolvedValue(1);

      const result = await service.hasCheckedInToday('student-1');

      expect(result).toBe(true);
    });

    it('should return false if student has not checked in today', async () => {
      mockRepository.count.mockResolvedValue(0);

      const result = await service.hasCheckedInToday('student-1');

      expect(result).toBe(false);
    });
  });

  describe('getTrends', () => {
    it('should calculate mood trends', async () => {
      const checkIns = [
        { ...mockMoodCheckIn, mood: MoodType.HAPPY, intensity: 4 },
        { ...mockMoodCheckIn, mood: MoodType.OKAY, intensity: 3 },
        { ...mockMoodCheckIn, mood: MoodType.HAPPY, intensity: 5 },
      ];

      mockRepository.find.mockResolvedValue(checkIns);

      const result = await service.getTrends('student-1', 7);

      expect(result).toHaveProperty('moods');
      expect(result).toHaveProperty('averageIntensity');
      expect(result.period).toBe('7d');
      expect(result.alertTriggered).toBe(false);
    });

    it('should detect concerning patterns', async () => {
      const checkIns = [
        { ...mockMoodCheckIn, mood: MoodType.SAD, createdAt: new Date('2025-01-03') },
        { ...mockMoodCheckIn, mood: MoodType.SAD, createdAt: new Date('2025-01-02') },
        { ...mockMoodCheckIn, mood: MoodType.ANXIOUS, createdAt: new Date('2025-01-01') },
      ];

      mockRepository.find.mockResolvedValue(checkIns);

      const result = await service.getTrends('student-1', 7);

      expect(result.alertTriggered).toBe(true);
      expect(result.concerningPatternDays).toBeGreaterThanOrEqual(3);
    });
  });
});
