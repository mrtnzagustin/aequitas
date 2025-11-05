import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BiometricTrackerService } from './biometric-tracker.service';
import { FocusSession } from './entities/focus-session.entity';
import { FocusMetric, GazeDirection, HeadPose, EmotionDetected } from './entities/focus-metric.entity';
import { StudentFocusPattern } from './entities/student-focus-pattern.entity';
import { NotFoundException } from '@nestjs/common';

describe('BiometricTrackerService', () => {
  let service: BiometricTrackerService;
  let sessionRepository: Repository<FocusSession>;
  let metricRepository: Repository<FocusMetric>;
  let patternRepository: Repository<StudentFocusPattern>;

  const mockSessionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockMetricRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockPatternRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BiometricTrackerService,
        {
          provide: getRepositoryToken(FocusSession),
          useValue: mockSessionRepository,
        },
        {
          provide: getRepositoryToken(FocusMetric),
          useValue: mockMetricRepository,
        },
        {
          provide: getRepositoryToken(StudentFocusPattern),
          useValue: mockPatternRepository,
        },
      ],
    }).compile();

    service = module.get<BiometricTrackerService>(BiometricTrackerService);
    sessionRepository = module.get(getRepositoryToken(FocusSession));
    metricRepository = module.get(getRepositoryToken(FocusMetric));
    patternRepository = module.get(getRepositoryToken(StudentFocusPattern));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('startSession', () => {
    it('should create a new focus session', async () => {
      const dto = { studentId: 'student-1', taskId: 'task-1' };
      const mockSession = { id: 'session-1', ...dto, startedAt: new Date() };

      mockSessionRepository.create.mockReturnValue(mockSession);
      mockSessionRepository.save.mockResolvedValue(mockSession);

      const result = await service.startSession(dto);

      expect(result).toEqual(mockSession);
      expect(sessionRepository.create).toHaveBeenCalled();
      expect(sessionRepository.save).toHaveBeenCalled();
    });
  });

  describe('endSession', () => {
    it('should end a session and calculate metrics', async () => {
      const mockSession: any = {
        id: 'session-1',
        studentId: 'student-1',
        startedAt: new Date(Date.now() - 1800000), // 30 min ago
      };

      const mockMetrics = [
        { focusScore: 80, timestamp: new Date() },
        { focusScore: 70, timestamp: new Date() },
        { focusScore: 30, timestamp: new Date() },
      ];

      mockSessionRepository.findOne.mockResolvedValue(mockSession);
      mockMetricRepository.find.mockResolvedValue(mockMetrics);
      mockSessionRepository.save.mockResolvedValue(mockSession);
      mockSessionRepository.find.mockResolvedValue([mockSession]);
      mockPatternRepository.findOne.mockResolvedValue(null);
      mockPatternRepository.create.mockReturnValue({ studentId: 'student-1' });
      mockPatternRepository.save.mockResolvedValue({});

      const result = await service.endSession('session-1');

      expect(result.endedAt).toBeDefined();
      expect(result.totalDuration).toBeGreaterThan(0);
      expect(result.averageFocusScore).toBe(60); // (80+70+30)/3
      expect(result.lowFocusPeriods).toBe(1);
      expect(sessionRepository.save).toHaveBeenCalled();
    });

    it('should throw error if session not found', async () => {
      mockSessionRepository.findOne.mockResolvedValue(null);

      await expect(service.endSession('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('recordMetric', () => {
    it('should record a focus metric', async () => {
      const dto = {
        sessionId: 'session-1',
        focusScore: 75,
        gazeDirection: GazeDirection.ON_SCREEN,
        blinkRate: 18,
        headPose: HeadPose.UPRIGHT,
        emotionDetected: EmotionDetected.ENGAGED,
      };

      const mockSession = { id: 'session-1' };
      mockSessionRepository.findOne.mockResolvedValue(mockSession);

      const mockMetric = { id: 'metric-1', ...dto };
      mockMetricRepository.create.mockReturnValue(mockMetric);
      mockMetricRepository.save.mockResolvedValue(mockMetric);

      const result = await service.recordMetric(dto);

      expect(result).toEqual(mockMetric);
      expect(metricRepository.save).toHaveBeenCalled();
    });

    it('should throw error if session not found', async () => {
      const dto = {
        sessionId: 'invalid',
        focusScore: 75,
        gazeDirection: GazeDirection.ON_SCREEN,
        blinkRate: 18,
        headPose: HeadPose.UPRIGHT,
        emotionDetected: EmotionDetected.ENGAGED,
      };

      mockSessionRepository.findOne.mockResolvedValue(null);

      await expect(service.recordMetric(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStudentSessions', () => {
    it('should return student sessions', async () => {
      const mockSessions = [
        { id: 'session-1', studentId: 'student-1' },
        { id: 'session-2', studentId: 'student-1' },
      ];

      mockSessionRepository.find.mockResolvedValue(mockSessions);

      const result = await service.getStudentSessions('student-1');

      expect(result).toEqual(mockSessions);
      expect(sessionRepository.find).toHaveBeenCalledWith({
        where: { studentId: 'student-1' },
        order: { startedAt: 'DESC' },
        take: 10,
      });
    });
  });

  describe('getStudentPattern', () => {
    it('should return student focus pattern', async () => {
      const mockPattern = {
        id: 'pattern-1',
        studentId: 'student-1',
        optimalSessionLength: 25,
        bestTimeOfDay: '10:00',
      };

      mockPatternRepository.findOne.mockResolvedValue(mockPattern);

      const result = await service.getStudentPattern('student-1');

      expect(result).toEqual(mockPattern);
    });

    it('should return null if no pattern exists', async () => {
      mockPatternRepository.findOne.mockResolvedValue(null);

      const result = await service.getStudentPattern('student-1');

      expect(result).toBeNull();
    });
  });

  describe('getCurrentRecommendation', () => {
    it('should recommend break for low focus', async () => {
      const mockMetrics = [
        { focusScore: 30 },
        { focusScore: 35 },
        { focusScore: 25 },
      ];

      mockMetricRepository.find.mockResolvedValue(mockMetrics);

      const result = await service.getCurrentRecommendation('session-1');

      expect(result.action).toBe('BREAK');
      expect(result.message).toContain('break');
    });

    it('should recommend energizer for medium focus', async () => {
      const mockMetrics = [
        { focusScore: 50 },
        { focusScore: 55 },
        { focusScore: 52 },
      ];

      mockMetricRepository.find.mockResolvedValue(mockMetrics);

      const result = await service.getCurrentRecommendation('session-1');

      expect(result.action).toBe('ENERGIZER');
    });

    it('should recommend continue for high focus', async () => {
      const mockMetrics = [
        { focusScore: 80 },
        { focusScore: 85 },
        { focusScore: 90 },
      ];

      mockMetricRepository.find.mockResolvedValue(mockMetrics);

      const result = await service.getCurrentRecommendation('session-1');

      expect(result.action).toBe('CONTINUE');
    });
  });
});
