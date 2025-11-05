import { IsEnum, IsBoolean, IsInt, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AccessibilityFont } from '../entities/accessibility-profile.entity';

export class UpdateAccessibilityProfileDto {
  @ApiPropertyOptional({
    enum: AccessibilityFont,
    description: 'Font type for accessibility',
  })
  @IsOptional()
  @IsEnum(AccessibilityFont)
  font?: AccessibilityFont;

  @ApiPropertyOptional({
    description: 'Font size as percentage (50-200)',
    minimum: 50,
    maximum: 200,
  })
  @IsOptional()
  @IsInt()
  @Min(50)
  @Max(200)
  fontSize?: number;

  @ApiPropertyOptional({
    description: 'Line spacing as percentage (100-250)',
    minimum: 100,
    maximum: 250,
  })
  @IsOptional()
  @IsInt()
  @Min(100)
  @Max(250)
  lineSpacing?: number;

  @ApiPropertyOptional({
    description: 'Background color (hex code)',
  })
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @ApiPropertyOptional({
    description: 'Enable high contrast mode',
  })
  @IsOptional()
  @IsBoolean()
  highContrast?: boolean;

  @ApiPropertyOptional({
    description: 'Enable text-to-speech',
  })
  @IsOptional()
  @IsBoolean()
  textToSpeechEnabled?: boolean;

  @ApiPropertyOptional({
    description: 'Speech rate (0.5-2.0)',
    minimum: 0.5,
    maximum: 2.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.5)
  @Max(2.0)
  speechRate?: number;

  @ApiPropertyOptional({
    description: 'Enable screen magnifier',
  })
  @IsOptional()
  @IsBoolean()
  magnifierEnabled?: boolean;

  @ApiPropertyOptional({
    description: 'Magnification level (1.0-3.0)',
    minimum: 1.0,
    maximum: 3.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(1.0)
  @Max(3.0)
  magnification?: number;

  @ApiPropertyOptional({
    description: 'Enable focus mode',
  })
  @IsOptional()
  @IsBoolean()
  focusModeEnabled?: boolean;

  @ApiPropertyOptional({
    description: 'Enable reading ruler',
  })
  @IsOptional()
  @IsBoolean()
  readingRulerEnabled?: boolean;

  @ApiPropertyOptional({
    description: 'Reduce animations',
  })
  @IsOptional()
  @IsBoolean()
  reduceAnimations?: boolean;

  @ApiPropertyOptional({
    description: 'Preferred TTS voice',
  })
  @IsOptional()
  @IsString()
  preferredVoice?: string;
}
