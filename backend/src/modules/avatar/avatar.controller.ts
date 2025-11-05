import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { SaveOutfitDto } from './dto/save-outfit.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ItemCategory } from './entities/cosmetic-item.entity';

@Controller('avatar')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @Get(':studentId')
  @Roles(UserRole.STUDENT, UserRole.THERAPIST, UserRole.ADMIN)
  getAvatar(@Param('studentId') studentId: string) {
    return this.avatarService.getOrCreateAvatar(studentId);
  }

  @Put(':studentId')
  @Roles(UserRole.STUDENT, UserRole.THERAPIST, UserRole.ADMIN)
  updateAvatar(
    @Param('studentId') studentId: string,
    @Body() dto: UpdateAvatarDto,
  ) {
    return this.avatarService.updateAvatar(studentId, dto);
  }

  @Post(':studentId/unlock/:itemId')
  @Roles(UserRole.STUDENT, UserRole.ADMIN)
  unlockItem(
    @Param('studentId') studentId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.avatarService.unlockItem(studentId, itemId);
  }

  @Get(':studentId/items')
  @Roles(UserRole.STUDENT, UserRole.THERAPIST, UserRole.ADMIN)
  getAvailableItems(@Param('studentId') studentId: string) {
    return this.avatarService.getAvailableItems(studentId);
  }

  @Get('items/category/:category')
  @Roles(UserRole.STUDENT, UserRole.THERAPIST, UserRole.ADMIN)
  getItemsByCategory(@Param('category') category: ItemCategory) {
    return this.avatarService.getItemsByCategory(category);
  }

  @Post(':studentId/outfits')
  @Roles(UserRole.STUDENT)
  saveOutfit(
    @Param('studentId') studentId: string,
    @Body() dto: SaveOutfitDto,
  ) {
    return this.avatarService.saveOutfit(studentId, dto);
  }

  @Put(':studentId/outfits/:outfitId')
  @Roles(UserRole.STUDENT)
  loadOutfit(
    @Param('studentId') studentId: string,
    @Param('outfitId') outfitId: string,
  ) {
    return this.avatarService.loadOutfit(studentId, outfitId);
  }

  @Delete(':studentId/outfits/:outfitId')
  @Roles(UserRole.STUDENT)
  deleteOutfit(
    @Param('studentId') studentId: string,
    @Param('outfitId') outfitId: string,
  ) {
    return this.avatarService.deleteOutfit(studentId, outfitId);
  }
}
