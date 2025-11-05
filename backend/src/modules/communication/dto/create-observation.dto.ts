import {
  IsEnum,
  IsString,
  IsArray,
  IsOptional,
  MinLength,
  IsUUID,
} from 'class-validator';
import { ObservationContext } from '../entities/shared-observation.entity';

export class CreateObservationDto {
  @IsUUID()
  studentId: string;

  @IsEnum(ObservationContext)
  context: ObservationContext;

  @IsString()
  @MinLength(10)
  observation: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  concerns?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  victories?: string[];

  @IsArray()
  @IsUUID('4', { each: true })
  sharedWith: string[];
}
