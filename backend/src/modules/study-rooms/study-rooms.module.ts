import { Module } from '@nestjs/common';
import { StudyRoomsService } from './study-rooms.service';
@Module({ providers: [StudyRoomsService], exports: [StudyRoomsService] })
export class StudyRoomsModule {}
