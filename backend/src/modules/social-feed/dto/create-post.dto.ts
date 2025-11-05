import {
  IsEnum,
  IsString,
  IsOptional,
  IsUUID,
  MinLength,
  MaxLength,
} from 'class-validator';
import { PostType, PostVisibility } from '../entities/feed-post.entity';

export class CreatePostDto {
  @IsEnum(PostType)
  type: PostType;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  content: string;

  @IsOptional()
  @IsUUID()
  badgeId?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsEnum(PostVisibility)
  visibility?: PostVisibility;
}
