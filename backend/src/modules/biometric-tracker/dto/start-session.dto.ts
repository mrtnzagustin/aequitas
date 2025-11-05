import { IsUUID, IsOptional, IsString } from 'class-validator';

export class StartSessionDto {
  @IsUUID()
  studentId: string;

  @IsOptional()
  @IsString()
  taskId?: string;
}
