import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RemindersService } from './reminders.service';
import { RemindersController } from './reminders.controller';
import { ReminderRule, ReminderDelivery } from './entities/reminder-rule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReminderRule, ReminderDelivery])],
  controllers: [RemindersController],
  providers: [RemindersService],
  exports: [RemindersService],
})
export class NotificationsModule {}
