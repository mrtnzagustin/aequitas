import { IsUUID, IsString, IsObject, ValidateNested, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

class LoadIndicatorsDto {
  @IsNumber()
  @Min(0)
  interactionPace: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  errorRate: number;

  @IsNumber()
  @Min(0)
  taskSwitches: number;

  @IsNumber()
  @Min(0)
  reReadingCount: number;

  @IsNumber()
  @Min(0)
  helpRequests: number;

  @IsNumber()
  @Min(0)
  microPauses: number;
}

export class RecordMeasurementDto {
  @IsUUID()
  studentId: string;

  @IsString()
  taskId: string;

  @IsObject()
  @ValidateNested()
  @Type(() => LoadIndicatorsDto)
  indicators: LoadIndicatorsDto;
}
