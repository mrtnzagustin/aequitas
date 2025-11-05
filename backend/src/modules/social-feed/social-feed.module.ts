import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialFeedService } from './social-feed.service';
import { SocialFeedController } from './social-feed.controller';
import { FeedPost } from './entities/feed-post.entity';
import { FeedComment } from './entities/feed-comment.entity';
import { FeedReaction } from './entities/feed-reaction.entity';
import { StudentPoints } from '../gamification/entities/student-points.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FeedPost,
      FeedComment,
      FeedReaction,
      StudentPoints,
    ]),
  ],
  controllers: [SocialFeedController],
  providers: [SocialFeedService],
  exports: [SocialFeedService],
})
export class SocialFeedModule {}
