import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentsService } from './students.service';
import { Student, StudentStatus } from './entities/student.entity';

describe('StudentsService', () => {
  let service: StudentsService;
  let repository: Repository<Student>;

  const mockStudent: Student = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    firstName: 'Maria',
    lastName: 'Garcia',
    dateOfBirth: new Date('2010-05-15'),
    condition: 'Dyslexia',
    interests: ['reading', 'music'],
    learningPreferences: ['visual', 'hands-on'],
    photoUrl: 'https://example.com/photo.jpg',
    status: StudentStatus.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-01-01'),
    createdBy: 'therapist-id',
    assignments: [],
    notes: [],
    adaptations: [],
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: getRepositoryToken(Student),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
    repository = module.get<Repository<Student>>(getRepositoryToken(Student));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of students', async () => {
      const mockStudents = [mockStudent, { ...mockStudent, id: 'another-id' }];
      mockRepository.find.mockResolvedValue(mockStudents);

      const result = await service.findAll();

      expect(result).toEqual(mockStudents);
      expect(mockRepository.find).toHaveBeenCalledWith();
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no students exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      mockRepository.find.mockRejectedValue(new Error('Database error'));

      await expect(service.findAll()).rejects.toThrow('Database error');
    });
  });

  describe('findById', () => {
    it('should return student when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockStudent);

      const result = await service.findById(mockStudent.id);

      expect(result).toEqual(mockStudent);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockStudent.id },
      });
    });

    it('should return null when student not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findById('non-existent-id');

      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      mockRepository.findOne.mockRejectedValue(new Error('Query failed'));

      await expect(service.findById(mockStudent.id)).rejects.toThrow('Query failed');
    });
  });
});
