import { IsEnum, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DistractionType } from '../entities/distraction-event.entity';

export class RecordDistractionDto {
  @ApiProperty({
    enum: DistractionType,
    description: 'Type of distraction',
  })
  @IsEnum(DistractionType)
  type: DistractionType;

  @ApiProperty({
    description: 'Duration of distraction in seconds',
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  duration: number;
}
