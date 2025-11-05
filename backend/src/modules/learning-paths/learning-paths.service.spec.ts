import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LearningPathsService } from './learning-paths.service';
import { LearningPath, PathStatus } from './entities/learning-path.entity';
import { PathNode, NodeStatus } from './entities/path-node.entity';
import { NotFoundException } from '@nestjs/common';

describe('LearningPathsService', () => {
  let service: LearningPathsService;
  let pathRepository: Repository<LearningPath>;
  let nodeRepository: Repository<PathNode>;

  const mockPathRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockNodeRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LearningPathsService,
        { provide: getRepositoryToken(LearningPath), useValue: mockPathRepository },
        { provide: getRepositoryToken(PathNode), useValue: mockNodeRepository },
      ],
    }).compile();

    service = module.get<LearningPathsService>(LearningPathsService);
    pathRepository = module.get(getRepositoryToken(LearningPath));
    nodeRepository = module.get(getRepositoryToken(PathNode));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generatePath', () => {
    it('should generate a new learning path', async () => {
      const mockPath = { id: 'path-1', studentId: 'student-1', subject: 'math' };
      mockPathRepository.create.mockReturnValue(mockPath);
      mockPathRepository.save.mockResolvedValue(mockPath);
      mockNodeRepository.create.mockReturnValue({});
      mockNodeRepository.save.mockResolvedValue({});

      const result = await service.generatePath('student-1', 'math');

      expect(result).toEqual(mockPath);
      expect(pathRepository.save).toHaveBeenCalled();
    });
  });

  describe('completeNode', () => {
    it('should complete node and update progress', async () => {
      const mockNode = { id: 'node-1', pathId: 'path-1', status: NodeStatus.IN_PROGRESS, attemptsCount: 0, prerequisites: [] };
      mockNodeRepository.findOne.mockResolvedValue(mockNode);
      mockNodeRepository.save.mockResolvedValue(mockNode);
      mockNodeRepository.find.mockResolvedValue([mockNode, { id: 'node-2', prerequisites: ['node-1'], status: NodeStatus.LOCKED }]);
      mockPathRepository.findOne.mockResolvedValue({ id: 'path-1', difficultyLevel: 5, adaptationCount: 0 });
      mockPathRepository.save.mockResolvedValue({});

      const result = await service.completeNode('node-1', 85);

      expect(result.status).toBe(NodeStatus.COMPLETED);
      expect(result.masteryScore).toBe(85);
      expect(nodeRepository.save).toHaveBeenCalled();
    });

    it('should throw error if node not found', async () => {
      mockNodeRepository.findOne.mockResolvedValue(null);

      await expect(service.completeNode('invalid', 80)).rejects.toThrow(NotFoundException);
    });
  });

  describe('adaptDifficulty', () => {
    it('should increase difficulty', async () => {
      const mockPath = { id: 'path-1', difficultyLevel: 5, adaptationCount: 0 };
      mockPathRepository.findOne.mockResolvedValue(mockPath);
      mockPathRepository.save.mockResolvedValue(mockPath);

      await service.adaptDifficulty('path-1', 'INCREASE');

      expect(mockPath.difficultyLevel).toBe(6);
      expect(mockPath.adaptationCount).toBe(1);
    });

    it('should decrease difficulty', async () => {
      const mockPath = { id: 'path-1', difficultyLevel: 5, adaptationCount: 0 };
      mockPathRepository.findOne.mockResolvedValue(mockPath);
      mockPathRepository.save.mockResolvedValue(mockPath);

      await service.adaptDifficulty('path-1', 'DECREASE');

      expect(mockPath.difficultyLevel).toBe(4);
      expect(mockPath.adaptationCount).toBe(1);
    });
  });

  describe('getPath', () => {
    it('should return a path', async () => {
      const mockPath = { id: 'path-1' };
      mockPathRepository.findOne.mockResolvedValue(mockPath);

      const result = await service.getPath('path-1');

      expect(result).toEqual(mockPath);
    });

    it('should throw error if path not found', async () => {
      mockPathRepository.findOne.mockResolvedValue(null);

      await expect(service.getPath('invalid')).rejects.toThrow(NotFoundException);
    });
  });
});
