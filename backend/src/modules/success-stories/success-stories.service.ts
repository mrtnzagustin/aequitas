import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SuccessStory, StoryStatus, Reaction } from './entities/success-story.entity';
import { StoryComment } from './entities/story-comment.entity';
import { StoryCollection } from './entities/story-collection.entity';
import { CreateStoryDto } from './dto/create-story.dto';

@Injectable()
export class SuccessStoriesService {
  constructor(
    @InjectRepository(SuccessStory)
    private storyRepository: Repository<SuccessStory>,
    @InjectRepository(StoryComment)
    private commentRepository: Repository<StoryComment>,
    @InjectRepository(StoryCollection)
    private collectionRepository: Repository<StoryCollection>,
  ) {}

  async create(authorId: string, authorType: string, dto: CreateStoryDto): Promise<SuccessStory> {
    const story = this.storyRepository.create({
      ...dto,
      authorId,
      authorType: authorType as any,
      status: StoryStatus.PENDING,
      reactions: [],
      viewCount: 0,
      shareCount: 0,
    });
    return this.storyRepository.save(story);
  }

  async findAll(filters?: { challenges?: string[]; status?: StoryStatus }): Promise<SuccessStory[]> {
    const query = this.storyRepository.createQueryBuilder('story');

    if (filters?.status) {
      query.andWhere('story.status = :status', { status: filters.status });
    } else {
      query.andWhere('story.status = :status', { status: StoryStatus.PUBLISHED });
    }

    if (filters?.challenges && filters.challenges.length > 0) {
      query.andWhere('story.challenges && ARRAY[:...challenges]::varchar[]', {
        challenges: filters.challenges,
      });
    }

    return query.orderBy('story.createdAt', 'DESC').getMany();
  }

  async findOne(id: string): Promise<SuccessStory> {
    const story = await this.storyRepository.findOne({
      where: { id },
      relations: ['comments'],
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    story.viewCount += 1;
    await this.storyRepository.save(story);

    return story;
  }

  async approve(id: string, approverId: string, featured = false): Promise<SuccessStory> {
    const story = await this.findOne(id);
    story.status = StoryStatus.PUBLISHED;
    story.approvedBy = approverId;
    story.featured = featured;
    story.publishedAt = new Date();
    return this.storyRepository.save(story);
  }

  async addReaction(id: string, emoji: string): Promise<SuccessStory> {
    const story = await this.findOne(id);
    const existing = story.reactions.find((r) => r.emoji === emoji);

    if (existing) {
      existing.count += 1;
    } else {
      story.reactions.push({ emoji, count: 1 });
    }

    return this.storyRepository.save(story);
  }

  async addComment(storyId: string, authorId: string, comment: string): Promise<StoryComment> {
    const story = await this.findOne(storyId);
    const newComment = this.commentRepository.create({
      storyId,
      authorId,
      comment,
      moderated: false,
      approved: false,
    });
    return this.commentRepository.save(newComment);
  }

  async getCollections(): Promise<StoryCollection[]> {
    return this.collectionRepository.find({
      where: { isPublic: true },
    });
  }
}
