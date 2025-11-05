import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SoundscapesService } from './soundscapes.service';
import { SoundscapesController } from './soundscapes.controller';
import { Soundscape } from './entities/soundscape.entity';
import { StudentSoundPreference } from './entities/student-sound-preference.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Soundscape, StudentSoundPreference])],
  controllers: [SoundscapesController],
  providers: [SoundscapesService],
  exports: [SoundscapesService],
})
export class SoundscapesModule {}
