import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  LearningStyleProfile,
  LearningStyle,
} from './entities/learning-style-profile.entity';
import {
  StyleEvidence,
  EvidenceType,
} from './entities/style-evidence.entity';
import { RecordEvidenceDto } from './dto/record-evidence.dto';

interface StyleRecommendation {
  studyMethods: string[];
  contentFormats: string[];
  tipOfTheDay: string;
}

@Injectable()
export class LearningStyleService {
  constructor(
    @InjectRepository(LearningStyleProfile)
    private profileRepository: Repository<LearningStyleProfile>,
    @InjectRepository(StyleEvidence)
    private evidenceRepository: Repository<StyleEvidence>,
  ) {}

  async getOrCreateProfile(studentId: string): Promise<LearningStyleProfile> {
    let profile = await this.profileRepository.findOne({
      where: { studentId },
      relations: ['evidence'],
    });

    if (!profile) {
      profile = this.profileRepository.create({
        studentId,
        visualScore: 25,
        auditoryScore: 25,
        kinestheticScore: 25,
        readingWritingScore: 25,
        primaryStyle: LearningStyle.VISUAL,
        confidence: 0,
      });
      profile = await this.profileRepository.save(profile);
    }

    return profile;
  }

  async recordEvidence(
    studentId: string,
    dto: RecordEvidenceDto,
  ): Promise<StyleEvidence> {
    const profile = await this.getOrCreateProfile(studentId);

    const evidence = this.evidenceRepository.create({
      profileId: profile.id,
      evidenceType: dto.evidenceType,
      dataPoint: dto.dataPoint,
      weight: dto.weight || 1.0,
    });

    const savedEvidence = await this.evidenceRepository.save(evidence);

    // Trigger profile update
    await this.updateProfileScores(profile.id);

    return savedEvidence;
  }

  async updateProfileScores(profileId: string): Promise<LearningStyleProfile> {
    const profile = await this.profileRepository.findOne({
      where: { id: profileId },
    });

    if (!profile) {
      throw new Error('Profile not found');
    }

    // Get all evidence for this profile
    const evidence = await this.evidenceRepository.find({
      where: { profileId },
      order: { recordedAt: 'DESC' },
      take: 100, // Consider last 100 data points
    });

    if (evidence.length === 0) {
      return profile;
    }

    // Initialize scores
    const scores = {
      [LearningStyle.VISUAL]: 0,
      [LearningStyle.AUDITORY]: 0,
      [LearningStyle.KINESTHETIC]: 0,
      [LearningStyle.READING_WRITING]: 0,
    };

    let totalWeight = 0;

    // Analyze evidence and calculate scores
    for (const ev of evidence) {
      const weight = Number(ev.weight);
      totalWeight += weight;

      switch (ev.evidenceType) {
        case EvidenceType.CONTENT_INTERACTION:
          this.analyzeContentInteraction(ev, scores, weight);
          break;
        case EvidenceType.TIME_SPENT:
          this.analyzeTimeSpent(ev, scores, weight);
          break;
        case EvidenceType.PERFORMANCE:
          this.analyzePerformance(ev, scores, weight);
          break;
        case EvidenceType.COMPLETION:
          this.analyzeCompletion(ev, scores, weight);
          break;
        case EvidenceType.EXPLICIT_PREFERENCE:
          this.analyzeExplicitPreference(ev, scores, weight * 2); // Higher weight
          break;
      }
    }

    // Normalize scores to 0-100
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore > 0) {
      Object.keys(scores).forEach((key) => {
        scores[key as LearningStyle] = Math.round(
          (scores[key as LearningStyle] / maxScore) * 100,
        );
      });
    }

    // Update profile
    profile.visualScore = scores[LearningStyle.VISUAL];
    profile.auditoryScore = scores[LearningStyle.AUDITORY];
    profile.kinestheticScore = scores[LearningStyle.KINESTHETIC];
    profile.readingWritingScore = scores[LearningStyle.READING_WRITING];

    // Determine primary and secondary styles
    const sortedStyles = Object.entries(scores).sort(([, a], [, b]) => b - a);
    profile.primaryStyle = sortedStyles[0][0] as LearningStyle;
    profile.secondaryStyle = sortedStyles[1][0] as LearningStyle;

    // Calculate confidence (based on evidence count and score separation)
    const topScore = sortedStyles[0][1];
    const secondScore = sortedStyles[1][1];
    const separation = topScore - secondScore;
    const evidenceConfidence = Math.min(evidence.length * 2, 50); // Max 50 from count
    const separationConfidence = Math.min(separation, 50); // Max 50 from separation
    profile.confidence = evidenceConfidence + separationConfidence;

    return this.profileRepository.save(profile);
  }

  private analyzeContentInteraction(
    ev: StyleEvidence,
    scores: Record<LearningStyle, number>,
    weight: number,
  ): void {
    const contentType = ev.dataPoint.contentType?.toLowerCase();

    if (contentType?.includes('video') || contentType?.includes('image')) {
      scores[LearningStyle.VISUAL] += weight;
    }
    if (contentType?.includes('audio') || contentType?.includes('podcast')) {
      scores[LearningStyle.AUDITORY] += weight;
    }
    if (
      contentType?.includes('interactive') ||
      contentType?.includes('game')
    ) {
      scores[LearningStyle.KINESTHETIC] += weight;
    }
    if (contentType?.includes('text') || contentType?.includes('article')) {
      scores[LearningStyle.READING_WRITING] += weight;
    }
  }

  private analyzeTimeSpent(
    ev: StyleEvidence,
    scores: Record<LearningStyle, number>,
    weight: number,
  ): void {
    const duration = ev.dataPoint.duration || 0;
    const contentType = ev.dataPoint.contentType?.toLowerCase();

    // Higher time = preference (normalized to 0-1 range)
    const normalizedDuration = Math.min(duration / 1800, 1); // 30 min max

    if (contentType?.includes('video') || contentType?.includes('image')) {
      scores[LearningStyle.VISUAL] += weight * normalizedDuration;
    }
    if (contentType?.includes('audio')) {
      scores[LearningStyle.AUDITORY] += weight * normalizedDuration;
    }
    if (contentType?.includes('interactive')) {
      scores[LearningStyle.KINESTHETIC] += weight * normalizedDuration;
    }
    if (contentType?.includes('text')) {
      scores[LearningStyle.READING_WRITING] += weight * normalizedDuration;
    }
  }

  private analyzePerformance(
    ev: StyleEvidence,
    scores: Record<LearningStyle, number>,
    weight: number,
  ): void {
    const score = ev.dataPoint.score || 0;
    const contentType = ev.dataPoint.contentType?.toLowerCase();

    // Higher performance = better fit (normalized 0-1)
    const normalizedScore = score / 100;

    if (contentType?.includes('video') || contentType?.includes('visual')) {
      scores[LearningStyle.VISUAL] += weight * normalizedScore;
    }
    if (contentType?.includes('audio') || contentType?.includes('listening')) {
      scores[LearningStyle.AUDITORY] += weight * normalizedScore;
    }
    if (contentType?.includes('hands-on') || contentType?.includes('lab')) {
      scores[LearningStyle.KINESTHETIC] += weight * normalizedScore;
    }
    if (contentType?.includes('reading') || contentType?.includes('text')) {
      scores[LearningStyle.READING_WRITING] += weight * normalizedScore;
    }
  }

  private analyzeCompletion(
    ev: StyleEvidence,
    scores: Record<LearningStyle, number>,
    weight: number,
  ): void {
    const completed = ev.dataPoint.completed;
    const contentType = ev.dataPoint.contentType?.toLowerCase();

    if (!completed) return;

    if (contentType?.includes('video') || contentType?.includes('visual')) {
      scores[LearningStyle.VISUAL] += weight;
    }
    if (contentType?.includes('audio')) {
      scores[LearningStyle.AUDITORY] += weight;
    }
    if (contentType?.includes('interactive')) {
      scores[LearningStyle.KINESTHETIC] += weight;
    }
    if (contentType?.includes('text') || contentType?.includes('reading')) {
      scores[LearningStyle.READING_WRITING] += weight;
    }
  }

  private analyzeExplicitPreference(
    ev: StyleEvidence,
    scores: Record<LearningStyle, number>,
    weight: number,
  ): void {
    const preference = ev.dataPoint.preference?.toUpperCase();

    if (preference && preference in LearningStyle) {
      scores[preference as LearningStyle] += weight;
    }
  }

  async getProfile(studentId: string): Promise<LearningStyleProfile> {
    return this.getOrCreateProfile(studentId);
  }

  async getRecommendations(studentId: string): Promise<StyleRecommendation> {
    const profile = await this.getOrCreateProfile(studentId);

    const recommendations: Record<LearningStyle, StyleRecommendation> = {
      [LearningStyle.VISUAL]: {
        studyMethods: [
          'Use diagrams and mind maps',
          'Watch educational videos',
          'Color-code your notes',
          'Create flashcards with images',
          'Draw concepts and relationships',
        ],
        contentFormats: ['video', 'infographic', 'diagram', 'chart', 'image'],
        tipOfTheDay:
          'Try creating a visual timeline of key concepts you need to remember.',
      },
      [LearningStyle.AUDITORY]: {
        studyMethods: [
          'Listen to podcasts or audiobooks',
          'Record yourself explaining concepts',
          'Join study groups for discussion',
          'Read your notes aloud',
          'Use mnemonic rhymes or songs',
        ],
        contentFormats: ['audio', 'podcast', 'lecture', 'discussion', 'music'],
        tipOfTheDay:
          'Record a voice memo explaining today\'s lesson to reinforce learning.',
      },
      [LearningStyle.KINESTHETIC]: {
        studyMethods: [
          'Use hands-on experiments',
          'Take frequent breaks to move',
          'Build physical models',
          'Act out concepts or role-play',
          'Use manipulatives or tactile materials',
        ],
        contentFormats: [
          'interactive',
          'simulation',
          'game',
          'hands-on',
          'lab',
        ],
        tipOfTheDay:
          'Try teaching the concept to someone else using gestures and movement.',
      },
      [LearningStyle.READING_WRITING]: {
        studyMethods: [
          'Take detailed written notes',
          'Rewrite notes in your own words',
          'Create lists and outlines',
          'Write summaries after each session',
          'Use written practice problems',
        ],
        contentFormats: ['article', 'textbook', 'essay', 'notes', 'document'],
        tipOfTheDay:
          'Write a one-paragraph summary of what you learned today without looking at your notes.',
      },
    };

    return recommendations[profile.primaryStyle];
  }

  async getEvidenceHistory(
    studentId: string,
    limit = 50,
  ): Promise<StyleEvidence[]> {
    const profile = await this.getOrCreateProfile(studentId);

    return this.evidenceRepository.find({
      where: { profileId: profile.id },
      order: { recordedAt: 'DESC' },
      take: limit,
    });
  }
}
