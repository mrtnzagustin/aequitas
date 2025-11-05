import { IsString, IsEnum, IsInt, Min, Max, IsOptional, IsDateString } from 'class-validator';
import { RoomPrivacy } from '../entities/study-room.entity';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsString()
  topic: string;

  @IsString()
  description: string;

  @IsString()
  creatorId: string;

  @IsEnum(RoomPrivacy)
  privacy: RoomPrivacy;

  @IsInt()
  @Min(2)
  @Max(8)
  maxParticipants: number;

  @IsOptional()
  @IsDateString()
  scheduledStart?: string;
}
