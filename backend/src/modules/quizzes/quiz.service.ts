import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz, QuizQuestion, QuizAttempt, QuizDifficulty, QuestionType } from './entities/quiz.entity';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    @InjectRepository(QuizQuestion)
    private questionRepository: Repository<QuizQuestion>,
    @InjectRepository(QuizAttempt)
    private attemptRepository: Repository<QuizAttempt>,
  ) {}

  async generateQuiz(
    subject: string,
    contentText: string,
    difficulty: QuizDifficulty,
  ): Promise<Quiz> {
    // AI-generated quiz (simplified - would use GPT-4 in production)
    const quiz = this.quizRepository.create({
      title: `${subject} Quiz`,
      subject,
      difficulty,
      generatedBy: 'AI',
    });

    const savedQuiz = await this.quizRepository.save(quiz);

    // Generate questions
    const questions = this.generateQuestions(contentText, difficulty);

    for (const [index, questionData] of questions.entries()) {
      const question = this.questionRepository.create({
        ...questionData,
        quizId: savedQuiz.id,
        sequence: index + 1,
      });
      await this.questionRepository.save(question);
    }

    return this.getQuizWithQuestions(savedQuiz.id);
  }

  async getQuizWithQuestions(quizId: string): Promise<Quiz> {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: ['questions'],
    });

    if (!quiz) {
      throw new Error(`Quiz with id ${quizId} not found`);
    }

    return quiz;
  }

  async submitQuizAttempt(
    quizId: string,
    studentId: string,
    answers: Record<string, string>,
    timeSpentSeconds: number,
  ): Promise<QuizAttempt> {
    const quiz = await this.getQuizWithQuestions(quizId);
    let correctCount = 0;

    // Check answers
    for (const question of quiz.questions) {
      const studentAnswer = answers[question.id];
      if (this.checkAnswer(studentAnswer, question.correctAnswer, question.type)) {
        correctCount++;
      }
    }

    const score = Math.round((correctCount / quiz.questions.length) * 100);

    const attempt = this.attemptRepository.create({
      quizId,
      studentId,
      score,
      correctAnswers: correctCount,
      totalQuestions: quiz.questions.length,
      timeSpentSeconds,
      answers,
    });

    return this.attemptRepository.save(attempt);
  }

  private checkAnswer(studentAnswer: string, correctAnswer: string, type: QuestionType): boolean {
    if (!studentAnswer) return false;

    if (type === QuestionType.TRUE_FALSE || type === QuestionType.MULTIPLE_CHOICE) {
      return studentAnswer.toLowerCase() === correctAnswer.toLowerCase();
    }

    // Fuzzy match for short answer
    return studentAnswer.toLowerCase().includes(correctAnswer.toLowerCase());
  }

  private generateQuestions(content: string, difficulty: QuizDifficulty): Partial<QuizQuestion>[] {
    // Simplified question generation (would use AI in production)
    return [
      {
        type: QuestionType.MULTIPLE_CHOICE,
        question: 'What is the main concept discussed?',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option A',
        explanation: 'The main concept is Option A because...',
        difficulty: 5,
      },
      {
        type: QuestionType.TRUE_FALSE,
        question: 'This statement is true',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'This is true because...',
        difficulty: 3,
      },
      {
        type: QuestionType.SHORT_ANSWER,
        question: 'Explain the key idea',
        options: null,
        correctAnswer: 'key idea',
        explanation: 'The key idea involves...',
        difficulty: 7,
      },
    ];
  }

  async getStudentAttempts(studentId: string): Promise<QuizAttempt[]> {
    return this.attemptRepository.find({
      where: { studentId },
      order: { completedAt: 'DESC' },
    });
  }

  async getQuizAnalytics(quizId: string) {
    const attempts = await this.attemptRepository.find({
      where: { quizId },
    });

    if (attempts.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        averageTime: 0,
        passRate: 0,
      };
    }

    const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);
    const totalTime = attempts.reduce((sum, a) => sum + a.timeSpentSeconds, 0);
    const passCount = attempts.filter((a) => a.score >= 70).length;

    return {
      totalAttempts: attempts.length,
      averageScore: Math.round(totalScore / attempts.length),
      averageTime: Math.round(totalTime / attempts.length),
      passRate: Math.round((passCount / attempts.length) * 100),
    };
  }
}
