import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SuccessStoriesService } from './success-stories.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { StoryStatus } from './entities/success-story.entity';

@Controller('success-stories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SuccessStoriesController {
  constructor(private readonly successStoriesService: SuccessStoriesService) {}

  @Post(':authorId/:authorType')
  @Roles(UserRole.STUDENT, UserRole.PARENT, UserRole.THERAPIST, UserRole.ADMIN)
  create(
    @Param('authorId') authorId: string,
    @Param('authorType') authorType: string,
    @Body() dto: CreateStoryDto,
  ) {
    return this.successStoriesService.create(authorId, authorType, dto);
  }

  @Get()
  @Roles(UserRole.STUDENT, UserRole.PARENT, UserRole.THERAPIST, UserRole.ADMIN)
  findAll(@Query('challenges') challenges?: string, @Query('status') status?: StoryStatus) {
    const challengesArray = challenges ? challenges.split(',') : undefined;
    return this.successStoriesService.findAll({ challenges: challengesArray, status });
  }

  @Get('collections')
  @Roles(UserRole.STUDENT, UserRole.PARENT, UserRole.THERAPIST, UserRole.ADMIN)
  getCollections() {
    return this.successStoriesService.getCollections();
  }

  @Get(':id')
  @Roles(UserRole.STUDENT, UserRole.PARENT, UserRole.THERAPIST, UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.successStoriesService.findOne(id);
  }

  @Patch(':id/approve/:approverId')
  @Roles(UserRole.THERAPIST, UserRole.ADMIN)
  approve(
    @Param('id') id: string,
    @Param('approverId') approverId: string,
    @Body('featured') featured: boolean,
  ) {
    return this.successStoriesService.approve(id, approverId, featured);
  }

  @Post(':id/react')
  @Roles(UserRole.STUDENT, UserRole.PARENT, UserRole.THERAPIST, UserRole.ADMIN)
  addReaction(@Param('id') id: string, @Body('emoji') emoji: string) {
    return this.successStoriesService.addReaction(id, emoji);
  }

  @Post(':id/comment/:authorId')
  @Roles(UserRole.STUDENT, UserRole.PARENT, UserRole.THERAPIST, UserRole.ADMIN)
  addComment(
    @Param('id') id: string,
    @Param('authorId') authorId: string,
    @Body('comment') comment: string,
  ) {
    return this.successStoriesService.addComment(id, authorId, comment);
  }
}
