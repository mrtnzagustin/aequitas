import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

export interface AdaptationParams {
  studentName: string;
  condition: string;
  interests: string[];
  learningPreferences: string[];
  recentNoteSummary: string;
  language: string;
  task: string;
}

@Injectable()
export class LangchainService {
  private llm: ChatOpenAI;

  constructor(private readonly configService: ConfigService) {
    this.llm = new ChatOpenAI({
      openAIApiKey: this.configService.get('OPENAI_API_KEY'),
      modelName: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 2048,
    });
  }

  async generateAdaptation(params: AdaptationParams): Promise<string> {
    const systemPrompt = `You are an expert pedagogical assistant specializing in adapting educational tasks for students with learning differences.

Student Profile:
- Name: the student
- Condition: {condition}
- Interests: {interests}
- Learning Preferences: {learningPreferences}

Recent Context:
{recentNoteSummary}

Your task is to adapt the provided educational task to suit this student's needs. Follow these guidelines:

1. **Simplify language** if the student has reading difficulties
2. **Break down multi-step instructions** into clear, numbered steps
3. **Incorporate the student's interests** where possible to increase engagement
4. **Add visual cues** if the student is a visual learner
5. **Provide scaffolding** for complex concepts
6. **Maintain the core learning objective** of the original task
7. **Respond in {language}**

Do not patronize or oversimplify unnecessarily. Aim for age-appropriate language tailored to the student's specific needs.

After providing the adapted task, briefly explain the key changes you made and why.`;

    const promptTemplate = ChatPromptTemplate.fromMessages([
      ['system', systemPrompt],
      ['user', 'Original Task:\n{task}\n\nPlease generate an adapted version of this task.'],
    ]);

    const chain = promptTemplate
      .pipe(this.llm)
      .pipe(new StringOutputParser());

    return chain.invoke({
      condition: params.condition,
      interests: params.interests.join(', '),
      learningPreferences: params.learningPreferences.join(', '),
      recentNoteSummary: params.recentNoteSummary || 'No recent notes available.',
      language: params.language,
      task: params.task,
    });
  }
}
