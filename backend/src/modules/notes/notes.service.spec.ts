import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotesService } from './notes.service';
import { Note, NoteType, NoteVisibility } from './entities/note.entity';

describe('NotesService', () => {
  let service: NotesService;
  let repository: Repository<Note>;

  const mockNote: Note = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    studentId: 'student-id-123',
    authorId: 'therapist-id-123',
    type: NoteType.THERAPEUTIC,
    content: '<p>Student showed progress in reading comprehension.</p>',
    tags: ['reading', 'progress'],
    grade: null,
    visibility: NoteVisibility.THERAPIST_ONLY,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    student: null,
    author: null,
  };

  const mockRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getRepositoryToken(Note),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    repository = module.get<Repository<Note>>(getRepositoryToken(Note));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByStudentId', () => {
    it('should return notes for a student ordered by createdAt DESC', async () => {
      const mockNotes = [
        mockNote,
        {
          ...mockNote,
          id: 'note-2',
          type: NoteType.ACADEMIC,
          createdAt: new Date('2025-01-02'),
        },
      ];
      mockRepository.find.mockResolvedValue(mockNotes);

      const result = await service.findByStudentId('student-id-123');

      expect(result).toEqual(mockNotes);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { studentId: 'student-id-123' },
        order: { createdAt: 'DESC' },
      });
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when student has no notes', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findByStudentId('student-no-notes');

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      mockRepository.find.mockRejectedValue(new Error('Database error'));

      await expect(service.findByStudentId('student-id-123')).rejects.toThrow(
        'Database error',
      );
    });

    it('should call repository with correct parameters', async () => {
      mockRepository.find.mockResolvedValue([mockNote]);

      await service.findByStudentId('test-student-id');

      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ studentId: 'test-student-id' }),
          order: expect.objectContaining({ createdAt: 'DESC' }),
        }),
      );
    });
  });
});
