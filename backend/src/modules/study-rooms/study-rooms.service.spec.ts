import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudyRoomsService } from './study-rooms.service';
import { StudyRoom, RoomStatus, RoomPrivacy } from './entities/study-room.entity';
import { RoomParticipant, ParticipantRole } from './entities/room-participant.entity';
import { RoomMessage, MessageType } from './entities/room-message.entity';
import { WhiteboardSession } from './entities/whiteboard-session.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('StudyRoomsService', () => {
  let service: StudyRoomsService;
  let roomRepository: Repository<StudyRoom>;
  let participantRepository: Repository<RoomParticipant>;
  let messageRepository: Repository<RoomMessage>;
  let whiteboardRepository: Repository<WhiteboardSession>;

  const mockRoomRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockParticipantRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
  };

  const mockMessageRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockWhiteboardRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudyRoomsService,
        {
          provide: getRepositoryToken(StudyRoom),
          useValue: mockRoomRepository,
        },
        {
          provide: getRepositoryToken(RoomParticipant),
          useValue: mockParticipantRepository,
        },
        {
          provide: getRepositoryToken(RoomMessage),
          useValue: mockMessageRepository,
        },
        {
          provide: getRepositoryToken(WhiteboardSession),
          useValue: mockWhiteboardRepository,
        },
      ],
    }).compile();

    service = module.get<StudyRoomsService>(StudyRoomsService);
    roomRepository = module.get(getRepositoryToken(StudyRoom));
    participantRepository = module.get(getRepositoryToken(RoomParticipant));
    messageRepository = module.get(getRepositoryToken(RoomMessage));
    whiteboardRepository = module.get(getRepositoryToken(WhiteboardSession));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createRoom', () => {
    it('should create a new study room', async () => {
      const dto: CreateRoomDto = {
        name: 'Math Study',
        topic: 'Algebra',
        description: 'Homework help',
        creatorId: 'user-1',
        privacy: RoomPrivacy.PUBLIC,
        maxParticipants: 5,
      };

      const mockRoom = { id: 'room-1', ...dto, status: RoomStatus.ACTIVE };
      mockRoomRepository.create.mockReturnValue(mockRoom);
      mockRoomRepository.save.mockResolvedValue(mockRoom);
      mockRoomRepository.findOne.mockResolvedValue(mockRoom);
      mockParticipantRepository.count.mockResolvedValue(0);
      mockParticipantRepository.findOne.mockResolvedValue(null);

      const mockParticipant = { id: 'p-1', roomId: 'room-1', studentId: 'user-1' };
      mockParticipantRepository.create.mockReturnValue(mockParticipant);
      mockParticipantRepository.save.mockResolvedValue(mockParticipant);

      const result = await service.createRoom(dto);

      expect(roomRepository.create).toHaveBeenCalled();
      expect(roomRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockRoom);
    });

    it('should create scheduled room if scheduledStart provided', async () => {
      const dto: CreateRoomDto = {
        name: 'Future Study',
        topic: 'Science',
        description: 'Tomorrow',
        creatorId: 'user-1',
        privacy: RoomPrivacy.PUBLIC,
        maxParticipants: 4,
        scheduledStart: '2025-12-01T10:00:00Z',
      };

      const mockRoom = { id: 'room-1', ...dto, status: RoomStatus.SCHEDULED };
      mockRoomRepository.create.mockReturnValue(mockRoom);
      mockRoomRepository.save.mockResolvedValue(mockRoom);
      mockRoomRepository.findOne.mockResolvedValue(mockRoom);
      mockParticipantRepository.count.mockResolvedValue(0);
      mockParticipantRepository.findOne.mockResolvedValue(null);

      const mockParticipant = { id: 'p-1' };
      mockParticipantRepository.create.mockReturnValue(mockParticipant);
      mockParticipantRepository.save.mockResolvedValue(mockParticipant);

      const result = await service.createRoom(dto);

      expect(result.status).toBe(RoomStatus.SCHEDULED);
    });
  });

  describe('getAvailableRooms', () => {
    it('should return only active rooms with space', async () => {
      const mockRooms = [
        { id: 'room-1', maxParticipants: 5, status: RoomStatus.ACTIVE },
        { id: 'room-2', maxParticipants: 3, status: RoomStatus.ACTIVE },
      ];
      mockRoomRepository.find.mockResolvedValue(mockRooms);
      mockParticipantRepository.count.mockResolvedValueOnce(2).mockResolvedValueOnce(5);

      const result = await service.getAvailableRooms();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('room-1');
    });
  });

  describe('joinRoom', () => {
    it('should allow student to join room', async () => {
      const mockRoom = { id: 'room-1', status: RoomStatus.ACTIVE, maxParticipants: 5 };
      mockRoomRepository.findOne.mockResolvedValue(mockRoom);
      mockParticipantRepository.count.mockResolvedValue(2);
      mockParticipantRepository.findOne.mockResolvedValue(null);

      const mockParticipant = { id: 'p-1', roomId: 'room-1', studentId: 'student-1' };
      mockParticipantRepository.create.mockReturnValue(mockParticipant);
      mockParticipantRepository.save.mockResolvedValue(mockParticipant);

      const result = await service.joinRoom('room-1', 'student-1');

      expect(result).toEqual(mockParticipant);
      expect(participantRepository.save).toHaveBeenCalled();
    });

    it('should throw error if room not found', async () => {
      mockRoomRepository.findOne.mockResolvedValue(null);

      await expect(service.joinRoom('room-1', 'student-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw error if room is full', async () => {
      const mockRoom = { id: 'room-1', status: RoomStatus.ACTIVE, maxParticipants: 3 };
      mockRoomRepository.findOne.mockResolvedValue(mockRoom);
      mockParticipantRepository.count.mockResolvedValue(3);

      await expect(service.joinRoom('room-1', 'student-1')).rejects.toThrow(BadRequestException);
    });

    it('should return existing participant if already in room', async () => {
      const mockRoom = { id: 'room-1', status: RoomStatus.ACTIVE, maxParticipants: 5 };
      const mockParticipant = { id: 'p-1', roomId: 'room-1', studentId: 'student-1' };
      mockRoomRepository.findOne.mockResolvedValue(mockRoom);
      mockParticipantRepository.count.mockResolvedValue(1);
      mockParticipantRepository.findOne.mockResolvedValue(mockParticipant);

      const result = await service.joinRoom('room-1', 'student-1');

      expect(result).toEqual(mockParticipant);
      expect(participantRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('leaveRoom', () => {
    it('should update participant leaving time', async () => {
      const mockParticipant = {
        id: 'p-1',
        roomId: 'room-1',
        studentId: 'student-1',
        joinedAt: new Date(Date.now() - 3600000), // 1 hour ago
        leftAt: null,
        totalTimeMinutes: 0,
      };
      mockParticipantRepository.findOne.mockResolvedValue(mockParticipant);
      mockParticipantRepository.save.mockResolvedValue(mockParticipant);
      mockParticipantRepository.count.mockResolvedValue(1);

      await service.leaveRoom('room-1', 'student-1');

      expect(mockParticipant.leftAt).toBeDefined();
      expect(mockParticipant.totalTimeMinutes).toBeGreaterThan(0);
      expect(participantRepository.save).toHaveBeenCalled();
    });

    it('should throw error if participant not found', async () => {
      mockParticipantRepository.findOne.mockResolvedValue(null);

      await expect(service.leaveRoom('room-1', 'student-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('sendMessage', () => {
    it('should create and save a message', async () => {
      const dto: SendMessageDto = {
        roomId: 'room-1',
        senderId: 'user-1',
        message: 'Hello everyone!',
        type: MessageType.TEXT,
      };

      const mockRoom = { id: 'room-1' };
      mockRoomRepository.findOne.mockResolvedValue(mockRoom);

      const mockMessage = { id: 'msg-1', ...dto, flagged: false };
      mockMessageRepository.create.mockReturnValue(mockMessage);
      mockMessageRepository.save.mockResolvedValue(mockMessage);

      const result = await service.sendMessage(dto);

      expect(result).toEqual(mockMessage);
      expect(messageRepository.save).toHaveBeenCalled();
    });

    it('should flag inappropriate content', async () => {
      const dto: SendMessageDto = {
        roomId: 'room-1',
        senderId: 'user-1',
        message: 'This is spam',
        type: MessageType.TEXT,
      };

      const mockRoom = { id: 'room-1' };
      mockRoomRepository.findOne.mockResolvedValue(mockRoom);

      const mockMessage = { id: 'msg-1', ...dto, flagged: true };
      mockMessageRepository.create.mockReturnValue(mockMessage);
      mockMessageRepository.save.mockResolvedValue(mockMessage);

      const result = await service.sendMessage(dto);

      expect(result.flagged).toBe(true);
    });
  });

  describe('saveWhiteboard', () => {
    it('should save whiteboard data', async () => {
      const mockRoom = { id: 'room-1', whiteboardData: {} };
      mockRoomRepository.findOne.mockResolvedValue(mockRoom);
      mockRoomRepository.save.mockResolvedValue(mockRoom);

      const mockSession = { id: 'wb-1', roomId: 'room-1', data: { test: 'data' } };
      mockWhiteboardRepository.create.mockReturnValue(mockSession);
      mockWhiteboardRepository.save.mockResolvedValue(mockSession);

      const result = await service.saveWhiteboard('room-1', { test: 'data' });

      expect(result).toEqual(mockSession);
      expect(roomRepository.save).toHaveBeenCalled();
      expect(whiteboardRepository.save).toHaveBeenCalled();
    });
  });

  describe('getWhiteboard', () => {
    it('should return whiteboard data', async () => {
      const mockRoom = { id: 'room-1', whiteboardData: { test: 'data' } };
      mockRoomRepository.findOne.mockResolvedValue(mockRoom);

      const result = await service.getWhiteboard('room-1');

      expect(result).toEqual({ test: 'data' });
    });

    it('should return empty object if no whiteboard data', async () => {
      const mockRoom = { id: 'room-1', whiteboardData: null };
      mockRoomRepository.findOne.mockResolvedValue(mockRoom);

      const result = await service.getWhiteboard('room-1');

      expect(result).toEqual({});
    });
  });

  describe('endRoom', () => {
    it('should mark room as ended', async () => {
      const mockRoom: any = { id: 'room-1', status: RoomStatus.ACTIVE };
      mockRoomRepository.findOne.mockResolvedValue(mockRoom);
      mockRoomRepository.save.mockResolvedValue(mockRoom);

      await service.endRoom('room-1');

      expect(mockRoom.status).toBe(RoomStatus.ENDED);
      expect(mockRoom.endedAt).toBeDefined();
      expect(roomRepository.save).toHaveBeenCalled();
    });
  });
});
