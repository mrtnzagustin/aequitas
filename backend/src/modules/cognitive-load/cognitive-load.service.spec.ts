import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { CognitiveLoadService } from './cognitive-load.service';
import { CognitiveLoadMeasurement, LoadIndicators } from './entities/cognitive-load-measurement.entity';
import { LoadPattern } from './entities/load-pattern.entity';
import { RecordMeasurementDto } from './dto/record-measurement.dto';

describe('CognitiveLoadService', () => {
  let service: CognitiveLoadService;
  let measurementRepository: Repository<CognitiveLoadMeasurement>;
  let patternRepository: Repository<LoadPattern>;

  const mockMeasurementRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockPatternRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CognitiveLoadService,
        {
          provide: getRepositoryToken(CognitiveLoadMeasurement),
          useValue: mockMeasurementRepository,
        },
        {
          provide: getRepositoryToken(LoadPattern),
          useValue: mockPatternRepository,
        },
      ],
    }).compile();

    service = module.get<CognitiveLoadService>(CognitiveLoadService);
    measurementRepository = module.get(getRepositoryToken(CognitiveLoadMeasurement));
    patternRepository = module.get(getRepositoryToken(LoadPattern));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateLoadScore', () => {
    it('should calculate load score from indicators', () => {
      const indicators: LoadIndicators = {
        interactionPace: 5,
        errorRate: 0.2,
        taskSwitches: 3,
        reReadingCount: 2,
        helpRequests: 1,
        microPauses: 10,
      };

      const score = service.calculateLoadScore(indicators);

      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
      expect(typeof score).toBe('number');
    });

    it('should return high score for high load indicators', () => {
      const indicators: LoadIndicators = {
        interactionPace: 15,
        errorRate: 0.8,
        taskSwitches: 10,
        reReadingCount: 15,
        helpRequests: 5,
        microPauses: 30,
      };

      const score = service.calculateLoadScore(indicators);

      expect(score).toBeGreaterThan(70);
    });

    it('should return low score for low load indicators', () => {
      const indicators: LoadIndicators = {
        interactionPace: 1,
        errorRate: 0.05,
        taskSwitches: 0,
        reReadingCount: 0,
        helpRequests: 0,
        microPauses: 0,
      };

      const score = service.calculateLoadScore(indicators);

      expect(score).toBeLessThan(30);
    });
  });

  describe('recordMeasurement', () => {
    it('should record a new measurement', async () => {
      const dto: RecordMeasurementDto = {
        studentId: 'student-1',
        taskId: 'math-001',
        indicators: {
          interactionPace: 5,
          errorRate: 0.2,
          taskSwitches: 2,
          reReadingCount: 1,
          helpRequests: 0,
          microPauses: 5,
        },
      };

      const mockMeasurement = { id: '1', ...dto, loadScore: 45 };
      mockMeasurementRepository.create.mockReturnValue(mockMeasurement);
      mockMeasurementRepository.save.mockResolvedValue(mockMeasurement);
      mockMeasurementRepository.find.mockResolvedValue([]);

      const result = await service.recordMeasurement(dto);

      expect(measurementRepository.create).toHaveBeenCalled();
      expect(measurementRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockMeasurement);
    });

    it('should trigger intervention for sustained high load', async () => {
      const dto: RecordMeasurementDto = {
        studentId: 'student-1',
        taskId: 'math-001',
        indicators: {
          interactionPace: 15,
          errorRate: 0.9,
          taskSwitches: 10,
          reReadingCount: 15,
          helpRequests: 5,
          microPauses: 30,
        },
      };

      const highLoadMeasurements = [
        { loadScore: 85 },
        { loadScore: 87 },
        { loadScore: 90 },
      ];
      mockMeasurementRepository.find.mockResolvedValue(highLoadMeasurements);

      const mockMeasurement = { id: '1', ...dto, loadScore: 88, interventionTriggered: 'SIMPLIFY_AND_BREAK' };
      mockMeasurementRepository.create.mockReturnValue(mockMeasurement);
      mockMeasurementRepository.save.mockResolvedValue(mockMeasurement);

      const result = await service.recordMeasurement(dto);

      expect(result.interventionTriggered).toBe('SIMPLIFY_AND_BREAK');
    });

    it('should not trigger intervention for low load', async () => {
      const dto: RecordMeasurementDto = {
        studentId: 'student-1',
        taskId: 'math-001',
        indicators: {
          interactionPace: 2,
          errorRate: 0.1,
          taskSwitches: 1,
          reReadingCount: 0,
          helpRequests: 0,
          microPauses: 2,
        },
      };

      const mockMeasurement = { id: '1', ...dto, loadScore: 25 };
      mockMeasurementRepository.create.mockReturnValue(mockMeasurement);
      mockMeasurementRepository.save.mockResolvedValue(mockMeasurement);

      const result = await service.recordMeasurement(dto);

      expect(result.interventionTriggered).toBeUndefined();
    });
  });

  describe('getCurrentLoad', () => {
    it('should return current load score and recommendation', async () => {
      const measurements = [
        { loadScore: 45 },
        { loadScore: 50 },
        { loadScore: 48 },
      ];
      mockMeasurementRepository.find.mockResolvedValue(measurements);

      const result = await service.getCurrentLoad('student-1');

      expect(result.loadScore).toBe(48); // average
      expect(result.recommendation).toBeDefined();
    });

    it('should return zero load for no recent activity', async () => {
      mockMeasurementRepository.find.mockResolvedValue([]);

      const result = await service.getCurrentLoad('student-1');

      expect(result.loadScore).toBe(0);
      expect(result.recommendation).toBe('No recent activity');
    });

    it('should recommend break for high load', async () => {
      const measurements = [
        { loadScore: 85 },
        { loadScore: 88 },
        { loadScore: 90 },
      ];
      mockMeasurementRepository.find.mockResolvedValue(measurements);

      const result = await service.getCurrentLoad('student-1');

      expect(result.loadScore).toBeGreaterThanOrEqual(80);
      expect(result.recommendation).toContain('break');
    });

    it('should recommend increased complexity for low load', async () => {
      const measurements = [
        { loadScore: 15 },
        { loadScore: 20 },
        { loadScore: 18 },
      ];
      mockMeasurementRepository.find.mockResolvedValue(measurements);

      const result = await service.getCurrentLoad('student-1');

      expect(result.loadScore).toBeLessThan(30);
      expect(result.recommendation).toContain('increase');
    });
  });

  describe('getPatterns', () => {
    it('should return load patterns for a student', async () => {
      const mockPatterns = [
        {
          id: '1',
          studentId: 'student-1',
          subject: 'math',
          averageLoad: 55,
          peakLoadTime: '14:00',
          optimalSessionLength: 30,
          overloadTriggers: ['High errorRate'],
          effectiveInterventions: ['SIMPLIFY_AND_BREAK'],
        },
      ];
      mockPatternRepository.find.mockResolvedValue(mockPatterns);

      const result = await service.getPatterns('student-1');

      expect(result).toEqual(mockPatterns);
      expect(patternRepository.find).toHaveBeenCalledWith({ where: { studentId: 'student-1' } });
    });

    it('should filter patterns by subject', async () => {
      const mockPatterns = [
        {
          id: '1',
          studentId: 'student-1',
          subject: 'math',
          averageLoad: 55,
          peakLoadTime: '14:00',
          optimalSessionLength: 30,
          overloadTriggers: [],
          effectiveInterventions: [],
        },
      ];
      mockPatternRepository.find.mockResolvedValue(mockPatterns);

      await service.getPatterns('student-1', 'math');

      expect(patternRepository.find).toHaveBeenCalledWith({
        where: { studentId: 'student-1', subject: 'math' },
      });
    });
  });

  describe('getRecommendations', () => {
    it('should return personalized recommendations', async () => {
      const mockPatterns = [
        {
          id: '1',
          studentId: 'student-1',
          subject: 'math',
          averageLoad: 65,
          peakLoadTime: '14:00',
          optimalSessionLength: 25,
          overloadTriggers: ['High errorRate'],
          effectiveInterventions: ['SIMPLIFY_AND_BREAK'],
        },
        {
          id: '2',
          studentId: 'student-1',
          subject: 'reading',
          averageLoad: 45,
          peakLoadTime: '10:00',
          optimalSessionLength: 40,
          overloadTriggers: ['High reReadingCount'],
          effectiveInterventions: ['AUDIO_VERSION'],
        },
      ];
      mockPatternRepository.find.mockResolvedValue(mockPatterns);

      const result = await service.getRecommendations('student-1');

      expect(result.message).toBeDefined();
      expect(result.recommendations).toHaveLength(2);
      expect(result.recommendations[0].subject).toBe('math');
      expect(result.recommendations[0].optimalSessionLength).toBe('25 minutes');
    });

    it('should return message when no data available', async () => {
      mockPatternRepository.find.mockResolvedValue([]);

      const result = await service.getRecommendations('student-1');

      expect(result.message).toBe('Not enough data yet');
      expect(result.recommendations).toEqual([]);
    });
  });
});
