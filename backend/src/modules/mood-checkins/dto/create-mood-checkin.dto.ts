import { IsEnum, IsOptional, IsString, IsInt, Min, Max, IsArray } from 'class-validator';
import { MoodType } from '../entities/mood-checkin.entity';

export class CreateMoodCheckInDto {
  @IsString()
  studentId: string;

  @IsEnum(MoodType)
  mood: MoodType;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  intensity?: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  triggers?: string[];
}
