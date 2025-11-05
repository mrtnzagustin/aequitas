import { Injectable } from '@nestjs/common';
@Injectable()
export class CognitiveLoadService {
  async recordMetric(studentId: string, loadPercentage: number) { return { studentId, loadPercentage }; }
}
