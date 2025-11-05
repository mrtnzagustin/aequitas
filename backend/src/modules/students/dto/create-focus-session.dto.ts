import { IsUUID, IsInt, IsBoolean, IsOptional, IsObject, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FocusEnvironmentSettings } from '../entities/focus-session.entity';

export class CreateFocusSessionDto {
  @ApiProperty({
    description: 'Student ID',
  })
  @IsUUID()
  studentId: string;

  @ApiPropertyOptional({
    description: 'Task ID (if focusing on specific task)',
  })
  @IsOptional()
  @IsUUID()
  taskId?: string;

  @ApiProperty({
    description: 'Planned session duration in minutes',
    minimum: 5,
    maximum: 120,
  })
  @IsInt()
  @Min(5)
  @Max(120)
  plannedDuration: number;

  @ApiPropertyOptional({
    description: 'Environment settings for the session',
  })
  @IsOptional()
  @IsObject()
  environmentSettings?: FocusEnvironmentSettings;
}
