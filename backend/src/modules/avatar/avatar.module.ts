import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvatarService } from './avatar.service';
import { AvatarController } from './avatar.controller';
import { StudentAvatar } from './entities/student-avatar.entity';
import { AvatarOutfit } from './entities/avatar-outfit.entity';
import { CosmeticItem } from './entities/cosmetic-item.entity';
import { StudentPoints } from '../gamification/entities/student-points.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudentAvatar,
      AvatarOutfit,
      CosmeticItem,
      StudentPoints,
    ]),
  ],
  controllers: [AvatarController],
  providers: [AvatarService],
  exports: [AvatarService],
})
export class AvatarModule {}
