# Implement Feature Task

You are an AI assistant helping to implement a specific task for the Aequitas platform.

## Context
You have access to:
- The feature specification
- The implementation plan
- The task details
- The existing codebase

## Your Task
Implement the specific task following the platform's standards and conventions.

## Implementation Guidelines

### 1. Code Quality Standards

#### TypeScript
- Use strict mode (no `any` without justification)
- Prefer interfaces over types for objects
- Use meaningful variable names
- Add JSDoc comments for public APIs

```typescript
/**
 * Creates a new student profile with validation
 * @param dto - The student creation data
 * @param userId - The ID of the user creating the profile
 * @returns The created student entity
 * @throws {ForbiddenException} If user lacks permission
 */
async createStudent(dto: CreateStudentDto, userId: string): Promise<Student> {
  // Implementation
}
```

#### Error Handling
- Use appropriate NestJS exceptions (BadRequestException, NotFoundException, etc.)
- Include helpful error messages
- Log errors with context

```typescript
if (!student) {
  this.logger.error(`Student not found: ${id}`, { userId, studentId: id });
  throw new NotFoundException(`Student with ID ${id} not found`);
}
```

### 2. Backend Implementation (NestJS)

#### Module Structure
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([Entity])],
  controllers: [FeatureController],
  providers: [FeatureService],
  exports: [FeatureService],
})
export class FeatureModule {}
```

#### Controller Pattern
```typescript
@Controller('api/resource')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResourceController {
  constructor(private readonly service: ResourceService) {}

  @Get(':id')
  @Roles(UserRole.THERAPIST, UserRole.TEACHER)
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<ResourceDto> {
    return this.service.findOne(id, user);
  }
}
```

#### Service Pattern
```typescript
@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(Resource)
    private repository: Repository<Resource>,
    private readonly rbacService: RbacService,
  ) {}

  async findOne(id: string, user: User): Promise<Resource> {
    const resource = await this.repository.findOne({ where: { id } });

    if (!resource) {
      throw new NotFoundException();
    }

    // RBAC check
    if (!this.rbacService.canAccess(user, resource)) {
      throw new ForbiddenException();
    }

    return resource;
  }
}
```

#### DTO Validation
```typescript
export class CreateResourceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ResourceType)
  type: ResourceType;
}
```

#### Entity Definition
```typescript
@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ResourceType })
  type: ResourceType;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 3. AI Integration (LangChain/LangGraph)

#### Prompt Template
```typescript
const ADAPTATION_PROMPT = ChatPromptTemplate.fromMessages([
  ['system', `You are an expert pedagogical assistant adapting tasks for students with {condition}.

Context about the student:
- Condition: {condition}
- Interests: {interests}
- Learning preferences: {preferences}

Generate an adaptation in {language} that:
1. Simplifies complex instructions
2. Uses the student's interests
3. Provides visual cues when helpful
4. Maintains the learning objective`],
  ['user', 'Original task:\n{task}'],
]);
```

#### LangChain Chain
```typescript
const adaptationChain = ADAPTATION_PROMPT
  .pipe(llm)
  .pipe(new StringOutputParser());

const result = await adaptationChain.invoke({
  condition: student.condition,
  interests: student.interests.join(', '),
  preferences: student.learningPreferences,
  language: user.locale,
  task: originalTask,
});
```

#### LangGraph Workflow
```typescript
const workflow = new StateGraph({
  channels: {
    task: { value: (x, y) => y },
    adaptation: { value: (x, y) => y },
    feedback: { value: (x, y) => [...x, y] },
  },
});

workflow.addNode('generate', generateAdaptation);
workflow.addNode('review', humanReview);
workflow.addNode('refine', refineAdaptation);

workflow.addEdge('generate', 'review');
workflow.addConditionalEdges('review', shouldRefine, {
  refine: 'refine',
  done: END,
});
workflow.addEdge('refine', 'review');

const app = workflow.compile();
```

### 4. Frontend Implementation (Next.js + Shadcn)

#### Page Component
```typescript
// app/[locale]/students/[id]/page.tsx
export default async function StudentProfilePage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  const t = await getTranslations({ locale, namespace: 'student' });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{t('profile.title')}</h1>
      <StudentProfile studentId={id} />
    </div>
  );
}
```

#### Component with Shadcn
```typescript
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

export function StudentProfile({ studentId }: { studentId: string }) {
  const t = useTranslations('student');
  const { data: student, isLoading } = useStudent(studentId);

  if (isLoading) return <Skeleton />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{student.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Content */}
      </CardContent>
      <CardFooter>
        <Button onClick={handleEdit}>{t('actions.edit')}</Button>
      </CardFooter>
    </Card>
  );
}
```

#### Custom Hook
```typescript
export function useStudent(id: string) {
  return useQuery({
    queryKey: ['student', id],
    queryFn: async () => {
      const res = await fetch(`/api/students/${id}`);
      if (!res.ok) throw new Error('Failed to fetch student');
      return res.json();
    },
  });
}
```

#### i18n Strings
```json
// i18n/locales/es/student.json
{
  "profile": {
    "title": "Perfil del Estudiante",
    "edit": "Editar",
    "save": "Guardar",
    "cancel": "Cancelar"
  },
  "actions": {
    "edit": "Editar",
    "delete": "Eliminar",
    "addNote": "Agregar Nota"
  }
}
```

### 5. Testing

#### Backend Unit Test
```typescript
describe('StudentService', () => {
  let service: StudentService;
  let repository: MockRepository<Student>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: getRepositoryToken(Student),
          useClass: MockRepository,
        },
      ],
    }).compile();

    service = module.get(StudentService);
    repository = module.get(getRepositoryToken(Student));
  });

  it('should find a student by id', async () => {
    const student = { id: '1', name: 'Test' };
    repository.findOne.mockResolvedValue(student);

    const result = await service.findOne('1');
    expect(result).toEqual(student);
  });
});
```

#### Frontend Component Test
```typescript
import { render, screen } from '@testing-library/react';
import { StudentProfile } from './StudentProfile';

describe('StudentProfile', () => {
  it('renders student name', async () => {
    render(<StudentProfile studentId="1" />);

    expect(await screen.findByText('Test Student')).toBeInTheDocument();
  });
});
```

#### E2E Test (Playwright)
```typescript
test('therapist can create student profile', async ({ page }) => {
  await page.goto('/students/new');

  await page.fill('[name="name"]', 'Juan Pérez');
  await page.selectOption('[name="condition"]', 'dyslexia');
  await page.click('button[type="submit"]');

  await expect(page.locator('text=Perfil creado')).toBeVisible();
});
```

### 6. Security Checklist

Before submitting:
- [ ] RBAC enforced at controller and service layer
- [ ] Input validation with DTOs
- [ ] SQL injection prevented (using ORM properly)
- [ ] XSS prevented (React escaping + sanitization)
- [ ] CSRF protection enabled (NestJS default)
- [ ] Audit log created for data modifications
- [ ] Sensitive data not logged
- [ ] Error messages don't leak internal details

### 7. Accessibility Checklist

For UI components:
- [ ] Keyboard navigable (tab order logical)
- [ ] ARIA labels on interactive elements
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Focus indicators visible
- [ ] Screen reader tested (VoiceOver/NVDA)
- [ ] Form validation errors announced

### 8. i18n Checklist

- [ ] All UI strings in locale files
- [ ] No hardcoded strings in components
- [ ] Dates/numbers formatted with locale
- [ ] RTL considered (if applicable)
- [ ] Translations complete for default locale (es-AR)

## Output Format

Provide:
1. **Implementation code** with full file paths
2. **Test code** covering the implementation
3. **Migration scripts** (if database changes)
4. **i18n strings** (if UI changes)
5. **Brief explanation** of design decisions

Use code blocks with language specifiers:
```typescript
// Your code here
```

Be thorough but concise. Follow the existing codebase patterns.
