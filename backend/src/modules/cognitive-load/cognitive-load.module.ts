import { Module } from '@nestjs/common';
import { CognitiveLoadService } from './cognitive-load.service';
@Module({ providers: [CognitiveLoadService], exports: [CognitiveLoadService] })
export class CognitiveLoadModule {}
