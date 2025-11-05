import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SocialFeedService } from './social-feed.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('social-feed')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SocialFeedController {
  constructor(private readonly socialFeedService: SocialFeedService) {}

  @Post('posts/:studentId')
  @Roles(UserRole.STUDENT, UserRole.ADMIN)
  createPost(
    @Param('studentId') studentId: string,
    @Body() dto: CreatePostDto,
  ) {
    return this.socialFeedService.createPost(studentId, dto);
  }

  @Get('feed/:studentId')
  @Roles(UserRole.STUDENT, UserRole.THERAPIST, UserRole.ADMIN)
  getFeed(
    @Param('studentId') studentId: string,
    @Query('limit') limit?: number,
  ) {
    return this.socialFeedService.getFeed(studentId, limit);
  }

  @Get('posts/detail/:postId')
  @Roles(UserRole.STUDENT, UserRole.THERAPIST, UserRole.ADMIN)
  getPost(@Param('postId') postId: string) {
    return this.socialFeedService.getPost(postId);
  }

  @Get('posts/student/:studentId')
  @Roles(UserRole.STUDENT, UserRole.THERAPIST, UserRole.ADMIN)
  getPostsByStudent(
    @Param('studentId') studentId: string,
    @Query('limit') limit?: number,
  ) {
    return this.socialFeedService.getPostsByStudent(studentId, limit);
  }

  @Post('posts/:postId/comments/:authorId')
  @Roles(UserRole.STUDENT, UserRole.ADMIN)
  addComment(
    @Param('postId') postId: string,
    @Param('authorId') authorId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.socialFeedService.addComment(postId, authorId, dto);
  }

  @Post('posts/:postId/reactions/:userId')
  @Roles(UserRole.STUDENT, UserRole.ADMIN)
  addReaction(
    @Param('postId') postId: string,
    @Param('userId') userId: string,
    @Body('emoji') emoji: string,
  ) {
    return this.socialFeedService.addReaction(postId, userId, emoji);
  }

  @Delete('posts/:postId/reactions/:userId')
  @Roles(UserRole.STUDENT, UserRole.ADMIN)
  removeReaction(
    @Param('postId') postId: string,
    @Param('userId') userId: string,
    @Query('emoji') emoji: string,
  ) {
    return this.socialFeedService.removeReaction(postId, userId, emoji);
  }

  @Post('posts/:postId/high-five/:userId')
  @Roles(UserRole.STUDENT, UserRole.ADMIN)
  giveHighFive(
    @Param('postId') postId: string,
    @Param('userId') userId: string,
  ) {
    return this.socialFeedService.giveHighFive(postId, userId);
  }

  @Put('posts/:postId/moderate/:moderatorId')
  @Roles(UserRole.THERAPIST, UserRole.ADMIN)
  moderatePost(
    @Param('postId') postId: string,
    @Param('moderatorId') moderatorId: string,
    @Body('approved') approved: boolean,
    @Body('notes') notes?: string,
  ) {
    return this.socialFeedService.moderatePost(
      postId,
      moderatorId,
      approved,
      notes,
    );
  }

  @Put('comments/:commentId/moderate/:moderatorId')
  @Roles(UserRole.THERAPIST, UserRole.ADMIN)
  moderateComment(
    @Param('commentId') commentId: string,
    @Param('moderatorId') moderatorId: string,
    @Body('approved') approved: boolean,
    @Body('notes') notes?: string,
  ) {
    return this.socialFeedService.moderateComment(
      commentId,
      moderatorId,
      approved,
      notes,
    );
  }

  @Delete('posts/:postId/:studentId')
  @Roles(UserRole.STUDENT, UserRole.ADMIN)
  deletePost(
    @Param('postId') postId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.socialFeedService.deletePost(postId, studentId);
  }
}
