import {
  IsBoolean,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsArray,
  IsUUID,
} from 'class-validator';

export class UpdatePreferencesDto {
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  favoriteSoundscapes?: string[];

  @IsOptional()
  @IsBoolean()
  autoPlayEnabled?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  defaultVolume?: number;
}
