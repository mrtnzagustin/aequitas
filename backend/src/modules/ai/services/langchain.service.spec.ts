import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { LangchainService, AdaptationParams } from './langchain.service';
import { ChatOpenAI } from '@langchain/openai';

// Mock LangChain modules
jest.mock('@langchain/openai');
jest.mock('@langchain/core/prompts');
jest.mock('@langchain/core/output_parsers');

describe('LangchainService', () => {
  let service: LangchainService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'OPENAI_API_KEY') return 'test-api-key';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LangchainService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<LangchainService>(LangchainService);
    configService = module.get<ConfigService>(ConfigService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateAdaptation', () => {
    const mockParams: AdaptationParams = {
      studentName: 'Maria',
      condition: 'Dyslexia',
      interests: ['music', 'art'],
      learningPreferences: ['visual', 'hands-on'],
      recentNoteSummary: 'Student has shown improvement in reading comprehension.',
      language: 'es-AR',
      task: 'Read chapter 5 and answer questions 1-10',
    };

    it('should be properly initialized', () => {
      // Service initialization test
      expect(service).toBeDefined();
    });
  });
});
