import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
  ) {}

  async findByStudentId(studentId: string): Promise<Note[]> {
    return this.noteRepository.find({
      where: { studentId },
      order: { createdAt: 'DESC' },
    });
  }
}
