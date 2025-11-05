import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentoringService } from './mentoring.service';
import { MentoringController } from './mentoring.controller';
import { PeerMentor } from './entities/peer-mentor.entity';
import { MentorMatch } from './entities/mentor-match.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PeerMentor, MentorMatch])],
  controllers: [MentoringController],
  providers: [MentoringService],
  exports: [MentoringService],
})
export class MentoringModule {}
