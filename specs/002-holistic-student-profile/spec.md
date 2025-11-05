# 002: Holistic Student Profile

**Status:** Draft
**Epic:** Student Management
**Priority:** P0
**Assigned To:** TBD
**Target Release:** v1.0 (MVP)

## 1. Overview

The Holistic Student Profile feature creates a unified, chronological view of each student's educational and therapeutic journey. This feature consolidates all interactions, notes, adaptations, and progress from Therapists, Teachers, and Parents into a single, accessible timeline that respects role-based permissions.

This is the central feature of the Aequitas platform - the "single source of truth" for a student's needs, progress, and history. It replaces scattered notebooks, emails, and disconnected systems with a structured, searchable, and comprehensive profile.

## 2. Problem Statement

**Current State:**
Student information is fragmented across multiple locations:
- Therapist notes in physical notebooks or separate apps
- Teacher observations in grade books or emails
- Parent feedback in sporadic communication
- Previous adaptations lost or forgotten
- No chronological view of progress
- Difficult to identify patterns or trends

**Desired State:**
A single, comprehensive profile for each student that:
- Aggregates all notes and interactions in one place
- Maintains a chronological timeline of progress
- Separates notes by type (Therapeutic, Academic, Family) with appropriate RBAC
- Enables quick access to student's condition, interests, and learning preferences
- Preserves history for trend analysis and RAG queries

**Impact if Not Addressed:**
Without a holistic profile, the AI adaptations lack context, users miss critical information, and the platform becomes just another disconnected tool instead of a unified solution.

## 3. User Personas

### Therapist (Psycho-pedagogue)
- **Needs:** Complete view of student (therapeutic, academic, family), ability to add confidential therapeutic notes, track interventions over time
- **Workflow:** Opens student profile → Sees condition summary → Reviews recent notes from all sources → Adds therapeutic observation → Views adaptation history

### Teacher
- **Needs:** Access to academic history, ability to add grades and observations, view family context (but not therapeutic details)
- **Workflow:** Selects student from class → Reviews academic notes → Checks recent family notes → Adds grade and observation → Reviews successful adaptations

### Parent
- **Needs:** View child's academic progress (non-sensitive), add family observations, understand what's happening at school
- **Workflow:** Opens child's profile → Sees recent academic achievements → Reviews teacher feedback → Adds note about behavior at home

### Admin
- **Needs:** Create student profiles, assign users to students, manage student data, compliance oversight
- **Workflow:** Creates student profile → Fills in basic info and condition → Assigns therapist and teachers → Sets parent access

## 4. Functional Requirements

### 4.1 Core Behaviors

#### Profile Creation

```gherkin
Given an Admin is logged in
When they click "Create Student Profile"
Then they see a form with: Name, Date of Birth, Condition, Interests, Learning Preferences
And they can optionally upload a profile photo

Given an Admin submits a student profile with valid data
When the profile is created
Then the student appears in the system
And an audit log entry is created
And the Admin can assign users to this student

Given an Admin tries to create a student with missing required fields
When they submit the form
Then they see validation errors
And the profile is not created
```

#### Profile Viewing (RBAC)

```gherkin
Given a Therapist views a student they're assigned to
When they open the profile
Then they see:
  - Student header (name, photo, condition, age)
  - Summary dashboard (recent activity, note count by type)
  - Chronological timeline of all notes and adaptations
  - Tabs: "Therapeutic Notes", "Academic Notes", "Family Notes", "Adaptations", "History Chat"

Given a Teacher views a student in their class
When they open the profile
Then they see:
  - Student header (name, photo, age) [condition may be redacted based on settings]
  - Summary dashboard (recent academic activity, grades)
  - Chronological timeline of academic and family notes only
  - Tabs: "Academic Notes", "Family Notes", "Adaptations"
  - "Therapeutic Notes" tab is NOT visible

Given a Parent views their child's profile
When they open the profile
Then they see:
  - Student header (name, photo, age)
  - Summary dashboard (recent progress, upcoming tasks)
  - Chronological timeline of family notes and approved academic notes
  - Tabs: "Academic Notes" (limited fields), "Family Notes", "Adaptations"
  - Sensitive fields like "Therapist observations" are redacted
```

#### Adding Notes (Type-Specific)

```gherkin
Given a Therapist is on a student's profile
When they click "Add Therapeutic Note"
Then they see a form with:
  - Text area (supports rich text)
  - Microphone icon for speech-to-text
  - Tags dropdown (e.g., "Reading Intervention", "Behavioral Observation")
  - Visibility toggle (default: "Therapist only")
  - "Save" and "Cancel" buttons

Given a Therapist saves a therapeutic note
When the note is created
Then it appears in the chronological timeline with a "Therapeutic" badge
And it is only visible to users with Therapist role (or Admins)
And an audit log entry is created

Given a Teacher is on a student's profile
When they click "Add Academic Note"
Then they see a form with:
  - Text area (supports rich text)
  - Microphone icon for speech-to-text
  - Grade field (optional): Subject dropdown + Grade input
  - Tags dropdown (e.g., "Math", "Reading", "Behavior")
  - "Save" and "Cancel" buttons

Given a Teacher saves an academic note with a grade
When the note is created
Then it appears in the timeline with an "Academic" badge
And the grade is displayed prominently
And it is visible to Therapists, Teachers, and Parents (with field-level filtering)

Given a Parent is on their child's profile
When they click "Add Family Note"
Then they see a form with:
  - Text area (supports rich text)
  - Microphone icon for speech-to-text
  - Tags dropdown (e.g., "Sleep", "Mood", "Home Environment")
  - "Save" and "Cancel" buttons

Given a Parent saves a family note
When the note is created
Then it appears in the timeline with a "Family" badge
And it is visible to all assigned users (Therapist, Teacher, Parent)
```

#### Chronological Timeline

```gherkin
Given a Therapist views a student's timeline
When they scroll through the entries
Then they see all notes and adaptations sorted by date (newest first)
And each entry shows:
  - Type badge (Therapeutic, Academic, Family, Adaptation)
  - Author name and role
  - Timestamp (formatted in user's locale)
  - Content preview (first 100 chars)
  - "View details" link

Given a Teacher views the same timeline
When they scroll through the entries
Then they see only Academic and Family notes (Therapeutic notes are filtered out)

Given a user clicks on a timeline entry
When the entry expands
Then they see the full content
And any associated metadata (tags, grades, attachments)
```

#### Profile Dashboard (Summary View)

```gherkin
Given a user opens a student profile
When the profile loads
Then they see a dashboard at the top with:
  - Total notes count (filtered by their permission level)
  - Recent activity summary (last 7 days)
  - Condition summary with key accommodations
  - Quick stats: Recent grades (if Teacher/Therapist), Active adaptations

Given a Therapist views the dashboard
When they see the condition summary
Then it includes:
  - Primary condition (e.g., "Dyslexia")
  - Learning preferences (e.g., "Visual learner", "Needs extra time")
  - Interests (e.g., "Dinosaurs", "Soccer")
  - Current therapeutic goals (if set)
```

#### Profile Editing

```gherkin
Given a Therapist is viewing a student profile
When they click "Edit Profile"
Then they can modify:
  - Condition
  - Interests (multi-select or free text)
  - Learning preferences (multi-select or free text)
  - Photo upload

Given a Teacher tries to edit the profile
When they click "Edit Profile"
Then they see a "Permission Denied" message
And can only add notes, not edit the profile

Given an Admin edits a student profile
When they save changes
Then the changes are logged in the audit trail
And users with access see the updated profile
```

### 4.2 User Interface

#### Student Profile Page Layout

**Header Section:**
- Left: Profile photo (150x150px, rounded)
- Center:
  - Student name (h1)
  - Age and date of birth (smaller text)
  - Condition badges (e.g., "Dyslexia", "ADHD")
- Right:
  - "Edit Profile" button (if permitted)
  - "Add Note" dropdown (Therapeutic/Academic/Family based on role)
  - "Adapt Task" button

**Dashboard Section (Cards):**
Three-column grid:
1. **Recent Activity Card:**
   - Last 5 timeline entries (compact view)
   - "View all" link

2. **Stats Card:**
   - Note counts by type (icon + number)
   - Recent grades (if applicable)
   - Active adaptations count

3. **Condition Summary Card:**
   - Condition name
   - Key accommodations (bulleted list)
   - Interests (tags)
   - Learning preferences (tags)

**Tabs Section:**
Tabs based on user role:
- Therapist: "Therapeutic Notes", "Academic Notes", "Family Notes", "Adaptations", "History Chat"
- Teacher: "Academic Notes", "Family Notes", "Adaptations"
- Parent: "Academic Notes", "Family Notes", "Adaptations"

**Timeline View (Default Tab):**
- Infinite scroll or pagination
- Each entry:
  - Type badge (colored: blue=Therapeutic, green=Academic, purple=Family, orange=Adaptation)
  - Author avatar + name
  - Timestamp (relative: "2 hours ago" or absolute: "Nov 5, 2025, 2:30 PM")
  - Content preview
  - "View details" button
- Filter dropdown: "All", "Notes Only", "Adaptations Only", "By Author"
- Search box: "Search timeline..."

**Add Note Modal:**
- Modal overlay (dismissible)
- Title: "Add [Type] Note"
- Rich text editor (bold, italic, lists, links)
- Microphone button (speech-to-text)
- Tags dropdown (multi-select)
- Grade fields (Academic notes only):
  - Subject dropdown (Math, Language Arts, Science, etc.)
  - Grade input (free text or dropdown based on locale)
- "Save" button (primary)
- "Cancel" button

#### Responsive Design
- Desktop: Three-column layout with sidebar
- Tablet: Two-column layout
- Mobile: Single column, collapsible sections

### 4.3 Data Model

#### Student Entity
```typescript
interface Student {
  id: string; // UUID
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  condition: string; // Primary condition (e.g., "Dyslexia")
  interests: string[]; // Array of interests
  learningPreferences: string[]; // Array of preferences
  photoUrl: string | null; // S3/storage URL
  status: StudentStatus; // ACTIVE, INACTIVE, ARCHIVED
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID
}

enum StudentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}
```

#### Note Entity (Polymorphic)
```typescript
interface Note {
  id: string; // UUID
  studentId: string; // Student ID
  authorId: string; // User ID
  type: NoteType; // THERAPEUTIC, ACADEMIC, FAMILY
  content: string; // Rich text (stored as HTML or Markdown)
  tags: string[]; // Array of tags
  grade?: Grade; // Only for ACADEMIC notes
  visibility: NoteVisibility; // Controls who can see this note
  createdAt: Date;
  updatedAt: Date;
}

enum NoteType {
  THERAPEUTIC = 'THERAPEUTIC',
  ACADEMIC = 'ACADEMIC',
  FAMILY = 'FAMILY',
}

enum NoteVisibility {
  THERAPIST_ONLY = 'THERAPIST_ONLY', // Only therapists and admins
  TEAM = 'TEAM', // Therapists, teachers
  ALL = 'ALL', // Everyone including parents
}

interface Grade {
  subject: string; // e.g., "Math", "Reading"
  score: string; // Grade (flexible format: "A", "85%", "7/10")
  maxScore?: string; // Optional denominator
}
```

#### StudentAssignment Entity (from Spec 001)
```typescript
interface StudentAssignment {
  id: string;
  userId: string;
  studentId: string;
  assignedBy: string;
  assignedAt: Date;
}
```

#### Relationships
- Student → Note: One-to-many
- Student → StudentAssignment: One-to-many (students have multiple assigned users)
- User → Note: One-to-many (users author multiple notes)

### 4.4 Business Logic

#### Note Visibility Rules

**Therapeutic Notes (THERAPIST_ONLY by default):**
- Visible to: Therapists assigned to student, Admins
- Hidden from: Teachers, Parents

**Academic Notes (TEAM visibility by default):**
- Visible to: Therapists, Teachers assigned to student, Admins
- Parents: See limited fields (grades and general observations, but not sensitive teacher comments)
- Field-level filtering:
  - Parent sees: Subject, grade, general feedback
  - Parent does NOT see: "Therapist observations" field or "Behavioral concerns" tagged notes

**Family Notes (ALL visibility by default):**
- Visible to: Everyone assigned to the student
- No restrictions

#### Timeline Filtering Logic
For each user, the timeline query filters by:
1. Student assignment (user must be assigned to the student)
2. Note visibility:
   - Therapist/Admin: All notes
   - Teacher: TEAM and ALL notes
   - Parent: ALL notes + limited fields from TEAM notes

#### Age Calculation
- Age displayed as: "[X] years" (e.g., "8 years" or "15 years")
- Calculated dynamically from `dateOfBirth` on each page load
- Formatting respects locale (but age format is universal)

#### Profile Photo Upload
- Accepted formats: JPG, PNG, HEIC
- Max file size: 5MB
- Automatically resized to 300x300px
- Stored in cloud storage (S3 or similar)
- Placeholder avatar if no photo uploaded (initials-based)

#### Rich Text Sanitization
- User input sanitized to prevent XSS
- Allowed HTML tags: `<b>`, `<i>`, `<u>`, `<a>`, `<ul>`, `<ol>`, `<li>`, `<p>`, `<br>`
- Strip `<script>`, `<iframe>`, `<object>`, event handlers
- Use DOMPurify library for sanitization

## 5. Non-Functional Requirements

### 5.1 Security & Privacy

#### RBAC Enforcement
- Every profile view filtered by user's role and student assignments
- Notes filtered by visibility rules at database query level
- Field-level permissions enforced in API responses
- Audit log for all profile views and note creations

#### Sensitive Data Handling
- Therapeutic notes encrypted at rest (column-level encryption)
- Profile photos stored in private S3 bucket (signed URLs)
- No sensitive data in URLs (use UUIDs, not names)

#### Audit Logging
Events to log:
- Student profile created
- Student profile updated (with field changes)
- Note created (with type and author)
- Note viewed (for therapeutic notes)
- Profile photo uploaded
- User assigned to student

### 5.2 Performance

- Profile page load: < 2 seconds (95th percentile)
- Timeline query: < 500ms for 500 notes
- Add note: < 1 second (save + refresh timeline)
- Profile photo upload: < 5 seconds for 5MB file
- Rich text editor: No lag on typing (debounced auto-save at 3 seconds)

#### Database Optimization
- Index on `studentId` in Notes table
- Index on `studentId` in StudentAssignments table
- Index on `createdAt` in Notes table (for timeline sorting)
- Consider partitioning Notes table by `studentId` if > 100K notes

### 5.3 Internationalization

#### Date/Time Formatting
- Use user's locale for date formatting
- Spanish (es-AR): "5 de noviembre de 2025, 14:30"
- English (en-US): "November 5, 2025, 2:30 PM"
- Relative times: "Hace 2 horas" (Spanish) vs "2 hours ago" (English)

#### UI Strings
```json
// i18n/locales/es/student.json
{
  "profile": {
    "title": "Perfil del Estudiante",
    "editProfile": "Editar Perfil",
    "addNote": "Agregar Nota",
    "adaptTask": "Adaptar Tarea",
    "condition": "Condición",
    "interests": "Intereses",
    "learningPreferences": "Preferencias de Aprendizaje",
    "age": "{years} años"
  },
  "notes": {
    "therapeutic": "Nota Terapéutica",
    "academic": "Nota Académica",
    "family": "Nota Familiar",
    "addTherapeutic": "Agregar Nota Terapéutica",
    "addAcademic": "Agregar Nota Académica",
    "addFamily": "Agregar Nota Familiar",
    "content": "Contenido",
    "tags": "Etiquetas",
    "grade": "Calificación",
    "subject": "Materia",
    "save": "Guardar",
    "cancel": "Cancelar"
  },
  "timeline": {
    "title": "Línea de Tiempo",
    "filter": "Filtrar",
    "search": "Buscar en la línea de tiempo...",
    "viewDetails": "Ver detalles",
    "noEntries": "No hay entradas en la línea de tiempo"
  }
}
```

### 5.4 Accessibility

#### Keyboard Navigation
- Profile page fully navigable via keyboard
- Tab through: Edit Profile → Add Note → Timeline entries → Pagination
- Modal focus trap (Tab cycles within modal)
- Escape key closes modals

#### Screen Reader Support
- Profile header: `<h1>` for student name
- Dashboard cards: ARIA landmarks (`role="region"`)
- Timeline entries: ARIA labels with timestamp and author
- Rich text editor: ARIA label "Note content"
- "Add Note" modal: Focus moves to editor on open

#### Visual Accessibility
- Color contrast: 4.5:1 minimum for text
- Type badges use both color and icon (not color alone)
- Focus indicators on all interactive elements
- Text resizable to 200% without breaking layout

## 6. API Specifications

### 6.1 Student Endpoints

#### GET /api/students
List all students accessible to the current user.

**Auth:** Required

**Query Params:**
- `page` (number, default: 1)
- `limit` (number, default: 50)
- `search` (string, optional) - searches name
- `status` (StudentStatus, optional)

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "firstName": "Juan",
      "lastName": "Pérez",
      "dateOfBirth": "2015-03-15",
      "age": 10,
      "condition": "Dyslexia",
      "photoUrl": "https://storage.example.com/photos/abc123.jpg",
      "status": "ACTIVE"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 25
  }
}
```

#### GET /api/students/:id
Get detailed profile for a specific student.

**Auth:** Required (must be assigned to student)

**Response (200):**
```json
{
  "id": "uuid",
  "firstName": "Juan",
  "lastName": "Pérez",
  "dateOfBirth": "2015-03-15",
  "age": 10,
  "condition": "Dyslexia",
  "interests": ["Soccer", "Dinosaurs", "Video games"],
  "learningPreferences": ["Visual learner", "Needs extra time", "Prefers step-by-step instructions"],
  "photoUrl": "https://storage.example.com/photos/abc123.jpg",
  "status": "ACTIVE",
  "createdAt": "2025-09-01T08:00:00Z",
  "updatedAt": "2025-11-05T14:30:00Z"
}
```

**Response (403):**
```json
{
  "statusCode": 403,
  "message": "You do not have permission to view this student",
  "error": "Forbidden"
}
```

#### POST /api/students
Create a new student profile.

**Auth:** Required (Admin only)

**Request:**
```json
{
  "firstName": "María",
  "lastName": "González",
  "dateOfBirth": "2014-07-22",
  "condition": "ADHD",
  "interests": ["Art", "Music"],
  "learningPreferences": ["Kinesthetic learner", "Needs frequent breaks"]
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "firstName": "María",
  "lastName": "González",
  "dateOfBirth": "2014-07-22",
  "age": 11,
  "condition": "ADHD",
  "interests": ["Art", "Music"],
  "learningPreferences": ["Kinesthetic learner", "Needs frequent breaks"],
  "photoUrl": null,
  "status": "ACTIVE",
  "createdAt": "2025-11-05T15:00:00Z",
  "updatedAt": "2025-11-05T15:00:00Z"
}
```

#### PATCH /api/students/:id
Update a student profile.

**Auth:** Required (Therapist or Admin)

**Request:**
```json
{
  "interests": ["Art", "Music", "Soccer"],
  "learningPreferences": ["Kinesthetic learner", "Needs frequent breaks", "Responds well to visual aids"]
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "firstName": "María",
  "lastName": "González",
  // ... full updated profile
  "updatedAt": "2025-11-05T15:30:00Z"
}
```

#### POST /api/students/:id/photo
Upload a profile photo.

**Auth:** Required (Therapist or Admin)

**Request:** (multipart/form-data)
- `file`: Image file (JPG, PNG, HEIC)

**Response (200):**
```json
{
  "photoUrl": "https://storage.example.com/photos/xyz789.jpg"
}
```

### 6.2 Note Endpoints

#### GET /api/students/:studentId/notes
Get all notes for a student (filtered by user permissions).

**Auth:** Required

**Query Params:**
- `type` (NoteType, optional)
- `page` (number, default: 1)
- `limit` (number, default: 50)
- `search` (string, optional)

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "studentId": "uuid",
      "author": {
        "id": "uuid",
        "firstName": "Dr. Ana",
        "lastName": "López",
        "role": "THERAPIST"
      },
      "type": "THERAPEUTIC",
      "content": "<p>Student showed improvement in reading comprehension...</p>",
      "tags": ["Reading", "Progress"],
      "createdAt": "2025-11-05T10:00:00Z",
      "updatedAt": "2025-11-05T10:00:00Z"
    },
    {
      "id": "uuid",
      "studentId": "uuid",
      "author": {
        "id": "uuid",
        "firstName": "Prof. Carlos",
        "lastName": "Rodríguez",
        "role": "TEACHER"
      },
      "type": "ACADEMIC",
      "content": "<p>Excellent performance on math quiz.</p>",
      "tags": ["Math"],
      "grade": {
        "subject": "Mathematics",
        "score": "9/10"
      },
      "createdAt": "2025-11-04T14:30:00Z",
      "updatedAt": "2025-11-04T14:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 87
  }
}
```

#### POST /api/students/:studentId/notes
Create a new note.

**Auth:** Required (must be assigned to student)

**Request:**
```json
{
  "type": "ACADEMIC",
  "content": "<p>Student struggled with word problems today. Needs more visual aids.</p>",
  "tags": ["Math", "Word Problems"],
  "grade": {
    "subject": "Mathematics",
    "score": "6/10"
  }
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "studentId": "uuid",
  "authorId": "uuid",
  "type": "ACADEMIC",
  "content": "<p>Student struggled with word problems today. Needs more visual aids.</p>",
  "tags": ["Math", "Word Problems"],
  "grade": {
    "subject": "Mathematics",
    "score": "6/10"
  },
  "visibility": "TEAM",
  "createdAt": "2025-11-05T15:45:00Z",
  "updatedAt": "2025-11-05T15:45:00Z"
}
```

#### GET /api/students/:studentId/timeline
Get chronological timeline of notes and adaptations.

**Auth:** Required

**Query Params:**
- `page` (number, default: 1)
- `limit` (number, default: 20)

**Response (200):**
```json
{
  "data": [
    {
      "type": "note",
      "note": {
        "id": "uuid",
        "type": "ACADEMIC",
        "author": {
          "firstName": "Prof. Carlos",
          "lastName": "Rodríguez",
          "role": "TEACHER"
        },
        "contentPreview": "Student struggled with word problems...",
        "createdAt": "2025-11-05T15:45:00Z"
      }
    },
    {
      "type": "adaptation",
      "adaptation": {
        "id": "uuid",
        "taskTitle": "Math Word Problems",
        "status": "CONFIRMED",
        "createdBy": {
          "firstName": "Prof. Carlos",
          "lastName": "Rodríguez"
        },
        "createdAt": "2025-11-04T11:00:00Z"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

## 7. Edge Cases & Error Handling

### Student Not Assigned to User
- **Scenario:** Teacher tries to access student they're not assigned to
- **Detection:** Check StudentAssignment table in service layer
- **Error Message:** "You do not have permission to view this student."
- **Recovery:** Redirect to dashboard, log access attempt

### Large Note Content
- **Scenario:** User tries to save a note with >10,000 characters
- **Detection:** Frontend validation (warn at 8,000 chars) + backend DTO validation
- **Error Message:** "Note content exceeds maximum length of 10,000 characters."
- **Recovery:** User must shorten content

### Duplicate Profile Photo Upload
- **Scenario:** User uploads a new photo while previous upload is in progress
- **Detection:** Frontend disables upload button during upload
- **Error Message:** "Please wait for the current upload to complete."
- **Recovery:** Queue uploads or cancel previous upload

### Timeline Pagination at High Volume
- **Scenario:** Student has 5,000+ timeline entries
- **Detection:** Database query slow (> 1 second)
- **Error Message:** None (graceful handling)
- **Recovery:** Use cursor-based pagination instead of offset-based, implement virtual scrolling on frontend

### Rich Text XSS Attempt
- **Scenario:** User tries to inject `<script>` tag in note content
- **Detection:** Backend sanitization with DOMPurify
- **Error Message:** None (silently stripped)
- **Recovery:** Malicious content removed, safe content saved

## 8. Testing Strategy

### 8.1 Unit Tests

**Services:**
- `StudentService.findOne()` - authorized access, unauthorized access, non-existent student
- `StudentService.create()` - valid data, invalid data, duplicate detection
- `NoteService.create()` - valid note, invalid type, content sanitization
- `NoteService.findByStudent()` - RBAC filtering, timeline query

**Utilities:**
- `calculateAge()` - various birthdates, edge cases (leap year, today's date)
- `sanitizeHtml()` - malicious input, safe input, mixed content

### 8.2 Integration Tests

**API Endpoints:**
- `GET /api/students/:id` - authorized, unauthorized, not found
- `POST /api/students` - successful creation, validation errors
- `POST /api/students/:studentId/notes` - all note types, RBAC enforcement
- `GET /api/students/:studentId/timeline` - pagination, filtering

### 8.3 E2E Tests

**Critical Flows:**
1. **Admin creates student profile:**
   - Admin logs in
   - Navigates to "Create Student"
   - Fills form
   - Uploads photo
   - Submits
   - Verifies profile appears in list

2. **Therapist adds therapeutic note:**
   - Therapist logs in
   - Opens student profile
   - Clicks "Add Therapeutic Note"
   - Types content (or uses speech-to-text)
   - Adds tags
   - Saves
   - Verifies note appears in timeline

3. **Teacher views student profile (RBAC):**
   - Teacher logs in
   - Opens assigned student
   - Verifies "Therapeutic Notes" tab is not visible
   - Verifies can see "Academic Notes" and "Family Notes"
   - Adds academic note with grade
   - Verifies note saved successfully

4. **Parent views child's profile (limited access):**
   - Parent logs in
   - Opens child's profile
   - Verifies can see academic notes (public fields)
   - Verifies cannot see therapeutic notes
   - Adds family note
   - Verifies note visible to all

### 8.4 Accessibility Tests

- Run aXe DevTools on profile page (0 violations)
- Keyboard navigation test (all features accessible)
- Screen reader test (timeline entries properly announced)
- Color contrast check (all text meets WCAG AA)

## 9. Success Metrics

### Quantitative
- 100% of students have profiles within 1 week of enrollment
- Average of 3 notes per student per week
- < 2 seconds profile page load time
- 0 RBAC bypass incidents

### Qualitative
- Users report: "It's easy to see the full picture of a student"
- "I no longer lose track of important observations"
- "The timeline view helps me identify patterns"

## 10. Dependencies

### Required Features
- Spec 001: User & Role Management (for RBAC)

### Required Infrastructure
- PostgreSQL database
- S3 or similar for photo storage
- Rich text editor library (Tiptap, Quill, or Draft.js)
- Sanitization library (DOMPurify)

### Required Libraries
- NestJS: `@nestjs/typeorm`
- Frontend: `react-quill` or `@tiptap/react` (rich text editor)
- Sanitization: `isomorphic-dompurify`

## 11. Open Questions

1. **Photo Storage:** Should we use S3, Cloudinary, or local storage?
   - **Decision needed by:** Pre-implementation
   - **Assumption:** S3 with signed URLs for security

2. **Rich Text Format:** Should we store HTML or Markdown?
   - **Decision needed by:** Pre-implementation
   - **Assumption:** HTML (easier for rich editors, sanitize on save)

3. **Note Editing:** Should users be able to edit/delete their own notes?
   - **Decision needed by:** Pre-implementation
   - **Assumption:** Edit within 5 minutes, no deletion (for audit trail integrity)

4. **Timeline Performance:** At what scale do we need to optimize (cursor pagination, caching)?
   - **Decision needed by:** Post-implementation (based on usage data)
   - **Assumption:** Optimize when average student has >500 entries

## 12. Future Enhancements

### Phase 2
- Note attachments (PDFs, images, documents)
- Note editing and version history
- Note threading (replies to notes)
- Timeline filtering by date range
- Export profile as PDF for reports
- Bulk student import (CSV)

### Phase 3
- Profile comparison (compare two students' profiles)
- AI-generated profile summaries
- Automated insights from timeline patterns
- Student portfolio (showcase achievements)
- Parent-Teacher messaging within profile context

---

**Specification Last Updated:** 2025-11-05
**Next Review:** 2025-12-05
