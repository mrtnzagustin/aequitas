import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { StudentsModule } from './modules/students/students.module';
import { NotesModule } from './modules/notes/notes.module';
import { AdaptationsModule } from './modules/adaptations/adaptations.module';
import { AiModule } from './modules/ai/ai.module';
import { LearningStyleModule } from './modules/learning-style/learning-style.module';
import { AvatarModule } from './modules/avatar/avatar.module';
import { SocialFeedModule } from './modules/social-feed/social-feed.module';
import { CommunicationHubModule } from './modules/communication/communication-hub.module';
import { SoundscapesModule } from './modules/soundscapes/soundscapes.module';
import { SuccessStoriesModule } from './modules/success-stories/success-stories.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') === 'development', // Disable in production
        logging: configService.get('NODE_ENV') === 'development',
      }),
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    StudentsModule,
    NotesModule,
    AdaptationsModule,
    AiModule,
    LearningStyleModule,
    AvatarModule,
    SocialFeedModule,
    CommunicationHubModule,
    SoundscapesModule,
    SuccessStoriesModule,
  ],
})
export class AppModule {}
