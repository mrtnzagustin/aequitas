import { Test, TestingModule } from '@nestjs/testing';
import { OcrService } from './ocr.service';
import * as Tesseract from 'tesseract.js';

// Mock tesseract.js
jest.mock('tesseract.js');

describe('OcrService', () => {
  let service: OcrService;

  const mockWorker = {
    recognize: jest.fn().mockResolvedValue({
      data: { text: 'Extracted text from image' },
    }),
    terminate: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OcrService],
    }).compile();

    service = module.get<OcrService>(OcrService);

    // Mock createWorker
    (Tesseract.createWorker as jest.Mock) = jest.fn().mockResolvedValue(mockWorker);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('extractTextFromImage', () => {
    it('should extract text from image', async () => {
      const imagePath = '/path/to/image.jpg';
      const result = await service.extractTextFromImage(imagePath);

      expect(result).toBe('Extracted text from image');
      expect(Tesseract.createWorker).toHaveBeenCalledWith('spa');
      expect(mockWorker.recognize).toHaveBeenCalledWith(imagePath);
      expect(mockWorker.terminate).toHaveBeenCalled();
    });

    it('should use specified language', async () => {
      await service.extractTextFromImage('/path/to/image.jpg', 'eng');

      expect(Tesseract.createWorker).toHaveBeenCalledWith('eng');
    });

    it('should terminate worker after processing', async () => {
      await service.extractTextFromImage('/path/to/image.jpg');

      expect(mockWorker.terminate).toHaveBeenCalled();
    });
  });
});
