import { IsEnum, IsInt, IsBoolean, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReminderEventType, DeliveryMethod, ReminderTone } from '../entities/reminder-rule.entity';

export class CreateReminderRuleDto {
  @ApiProperty({ enum: ReminderEventType })
  @IsEnum(ReminderEventType)
  eventType: ReminderEventType;

  @ApiProperty({ description: 'Minutes before event to send reminder' })
  @IsInt()
  @Min(0)
  advanceMinutes: number;

  @ApiPropertyOptional({ enum: DeliveryMethod })
  @IsOptional()
  @IsEnum(DeliveryMethod)
  deliveryMethod?: DeliveryMethod;

  @ApiPropertyOptional({ enum: ReminderTone })
  @IsOptional()
  @IsEnum(ReminderTone)
  tone?: ReminderTone;
}

export class UpdateReminderRuleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  advanceMinutes?: number;

  @ApiPropertyOptional({ enum: DeliveryMethod })
  @IsOptional()
  @IsEnum(DeliveryMethod)
  deliveryMethod?: DeliveryMethod;

  @ApiPropertyOptional({ enum: ReminderTone })
  @IsOptional()
  @IsEnum(ReminderTone)
  tone?: ReminderTone;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
