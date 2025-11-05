import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserRole, UserStatus } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.THERAPIST,
    status: UserStatus.ACTIVE,
    locale: 'es-AR',
    passwordHash: 'hashed_password',
    lastLoginAt: new Date('2025-01-01'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-01-01'),
    createdBy: 'admin-id',
    studentAssignments: [],
    notes: [],
  };

  const mockQueryBuilder = {
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findById(mockUser.id);

      expect(result).toEqual(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findById('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findById('non-existent-id')).rejects.toThrow(
        'User with ID non-existent-id not found',
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'non-existent-id' },
      });
    });

    it('should handle database errors', async () => {
      mockRepository.findOne.mockRejectedValue(new Error('Database error'));

      await expect(service.findById(mockUser.id)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('findByEmail', () => {
    it('should return user when found by email', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail(mockUser.email);

      expect(result).toEqual(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockUser.email },
      });
    });

    it('should return null when user not found by email', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
    });

    it('should handle case sensitivity', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      await service.findByEmail('TEST@EXAMPLE.COM');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'TEST@EXAMPLE.COM' },
      });
    });
  });

  describe('updateLastLogin', () => {
    it('should update lastLoginAt timestamp', async () => {
      mockRepository.update.mockResolvedValue({ affected: 1, raw: [], generatedMaps: [] });

      await service.updateLastLogin(mockUser.id);

      expect(mockRepository.update).toHaveBeenCalledWith(
        mockUser.id,
        expect.objectContaining({
          lastLoginAt: expect.any(Date),
        }),
      );
    });

    it('should update with current timestamp', async () => {
      const beforeTime = new Date();
      mockRepository.update.mockResolvedValue({ affected: 1, raw: [], generatedMaps: [] });

      await service.updateLastLogin(mockUser.id);
      const afterTime = new Date();

      const callArgs = mockRepository.update.mock.calls[0][1];
      const updatedTime = callArgs.lastLoginAt;

      expect(updatedTime.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(updatedTime.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });

    it('should handle update failure', async () => {
      mockRepository.update.mockRejectedValue(new Error('Update failed'));

      await expect(service.updateLastLogin(mockUser.id)).rejects.toThrow(
        'Update failed',
      );
    });
  });

  describe('findAll', () => {
    const mockUsers: User[] = [
      mockUser,
      {
        ...mockUser,
        id: '223e4567-e89b-12d3-a456-426614174000',
        email: 'teacher@example.com',
        role: UserRole.TEACHER,
      },
      {
        ...mockUser,
        id: '323e4567-e89b-12d3-a456-426614174000',
        email: 'parent@example.com',
        role: UserRole.PARENT,
        status: UserStatus.INACTIVE,
      },
    ];

    it('should return all users when no filters provided', async () => {
      mockQueryBuilder.getMany.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(result).toEqual(mockUsers);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
    });

    it('should filter by role when provided', async () => {
      const teacherUsers = [mockUsers[1]];
      mockQueryBuilder.getMany.mockResolvedValue(teacherUsers);

      const result = await service.findAll({ role: UserRole.TEACHER });

      expect(result).toEqual(teacherUsers);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'user.role = :role',
        { role: UserRole.TEACHER },
      );
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
    });

    it('should filter by status when provided', async () => {
      const activeUsers = [mockUsers[0], mockUsers[1]];
      mockQueryBuilder.getMany.mockResolvedValue(activeUsers);

      const result = await service.findAll({ status: UserStatus.ACTIVE });

      expect(result).toEqual(activeUsers);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'user.status = :status',
        { status: UserStatus.ACTIVE },
      );
    });

    it('should filter by both role and status when provided', async () => {
      const filteredUsers = [mockUsers[0]];
      mockQueryBuilder.getMany.mockResolvedValue(filteredUsers);

      const result = await service.findAll({
        role: UserRole.THERAPIST,
        status: UserStatus.ACTIVE,
      });

      expect(result).toEqual(filteredUsers);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(2);
      expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(
        1,
        'user.role = :role',
        { role: UserRole.THERAPIST },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(
        2,
        'user.status = :status',
        { status: UserStatus.ACTIVE },
      );
    });

    it('should return empty array when no users match filters', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      const result = await service.findAll({ role: UserRole.ADMIN });

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      mockQueryBuilder.getMany.mockRejectedValue(new Error('Query failed'));

      await expect(service.findAll()).rejects.toThrow('Query failed');
    });

    it('should handle undefined filters gracefully', async () => {
      mockQueryBuilder.getMany.mockResolvedValue(mockUsers);

      const result = await service.findAll({});

      expect(result).toEqual(mockUsers);
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
    });

    it('should handle role filter with string value', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockUsers[1]]);

      await service.findAll({ role: 'TEACHER' as any });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'user.role = :role',
        { role: 'TEACHER' },
      );
    });
  });

  describe('edge cases', () => {
    it('should handle null user ID in findById', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findById(null as any)).rejects.toThrow();
    });

    it('should handle empty string email in findByEmail', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('');

      expect(result).toBeNull();
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: '' },
      });
    });

    it('should handle concurrent findAll requests', async () => {
      const testUsers = [mockUser, { ...mockUser, id: 'user-2' }];
      mockQueryBuilder.getMany.mockResolvedValue(testUsers);

      const promise1 = service.findAll({ role: UserRole.TEACHER });
      const promise2 = service.findAll({ status: UserStatus.ACTIVE });

      const [result1, result2] = await Promise.all([promise1, promise2]);

      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledTimes(2);
    });
  });
});
