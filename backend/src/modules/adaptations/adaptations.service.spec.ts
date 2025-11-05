import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdaptationsService } from './adaptations.service';
import { TaskAdaptation, AdaptationStatus, TaskSource } from './entities/task-adaptation.entity';

describe('AdaptationsService', () => {
  let service: AdaptationsService;
  let repository: Repository<TaskAdaptation>;

  const mockAdaptation: any = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    studentId: 'student-id-123',
    originalTask: 'Read chapter 5 and answer questions 1-10',
    originalTaskSource: TaskSource.TEXT,
    originalTaskUrl: null,
    adaptedTask: 'Read chapter 5 with visual aids. Answer questions 1-5 with sentence starters.',
    explanation: 'Reduced question count and provided scaffolding for student with dyslexia.',
    status: AdaptationStatus.CONFIRMED,
    subject: 'Reading',
    difficulty: 'MEDIUM',
    createdBy: 'teacher-id-123',
    confirmedBy: 'therapist-id-123',
    confirmedAt: new Date('2025-01-02'),
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-02'),
    student: null,
    refinements: [],
  };

  const mockRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdaptationsService,
        {
          provide: getRepositoryToken(TaskAdaptation),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AdaptationsService>(AdaptationsService);
    repository = module.get<Repository<TaskAdaptation>>(getRepositoryToken(TaskAdaptation));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByStudentId', () => {
    it('should return adaptations for a student ordered by createdAt DESC', async () => {
      const mockAdaptations = [
        mockAdaptation,
        {
          ...mockAdaptation,
          id: 'adaptation-2',
          status: AdaptationStatus.DRAFT,
          createdAt: new Date('2025-01-03'),
        },
      ];
      mockRepository.find.mockResolvedValue(mockAdaptations);

      const result = await service.findByStudentId('student-id-123');

      expect(result).toEqual(mockAdaptations);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { studentId: 'student-id-123' },
        order: { createdAt: 'DESC' },
      });
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when student has no adaptations', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findByStudentId('student-no-adaptations');

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      mockRepository.find.mockRejectedValue(new Error('Database error'));

      await expect(service.findByStudentId('student-id-123')).rejects.toThrow(
        'Database error',
      );
    });

    it('should call repository with correct parameters', async () => {
      mockRepository.find.mockResolvedValue([mockAdaptation]);

      await service.findByStudentId('test-student-id');

      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ studentId: 'test-student-id' }),
          order: expect.objectContaining({ createdAt: 'DESC' }),
        }),
      );
    });

    it('should handle null or undefined student ID', async () => {
      mockRepository.find.mockResolvedValue([]);

      await service.findByStudentId(null as any);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { studentId: null },
        order: { createdAt: 'DESC' },
      });
    });
  });
});
