import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';
import { AvatarStyle, AvatarComponents } from '../entities/student-avatar.entity';

export class UpdateAvatarDto {
  @IsOptional()
  @IsEnum(AvatarStyle)
  style?: AvatarStyle;

  @IsOptional()
  @IsObject()
  components?: Partial<AvatarComponents>;

  @IsOptional()
  @IsString()
  backgroundTheme?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @IsOptional()
  @IsString()
  pronouns?: string;

  @IsOptional()
  @IsString()
  bannerUrl?: string;
}
