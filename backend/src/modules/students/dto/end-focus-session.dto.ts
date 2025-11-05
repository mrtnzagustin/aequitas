import { IsBoolean, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EndFocusSessionDto {
  @ApiProperty({
    description: 'Whether the session was completed successfully',
  })
  @IsBoolean()
  completedSuccessfully: boolean;

  @ApiProperty({
    description: 'Actual duration in minutes',
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  actualDuration: number;

  @ApiProperty({
    description: 'Focus score (0-100)',
    minimum: 0,
    maximum: 100,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  focusScore: number;
}
