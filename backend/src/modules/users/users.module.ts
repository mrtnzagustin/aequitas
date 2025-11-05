import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AccessibilityService } from './accessibility.service';
import { AccessibilityController } from './accessibility.controller';
import { User } from './entities/user.entity';
import { AccessibilityProfile } from './entities/accessibility-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, AccessibilityProfile])],
  controllers: [UsersController, AccessibilityController],
  providers: [UsersService, AccessibilityService],
  exports: [UsersService, AccessibilityService],
})
export class UsersModule {}
