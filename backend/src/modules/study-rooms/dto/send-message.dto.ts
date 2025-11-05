import { IsString, IsEnum, IsUUID } from 'class-validator';
import { MessageType } from '../entities/room-message.entity';

export class SendMessageDto {
  @IsUUID()
  roomId: string;

  @IsUUID()
  senderId: string;

  @IsString()
  message: string;

  @IsEnum(MessageType)
  type: MessageType;
}
