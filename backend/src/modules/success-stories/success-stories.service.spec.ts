import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SuccessStoriesService } from './success-stories.service';
import { SuccessStory, StoryStatus, AuthorType, ContentType, StoryVisibility } from './entities/success-story.entity';
import { StoryComment } from './entities/story-comment.entity';
import { StoryCollection } from './entities/story-collection.entity';
import { NotFoundException } from '@nestjs/common';

describe('SuccessStoriesService', () => {
  let service: SuccessStoriesService;
  let storyRepository: Repository<SuccessStory>;
  let commentRepository: Repository<StoryComment>;
  let collectionRepository: Repository<StoryCollection>;

  const mockStory: any = {
    id: 'story-1',
    authorId: 'user-1',
    authorType: AuthorType.STUDENT,
    title: 'My Success Story',
    summary: 'A brief summary',
    content: 'Full content here',
    contentType: ContentType.TEXT,
    mediaUrl: null,
    challenges: ['ADHD'],
    outcomeMetrics: null,
    visibility: StoryVisibility.PUBLIC,
    featured: false,
    approvedBy: null,
    status: StoryStatus.PENDING,
    reactions: [],
    viewCount: 0,
    shareCount: 0,
    comments: [],
    createdAt: new Date(),
    publishedAt: null,
    updatedAt: new Date(),
  };

  const mockStoryRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockCommentRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockCollectionRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuccessStoriesService,
        { provide: getRepositoryToken(SuccessStory), useValue: mockStoryRepository },
        { provide: getRepositoryToken(StoryComment), useValue: mockCommentRepository },
        { provide: getRepositoryToken(StoryCollection), useValue: mockCollectionRepository },
      ],
    }).compile();

    service = module.get<SuccessStoriesService>(SuccessStoriesService);
    storyRepository = module.get<Repository<SuccessStory>>(getRepositoryToken(SuccessStory));
    commentRepository = module.get<Repository<StoryComment>>(getRepositoryToken(StoryComment));
    collectionRepository = module.get<Repository<StoryCollection>>(getRepositoryToken(StoryCollection));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new story', async () => {
      const dto = {
        title: 'My Story',
        summary: 'Summary',
        content: 'Content',
        contentType: ContentType.TEXT,
        challenges: ['ADHD'],
        visibility: StoryVisibility.PUBLIC,
      };

      mockStoryRepository.create.mockReturnValue(mockStory);
      mockStoryRepository.save.mockResolvedValue(mockStory);

      const result = await service.create('user-1', AuthorType.STUDENT, dto as any);

      expect(result).toEqual(mockStory);
      expect(mockStoryRepository.create).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a story and increment view count', async () => {
      mockStoryRepository.findOne.mockResolvedValue(mockStory);
      mockStoryRepository.save.mockResolvedValue({ ...mockStory, viewCount: 1 });

      const result = await service.findOne('story-1');

      expect(result.viewCount).toBe(1);
    });

    it('should throw if story not found', async () => {
      mockStoryRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('approve', () => {
    it('should approve and publish story', async () => {
      mockStoryRepository.findOne.mockResolvedValue(mockStory);
      mockStoryRepository.save.mockResolvedValue({
        ...mockStory,
        status: StoryStatus.PUBLISHED,
        approvedBy: 'admin-1',
        publishedAt: expect.any(Date),
      });

      const result = await service.approve('story-1', 'admin-1', false);

      expect(result.status).toBe(StoryStatus.PUBLISHED);
      expect(result.approvedBy).toBe('admin-1');
    });
  });

  describe('addReaction', () => {
    it('should add new reaction', async () => {
      mockStoryRepository.findOne.mockResolvedValue(mockStory);
      mockStoryRepository.save.mockResolvedValue({
        ...mockStory,
        reactions: [{ emoji: '❤️', count: 1 }],
      });

      const result = await service.addReaction('story-1', '❤️');

      expect(result.reactions).toHaveLength(1);
    });

    it('should increment existing reaction', async () => {
      const storyWithReaction = {
        ...mockStory,
        reactions: [{ emoji: '❤️', count: 1 }],
      };
      mockStoryRepository.findOne.mockResolvedValue(storyWithReaction);
      mockStoryRepository.save.mockResolvedValue({
        ...storyWithReaction,
        reactions: [{ emoji: '❤️', count: 2 }],
      });

      const result = await service.addReaction('story-1', '❤️');

      expect(result.reactions[0].count).toBe(2);
    });
  });

  describe('addComment', () => {
    it('should add a comment to story', async () => {
      const mockComment = {
        id: 'comment-1',
        storyId: 'story-1',
        authorId: 'user-2',
        comment: 'Great story!',
        moderated: false,
        approved: false,
      };

      mockStoryRepository.findOne.mockResolvedValue(mockStory);
      mockCommentRepository.create.mockReturnValue(mockComment);
      mockCommentRepository.save.mockResolvedValue(mockComment);

      const result = await service.addComment('story-1', 'user-2', 'Great story!');

      expect(result).toEqual(mockComment);
    });
  });
});
