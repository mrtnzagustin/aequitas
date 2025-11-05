# Implementation Plan: Adaptation Review & Confirmation

## Feature Summary
Human-in-the-loop system for reviewing and confirming AI-generated adaptations before they are assigned to students. Ensures quality control and educational appropriateness.

## Technical Approach

### Architecture
- **Backend**: NestJS with status workflow management
- **Database**: PostgreSQL for adaptation status and review history
- **Notifications**: Real-time updates when adaptations are confirmed

### Key Components
1. **Review Workflow**: Status transitions (DRAFT → IN_REVIEW → CONFIRMED)
2. **Comment System**: Reviewers can add notes and suggestions
3. **Confirmation Service**: Final approval logic
4. **History Tracking**: Audit trail of all review activities

## Implementation Phases

### Phase 1: Status Workflow (Days 1-3)
- Add status field to TaskAdaptation entity
- Implement status transition logic
- Add validation rules for status changes
- Build API endpoints for status updates

### Phase 2: Review System (Days 4-6)
- Create ReviewComment entity
- Build comment CRUD service
- Add reviewer assignment logic
- Implement review API endpoints

### Phase 3: Confirmation Logic (Days 7-8)
- Implement confirmation workflow
- Add therapist override capabilities
- Build confirmation history
- Add notification triggers

### Phase 4: Frontend - Review UI (Days 9-14)
- Build review dashboard
- Create adaptation review modal
- Add comment interface
- Implement status actions (Approve/Reject/Request Changes)

### Phase 5: Testing (Days 15-17)
- Unit tests for workflow logic
- Integration tests for API
- E2E tests for review flow
- User acceptance testing

## Success Criteria
- [ ] All adaptations require confirmation before assignment
- [ ] Review workflow is intuitive and fast
- [ ] Therapists can override teacher reviews
- [ ] All review actions are audited
- [ ] 100% of adaptations have clear status

## Estimated Timeline
**Total: 17 days (3-4 weeks)**
