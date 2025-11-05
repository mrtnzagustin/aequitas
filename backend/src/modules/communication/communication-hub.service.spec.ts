import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommunicationHubService } from './communication-hub.service';
import {
  ParentTeacherMessage,
  MessagePriority,
} from './entities/parent-teacher-message.entity';
import {
  SharedObservation,
  ObservationContext,
} from './entities/shared-observation.entity';
import { ObservationComment } from './entities/observation-comment.entity';
import { WeeklyProgressReport } from './entities/weekly-progress-report.entity';
import { NotFoundException } from '@nestjs/common';

describe('CommunicationHubService', () => {
  let service: CommunicationHubService;
  let messageRepository: Repository<ParentTeacherMessage>;
  let observationRepository: Repository<SharedObservation>;
  let commentRepository: Repository<ObservationComment>;
  let reportRepository: Repository<WeeklyProgressReport>;

  const mockMessage: any = {
    id: 'message-1',
    studentId: 'student-1',
    senderId: 'therapist-1',
    recipientIds: ['parent-1'],
    subject: 'Weekly Update',
    body: 'Your child had a great week!',
    attachments: [],
    priority: MessagePriority.NORMAL,
    readBy: ['therapist-1'],
    archived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockObservation: any = {
    id: 'obs-1',
    studentId: 'student-1',
    authorId: 'parent-1',
    context: ObservationContext.HOME,
    observation: 'Child struggled with math homework',
    concerns: ['Math difficulty'],
    victories: ['Completed reading assignment'],
    sharedWith: ['therapist-1', 'parent-1'],
    comments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockComment: any = {
    id: 'comment-1',
    observationId: 'obs-1',
    authorId: 'therapist-1',
    content: 'Thanks for sharing this observation',
    createdAt: new Date(),
  };

  const mockReport: any = {
    id: 'report-1',
    studentId: 'student-1',
    weekOf: new Date('2025-11-01'),
    tasksCompleted: 8,
    averageMood: 4.2,
    badgesEarned: 2,
    focusMinutes: 120,
    focusAreas: ['Math', 'Reading'],
    suggestedActivities: ['Practice math daily'],
    teacherNotes: null,
    sentToParents: false,
    sentAt: null,
    generatedAt: new Date(),
  };

  const mockMessageRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockObservationRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockCommentRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockReportRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunicationHubService,
        {
          provide: getRepositoryToken(ParentTeacherMessage),
          useValue: mockMessageRepository,
        },
        {
          provide: getRepositoryToken(SharedObservation),
          useValue: mockObservationRepository,
        },
        {
          provide: getRepositoryToken(ObservationComment),
          useValue: mockCommentRepository,
        },
        {
          provide: getRepositoryToken(WeeklyProgressReport),
          useValue: mockReportRepository,
        },
      ],
    }).compile();

    service = module.get<CommunicationHubService>(CommunicationHubService);
    messageRepository = module.get<Repository<ParentTeacherMessage>>(
      getRepositoryToken(ParentTeacherMessage),
    );
    observationRepository = module.get<Repository<SharedObservation>>(
      getRepositoryToken(SharedObservation),
    );
    commentRepository = module.get<Repository<ObservationComment>>(
      getRepositoryToken(ObservationComment),
    );
    reportRepository = module.get<Repository<WeeklyProgressReport>>(
      getRepositoryToken(WeeklyProgressReport),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendMessage', () => {
    it('should create and send a message', async () => {
      const dto = {
        studentId: 'student-1',
        recipientIds: ['parent-1'],
        subject: 'Test Message',
        body: 'Test content',
        priority: MessagePriority.NORMAL,
      };

      mockMessageRepository.create.mockReturnValue(mockMessage);
      mockMessageRepository.save.mockResolvedValue(mockMessage);

      const result = await service.sendMessage('therapist-1', dto);

      expect(result).toEqual(mockMessage);
      expect(mockMessageRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          senderId: 'therapist-1',
          readBy: ['therapist-1'],
        }),
      );
    });
  });

  describe('getMessagesForUser', () => {
    it('should return messages for user', async () => {
      mockMessageRepository.find.mockResolvedValue([mockMessage]);

      const result = await service.getMessagesForUser('parent-1');

      expect(result).toEqual([mockMessage]);
    });

    it('should filter by studentId when provided', async () => {
      mockMessageRepository.find.mockResolvedValue([mockMessage]);

      await service.getMessagesForUser('parent-1', 'student-1');

      expect(mockMessageRepository.find).toHaveBeenCalled();
    });
  });

  describe('getMessage', () => {
    it('should return a single message', async () => {
      mockMessageRepository.findOne.mockResolvedValue(mockMessage);

      const result = await service.getMessage('message-1');

      expect(result).toEqual(mockMessage);
    });

    it('should throw if message not found', async () => {
      mockMessageRepository.findOne.mockResolvedValue(null);

      await expect(service.getMessage('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('markAsRead', () => {
    it('should mark message as read', async () => {
      mockMessageRepository.findOne.mockResolvedValue(mockMessage);
      mockMessageRepository.save.mockResolvedValue({
        ...mockMessage,
        readBy: ['therapist-1', 'parent-1'],
      });

      const result = await service.markAsRead('message-1', 'parent-1');

      expect(result.readBy).toContain('parent-1');
      expect(mockMessageRepository.save).toHaveBeenCalled();
    });

    it('should not duplicate if already read', async () => {
      const alreadyRead = {
        ...mockMessage,
        readBy: ['therapist-1', 'parent-1'],
      };
      mockMessageRepository.findOne.mockResolvedValue(alreadyRead);

      await service.markAsRead('message-1', 'parent-1');

      expect(mockMessageRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('archiveMessage', () => {
    it('should archive message', async () => {
      mockMessageRepository.findOne.mockResolvedValue(mockMessage);
      mockMessageRepository.save.mockResolvedValue({
        ...mockMessage,
        archived: true,
      });

      const result = await service.archiveMessage('message-1');

      expect(result.archived).toBe(true);
    });
  });

  describe('createObservation', () => {
    it('should create observation', async () => {
      const dto = {
        studentId: 'student-1',
        context: ObservationContext.HOME,
        observation: 'Test observation',
        concerns: ['Concern 1'],
        victories: ['Victory 1'],
        sharedWith: ['therapist-1'],
      };

      mockObservationRepository.create.mockReturnValue(mockObservation);
      mockObservationRepository.save.mockResolvedValue(mockObservation);

      const result = await service.createObservation('parent-1', dto);

      expect(result).toEqual(mockObservation);
      expect(mockObservationRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          authorId: 'parent-1',
        }),
      );
    });
  });

  describe('getObservationsForStudent', () => {
    it('should return observations user has access to', async () => {
      mockObservationRepository.find.mockResolvedValue([mockObservation]);

      const result = await service.getObservationsForStudent(
        'student-1',
        'therapist-1',
      );

      expect(result).toEqual([mockObservation]);
    });

    it('should filter out observations user cannot access', async () => {
      const restrictedObs = {
        ...mockObservation,
        sharedWith: ['other-user'],
        authorId: 'other-user',
      };
      mockObservationRepository.find.mockResolvedValue([restrictedObs]);

      const result = await service.getObservationsForStudent(
        'student-1',
        'therapist-1',
      );

      expect(result).toEqual([]);
    });
  });

  describe('addObservationComment', () => {
    it('should add comment to observation', async () => {
      const dto = { content: 'Great observation!' };

      mockObservationRepository.findOne.mockResolvedValue(mockObservation);
      mockCommentRepository.create.mockReturnValue(mockComment);
      mockCommentRepository.save.mockResolvedValue(mockComment);

      const result = await service.addObservationComment(
        'obs-1',
        'therapist-1',
        dto,
      );

      expect(result).toEqual(mockComment);
      expect(mockCommentRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          observationId: 'obs-1',
          authorId: 'therapist-1',
          content: dto.content,
        }),
      );
    });

    it('should throw if observation not found', async () => {
      mockObservationRepository.findOne.mockResolvedValue(null);

      const dto = { content: 'Test' };
      await expect(
        service.addObservationComment('non-existent', 'therapist-1', dto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('generateWeeklyReport', () => {
    it('should create new report', async () => {
      mockReportRepository.findOne.mockResolvedValue(null);
      mockReportRepository.create.mockReturnValue(mockReport);
      mockReportRepository.save.mockResolvedValue(mockReport);

      const result = await service.generateWeeklyReport(
        'student-1',
        new Date('2025-11-01'),
      );

      expect(result).toEqual(mockReport);
      expect(mockReportRepository.create).toHaveBeenCalled();
    });

    it('should return existing report if already exists', async () => {
      mockReportRepository.findOne.mockResolvedValue(mockReport);

      const result = await service.generateWeeklyReport(
        'student-1',
        new Date('2025-11-01'),
      );

      expect(result).toEqual(mockReport);
      expect(mockReportRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getWeeklyReport', () => {
    it('should return report', async () => {
      mockReportRepository.findOne.mockResolvedValue(mockReport);

      const result = await service.getWeeklyReport(
        'student-1',
        new Date('2025-11-01'),
      );

      expect(result).toEqual(mockReport);
    });

    it('should throw if report not found', async () => {
      mockReportRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getWeeklyReport('student-1', new Date('2025-11-01')),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('sendReportToParents', () => {
    it('should mark report as sent', async () => {
      mockReportRepository.findOne.mockResolvedValue(mockReport);
      mockReportRepository.save.mockResolvedValue({
        ...mockReport,
        sentToParents: true,
        sentAt: expect.any(Date),
      });

      const result = await service.sendReportToParents('report-1');

      expect(result.sentToParents).toBe(true);
      expect(result.sentAt).toBeDefined();
    });
  });

  describe('getRecentReports', () => {
    it('should return recent reports', async () => {
      mockReportRepository.find.mockResolvedValue([mockReport]);

      const result = await service.getRecentReports('student-1');

      expect(result).toEqual([mockReport]);
      expect(mockReportRepository.find).toHaveBeenCalledWith({
        where: { studentId: 'student-1' },
        order: { weekOf: 'DESC' },
        take: 4,
      });
    });

    it('should respect custom limit', async () => {
      mockReportRepository.find.mockResolvedValue([]);

      await service.getRecentReports('student-1', 10);

      expect(mockReportRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10,
        }),
      );
    });
  });

  describe('getCommunicationStats', () => {
    it('should return communication statistics', async () => {
      mockMessageRepository.find.mockResolvedValue([mockMessage]);
      mockObservationRepository.find.mockResolvedValue([mockObservation]);

      const result = await service.getCommunicationStats('student-1');

      expect(result).toHaveProperty('totalMessages');
      expect(result).toHaveProperty('totalObservations');
      expect(result).toHaveProperty('recentActivity');
    });
  });
});
