import { Injectable } from '@nestjs/common';
@Injectable()
export class StudyCompanionService {
  async chat(studentId: string, message: string) { return { response: 'AI response to: ' + message }; }
}
