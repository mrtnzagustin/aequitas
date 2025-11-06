# Implementation Plan: Holistic Student Profile

## Feature Summary
Central unified profile system for students that consolidates all notes, adaptations, and interactions from multiple users while respecting RBAC. This is the "single source of truth" for each student's educational journey.

## Technical Approach

### Architecture
- **Backend**: NestJS with TypeORM for profile and note management
- **Database**: PostgreSQL with indexes for timeline queries
- **Storage**: S3 for profile photos
- **Rich Text**: HTML storage with DOMPurify sanitization

### Key Components
1. **Student Module**: CRUD operations for student profiles
2. **Note Module**: Polymorphic notes (Therapeutic, Academic, Family)
3. **Timeline Module**: Chronological aggregation of all student data
4. **Upload Module**: Profile photo handling with S3 integration

## Implementation Phases

### Phase 1: Student Entity & CRUD (Days 1-3)
- Create Student entity with all fields
- Implement student CRUD service
- Add photo upload to S3
- Build API endpoints for students

### Phase 2: Note System (Days 4-7)
- Create polymorphic Note entity
- Implement note type discrimination (Therapeutic, Academic, Family)
- Add RBAC filtering for notes
- Build note creation endpoints
- Implement rich text sanitization

### Phase 3: Timeline Aggregation (Days 8-10)
- Build timeline query service
- Implement pagination and filtering
- Aggregate notes and adaptations
- Optimize queries with indexes

### Phase 4: Profile Dashboard (Days 11-13)
- Calculate profile statistics
- Build dashboard API endpoint
- Add age calculation logic
- Implement condition summary

### Phase 5: Frontend - Profile View (Days 14-18)
- Create student profile page
- Build profile header component
- Implement dashboard cards
- Create timeline component
- Add infinite scroll/pagination

### Phase 6: Frontend - Note Management (Days 19-22)
- Build "Add Note" modal
- Implement rich text editor
- Add note type-specific forms
- Handle speech-to-text integration
- Create note detail view

### Phase 7: Testing (Days 23-25)
- Unit tests for all services
- Integration tests for API endpoints
- E2E tests for critical flows
- Accessibility testing
- Performance testing for large timelines

## Dependencies

### External Dependencies
- `@aws-sdk/client-s3` - Photo storage
- `isomorphic-dompurify` - HTML sanitization
- `@tiptap/react` or `react-quill` - Rich text editor
- `sharp` - Image resizing

### Internal Dependencies
- Spec 001: User & Role Management (for RBAC)

## Risks & Mitigations

### Risk 1: Timeline Performance with 1000+ Entries
- **Mitigation**: Use cursor-based pagination, implement virtual scrolling, add database indexes

### Risk 2: Rich Text XSS Vulnerabilities
- **Mitigation**: Strict HTML sanitization with DOMPurify, whitelist allowed tags only

### Risk 3: Large Photo Uploads
- **Mitigation**: Frontend file size validation, automatic image compression, progress indicators

### Risk 4: RBAC Complexity for Field-Level Filtering
- **Mitigation**: Clear visibility rules, service-layer filtering, comprehensive tests

## Success Criteria

- [ ] All students have complete profiles with photos
- [ ] Notes are correctly filtered by user role
- [ ] Timeline loads in < 2 seconds with 500 entries
- [ ] Rich text editor works smoothly without lag
- [ ] Photo upload completes in < 5 seconds
- [ ] No RBAC bypass incidents
- [ ] 0 XSS vulnerabilities in rich text

## Estimated Timeline
**Total: 25 days (5 weeks)**
