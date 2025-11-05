import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudyRoom, RoomStatus } from './entities/study-room.entity';
import { RoomParticipant, ParticipantRole } from './entities/room-participant.entity';
import { RoomMessage } from './entities/room-message.entity';
import { WhiteboardSession } from './entities/whiteboard-session.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class StudyRoomsService {
  constructor(
    @InjectRepository(StudyRoom)
    private readonly roomRepository: Repository<StudyRoom>,
    @InjectRepository(RoomParticipant)
    private readonly participantRepository: Repository<RoomParticipant>,
    @InjectRepository(RoomMessage)
    private readonly messageRepository: Repository<RoomMessage>,
    @InjectRepository(WhiteboardSession)
    private readonly whiteboardRepository: Repository<WhiteboardSession>,
  ) {}

  async createRoom(dto: CreateRoomDto): Promise<StudyRoom> {
    const status = dto.scheduledStart ? RoomStatus.SCHEDULED : RoomStatus.ACTIVE;

    const room = this.roomRepository.create({
      name: dto.name,
      topic: dto.topic,
      description: dto.description,
      creatorId: dto.creatorId,
      privacy: dto.privacy,
      maxParticipants: dto.maxParticipants,
      scheduledStart: dto.scheduledStart ? new Date(dto.scheduledStart) : undefined,
      actualStart: status === RoomStatus.ACTIVE ? new Date() : undefined,
      status,
      whiteboardData: {},
    });

    const saved = await this.roomRepository.save(room);

    // Auto-join creator as moderator (only for active rooms)
    if (status === RoomStatus.ACTIVE) {
      await this.joinRoom(saved.id, dto.creatorId, ParticipantRole.MODERATOR);
    }

    return saved;
  }

  async getAvailableRooms(): Promise<StudyRoom[]> {
    const rooms = await this.roomRepository.find({
      where: { status: RoomStatus.ACTIVE },
      relations: ['creator'],
    });

    // Filter out full rooms
    const roomsWithCounts = await Promise.all(
      rooms.map(async (room) => {
        const count = await this.getActiveParticipantCount(room.id);
        return { room, count };
      }),
    );

    return roomsWithCounts
      .filter(({ room, count }) => count < room.maxParticipants)
      .map(({ room }) => room);
  }

  async joinRoom(roomId: string, studentId: string, role: ParticipantRole = ParticipantRole.PARTICIPANT): Promise<RoomParticipant> {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (room.status !== RoomStatus.ACTIVE) {
      throw new BadRequestException('Room is not active');
    }

    const activeCount = await this.getActiveParticipantCount(roomId);
    if (activeCount >= room.maxParticipants) {
      throw new BadRequestException('Room is full');
    }

    // Check if already in room
    const existing = await this.participantRepository.findOne({
      where: { roomId, studentId, leftAt: null as any },
    });
    if (existing) {
      return existing;
    }

    const participant = this.participantRepository.create({
      roomId,
      studentId,
      joinedAt: new Date(),
      role,
    });

    return this.participantRepository.save(participant);
  }

  async leaveRoom(roomId: string, studentId: string): Promise<void> {
    const participant = await this.participantRepository.findOne({
      where: { roomId, studentId, leftAt: null as any },
    });

    if (!participant) {
      throw new NotFoundException('Participant not found in room');
    }

    const now = new Date();
    const minutesSpent = Math.floor((now.getTime() - participant.joinedAt.getTime()) / 60000);

    participant.leftAt = now;
    participant.totalTimeMinutes = minutesSpent;

    await this.participantRepository.save(participant);

    // End room if no active participants
    const activeCount = await this.getActiveParticipantCount(roomId);
    if (activeCount === 0) {
      await this.endRoom(roomId);
    }
  }

  async getParticipants(roomId: string): Promise<RoomParticipant[]> {
    return this.participantRepository.find({
      where: { roomId, leftAt: null as any },
      relations: ['student'],
    });
  }

  async sendMessage(dto: SendMessageDto): Promise<RoomMessage> {
    const room = await this.roomRepository.findOne({ where: { id: dto.roomId } });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Check for inappropriate content
    const flagged = this.checkInappropriateContent(dto.message);

    const message = this.messageRepository.create({
      roomId: dto.roomId,
      senderId: dto.senderId,
      message: dto.message,
      type: dto.type,
      flagged,
    });

    return this.messageRepository.save(message);
  }

  async getMessages(roomId: string, limit: number = 50): Promise<RoomMessage[]> {
    return this.messageRepository.find({
      where: { roomId },
      relations: ['sender'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async saveWhiteboard(roomId: string, data: any): Promise<WhiteboardSession> {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Update room's whiteboard data
    room.whiteboardData = data;
    await this.roomRepository.save(room);

    // Save snapshot
    const session = this.whiteboardRepository.create({
      roomId,
      data,
      savedAt: new Date(),
    });

    return this.whiteboardRepository.save(session);
  }

  async getWhiteboard(roomId: string): Promise<any> {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room.whiteboardData || {};
  }

  async endRoom(roomId: string): Promise<void> {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    room.status = RoomStatus.ENDED;
    room.endedAt = new Date();

    await this.roomRepository.save(room);
  }

  private async getActiveParticipantCount(roomId: string): Promise<number> {
    return this.participantRepository.count({
      where: { roomId, leftAt: null as any },
    });
  }

  private checkInappropriateContent(message: string): boolean {
    const badWords = ['spam', 'inappropriate']; // Simplified list
    const lowerMessage = message.toLowerCase();
    return badWords.some((word) => lowerMessage.includes(word));
  }
}
