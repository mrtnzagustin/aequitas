import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Soundscape, SoundscapeType } from './entities/soundscape.entity';
import {
  StudentSoundPreference,
  EffectivenessRating,
} from './entities/student-sound-preference.entity';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Injectable()
export class SoundscapesService {
  constructor(
    @InjectRepository(Soundscape)
    private soundscapeRepository: Repository<Soundscape>,
    @InjectRepository(StudentSoundPreference)
    private preferenceRepository: Repository<StudentSoundPreference>,
  ) {}

  // ===== SOUNDSCAPES =====

  async getAllSoundscapes(): Promise<Soundscape[]> {
    return this.soundscapeRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async getSoundscapesByType(type: SoundscapeType): Promise<Soundscape[]> {
    return this.soundscapeRepository.find({
      where: { type, isActive: true },
      order: { name: 'ASC' },
    });
  }

  async getSoundscape(id: string): Promise<Soundscape> {
    const soundscape = await this.soundscapeRepository.findOne({
      where: { id },
    });

    if (!soundscape) {
      throw new NotFoundException('Soundscape not found');
    }

    return soundscape;
  }

  async getRecommendedSoundscapes(
    learningConditions: string[],
  ): Promise<Soundscape[]> {
    const allSoundscapes = await this.getAllSoundscapes();

    // Filter soundscapes that match any of the learning conditions
    return allSoundscapes.filter((soundscape) =>
      soundscape.recommendedFor.some((condition) =>
        learningConditions.includes(condition),
      ),
    );
  }

  // ===== PREFERENCES =====

  async getOrCreatePreferences(
    studentId: string,
  ): Promise<StudentSoundPreference> {
    let preference = await this.preferenceRepository.findOne({
      where: { studentId },
    });

    if (!preference) {
      preference = this.preferenceRepository.create({
        studentId,
        favoriteSoundscapes: [],
        effectivenessRatings: [],
        autoPlayEnabled: false,
        defaultVolume: 70,
      });
      preference = await this.preferenceRepository.save(preference);
    }

    return preference;
  }

  async updatePreferences(
    studentId: string,
    dto: UpdatePreferencesDto,
  ): Promise<StudentSoundPreference> {
    const preference = await this.getOrCreatePreferences(studentId);

    if (dto.favoriteSoundscapes !== undefined) {
      preference.favoriteSoundscapes = dto.favoriteSoundscapes;
    }

    if (dto.autoPlayEnabled !== undefined) {
      preference.autoPlayEnabled = dto.autoPlayEnabled;
    }

    if (dto.defaultVolume !== undefined) {
      preference.defaultVolume = dto.defaultVolume;
    }

    return this.preferenceRepository.save(preference);
  }

  async addToFavorites(
    studentId: string,
    soundscapeId: string,
  ): Promise<StudentSoundPreference> {
    const preference = await this.getOrCreatePreferences(studentId);

    // Verify soundscape exists
    await this.getSoundscape(soundscapeId);

    if (!preference.favoriteSoundscapes.includes(soundscapeId)) {
      preference.favoriteSoundscapes.push(soundscapeId);
      await this.preferenceRepository.save(preference);
    }

    return preference;
  }

  async removeFromFavorites(
    studentId: string,
    soundscapeId: string,
  ): Promise<StudentSoundPreference> {
    const preference = await this.getOrCreatePreferences(studentId);

    preference.favoriteSoundscapes = preference.favoriteSoundscapes.filter(
      (id) => id !== soundscapeId,
    );

    return this.preferenceRepository.save(preference);
  }

  async trackPlayback(
    studentId: string,
    soundscapeId: string,
    focusMinutes: number,
  ): Promise<void> {
    const preference = await this.getOrCreatePreferences(studentId);

    // Update last played
    preference.lastPlayedSoundscapeId = soundscapeId;
    preference.lastPlayedAt = new Date();

    // Update effectiveness rating
    const existingRating = preference.effectivenessRatings.find(
      (r) => r.soundscapeId === soundscapeId,
    );

    if (existingRating) {
      existingRating.timesPlayed += 1;
      existingRating.totalFocusMinutes += focusMinutes;
    } else {
      preference.effectivenessRatings.push({
        soundscapeId,
        rating: 0, // Will be set by user feedback
        timesPlayed: 1,
        totalFocusMinutes: focusMinutes,
      });
    }

    await this.preferenceRepository.save(preference);
  }

  async rateSoundscape(
    studentId: string,
    soundscapeId: string,
    rating: number,
  ): Promise<StudentSoundPreference> {
    const preference = await this.getOrCreatePreferences(studentId);

    const existingRating = preference.effectivenessRatings.find(
      (r) => r.soundscapeId === soundscapeId,
    );

    if (existingRating) {
      existingRating.rating = rating;
    } else {
      preference.effectivenessRatings.push({
        soundscapeId,
        rating,
        timesPlayed: 0,
        totalFocusMinutes: 0,
      });
    }

    return this.preferenceRepository.save(preference);
  }

  async getPersonalizedRecommendations(
    studentId: string,
  ): Promise<Soundscape[]> {
    const preference = await this.getOrCreatePreferences(studentId);
    const allSoundscapes = await this.getAllSoundscapes();

    // Sort by effectiveness ratings
    const sortedByRating = [...allSoundscapes].sort((a, b) => {
      const ratingA =
        preference.effectivenessRatings.find((r) => r.soundscapeId === a.id)
          ?.rating || 0;
      const ratingB =
        preference.effectivenessRatings.find((r) => r.soundscapeId === b.id)
          ?.rating || 0;
      return ratingB - ratingA;
    });

    return sortedByRating.slice(0, 5); // Top 5 recommendations
  }
}
