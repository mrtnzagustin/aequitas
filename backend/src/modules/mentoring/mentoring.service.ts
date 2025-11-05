import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PeerMentor } from './entities/peer-mentor.entity';
import { MentorMatch, MatchStatus } from './entities/mentor-match.entity';

@Injectable()
export class MentoringService {
  constructor(
    @InjectRepository(PeerMentor)
    private mentorRepository: Repository<PeerMentor>,
    @InjectRepository(MentorMatch)
    private matchRepository: Repository<MentorMatch>,
  ) {}

  async registerMentor(studentId: string, data: Partial<PeerMentor>): Promise<PeerMentor> {
    const mentor = this.mentorRepository.create({ studentId, ...data });
    return this.mentorRepository.save(mentor);
  }

  async findMentors(focusArea: string): Promise<PeerMentor[]> {
    return this.mentorRepository.find({
      where: { isActive: true },
    });
  }

  async createMatch(mentorId: string, menteeId: string, focusArea: string): Promise<MentorMatch> {
    const match = this.matchRepository.create({
      mentorId,
      menteeId,
      focusArea,
      matchScore: 80,
      status: MatchStatus.PROPOSED,
    });
    return this.matchRepository.save(match);
  }

  async acceptMatch(matchId: string): Promise<MentorMatch> {
    const match = await this.matchRepository.findOne({ where: { id: matchId } });
    if (!match) throw new NotFoundException('Match not found');
    match.status = MatchStatus.ACCEPTED;
    match.startedAt = new Date();
    return this.matchRepository.save(match);
  }

  async getMatches(studentId: string): Promise<MentorMatch[]> {
    return this.matchRepository.find({
      where: [{ mentorId: studentId }, { menteeId: studentId }],
    });
  }
}
