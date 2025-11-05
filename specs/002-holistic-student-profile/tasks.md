# Implementation Tasks: Holistic Student Profile

## Phase 1: Student Entity & CRUD

### Task 1.1: Create Student Entity
- [ ] Define Student interface
- [ ] Create Student entity with TypeORM
- [ ] Add StudentStatus enum
- [ ] Set up validation rules
- [ ] Create database migration
- **Estimate**: 2 hours

### Task 1.2: Student Service CRUD
- [ ] Implement findAll() with pagination
- [ ] Implement findOne() with RBAC checks
- [ ] Implement create() (Admin only)
- [ ] Implement update() (Therapist/Admin)
- [ ] Write unit tests
- **Estimate**: 4 hours

### Task 1.3: Photo Upload Service
- [ ] Set up S3 client configuration
- [ ] Implement uploadPhoto() method
- [ ] Add image resizing with sharp (300x300px)
- [ ] Generate signed URLs for viewing
- [ ] Write unit tests
- **Estimate**: 4 hours

### Task 1.4: Student API Endpoints
- [ ] GET /api/students (with pagination)
- [ ] GET /api/students/:id
- [ ] POST /api/students (Admin only)
- [ ] PATCH /api/students/:id
- [ ] POST /api/students/:id/photo
- [ ] Write integration tests
- **Estimate**: 4 hours

## Phase 2: Note System

### Task 2.1: Create Note Entity
- [ ] Define Note interface
- [ ] Create Note entity with TypeORM
- [ ] Add NoteType and NoteVisibility enums
- [ ] Add Grade embedded type
- [ ] Create database migration
- [ ] Add indexes on studentId and createdAt
- **Estimate**: 3 hours

### Task 2.2: Note Service
- [ ] Implement createNote() with type validation
- [ ] Implement findByStudent() with RBAC filtering
- [ ] Add visibility rule enforcement
- [ ] Implement field-level filtering for parents
- [ ] Write unit tests for all note types
- **Estimate**: 6 hours

### Task 2.3: Rich Text Sanitization
- [ ] Set up DOMPurify
- [ ] Create sanitizeHtml() utility
- [ ] Whitelist safe HTML tags
- [ ] Test with malicious input
- [ ] Write unit tests
- **Estimate**: 2 hours

### Task 2.4: Note API Endpoints
- [ ] GET /api/students/:studentId/notes
- [ ] POST /api/students/:studentId/notes
- [ ] Add filtering by note type
- [ ] Add pagination
- [ ] Write integration tests
- **Estimate**: 4 hours

## Phase 3: Timeline Aggregation

### Task 3.1: Timeline Service
- [ ] Create TimelineService
- [ ] Implement query that joins notes and adaptations
- [ ] Sort by createdAt descending
- [ ] Apply RBAC filtering
- [ ] Implement cursor-based pagination
- [ ] Write unit tests
- **Estimate**: 6 hours

### Task 3.2: Timeline API Endpoint
- [ ] GET /api/students/:studentId/timeline
- [ ] Add pagination parameters
- [ ] Format response with type discrimination
- [ ] Write integration tests
- **Estimate**: 3 hours

### Task 3.3: Performance Optimization
- [ ] Add database indexes
- [ ] Implement query result caching (5 min)
- [ ] Test with 1000+ timeline entries
- [ ] Optimize slow queries
- **Estimate**: 4 hours

## Phase 4: Profile Dashboard

### Task 4.1: Age Calculation Utility
- [ ] Create calculateAge() utility
- [ ] Handle edge cases (leap years, today's birthday)
- [ ] Write unit tests
- **Estimate**: 1 hour

### Task 4.2: Profile Statistics Service
- [ ] Implement getProfileStats()
- [ ] Count notes by type (respecting RBAC)
- [ ] Get recent grades
- [ ] Count active adaptations
- [ ] Write unit tests
- **Estimate**: 3 hours

### Task 4.3: Dashboard API Endpoint
- [ ] Add stats to GET /api/students/:id response
- [ ] Include recent activity summary
- [ ] Format condition summary
- [ ] Write integration tests
- **Estimate**: 2 hours

## Phase 5: Frontend - Profile View

### Task 5.1: Profile Page Layout
- [ ] Create StudentProfilePage component
- [ ] Build responsive layout (header, dashboard, tabs)
- [ ] Add loading states
- [ ] Write component tests
- **Estimate**: 4 hours

### Task 5.2: Profile Header Component
- [ ] Display profile photo (with placeholder)
- [ ] Show student name, age, condition
- [ ] Add Edit Profile button (conditional)
- [ ] Add Add Note button
- [ ] Write component tests
- **Estimate**: 3 hours

### Task 5.3: Dashboard Cards
- [ ] Create Recent Activity card
- [ ] Create Stats card
- [ ] Create Condition Summary card
- [ ] Make responsive
- [ ] Write component tests
- **Estimate**: 4 hours

### Task 5.4: Timeline Component
- [ ] Create Timeline component
- [ ] Display notes and adaptations
- [ ] Implement infinite scroll
- [ ] Add type badges and icons
- [ ] Format timestamps (relative and absolute)
- [ ] Write component tests
- **Estimate**: 6 hours

### Task 5.5: Profile Tabs
- [ ] Create tab navigation component
- [ ] Implement role-based tab visibility
- [ ] Add routing for each tab
- [ ] Write component tests
- **Estimate**: 3 hours

## Phase 6: Frontend - Note Management

### Task 6.1: Add Note Modal
- [ ] Create AddNoteModal component
- [ ] Add modal overlay and animations
- [ ] Handle different note types
- [ ] Add form validation
- [ ] Write component tests
- **Estimate**: 4 hours

### Task 6.2: Rich Text Editor Integration
- [ ] Integrate Tiptap or React Quill
- [ ] Configure toolbar (bold, italic, lists, links)
- [ ] Add character count indicator
- [ ] Handle paste from clipboard
- [ ] Write component tests
- **Estimate**: 5 hours

### Task 6.3: Note Type-Specific Forms
- [ ] Build Therapeutic Note form
- [ ] Build Academic Note form (with grade fields)
- [ ] Build Family Note form
- [ ] Add tag dropdowns
- [ ] Write component tests
- **Estimate**: 4 hours

### Task 6.4: Speech-to-Text Integration
- [ ] Add microphone button
- [ ] Integrate Web Speech API
- [ ] Handle transcription errors
- [ ] Add visual feedback during recording
- [ ] Write component tests
- **Estimate**: 4 hours

### Task 6.5: Note Detail View
- [ ] Create NoteDetailView component
- [ ] Display full note content
- [ ] Show metadata (author, date, tags)
- [ ] Add Copy to Clipboard button
- [ ] Write component tests
- **Estimate**: 3 hours

## Phase 7: Testing

### Task 7.1: Unit Tests
- [ ] Test Student Service methods
- [ ] Test Note Service methods
- [ ] Test Timeline Service methods
- [ ] Test sanitizeHtml utility
- [ ] Test calculateAge utility
- [ ] Achieve >90% coverage
- **Estimate**: 8 hours

### Task 7.2: Integration Tests
- [ ] Test all student endpoints
- [ ] Test all note endpoints
- [ ] Test timeline endpoint
- [ ] Test RBAC enforcement
- [ ] Test photo upload
- **Estimate**: 6 hours

### Task 7.3: E2E Tests
- [ ] Test admin creates student profile
- [ ] Test therapist adds therapeutic note
- [ ] Test teacher views student (RBAC)
- [ ] Test parent views child profile
- [ ] Test timeline pagination
- **Estimate**: 6 hours

### Task 7.4: Security Tests
- [ ] Test XSS in rich text
- [ ] Test RBAC bypass attempts
- [ ] Test photo upload security
- [ ] Fix any vulnerabilities
- **Estimate**: 4 hours

### Task 7.5: Accessibility Tests
- [ ] Run aXe on profile page
- [ ] Test keyboard navigation
- [ ] Test screen reader
- [ ] Fix violations
- **Estimate**: 3 hours

### Task 7.6: Performance Tests
- [ ] Test timeline with 1000+ entries
- [ ] Test photo upload with large files
- [ ] Test concurrent note creation
- [ ] Optimize if needed
- **Estimate**: 4 hours

## Summary
**Total Estimated Hours**: ~125 hours
**Total Estimated Days**: ~25 days

## Dependencies
- Spec 001 must be completed (RBAC system)
- S3 bucket must be configured
- Rich text editor library must be chosen

## Notes
- Photo uploads should be queued if needed
- Timeline performance is critical - monitor closely
- RBAC must be tested thoroughly for each note type
