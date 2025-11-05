import { IsUUID, IsInt, Min, Max, IsEnum } from 'class-validator';
import { GazeDirection, HeadPose, EmotionDetected } from '../entities/focus-metric.entity';

export class RecordMetricDto {
  @IsUUID()
  sessionId: string;

  @IsInt()
  @Min(0)
  @Max(100)
  focusScore: number;

  @IsEnum(GazeDirection)
  gazeDirection: GazeDirection;

  @IsInt()
  @Min(0)
  blinkRate: number;

  @IsEnum(HeadPose)
  headPose: HeadPose;

  @IsEnum(EmotionDetected)
  emotionDetected: EmotionDetected;
}
