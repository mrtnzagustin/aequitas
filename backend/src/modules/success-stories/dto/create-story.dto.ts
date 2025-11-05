import {
  IsEnum,
  IsString,
  IsArray,
  IsOptional,
  IsObject,
  MinLength,
  MaxLength,
} from 'class-validator';
import {
  AuthorType,
  ContentType,
  StoryVisibility,
  OutcomeMetrics,
} from '../entities/success-story.entity';

export class CreateStoryDto {
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @IsString()
  @MinLength(20)
  @MaxLength(500)
  summary: string;

  @IsString()
  @MinLength(50)
  content: string;

  @IsEnum(ContentType)
  contentType: ContentType;

  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @IsArray()
  @IsString({ each: true })
  challenges: string[];

  @IsOptional()
  @IsObject()
  outcomeMetrics?: OutcomeMetrics;

  @IsEnum(StoryVisibility)
  visibility: StoryVisibility;
}
