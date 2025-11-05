import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { MoodCheckIn, MoodType } from './entities/mood-checkin.entity';
import { CreateMoodCheckInDto } from './dto/create-mood-checkin.dto';

export interface MoodTrends {
  period: string;
  moods: { mood: MoodType; count: number }[];
  averageIntensity: number;
  alertTriggered: boolean;
  concerningPatternDays: number;
}

@Injectable()
export class MoodCheckInsService {
  constructor(
    @InjectRepository(MoodCheckIn)
    private readonly moodCheckInRepository: Repository<MoodCheckIn>,
  ) {}

  async create(createDto: CreateMoodCheckInDto): Promise<MoodCheckIn> {
    const moodCheckIn = this.moodCheckInRepository.create(createDto);
    return this.moodCheckInRepository.save(moodCheckIn);
  }

  async findByStudentId(studentId: string, days: number = 30): Promise<MoodCheckIn[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    return this.moodCheckInRepository.find({
      where: {
        studentId,
        createdAt: Between(since, new Date()),
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getTrends(studentId: string, days: number = 30): Promise<MoodTrends> {
    const checkIns = await this.findByStudentId(studentId, days);

    // Count mood occurrences
    const moodCounts = new Map<MoodType, number>();
    let totalIntensity = 0;
    let intensityCount = 0;

    checkIns.forEach((checkIn) => {
      moodCounts.set(checkIn.mood, (moodCounts.get(checkIn.mood) || 0) + 1);
      if (checkIn.intensity) {
        totalIntensity += checkIn.intensity;
        intensityCount++;
      }
    });

    const moods = Array.from(moodCounts.entries()).map(([mood, count]) => ({
      mood,
      count,
    }));

    // Check for concerning patterns (3+ consecutive sad/anxious days)
    const concerningMoods = [MoodType.SAD, MoodType.ANXIOUS];
    let concerningPatternDays = 0;
    let consecutiveDays = 0;

    const sortedCheckIns = [...checkIns].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );

    for (const checkIn of sortedCheckIns) {
      if (concerningMoods.includes(checkIn.mood)) {
        consecutiveDays++;
        if (consecutiveDays >= 3) {
          concerningPatternDays = consecutiveDays;
          break;
        }
      } else {
        consecutiveDays = 0;
      }
    }

    return {
      period: `${days}d`,
      moods,
      averageIntensity: intensityCount > 0 ? totalIntensity / intensityCount : 0,
      alertTriggered: concerningPatternDays >= 3,
      concerningPatternDays,
    };
  }

  async hasCheckedInToday(studentId: string): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const count = await this.moodCheckInRepository.count({
      where: {
        studentId,
        createdAt: Between(today, tomorrow),
      },
    });

    return count > 0;
  }
}
