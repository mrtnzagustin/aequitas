import { Injectable } from '@nestjs/common';
@Injectable()
export class StudyRoomsService {
  async createRoom(name: string) { return { id: '1', name, participants: [] }; }
}
