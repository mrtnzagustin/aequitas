import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyRoomsService } from './study-rooms.service';
import { StudyRoomsController } from './study-rooms.controller';
import { StudyRoom } from './entities/study-room.entity';
import { RoomParticipant } from './entities/room-participant.entity';
import { RoomMessage } from './entities/room-message.entity';
import { WhiteboardSession } from './entities/whiteboard-session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudyRoom,
      RoomParticipant,
      RoomMessage,
      WhiteboardSession,
    ]),
  ],
  controllers: [StudyRoomsController],
  providers: [StudyRoomsService],
  exports: [StudyRoomsService],
})
export class StudyRoomsModule {}
