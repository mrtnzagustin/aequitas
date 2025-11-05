import { Injectable } from '@nestjs/common';
@Injectable()
export class LearningPathsService {
  async generatePath(studentId: string, subject: string) { return { studentId, subject, steps: [] }; }
}
