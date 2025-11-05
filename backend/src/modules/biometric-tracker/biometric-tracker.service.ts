import { Injectable } from '@nestjs/common';
@Injectable()
export class BiometricTrackerService {
  async trackFocus(studentId: string, focusLevel: number) { return { studentId, focusLevel }; }
}
