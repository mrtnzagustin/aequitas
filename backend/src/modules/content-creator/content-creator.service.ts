import { Injectable } from '@nestjs/common';
@Injectable()
export class ContentCreatorService {
  async createContent(text: string, format: string) { return { text, format, url: 'generated' }; }
}
