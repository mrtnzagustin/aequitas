import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoodCheckIn } from './entities/mood-checkin.entity';
import { MoodCheckInsService } from './mood-checkins.service';
import { MoodCheckInsController } from './mood-checkins.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MoodCheckIn])],
  controllers: [MoodCheckInsController],
  providers: [MoodCheckInsService],
  exports: [MoodCheckInsService],
})
export class MoodCheckInsModule {}
