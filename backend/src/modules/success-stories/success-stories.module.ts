import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuccessStoriesService } from './success-stories.service';
import { SuccessStoriesController } from './success-stories.controller';
import { SuccessStory } from './entities/success-story.entity';
import { StoryComment } from './entities/story-comment.entity';
import { StoryCollection } from './entities/story-collection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SuccessStory, StoryComment, StoryCollection])],
  controllers: [SuccessStoriesController],
  providers: [SuccessStoriesService],
  exports: [SuccessStoriesService],
})
export class SuccessStoriesModule {}
