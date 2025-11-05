import { IsEnum, IsObject, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { EvidenceType } from '../entities/style-evidence.entity';

export class RecordEvidenceDto {
  @IsEnum(EvidenceType)
  evidenceType: EvidenceType;

  @IsObject()
  dataPoint: {
    contentType?: string;
    duration?: number;
    score?: number;
    completed?: boolean;
    preference?: string;
    metadata?: Record<string, any>;
  };

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  weight?: number;
}
