import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialFeedService } from './social-feed.service';
import {
  FeedPost,
  PostType,
  PostVisibility,
  PostStatus,
} from './entities/feed-post.entity';
import { FeedComment, ModerationStatus } from './entities/feed-comment.entity';
import { FeedReaction } from './entities/feed-reaction.entity';
import { StudentPoints } from '../gamification/entities/student-points.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('SocialFeedService', () => {
  let service: SocialFeedService;
  let postRepository: Repository<FeedPost>;
  let commentRepository: Repository<FeedComment>;
  let reactionRepository: Repository<FeedReaction>;
  let pointsRepository: Repository<StudentPoints>;

  const mockPost: any = {
    id: 'post-1',
    studentId: 'student-1',
    type: PostType.ACHIEVEMENT,
    content: 'I completed my homework!',
    badgeId: null,
    imageUrl: null,
    visibility: PostVisibility.PUBLIC,
    highFivesCount: 0,
    status: PostStatus.PUBLISHED,
    moderatedBy: null,
    moderationNotes: null,
    comments: [],
    reactions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockComment: any = {
    id: 'comment-1',
    postId: 'post-1',
    authorId: 'student-2',
    content: 'Great job!',
    moderationStatus: ModerationStatus.APPROVED,
    moderatedBy: null,
    moderationNotes: null,
    sentimentScore: 0.4,
    createdAt: new Date(),
  };

  const mockReaction: any = {
    id: 'reaction-1',
    postId: 'post-1',
    userId: 'student-2',
    emoji: '👏',
    createdAt: new Date(),
  };

  const mockPoints: any = {
    id: 'points-1',
    studentId: 'student-1',
    totalPoints: 100,
    level: 2,
  };

  const mockPostRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockCommentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockReactionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockPointsRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SocialFeedService,
        {
          provide: getRepositoryToken(FeedPost),
          useValue: mockPostRepository,
        },
        {
          provide: getRepositoryToken(FeedComment),
          useValue: mockCommentRepository,
        },
        {
          provide: getRepositoryToken(FeedReaction),
          useValue: mockReactionRepository,
        },
        {
          provide: getRepositoryToken(StudentPoints),
          useValue: mockPointsRepository,
        },
      ],
    }).compile();

    service = module.get<SocialFeedService>(SocialFeedService);
    postRepository = module.get<Repository<FeedPost>>(
      getRepositoryToken(FeedPost),
    );
    commentRepository = module.get<Repository<FeedComment>>(
      getRepositoryToken(FeedComment),
    );
    reactionRepository = module.get<Repository<FeedReaction>>(
      getRepositoryToken(FeedReaction),
    );
    pointsRepository = module.get<Repository<StudentPoints>>(
      getRepositoryToken(StudentPoints),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPost', () => {
    it('should create and auto-approve positive post', async () => {
      const dto = {
        type: PostType.ACHIEVEMENT,
        content: 'I did great on my test!',
        visibility: PostVisibility.PUBLIC,
      };

      mockPostRepository.create.mockReturnValue({
        ...mockPost,
        content: dto.content,
        status: PostStatus.PUBLISHED,
      });
      mockPostRepository.save.mockResolvedValue({
        ...mockPost,
        content: dto.content,
        status: PostStatus.PUBLISHED,
      });

      const result = await service.createPost('student-1', dto);

      expect(result.status).toBe(PostStatus.PUBLISHED);
      expect(mockPostRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          studentId: 'student-1',
          type: dto.type,
          content: dto.content,
        }),
      );
    });

    it('should flag post with negative content for moderation', async () => {
      const dto = {
        type: PostType.REFLECTION,
        content: 'I hate this stupid homework',
        visibility: PostVisibility.PUBLIC,
      };

      mockPostRepository.create.mockReturnValue({
        ...mockPost,
        content: dto.content,
        status: PostStatus.PENDING_MODERATION,
      });
      mockPostRepository.save.mockResolvedValue({
        ...mockPost,
        content: dto.content,
        status: PostStatus.PENDING_MODERATION,
      });

      const result = await service.createPost('student-1', dto);

      expect(result.status).toBe(PostStatus.PENDING_MODERATION);
    });
  });

  describe('getFeed', () => {
    it('should return published posts', async () => {
      mockPostRepository.find.mockResolvedValue([mockPost]);

      const result = await service.getFeed('student-1');

      expect(result).toEqual([mockPost]);
      expect(mockPostRepository.find).toHaveBeenCalledWith({
        where: { status: PostStatus.PUBLISHED },
        relations: ['student', 'comments', 'reactions'],
        order: { createdAt: 'DESC' },
        take: 20,
      });
    });

    it('should respect custom limit', async () => {
      mockPostRepository.find.mockResolvedValue([]);

      await service.getFeed('student-1', 5);

      expect(mockPostRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 5,
        }),
      );
    });
  });

  describe('getPost', () => {
    it('should return post with relations', async () => {
      mockPostRepository.findOne.mockResolvedValue(mockPost);

      const result = await service.getPost('post-1');

      expect(result).toEqual(mockPost);
      expect(mockPostRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'post-1' },
        relations: ['student', 'comments', 'reactions', 'comments.author'],
      });
    });

    it('should throw if post not found', async () => {
      mockPostRepository.findOne.mockResolvedValue(null);

      await expect(service.getPost('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('addComment', () => {
    it('should add positive comment and award points', async () => {
      mockPostRepository.findOne.mockResolvedValue(mockPost);
      mockCommentRepository.create.mockReturnValue(mockComment);
      mockCommentRepository.save.mockResolvedValue(mockComment);
      mockPointsRepository.findOne.mockResolvedValue(mockPoints);
      mockPointsRepository.save.mockResolvedValue({
        ...mockPoints,
        totalPoints: 105,
      });

      const dto = { content: 'Great job! This is amazing and wonderful!' };
      const result = await service.addComment('post-1', 'student-2', dto);

      expect(result.moderationStatus).toBe(ModerationStatus.APPROVED);
      expect(mockPointsRepository.save).toHaveBeenCalled();
    });

    it('should flag negative comment for moderation', async () => {
      mockPostRepository.findOne.mockResolvedValue(mockPost);
      mockCommentRepository.create.mockReturnValue({
        ...mockComment,
        content: 'This is stupid',
        moderationStatus: ModerationStatus.PENDING,
      });
      mockCommentRepository.save.mockResolvedValue({
        ...mockComment,
        content: 'This is stupid',
        moderationStatus: ModerationStatus.PENDING,
      });

      const dto = { content: 'This is stupid' };
      const result = await service.addComment('post-1', 'student-2', dto);

      expect(result.moderationStatus).toBe(ModerationStatus.PENDING);
    });

    it('should throw if post not found', async () => {
      mockPostRepository.findOne.mockResolvedValue(null);

      const dto = { content: 'Great!' };
      await expect(
        service.addComment('non-existent', 'student-2', dto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('addReaction', () => {
    it('should add reaction and award points', async () => {
      mockPostRepository.findOne.mockResolvedValue(mockPost);
      mockReactionRepository.findOne.mockResolvedValue(null);
      mockReactionRepository.create.mockReturnValue(mockReaction);
      mockReactionRepository.save.mockResolvedValue(mockReaction);
      mockPointsRepository.findOne.mockResolvedValue(mockPoints);
      mockPointsRepository.save.mockResolvedValue({
        ...mockPoints,
        totalPoints: 102,
      });

      const result = await service.addReaction('post-1', 'student-2', '👏');

      expect(result).toEqual(mockReaction);
      expect(mockPointsRepository.save).toHaveBeenCalled();
    });

    it('should return existing reaction if already exists', async () => {
      mockPostRepository.findOne.mockResolvedValue(mockPost);
      mockReactionRepository.findOne.mockResolvedValue(mockReaction);

      const result = await service.addReaction('post-1', 'student-2', '👏');

      expect(result).toEqual(mockReaction);
      expect(mockReactionRepository.create).not.toHaveBeenCalled();
    });

    it('should throw if post not found', async () => {
      mockPostRepository.findOne.mockResolvedValue(null);

      await expect(
        service.addReaction('non-existent', 'student-2', '👏'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeReaction', () => {
    it('should remove reaction', async () => {
      mockReactionRepository.findOne.mockResolvedValue(mockReaction);
      mockReactionRepository.remove.mockResolvedValue(mockReaction);

      await service.removeReaction('post-1', 'student-2', '👏');

      expect(mockReactionRepository.remove).toHaveBeenCalledWith(mockReaction);
    });

    it('should do nothing if reaction not found', async () => {
      mockReactionRepository.findOne.mockResolvedValue(null);

      await service.removeReaction('post-1', 'student-2', '👏');

      expect(mockReactionRepository.remove).not.toHaveBeenCalled();
    });
  });

  describe('giveHighFive', () => {
    it('should give high five and award points', async () => {
      mockPostRepository.findOne.mockResolvedValue(mockPost);
      mockReactionRepository.findOne.mockResolvedValue(null);
      mockReactionRepository.create.mockReturnValue({
        ...mockReaction,
        emoji: '🙌',
      });
      mockReactionRepository.save.mockResolvedValue({
        ...mockReaction,
        emoji: '🙌',
      });
      mockPostRepository.save.mockResolvedValue({
        ...mockPost,
        highFivesCount: 1,
      });
      mockPointsRepository.findOne.mockResolvedValue(mockPoints);
      mockPointsRepository.save.mockResolvedValue({
        ...mockPoints,
        totalPoints: 110,
      });

      const result = await service.giveHighFive('post-1', 'student-2');

      expect(result.highFivesCount).toBe(1);
      expect(mockPointsRepository.save).toHaveBeenCalled();
    });

    it('should throw if high five already given', async () => {
      mockPostRepository.findOne.mockResolvedValue(mockPost);
      mockReactionRepository.findOne.mockResolvedValue({
        ...mockReaction,
        emoji: '🙌',
      });

      await expect(
        service.giveHighFive('post-1', 'student-2'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('moderatePost', () => {
    it('should approve post', async () => {
      mockPostRepository.findOne.mockResolvedValue(mockPost);
      mockPostRepository.save.mockResolvedValue({
        ...mockPost,
        status: PostStatus.PUBLISHED,
        moderatedBy: 'therapist-1',
      });

      const result = await service.moderatePost(
        'post-1',
        'therapist-1',
        true,
        'Approved',
      );

      expect(result.status).toBe(PostStatus.PUBLISHED);
      expect(result.moderatedBy).toBe('therapist-1');
    });

    it('should reject post', async () => {
      mockPostRepository.findOne.mockResolvedValue(mockPost);
      mockPostRepository.save.mockResolvedValue({
        ...mockPost,
        status: PostStatus.REJECTED,
        moderatedBy: 'therapist-1',
      });

      const result = await service.moderatePost(
        'post-1',
        'therapist-1',
        false,
        'Inappropriate',
      );

      expect(result.status).toBe(PostStatus.REJECTED);
    });
  });

  describe('moderateComment', () => {
    it('should approve comment', async () => {
      mockCommentRepository.findOne.mockResolvedValue(mockComment);
      mockCommentRepository.save.mockResolvedValue({
        ...mockComment,
        moderationStatus: ModerationStatus.APPROVED,
      });

      const result = await service.moderateComment(
        'comment-1',
        'therapist-1',
        true,
      );

      expect(result.moderationStatus).toBe(ModerationStatus.APPROVED);
    });

    it('should reject comment', async () => {
      mockCommentRepository.findOne.mockResolvedValue(mockComment);
      mockCommentRepository.save.mockResolvedValue({
        ...mockComment,
        moderationStatus: ModerationStatus.REJECTED,
      });

      const result = await service.moderateComment(
        'comment-1',
        'therapist-1',
        false,
      );

      expect(result.moderationStatus).toBe(ModerationStatus.REJECTED);
    });
  });

  describe('getPostsByStudent', () => {
    it('should return student posts', async () => {
      mockPostRepository.find.mockResolvedValue([mockPost]);

      const result = await service.getPostsByStudent('student-1');

      expect(result).toEqual([mockPost]);
      expect(mockPostRepository.find).toHaveBeenCalledWith({
        where: { studentId: 'student-1', status: PostStatus.PUBLISHED },
        relations: ['reactions', 'comments'],
        order: { createdAt: 'DESC' },
        take: 10,
      });
    });
  });

  describe('deletePost', () => {
    it('should delete post', async () => {
      mockPostRepository.findOne.mockResolvedValue(mockPost);
      mockPostRepository.remove.mockResolvedValue(mockPost);

      await service.deletePost('post-1', 'student-1');

      expect(mockPostRepository.remove).toHaveBeenCalledWith(mockPost);
    });

    it('should throw if post not found', async () => {
      mockPostRepository.findOne.mockResolvedValue(null);

      await expect(
        service.deletePost('non-existent', 'student-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
