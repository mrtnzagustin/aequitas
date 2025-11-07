# Database Seeding

This directory contains the database seeding system for the Aequitas platform. The seeder populates the database with realistic test data for development and testing.

## 📁 Files

- **`data-factory.ts`** - Utilities for generating realistic fake data
- **`seed.ts`** - Main seeding script that populates all entities
- **`README.md`** - This file

## 🚀 Quick Start

### Running the Seeder

```bash
# From the backend directory
npm run db:setup

# Or directly
npm run seed
```

### What Gets Created

The seeder creates a complete test environment:

| Entity | Count | Details |
|--------|-------|---------|
| **Admin** | 1 | Email: `admin@aequitas.test` |
| **Therapists** | 3 | Random names and profiles |
| **Teachers** | 5 | Random names and profiles |
| **Parents** | 8 | Random names and profiles |
| **Students** | 15 | Complete profiles with assignments |
| **Notes** | ~75 | 3-8 notes per student |
| **Task Adaptations** | ~45 | 2-5 adaptations per student |
| **Learning Style Profiles** | 15 | One per student |
| **Mood Check-ins** | ~150 | 5-15 check-ins per student |

**Total:** ~300+ realistic records

### Test Credentials

All test users use the same password: `Test1234!`

**Admin Login:**
- Email: `admin@aequitas.test`
- Password: `Test1234!`

## 🏗️ Architecture

### Data Factory Pattern

The `DataFactory` provides utility functions for generating realistic data:

```typescript
import { DataFactory } from './data-factory';

// Create a random user
const therapist = await DataFactory.createUser(UserRole.THERAPIST);

// Create a random student
const student = DataFactory.createStudent({
  gradeLevel: 5,
  interests: ['Mathematics', 'Science']
});

// Create a note
const note = DataFactory.createNote(authorId, studentId, {
  category: 'ACADEMIC',
  content: 'Custom note content'
});
```

### Available Factory Methods

#### User Creation
```typescript
DataFactory.createUser(role: UserRole, customData?: Partial<User>)
```

Creates a user with the specified role. All users get:
- Realistic Spanish names
- Unique email addresses
- Hashed password (`Test1234!`)
- Active status
- Recent login timestamps

#### Student Creation
```typescript
DataFactory.createStudent(customData?: Partial<Student>)
```

Creates a student with:
- Age-appropriate grade level
- Random diagnosed conditions (ADHD, Dyslexia, etc.)
- Interests, strengths, and challenges
- School assignment

#### Note Creation
```typescript
DataFactory.createNote(authorId: string, studentId: string, customData?: Partial<Note>)
```

Creates realistic notes with:
- Varied content samples (participation, focus, behavior)
- Categories (GENERAL, ACADEMIC, BEHAVIORAL, SOCIAL)
- Tags and privacy settings

#### Task Adaptation Creation
```typescript
DataFactory.createTaskAdaptation(studentId: string, customData?: Partial<TaskAdaptation>)
```

Creates task adaptations with:
- Original and adapted task descriptions
- Adaptation reasoning
- Types (SIMPLIFICATION, BREAKDOWN, VISUAL_SUPPORT, EXTENDED_TIME)
- Effectiveness ratings

#### Learning Style Profile Creation
```typescript
DataFactory.createLearningStyleProfile(studentId: string, customData?: Partial<LearningStyleProfile>)
```

Creates learning style profiles with:
- Modality scores (visual, auditory, kinesthetic)
- Dominant modality identification
- Confidence scores

#### Mood Check-in Creation
```typescript
DataFactory.createMoodCheckin(studentId: string, customData?: Partial<MoodCheckin>)
```

Creates mood check-ins with:
- Various mood states (HAPPY, CALM, ANXIOUS, FRUSTRATED, etc.)
- Energy, stress, and sleep quality ratings
- Optional notes

### Utility Functions

```typescript
// Random number between min and max
DataFactory.random.int(min: number, max: number)

// Random item from array
DataFactory.random.item<T>(array: T[])

// Multiple random items from array
DataFactory.random.items<T>(array: T[], count: number)

// Random boolean
DataFactory.random.boolean()

// Random date within last N days
DataFactory.random.date(daysAgo: number)

// Generate Spanish name
DataFactory.generateName() // Returns { firstName, lastName }

// Generate email from name
DataFactory.generateEmail(firstName: string, lastName: string)

// Hash password
await DataFactory.hashPassword(password: string)
```

## 🎨 Customizing the Seeder

### Changing Entity Counts

Edit `seed.ts` and modify the loop counts:

```typescript
// Create more therapists (currently 3)
for (let i = 0; i < 5; i++) {  // Change to 5
  const therapistData = await DataFactory.createUser(UserRole.THERAPIST);
  // ...
}

// Create more students (currently 15)
for (let i = 0; i < 25; i++) {  // Change to 25
  const studentData = DataFactory.createStudent();
  // ...
}
```

### Adding Custom Data

You can add custom entities or modify existing ones:

```typescript
// Add a specific therapist
const customTherapist = await DataFactory.createUser(UserRole.THERAPIST, {
  email: 'maria.garcia@aequitas.test',
  firstName: 'María',
  lastName: 'García'
});
await dataSource.getRepository(User).save(customTherapist);
```

### Extending the Data Factory

To add new entity types, edit `data-factory.ts`:

```typescript
export function createCustomEntity(
  customData: Partial<CustomEntity> = {}
): Partial<CustomEntity> {
  return {
    field1: random.item(['Option1', 'Option2']),
    field2: random.int(1, 100),
    ...customData
  };
}
```

Then add it to the exported object:

```typescript
export const DataFactory = {
  // ... existing methods
  createCustomEntity,
};
```

## 🔄 Seeding Process

The seeder follows this order (respects foreign key constraints):

1. **Clear existing data** (in reverse dependency order)
2. **Create users** (admin, therapists, teachers, parents)
3. **Create students** with assignments to professionals
4. **Create notes** from assigned professionals
5. **Create task adaptations** for each student
6. **Create learning style profiles** for each student
7. **Create mood check-ins** for each student

## 🧪 Testing with Seeded Data

### Example Use Cases

**Test therapist login:**
- Login as any therapist (check console output for emails)
- View assigned students
- Create notes and adaptations

**Test student profile:**
- View student details
- See historical notes and adaptations
- Review mood trends

**Test parent view:**
- Login as parent
- View their children's progress
- Read teacher/therapist notes

### Resetting Data

The seeder automatically clears existing data before creating new records:

```bash
# This will delete and recreate all test data
npm run db:reset
```

## 📝 Adding New Entities

When you add a new entity to the platform:

1. **Create a factory method** in `data-factory.ts`:
   ```typescript
   export function createNewEntity(customData: Partial<NewEntity> = {}): Partial<NewEntity> {
     return {
       // Define realistic default values
       ...customData
     };
   }
   ```

2. **Add to the seeding script** in `seed.ts`:
   ```typescript
   // Create new entities
   console.log('📦 Creating new entities...');
   for (const student of students) {
     const entityData = DataFactory.createNewEntity();
     await dataSource.getRepository(NewEntity).save({
       ...entityData,
       student,
     });
   }
   ```

3. **Add to the clearing order** (at the top of the entities array):
   ```typescript
   const entities = [
     NewEntity,  // Add here (reverse dependency order)
     MoodCheckin,
     // ... rest
   ];
   ```

## 🐛 Troubleshooting

### "No changes were made" error

This happens when the database already has the exact same data. Run:
```bash
npm run db:reset
```

### Connection errors

Ensure PostgreSQL is running:
```bash
docker-compose up -d postgres
docker-compose ps  # Check status
```

### TypeORM errors

Check that all entities are properly imported and registered:
```typescript
// In seed.ts, verify all entities are imported
import { User } from '../../modules/users/entities/user.entity';
// ... etc
```

## 📚 Further Reading

- [TypeORM Documentation](https://typeorm.io/)
- [Faker.js](https://fakerjs.dev/) - Alternative data generation library
- [bcrypt](https://www.npmjs.com/package/bcrypt) - Password hashing

## 🤝 Contributing

When adding new seedable entities:
- Use realistic Spanish names and content
- Follow the existing patterns in `data-factory.ts`
- Ensure relationships are properly set up
- Test that the seeder runs successfully
- Update this README with the new entity information

---

**Last Updated:** 2025-11-07
**Maintainer:** Aequitas Team
