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
import { SoundscapesService } from './soundscapes.service';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { SoundscapeType } from './entities/soundscape.entity';

@Controller('soundscapes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SoundscapesController {
  constructor(private readonly soundscapesService: SoundscapesService) {}

  // SOUNDSCAPES

  @Get()
  @Roles(UserRole.STUDENT, UserRole.THERAPIST, UserRole.ADMIN)
  getAllSoundscapes() {
    return this.soundscapesService.getAllSoundscapes();
  }

  @Get('type/:type')
  @Roles(UserRole.STUDENT, UserRole.THERAPIST, UserRole.ADMIN)
  getSoundscapesByType(@Param('type') type: SoundscapeType) {
    return this.soundscapesService.getSoundscapesByType(type);
  }

  @Get('detail/:id')
  @Roles(UserRole.STUDENT, UserRole.THERAPIST, UserRole.ADMIN)
  getSoundscape(@Param('id') id: string) {
    return this.soundscapesService.getSoundscape(id);
  }

  @Get('recommended')
  @Roles(UserRole.STUDENT, UserRole.THERAPIST, UserRole.ADMIN)
  getRecommendedSoundscapes(@Query('conditions') conditions: string) {
    const conditionsArray = conditions ? conditions.split(',') : [];
    return this.soundscapesService.getRecommendedSoundscapes(conditionsArray);
  }

  // PREFERENCES

  @Get('preferences/:studentId')
  @Roles(UserRole.STUDENT, UserRole.THERAPIST, UserRole.ADMIN)
  getPreferences(@Param('studentId') studentId: string) {
    return this.soundscapesService.getOrCreatePreferences(studentId);
  }

  @Put('preferences/:studentId')
  @Roles(UserRole.STUDENT, UserRole.ADMIN)
  updatePreferences(
    @Param('studentId') studentId: string,
    @Body() dto: UpdatePreferencesDto,
  ) {
    return this.soundscapesService.updatePreferences(studentId, dto);
  }

  @Post('preferences/:studentId/favorites/:soundscapeId')
  @Roles(UserRole.STUDENT, UserRole.ADMIN)
  addToFavorites(
    @Param('studentId') studentId: string,
    @Param('soundscapeId') soundscapeId: string,
  ) {
    return this.soundscapesService.addToFavorites(studentId, soundscapeId);
  }

  @Delete('preferences/:studentId/favorites/:soundscapeId')
  @Roles(UserRole.STUDENT, UserRole.ADMIN)
  removeFromFavorites(
    @Param('studentId') studentId: string,
    @Param('soundscapeId') soundscapeId: string,
  ) {
    return this.soundscapesService.removeFromFavorites(studentId, soundscapeId);
  }

  @Post('preferences/:studentId/playback/:soundscapeId')
  @Roles(UserRole.STUDENT, UserRole.ADMIN)
  trackPlayback(
    @Param('studentId') studentId: string,
    @Param('soundscapeId') soundscapeId: string,
    @Body('focusMinutes') focusMinutes: number,
  ) {
    return this.soundscapesService.trackPlayback(
      studentId,
      soundscapeId,
      focusMinutes,
    );
  }

  @Post('preferences/:studentId/rate/:soundscapeId')
  @Roles(UserRole.STUDENT, UserRole.ADMIN)
  rateSoundscape(
    @Param('studentId') studentId: string,
    @Param('soundscapeId') soundscapeId: string,
    @Body('rating') rating: number,
  ) {
    return this.soundscapesService.rateSoundscape(
      studentId,
      soundscapeId,
      rating,
    );
  }

  @Get('preferences/:studentId/recommendations')
  @Roles(UserRole.STUDENT, UserRole.THERAPIST, UserRole.ADMIN)
  getPersonalizedRecommendations(@Param('studentId') studentId: string) {
    return this.soundscapesService.getPersonalizedRecommendations(studentId);
  }
}
