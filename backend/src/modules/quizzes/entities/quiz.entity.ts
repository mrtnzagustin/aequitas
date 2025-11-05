import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum QuizDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  SHORT_ANSWER = 'SHORT_ANSWER',
  FILL_BLANK = 'FILL_BLANK',
}

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  sourceContentId: string | null;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 100 })
  subject: string;

  @Column({
    type: 'enum',
    enum: QuizDifficulty,
    default: QuizDifficulty.MEDIUM,
  })
  difficulty: QuizDifficulty;

  @Column({ type: 'varchar', length: 20, default: 'AI' })
  generatedBy: string; // 'AI' or 'TEACHER'

  @Column({ type: 'uuid', nullable: true })
  approvedBy: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => QuizQuestion, (question) => question.quiz)
  questions: QuizQuestion[];
}

@Entity('quiz_questions')
export class QuizQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  quizId: string;

  @Column(() => Quiz)
  quiz: Quiz;

  @Column({
    type: 'enum',
    enum: QuestionType,
  })
  type: QuestionType;

  @Column({ type: 'text' })
  question: string;

  @Column({ type: 'jsonb', nullable: true })
  options: string[] | null; // For multiple choice

  @Column({ type: 'text' })
  correctAnswer: string;

  @Column({ type: 'text' })
  explanation: string;

  @Column({ type: 'int', default: 5 })
  difficulty: number; // 1-10

  @Column({ type: 'varchar', length: 100, nullable: true })
  conceptId: string | null;

  @Column({ type: 'int', default: 0 })
  sequence: number;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('quiz_attempts')
export class QuizAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  quizId: string;

  @Column('uuid')
  studentId: string;

  @Column({ type: 'int', default: 0 })
  score: number; // 0-100

  @Column({ type: 'int', default: 0 })
  correctAnswers: number;

  @Column({ type: 'int', default: 0 })
  totalQuestions: number;

  @Column({ type: 'int', default: 0 })
  timeSpentSeconds: number;

  @Column({ type: 'jsonb', default: {} })
  answers: Record<string, string>; // questionId -> answer

  @CreateDateColumn()
  completedAt: Date;
}
