import { Injectable } from '@nestjs/common';
import { createWorker } from 'tesseract.js';

@Injectable()
export class OcrService {
  async extractTextFromImage(imagePath: string, lang: string = 'spa'): Promise<string> {
    const worker = await createWorker(lang);

    const { data: { text } } = await worker.recognize(imagePath);

    await worker.terminate();

    return text;
  }
}
