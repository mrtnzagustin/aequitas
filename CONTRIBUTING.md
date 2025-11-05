# Contributing to Aequitas

Thank you for your interest in contributing to Aequitas! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Development Process

### 1. Spec-Driven Development

All features must follow the Spec-Kit methodology:

1. **Create a Spec**: Before writing any code, create a specification in `specs/[number]-[feature-name]/spec.md`
2. **Get Approval**: Have your spec reviewed and approved
3. **Implement**: Write code based on the spec
4. **Test**: Ensure all tests pass
5. **Document**: Update documentation

### 2. Branching Strategy

- `main` - Production-ready code (protected)
- `develop` - Integration branch (protected)
- `feature/[spec-number]-[short-description]` - Feature branches
- `fix/[issue-number]-[short-description]` - Bug fixes

### 3. Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Example:**
```
feat(spec-003): implement AI task adaptation

- Add LangChain integration for adaptation generation
- Implement OCR service with Tesseract.js
- Add refinement workflow with human-in-the-loop

Closes #42
```

## Pull Request Process

1. **Fork the Repository**
2. **Create a Branch**: `git checkout -b feature/XXX-your-feature`
3. **Write Code**: Follow coding standards
4. **Write Tests**: Ensure >80% coverage for new code
5. **Run Linter**: `pnpm run lint`
6. **Run Tests**: `pnpm run test`
7. **Commit Changes**: Follow commit convention
8. **Push to Fork**: `git push origin feature/XXX-your-feature`
9. **Open Pull Request**: Use the PR template

### Pull Request Template

```markdown
## Description
[Describe the changes and their purpose]

## Related Spec
[Link to the spec in specs/ directory]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] All tests passing

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings introduced
- [ ] Accessibility tested (WCAG 2.1 AA)
- [ ] i18n strings added to locale files
```

## Coding Standards

### Backend (NestJS)

1. **TypeScript Strict Mode**: No `any` types without justification
2. **Dependency Injection**: Use constructor injection
3. **DTOs**: Validate all inputs with `class-validator`
4. **Error Handling**: Use appropriate NestJS exceptions
5. **Logging**: Use structured logging with context
6. **Testing**: Write unit tests for services, integration tests for controllers

**Example Service:**
```typescript
@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly logger: Logger,
  ) {}

  async findById(id: string): Promise<Student> {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) {
      this.logger.warn(`Student not found: ${id}`);
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }
}
```

### Frontend (Next.js)

1. **TypeScript**: Use interfaces for props
2. **Components**: Functional components with hooks
3. **State Management**: Use Context or Zustand
4. **Styling**: Tailwind CSS with Shadcn components
5. **i18n**: All strings in locale files
6. **Accessibility**: WCAG 2.1 AA compliance

**Example Component:**
```typescript
interface StudentCardProps {
  student: Student;
  onSelect: (id: string) => void;
}

export function StudentCard({ student, onSelect }: StudentCardProps) {
  const t = useTranslations('students');

  return (
    <Card onClick={() => onSelect(student.id)} className="cursor-pointer">
      <CardHeader>
        <CardTitle>{student.firstName} {student.lastName}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{t('condition')}: {student.condition}</p>
      </CardContent>
    </Card>
  );
}
```

## Testing Guidelines

### Backend Tests

```bash
# Unit tests
pnpm run test

# Specific file
pnpm run test students.service.spec.ts

# Coverage
pnpm run test:cov
```

**Test Structure:**
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

  describe('findById', () => {
    it('should return a student when found', async () => {
      const student = { id: '1', firstName: 'Juan' };
      repository.findOne.mockResolvedValue(student);

      const result = await service.findById('1');

      expect(result).toEqual(student);
    });

    it('should throw NotFoundException when not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findById('1')).rejects.toThrow(NotFoundException);
    });
  });
});
```

### Frontend Tests

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e
```

**Test Structure:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { StudentCard } from './StudentCard';

describe('StudentCard', () => {
  const mockStudent = {
    id: '1',
    firstName: 'Juan',
    lastName: 'Pérez',
    condition: 'Dyslexia',
  };

  it('renders student information', () => {
    render(<StudentCard student={mockStudent} onSelect={() => {}} />);

    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText(/Dyslexia/)).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = jest.fn();
    render(<StudentCard student={mockStudent} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('button'));

    expect(onSelect).toHaveBeenCalledWith('1');
  });
});
```

## Accessibility Guidelines

All UI components must meet WCAG 2.1 AA standards:

1. **Keyboard Navigation**: All interactive elements accessible via keyboard
2. **Screen Reader Support**: ARIA labels on all interactive elements
3. **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
4. **Focus Indicators**: Visible focus states
5. **Semantic HTML**: Use proper HTML5 elements

**Testing:**
- Use aXe DevTools browser extension
- Test with keyboard only (no mouse)
- Test with screen reader (VoiceOver, NVDA)

## Internationalization (i18n)

All user-facing strings must be in locale files:

**DO:**
```typescript
const t = useTranslations('students');
<h1>{t('profile.title')}</h1>
```

**DON'T:**
```typescript
<h1>Student Profile</h1>
```

### Adding New Strings

1. Add to `frontend/src/i18n/locales/es/[namespace].json`
2. Add to `frontend/src/i18n/locales/en/[namespace].json`
3. Use in component with `useTranslations`

## Documentation

### Code Documentation

- Add JSDoc comments to public APIs
- Explain "why" not "what" in comments
- Keep comments up-to-date with code changes

### README Updates

When adding a new feature:
1. Update main README.md if it affects setup or usage
2. Add entry to CHANGELOG.md
3. Update API documentation if applicable

## Getting Help

- **Questions**: Open a Discussion on GitHub
- **Bugs**: Open an Issue with the bug template
- **Features**: Create a spec first, then discuss

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
