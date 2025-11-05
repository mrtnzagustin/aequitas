import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessibilityProfile } from './entities/accessibility-profile.entity';
import { UpdateAccessibilityProfileDto } from './dto/update-accessibility-profile.dto';

@Injectable()
export class AccessibilityService {
  constructor(
    @InjectRepository(AccessibilityProfile)
    private accessibilityProfileRepository: Repository<AccessibilityProfile>,
  ) {}

  /**
   * Get accessibility profile for a user
   */
  async getProfile(userId: string): Promise<AccessibilityProfile> {
    let profile = await this.accessibilityProfileRepository.findOne({
      where: { userId },
    });

    // If profile doesn't exist, create default one
    if (!profile) {
      profile = this.accessibilityProfileRepository.create({ userId });
      await this.accessibilityProfileRepository.save(profile);
    }

    return profile;
  }

  /**
   * Update accessibility profile
   */
  async updateProfile(
    userId: string,
    updateDto: UpdateAccessibilityProfileDto,
  ): Promise<AccessibilityProfile> {
    let profile = await this.accessibilityProfileRepository.findOne({
      where: { userId },
    });

    if (!profile) {
      // Create new profile if it doesn't exist
      profile = this.accessibilityProfileRepository.create({
        userId,
        ...updateDto,
      });
    } else {
      // Update existing profile
      Object.assign(profile, updateDto);
    }

    return this.accessibilityProfileRepository.save(profile);
  }

  /**
   * Reset profile to defaults
   */
  async resetProfile(userId: string): Promise<AccessibilityProfile> {
    let profile = await this.accessibilityProfileRepository.findOne({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Accessibility profile not found');
    }

    // Reset to defaults
    profile = this.accessibilityProfileRepository.create({
      id: profile.id,
      userId: profile.userId,
    });

    return this.accessibilityProfileRepository.save(profile);
  }

  /**
   * Get suggested settings based on user condition
   */
  async getSuggestedSettings(condition: string): Promise<Partial<AccessibilityProfile>> {
    const suggestions: Record<string, Partial<AccessibilityProfile>> = {
      DYSLEXIA: {
        font: 'OPENDYSLEXIC' as any,
        fontSize: 120,
        lineSpacing: 150,
        backgroundColor: '#fefae0', // Cream color
        textToSpeechEnabled: true,
        speechRate: 0.9,
        reduceAnimations: true,
      },
      ADHD: {
        fontSize: 110,
        lineSpacing: 130,
        focusModeEnabled: true,
        reduceAnimations: true,
        highContrast: false,
      },
      'VISUAL_IMPAIRMENT': {
        fontSize: 150,
        lineSpacing: 180,
        highContrast: true,
        textToSpeechEnabled: true,
        magnifierEnabled: true,
        magnification: 2.0,
      },
      AUTISM: {
        reduceAnimations: true,
        focusModeEnabled: true,
        backgroundColor: '#f0f0f0',
      },
    };

    return suggestions[condition.toUpperCase()] || {};
  }
}
