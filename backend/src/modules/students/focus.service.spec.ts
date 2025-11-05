import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FocusService } from './focus.service';
import { FocusSession } from './entities/focus-session.entity';
import { DistractionEvent, DistractionType } from './entities/distraction-event.entity';
import { NotFoundException } from '@nestjs/common';

describe('FocusService', () => {
  let service: FocusService;
  let sessionRepository: Repository<FocusSession>;
  let distractionRepository: Repository<DistractionEvent>;

  const mockSessionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  const mockDistractionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FocusService,
        {
          provide: getRepositoryToken(FocusSession),
          useValue: mockSessionRepository,
        },
        {
          provide: getRepositoryToken(DistractionEvent),
          useValue: mockDistractionRepository,
        },
      ],
    }).compile();

    service = module.get<FocusService>(FocusService);
    sessionRepository = module.get<Repository<FocusSession>>(
      getRepositoryToken(FocusSession),
    );
    distractionRepository = module.get<Repository<DistractionEvent>>(
      getRepositoryToken(DistractionEvent),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('startSession', () => {
    it('should create and save a new focus session', async () => {
      const createDto = {
        studentId: 'student-123',
        plannedDuration: 25,
        environmentSettings: {
          timerDuration: 25,
          strictMode: true,
        },
      };

      const savedSession = {
        id: 'session-123',
        ...createDto,
        distractionsCount: 0,
        actualDuration: 0,
        focusScore: 0,
        completedSuccessfully: false,
        startedAt: new Date(),
      };

      mockSessionRepository.create.mockReturnValue(savedSession);
      mockSessionRepository.save.mockResolvedValue(savedSession);

      const result = await service.startSession(createDto);

      expect(mockSessionRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockSessionRepository.save).toHaveBeenCalledWith(savedSession);
      expect(result).toEqual(savedSession);
    });
  });

  describe('endSession', () => {
    it('should end a session successfully', async () => {
      const sessionId = 'session-123';
      const endDto = {
        completedSuccessfully: true,
        actualDuration: 25,
        focusScore: 85,
      };

      const existingSession = {
        id: sessionId,
        studentId: 'student-123',
        plannedDuration: 25,
        distractionsCount: 2,
        startedAt: new Date(),
      };

      const updatedSession = {
        ...existingSession,
        ...endDto,
        endedAt: expect.any(Date),
      };

      mockSessionRepository.findOne.mockResolvedValue(existingSession);
      mockSessionRepository.save.mockResolvedValue(updatedSession);

      const result = await service.endSession(sessionId, endDto);

      expect(mockSessionRepository.findOne).toHaveBeenCalledWith({
        where: { id: sessionId },
      });
      expect(result.completedSuccessfully).toBe(true);
      expect(result.actualDuration).toBe(25);
      expect(result.focusScore).toBe(85);
      expect(result.endedAt).toBeDefined();
    });

    it('should throw NotFoundException if session not found', async () => {
      const sessionId = 'non-existent';
      const endDto = {
        completedSuccessfully: true,
        actualDuration: 25,
        focusScore: 85,
      };

      mockSessionRepository.findOne.mockResolvedValue(null);

      await expect(service.endSession(sessionId, endDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('recordDistraction', () => {
    it('should record a distraction and increment count', async () => {
      const sessionId = 'session-123';
      const distractionDto = {
        type: DistractionType.TAB_SWITCH,
        duration: 30,
      };

      const session = {
        id: sessionId,
        studentId: 'student-123',
        distractionsCount: 1,
        plannedDuration: 25,
      };

      const distraction = {
        id: 'distraction-123',
        sessionId,
        ...distractionDto,
        timestamp: new Date(),
      };

      mockSessionRepository.findOne.mockResolvedValue(session);
      mockDistractionRepository.create.mockReturnValue(distraction);
      mockDistractionRepository.save.mockResolvedValue(distraction);
      mockSessionRepository.save.mockResolvedValue({
        ...session,
        distractionsCount: 2,
      });

      const result = await service.recordDistraction(sessionId, distractionDto);

      expect(mockDistractionRepository.create).toHaveBeenCalledWith({
        sessionId,
        type: distractionDto.type,
        duration: distractionDto.duration,
      });
      expect(mockDistractionRepository.save).toHaveBeenCalledWith(distraction);
      expect(mockSessionRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ distractionsCount: 2 }),
      );
      expect(result).toEqual(distraction);
    });

    it('should throw NotFoundException if session not found', async () => {
      mockSessionRepository.findOne.mockResolvedValue(null);

      await expect(
        service.recordDistraction('non-existent', {
          type: DistractionType.TAB_SWITCH,
          duration: 30,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStudentSessions', () => {
    it('should return student sessions', async () => {
      const studentId = 'student-123';
      const sessions = [
        { id: 'session-1', studentId, plannedDuration: 25 },
        { id: 'session-2', studentId, plannedDuration: 30 },
      ];

      mockSessionRepository.find.mockResolvedValue(sessions);

      const result = await service.getStudentSessions(studentId);

      expect(mockSessionRepository.find).toHaveBeenCalledWith({
        where: { studentId },
        order: { startedAt: 'DESC' },
        take: 20,
      });
      expect(result).toEqual(sessions);
    });

    it('should respect custom limit', async () => {
      const studentId = 'student-123';
      const limit = 5;

      mockSessionRepository.find.mockResolvedValue([]);

      await service.getStudentSessions(studentId, limit);

      expect(mockSessionRepository.find).toHaveBeenCalledWith({
        where: { studentId },
        order: { startedAt: 'DESC' },
        take: limit,
      });
    });
  });

  describe('getStudentFocusPatterns', () => {
    it('should calculate focus patterns correctly', async () => {
      const studentId = 'student-123';
      const sessions = [
        {
          id: 'session-1',
          studentId,
          actualDuration: 25,
          distractionsCount: 2,
          completedSuccessfully: true,
          focusScore: 80,
          startedAt: new Date('2025-11-05T10:00:00'),
        },
        {
          id: 'session-2',
          studentId,
          actualDuration: 30,
          distractionsCount: 1,
          completedSuccessfully: true,
          focusScore: 90,
          startedAt: new Date('2025-11-05T10:30:00'),
        },
        {
          id: 'session-3',
          studentId,
          actualDuration: 20,
          distractionsCount: 5,
          completedSuccessfully: false,
          focusScore: 60,
          startedAt: new Date('2025-11-05T15:00:00'),
        },
      ];

      mockSessionRepository.find.mockResolvedValue(sessions);

      const result = await service.getStudentFocusPatterns(studentId);

      expect(result.totalSessions).toBe(3);
      expect(result.averageSessionLength).toBe(25); // (25+30+20)/3 = 25
      expect(result.averageDistractions).toBe(2.7); // (2+1+5)/3 ≈ 2.7
      expect(result.completionRate).toBe(67); // 2/3 * 100 ≈ 67
      expect(result.averageFocusScore).toBe(77); // (80+90+60)/3 ≈ 77
      expect(result.optimalTimeOfDay).toBe('morning'); // Most sessions at 10am
    });

    it('should handle no sessions gracefully', async () => {
      const studentId = 'student-123';

      mockSessionRepository.find.mockResolvedValue([]);

      const result = await service.getStudentFocusPatterns(studentId);

      expect(result).toEqual({
        averageSessionLength: 0,
        averageDistractions: 0,
        completionRate: 0,
        averageFocusScore: 0,
        totalSessions: 0,
      });
    });
  });
});
