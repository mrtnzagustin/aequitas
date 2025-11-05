import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService, JwtPayload } from './auth.service';
import { UsersService } from '../users/users.service';
import { User, UserRole, UserStatus } from '../users/entities/user.entity';

// Mock bcrypt
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.THERAPIST,
    status: UserStatus.ACTIVE,
    locale: 'es-AR',
    passwordHash: '$2b$12$hashedpassword',
    lastLoginAt: new Date('2025-01-01'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-01-01'),
    createdBy: 'admin-id',
    studentAssignments: [],
    notes: [],
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
    updateLastLogin: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, string> = {
        JWT_REFRESH_SECRET: 'refresh-secret',
        JWT_REFRESH_EXPIRES_IN: '7d',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(result).toEqual(mockUser);
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockUser.passwordHash);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.validateUser('nonexistent@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        service.validateUser('nonexistent@example.com', 'password123'),
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedException when account is inactive', async () => {
      const inactiveUser = { ...mockUser, status: UserStatus.INACTIVE };
      mockUsersService.findByEmail.mockResolvedValue(inactiveUser);

      await expect(
        service.validateUser('test@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        service.validateUser('test@example.com', 'password123'),
      ).rejects.toThrow('Account is not active');
    });

    it('should throw UnauthorizedException when account is pending', async () => {
      const pendingUser = { ...mockUser, status: UserStatus.PENDING };
      mockUsersService.findByEmail.mockResolvedValue(pendingUser);

      await expect(
        service.validateUser('test@example.com', 'password123'),
      ).rejects.toThrow('Account is not active');
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validateUser('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        service.validateUser('test@example.com', 'wrongpassword'),
      ).rejects.toThrow('Invalid credentials');
    });

    it('should handle bcrypt comparison errors', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockRejectedValue(new Error('Bcrypt error'));

      await expect(
        service.validateUser('test@example.com', 'password123'),
      ).rejects.toThrow('Bcrypt error');
    });
  });

  describe('login', () => {
    const validPassword = 'password123';

    beforeEach(() => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockUsersService.updateLastLogin.mockResolvedValue(undefined);
      mockJwtService.sign.mockImplementation((payload, options?) => {
        if (options?.secret) {
          return 'mock-refresh-token';
        }
        return 'mock-access-token';
      });
    });

    it('should return AuthResponse with tokens when login successful', async () => {
      const result = await service.login('test@example.com', validPassword);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.accessToken).toBe('mock-access-token');
      expect(result.refreshToken).toBe('mock-refresh-token');
    });

    it('should exclude passwordHash from user in response', async () => {
      const result = await service.login('test@example.com', validPassword);

      expect(result.user).not.toHaveProperty('passwordHash');
      expect(result.user).toHaveProperty('email');
      expect(result.user).toHaveProperty('role');
    });

    it('should update lastLoginAt timestamp', async () => {
      await service.login('test@example.com', validPassword);

      expect(mockUsersService.updateLastLogin).toHaveBeenCalledWith(mockUser.id);
      expect(mockUsersService.updateLastLogin).toHaveBeenCalledTimes(1);
    });

    it('should generate JWT with correct payload', async () => {
      await service.login('test@example.com', validPassword);

      const expectedPayload: JwtPayload = {
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      };

      expect(mockJwtService.sign).toHaveBeenCalledWith(expectedPayload);
    });

    it('should generate refresh token with correct config', async () => {
      await service.login('test@example.com', validPassword);

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        expect.any(Object),
        {
          secret: 'refresh-secret',
          expiresIn: '7d',
        },
      );
      expect(mockConfigService.get).toHaveBeenCalledWith('JWT_REFRESH_SECRET');
      expect(mockConfigService.get).toHaveBeenCalledWith('JWT_REFRESH_EXPIRES_IN');
    });

    it('should throw UnauthorizedException when credentials invalid', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should call validateUser before generating tokens', async () => {
      const validateUserSpy = jest.spyOn(service, 'validateUser');

      await service.login('test@example.com', validPassword);

      expect(validateUserSpy).toHaveBeenCalledWith('test@example.com', validPassword);
      expect(mockJwtService.sign).toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    const validRefreshToken = 'valid-refresh-token';
    const mockPayload = {
      sub: mockUser.id,
      email: mockUser.email,
      role: mockUser.role,
    };

    beforeEach(() => {
      mockJwtService.verify.mockReturnValue(mockPayload);
      mockJwtService.sign.mockImplementation((payload, options?) => {
        if (options?.secret) {
          return 'new-refresh-token';
        }
        return 'new-access-token';
      });
    });

    it('should return new tokens when refresh token is valid', async () => {
      const result = await service.refreshToken(validRefreshToken);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.accessToken).toBe('new-access-token');
      expect(result.refreshToken).toBe('new-refresh-token');
    });

    it('should verify refresh token with correct secret', async () => {
      await service.refreshToken(validRefreshToken);

      expect(mockJwtService.verify).toHaveBeenCalledWith(validRefreshToken, {
        secret: 'refresh-secret',
      });
      expect(mockConfigService.get).toHaveBeenCalledWith('JWT_REFRESH_SECRET');
    });

    it('should generate new tokens with same payload', async () => {
      await service.refreshToken(validRefreshToken);

      const expectedPayload: JwtPayload = {
        sub: mockPayload.sub,
        email: mockPayload.email,
        role: mockPayload.role,
      };

      expect(mockJwtService.sign).toHaveBeenCalledWith(expectedPayload);
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        expectedPayload,
        expect.objectContaining({ secret: 'refresh-secret' }),
      );
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshToken('invalid-token')).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.refreshToken('invalid-token')).rejects.toThrow(
        'Invalid refresh token',
      );
    });

    it('should throw UnauthorizedException when token is expired', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Token expired');
      });

      await expect(service.refreshToken('expired-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should handle malformed tokens', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Malformed token');
      });

      await expect(service.refreshToken('malformed.token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('hashPassword', () => {
    it('should hash password with bcrypt', async () => {
      const plainPassword = 'password123';
      const hashedPassword = '$2b$12$hashedpassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await service.hashPassword(plainPassword);

      expect(result).toBe(hashedPassword);
      expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, 12);
    });

    it('should use cost factor of 12', async () => {
      await service.hashPassword('password123');

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12);
    });

    it('should handle bcrypt errors', async () => {
      (bcrypt.hash as jest.Mock).mockRejectedValue(new Error('Hashing failed'));

      await expect(service.hashPassword('password123')).rejects.toThrow(
        'Hashing failed',
      );
    });

    it('should handle empty password', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$12$emptyhash');

      const result = await service.hashPassword('');

      expect(result).toBe('$2b$12$emptyhash');
      expect(bcrypt.hash).toHaveBeenCalledWith('', 12);
    });
  });

  describe('edge cases and security', () => {
    it('should not leak user information when credentials are invalid', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      const error = await service.validateUser('test@example.com', 'wrong')
        .catch(e => e);

      expect(error.message).toBe('Invalid credentials');
      expect(error.message).not.toContain('not found');
      expect(error.message).not.toContain('email');
    });

    it('should handle concurrent login attempts', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockUsersService.updateLastLogin.mockResolvedValue(undefined);
      mockJwtService.sign.mockReturnValue('mock-token');

      const promise1 = service.login('test@example.com', 'password123');
      const promise2 = service.login('test@example.com', 'password123');

      const [result1, result2] = await Promise.all([promise1, promise2]);

      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      expect(mockUsersService.updateLastLogin).toHaveBeenCalledTimes(2);
    });

    it('should handle null email gracefully', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.validateUser(null as any, 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should handle null password gracefully', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validateUser('test@example.com', null as any),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
