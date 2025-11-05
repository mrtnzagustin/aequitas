import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { FocusService } from './focus.service';
import { FocusController } from './focus.controller';
import { Student } from './entities/student.entity';
import { StudentAssignment } from './entities/student-assignment.entity';
import { FocusSession } from './entities/focus-session.entity';
import { DistractionEvent } from './entities/distraction-event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Student,
      StudentAssignment,
      FocusSession,
      DistractionEvent,
    ]),
  ],
  controllers: [StudentsController, FocusController],
  providers: [StudentsService, FocusService],
  exports: [StudentsService, FocusService],
})
export class StudentsModule {}
