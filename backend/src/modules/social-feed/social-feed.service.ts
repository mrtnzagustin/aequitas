import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  FeedPost,
  PostStatus,
  PostVisibility,
} from './entities/feed-post.entity';
import { FeedComment, ModerationStatus } from './entities/feed-comment.entity';
import { FeedReaction } from './entities/feed-reaction.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { StudentPoints } from '../gamification/entities/student-points.entity';

@Injectable()
export class SocialFeedService {
  // Simple bad words filter (would use better AI moderation in production)
  private readonly badWords = [
    'hate',
    'stupid',
    'dumb',
    'loser',
    'fail',
    'bad',
    'worst',
  ];

  constructor(
    @InjectRepository(FeedPost)
    private postRepository: Repository<FeedPost>,
    @InjectRepository(FeedComment)
    private commentRepository: Repository<FeedComment>,
    @InjectRepository(FeedReaction)
    private reactionRepository: Repository<FeedReaction>,
    @InjectRepository(StudentPoints)
    private pointsRepository: Repository<StudentPoints>,
  ) {}

  async createPost(studentId: string, dto: CreatePostDto): Promise<FeedPost> {
    // Auto-moderate content
    const moderationResult = this.moderateContent(dto.content);

    const post = this.postRepository.create({
      studentId,
      type: dto.type,
      content: dto.content,
      badgeId: dto.badgeId,
      imageUrl: dto.imageUrl,
      visibility: dto.visibility || PostVisibility.PUBLIC,
      status: moderationResult.approved
        ? PostStatus.PUBLISHED
        : PostStatus.PENDING_MODERATION,
    });

    return this.postRepository.save(post);
  }

  async getFeed(
    studentId: string,
    limit = 20,
  ): Promise<FeedPost[]> {
    // Get posts visible to this student
    return this.postRepository.find({
      where: { status: PostStatus.PUBLISHED },
      relations: ['student', 'comments', 'reactions'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getPost(postId: string): Promise<FeedPost> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['student', 'comments', 'reactions', 'comments.author'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async addComment(
    postId: string,
    authorId: string,
    dto: CreateCommentDto,
  ): Promise<FeedComment> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Auto-moderate comment
    const moderationResult = this.moderateContent(dto.content);
    const sentimentScore = this.analyzeSentiment(dto.content);

    const comment = this.commentRepository.create({
      postId,
      authorId,
      content: dto.content,
      moderationStatus: moderationResult.approved
        ? ModerationStatus.APPROVED
        : ModerationStatus.PENDING,
      sentimentScore,
    });

    const savedComment = await this.commentRepository.save(comment);

    // Award points for positive engagement
    if (moderationResult.approved && sentimentScore > 0.3) {
      await this.awardPoints(authorId, 5, 'Positive comment');
    }

    return savedComment;
  }

  async addReaction(
    postId: string,
    userId: string,
    emoji: string,
  ): Promise<FeedReaction> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if reaction already exists
    const existing = await this.reactionRepository.findOne({
      where: { postId, userId, emoji },
    });

    if (existing) {
      return existing;
    }

    const reaction = this.reactionRepository.create({
      postId,
      userId,
      emoji,
    });

    const savedReaction = await this.reactionRepository.save(reaction);

    // Award points for engagement
    await this.awardPoints(userId, 2, 'Reaction given');

    return savedReaction;
  }

  async removeReaction(
    postId: string,
    userId: string,
    emoji: string,
  ): Promise<void> {
    const reaction = await this.reactionRepository.findOne({
      where: { postId, userId, emoji },
    });

    if (reaction) {
      await this.reactionRepository.remove(reaction);
    }
  }

  async giveHighFive(postId: string, userId: string): Promise<FeedPost> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if user already gave high five (can only give once)
    const existingReaction = await this.reactionRepository.findOne({
      where: { postId, userId, emoji: '🙌' },
    });

    if (existingReaction) {
      throw new BadRequestException('Already gave high five');
    }

    // Add high five reaction
    await this.addReaction(postId, userId, '🙌');

    // Increment high five count
    post.highFivesCount += 1;
    const updatedPost = await this.postRepository.save(post);

    // Award points to post author
    await this.awardPoints(post.studentId, 10, 'High five received');

    return updatedPost;
  }

  async moderatePost(
    postId: string,
    moderatorId: string,
    approved: boolean,
    notes?: string,
  ): Promise<FeedPost> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    post.status = approved ? PostStatus.PUBLISHED : PostStatus.REJECTED;
    post.moderatedBy = moderatorId;
    post.moderationNotes = notes || null;

    return this.postRepository.save(post);
  }

  async moderateComment(
    commentId: string,
    moderatorId: string,
    approved: boolean,
    notes?: string,
  ): Promise<FeedComment> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    comment.moderationStatus = approved
      ? ModerationStatus.APPROVED
      : ModerationStatus.REJECTED;
    comment.moderatedBy = moderatorId;
    comment.moderationNotes = notes || null;

    return this.commentRepository.save(comment);
  }

  async getPostsByStudent(
    studentId: string,
    limit = 10,
  ): Promise<FeedPost[]> {
    return this.postRepository.find({
      where: { studentId, status: PostStatus.PUBLISHED },
      relations: ['reactions', 'comments'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async deletePost(postId: string, studentId: string): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { id: postId, studentId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.postRepository.remove(post);
  }

  private moderateContent(content: string): {
    approved: boolean;
    flagged: string[];
  } {
    const lowerContent = content.toLowerCase();
    const flagged: string[] = [];

    for (const word of this.badWords) {
      if (lowerContent.includes(word)) {
        flagged.push(word);
      }
    }

    // Auto-approve if no bad words found
    return {
      approved: flagged.length === 0,
      flagged,
    };
  }

  private analyzeSentiment(content: string): number {
    // Simple sentiment analysis (would use AI in production)
    const positiveWords = [
      'great',
      'amazing',
      'awesome',
      'good',
      'excellent',
      'congrats',
      'proud',
      'happy',
      'love',
      'best',
      'wonderful',
    ];
    const negativeWords = this.badWords;

    const lowerContent = content.toLowerCase();
    let score = 0;

    for (const word of positiveWords) {
      if (lowerContent.includes(word)) {
        score += 0.2;
      }
    }

    for (const word of negativeWords) {
      if (lowerContent.includes(word)) {
        score -= 0.3;
      }
    }

    // Normalize to -1 to 1
    return Math.max(-1, Math.min(1, score));
  }

  private async awardPoints(
    studentId: string,
    points: number,
    reason: string,
  ): Promise<void> {
    let studentPoints = await this.pointsRepository.findOne({
      where: { studentId },
    });

    if (!studentPoints) {
      // Create points record if doesn't exist
      studentPoints = this.pointsRepository.create({
        studentId,
        totalPoints: 0,
        level: 1,
      });
    }

    studentPoints.totalPoints += points;
    await this.pointsRepository.save(studentPoints);
  }
}
