import {
  IsEnum,
  IsString,
  IsArray,
  IsOptional,
  MinLength,
  MaxLength,
  IsUUID,
} from 'class-validator';
import { MessagePriority } from '../entities/parent-teacher-message.entity';

export class CreateMessageDto {
  @IsUUID()
  studentId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  recipientIds: string[];

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  subject: string;

  @IsString()
  @MinLength(1)
  body: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];

  @IsOptional()
  @IsEnum(MessagePriority)
  priority?: MessagePriority;
}
