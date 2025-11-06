# 007: Comprehensive Unit Testing

**Status:** In Progress
**Epic:** Code Quality & Testing
**Priority:** P0
**Assigned To:** Claude
**Target Release:** v1.0 (MVP)

## 1. Overview

This specification establishes comprehensive unit testing coverage for all existing backend services and controllers. Currently, the testing infrastructure is configured (Jest, Supertest) but no test files exist. This feature ensures code reliability, prevents regressions, and establishes a testing baseline for future development.

## 2. Problem Statement

**Current State:**
- Testing infrastructure configured but unused
- 0 test files exist (0% coverage)
- 7 services without tests: users, auth, students, notes, adaptations, langchain, ocr
- 5 controllers without tests: users, auth, students, notes, adaptations
- No safety net for refactoring or new features
- Potential bugs undetected

**Desired State:**
- Minimum 80% code coverage across all modules
- All services have comprehensive unit tests
- All controllers have integration tests
- CI/CD pipeline validates tests on every commit
- Developers can refactor with confidence

**Impact if Not Addressed:**
- Production bugs affecting users
- Broken features going undetected
- Difficulty maintaining code quality
- Slow development cycles due to manual testing

## 3. Testing Requirements

### 3.1 Services to Test

#### users.service.ts
**Test Cases:**
- `findById` - should return user when found
- `findById` - should throw NotFoundException when user not found
- `findByEmail` - should return user when found
- `findByEmail` - should return null when user not found
- `updateLastLogin` - should update lastLoginAt timestamp
- `findAll` - should return all users when no filters
- `findAll` - should filter by role when provided
- `findAll` - should filter by status when provided
- `findAll` - should filter by both role and status

#### auth.service.ts
**Test Cases:**
- `validateUser` - should return user when credentials valid
- `validateUser` - should throw UnauthorizedException when user not found
- `validateUser` - should throw UnauthorizedException when account inactive
- `validateUser` - should throw UnauthorizedException when password invalid
- `login` - should return AuthResponse with tokens
- `login` - should update lastLoginAt
- `login` - should exclude passwordHash from response
- `refreshToken` - should return new access and refresh tokens
- `refreshToken` - should throw UnauthorizedException when token invalid
- `hashPassword` - should hash password with bcrypt

#### students.service.ts
**Test Cases:**
- `findAll` - should return all students
- `findById` - should return student when found
- `findById` - should return null when student not found (needs fix)

#### notes.service.ts
**Test Cases:**
- `findByStudentId` - should return all notes for student
- `findByStudentId` - should filter by note type
- `findByStudentId` - should filter by visibility
- `findByStudentId` - should order by createdAt desc

#### adaptations.service.ts
**Test Cases:**
- `findByStudentId` - should return all adaptations for student
- `findByStudentId` - should filter by status
- `findByStudentId` - should order by createdAt desc

#### langchain.service.ts
**Test Cases:**
- `generateAdaptation` - should call OpenAI with correct prompt
- `generateAdaptation` - should include student profile in context
- `generateAdaptation` - should return adapted task
- `generateAdaptation` - should handle API errors gracefully
- `refineAdaptation` - should append user message to conversation
- `refineAdaptation` - should maintain context from previous messages

#### ocr.service.ts
**Test Cases:**
- `extractTextFromImage` - should extract text from valid image
- `extractTextFromImage` - should return confidence scores
- `extractTextFromImage` - should handle images with no text
- `extractTextFromImage` - should handle invalid image format

### 3.2 Controllers to Test

#### users.controller.ts
**Integration Test Cases:**
- `GET /users` - should return 200 with users array (admin only)
- `GET /users` - should return 403 when not admin
- `GET /users?role=TEACHER` - should filter by role
- `GET /users?status=ACTIVE` - should filter by status

#### auth.controller.ts
**Integration Test Cases:**
- `POST /auth/login` - should return 200 with tokens when valid
- `POST /auth/login` - should return 401 when invalid credentials
- `POST /auth/login` - should return 401 when account inactive
- `POST /auth/refresh` - should return 200 with new tokens
- `POST /auth/refresh` - should return 401 when token invalid
- `POST /auth/logout` - should return 200

#### students.controller.ts
**Integration Test Cases:**
- `GET /students` - should return 200 with students array
- `GET /students/:id` - should return 200 with student
- `GET /students/:id` - should return 404 when not found

#### notes.controller.ts
**Integration Test Cases:**
- `GET /notes/student/:studentId` - should return 200 with notes
- `GET /notes/student/:studentId` - should filter by visibility based on role
- `GET /notes/student/:studentId` - should return 403 when not authorized

#### adaptations.controller.ts
**Integration Test Cases:**
- `GET /adaptations/student/:studentId` - should return 200 with adaptations
- `GET /adaptations/student/:studentId` - should filter by status
- `GET /adaptations/student/:studentId` - should return 403 when not authorized

## 4. Technical Requirements

### 4.1 Testing Stack
- **Framework:** Jest 29.7.0
- **Mocking:** jest.mock, jest.spyOn
- **DB Mocking:** In-memory repositories (no real DB for unit tests)
- **HTTP Testing:** Supertest for controllers
- **Coverage:** Istanbul/NYC (built into Jest)

### 4.2 File Structure
```
backend/src/modules/
├── users/
│   ├── users.service.ts
│   ├── users.service.spec.ts      ← NEW
│   ├── users.controller.ts
│   └── users.controller.spec.ts   ← NEW
├── auth/
│   ├── auth.service.ts
│   ├── auth.service.spec.ts       ← NEW
│   ├── auth.controller.ts
│   └── auth.controller.spec.ts    ← NEW
└── [similar for students, notes, adaptations, ai]
```

### 4.3 Test Scripts
```bash
# Unit tests
pnpm run test

# Watch mode
pnpm run test:watch

# Coverage report
pnpm run test:cov

# Single file
pnpm run test users.service.spec
```

### 4.4 Coverage Thresholds
```json
{
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  }
}
```

## 5. Mocking Strategy

### 5.1 Repository Mocking
```typescript
const mockUserRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  createQueryBuilder: jest.fn(),
};
```

### 5.2 Service Mocking (for controllers)
```typescript
const mockUsersService = {
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findAll: jest.fn(),
};
```

### 5.3 External Service Mocking
```typescript
// Mock JwtService
const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

// Mock bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

// Mock LangChain/OpenAI
jest.mock('@langchain/openai');
```

## 6. Implementation Plan

### Phase 1: Setup (Complete)
- ✅ Jest configured
- ✅ Test scripts in package.json
- ✅ Test environment setup

### Phase 2: Service Tests
1. Create `users.service.spec.ts` with all test cases
2. Create `auth.service.spec.ts` with all test cases
3. Create `students.service.spec.ts` with all test cases
4. Create `notes.service.spec.ts` with all test cases
5. Create `adaptations.service.spec.ts` with all test cases
6. Create `langchain.service.spec.ts` with all test cases
7. Create `ocr.service.spec.ts` with all test cases

### Phase 3: Controller Tests
1. Create `users.controller.spec.ts`
2. Create `auth.controller.spec.ts`
3. Create `students.controller.spec.ts`
4. Create `notes.controller.spec.ts`
5. Create `adaptations.controller.spec.ts`

### Phase 4: Validation
1. Run all tests: `pnpm run test`
2. Generate coverage report: `pnpm run test:cov`
3. Verify 80%+ coverage achieved
4. Fix any failing tests
5. Update jest.config.js with coverage thresholds

### Phase 5: CI/CD Integration
1. Add test step to GitHub Actions
2. Enforce coverage thresholds
3. Block PRs with failing tests

## 7. Success Criteria

- ✅ All 7 services have `.spec.ts` files with comprehensive tests
- ✅ All 5 controllers have `.spec.ts` files with integration tests
- ✅ Minimum 80% code coverage across all modules
- ✅ All tests pass: `pnpm run test` exits with code 0
- ✅ Coverage report shows green for all modules
- ✅ No console errors or warnings during test runs
- ✅ Tests run in under 30 seconds total

## 8. Example Test Structure

### Service Test Example
```typescript
describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser as User);

      const result = await service.findById('1');

      expect(result).toEqual(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException when user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findById('999')).rejects.toThrow(NotFoundException);
    });
  });
});
```

### Controller Test Example
```typescript
describe('UsersController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('GET /users', () => {
    it('should return 200 with users array', () => {
      const mockUsers = [{ id: '1', email: 'test@example.com' }];
      jest.spyOn(mockUsersService, 'findAll').mockResolvedValue(mockUsers);

      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect(mockUsers);
    });
  });
});
```

## 9. Maintenance

- Run tests before every commit
- Update tests when modifying service logic
- Maintain 80%+ coverage as features are added
- Review coverage reports weekly
- Refactor tests to reduce duplication

## 10. References

- [NestJS Testing Documentation](https://docs.nestjs.com/fundamentals/testing)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- Constitution: `.specify/memory/constitution.md` - Testing principles

---

**Last Updated:** 2025-11-05
**Status:** In Progress - Ready for implementation
