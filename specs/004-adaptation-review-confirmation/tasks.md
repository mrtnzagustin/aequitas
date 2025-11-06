# Implementation Tasks: Adaptation Review & Confirmation

## Phase 1: Status Workflow

### Task 1.1: Update TaskAdaptation Entity
- [ ] Add status field (DRAFT, IN_REVIEW, CONFIRMED, REJECTED)
- [ ] Add reviewedBy field
- [ ] Add reviewedAt timestamp
- [ ] Create migration
- **Estimate**: 2 hours

### Task 1.2: Status Transition Service
- [ ] Create WorkflowService
- [ ] Implement transition validation
- [ ] Add business rules for each transition
- [ ] Write unit tests
- **Estimate**: 4 hours

### Task 1.3: Status Update Endpoints
- [ ] PATCH /api/adaptations/:id/status
- [ ] Add RBAC (only assigned users can review)
- [ ] Write integration tests
- **Estimate**: 3 hours

## Phase 2: Review System

### Task 2.1: ReviewComment Entity
- [ ] Create entity with fields
- [ ] Add relationship to TaskAdaptation
- [ ] Create migration
- **Estimate**: 2 hours

### Task 2.2: Comment Service
- [ ] Implement createComment()
- [ ] Implement findByAdaptation()
- [ ] Add RBAC filtering
- [ ] Write unit tests
- **Estimate**: 3 hours

### Task 2.3: Comment API Endpoints
- [ ] POST /api/adaptations/:id/comments
- [ ] GET /api/adaptations/:id/comments
- [ ] Write integration tests
- **Estimate**: 3 hours

## Phase 3: Confirmation Logic

### Task 3.1: Confirmation Service
- [ ] Implement confirmAdaptation()
- [ ] Add therapist override logic
- [ ] Update adaptation status
- [ ] Write unit tests
- **Estimate**: 3 hours

### Task 3.2: Notification System
- [ ] Trigger notification on confirmation
- [ ] Notify teacher when adaptation is reviewed
- [ ] Write tests
- **Estimate**: 3 hours

### Task 3.3: History Tracking
- [ ] Add audit log entries
- [ ] Track all status changes
- [ ] Write tests
- **Estimate**: 2 hours

## Phase 4: Frontend - Review UI

### Task 4.1: Review Dashboard
- [ ] Create review queue page
- [ ] List adaptations needing review
- [ ] Add filtering and sorting
- [ ] Write component tests
- **Estimate**: 6 hours

### Task 4.2: Review Modal
- [ ] Create detailed review view
- [ ] Show original and adapted tasks
- [ ] Add comment section
- [ ] Write component tests
- **Estimate**: 6 hours

### Task 4.3: Status Action Buttons
- [ ] Add Approve button
- [ ] Add Reject button
- [ ] Add Request Changes button
- [ ] Handle confirmation logic
- [ ] Write tests
- **Estimate**: 4 hours

### Task 4.4: Comment Interface
- [ ] Add comment input
- [ ] Display comment history
- [ ] Show reviewer names and timestamps
- [ ] Write tests
- **Estimate**: 4 hours

## Phase 5: Testing

### Task 5.1: Unit Tests
- [ ] Test WorkflowService
- [ ] Test Comment Service
- [ ] Test confirmation logic
- [ ] Achieve >90% coverage
- **Estimate**: 6 hours

### Task 5.2: Integration Tests
- [ ] Test all endpoints
- [ ] Test RBAC enforcement
- [ ] Test workflow transitions
- **Estimate**: 4 hours

### Task 5.3: E2E Tests
- [ ] Test full review flow
- [ ] Test therapist override
- [ ] Test rejection scenario
- **Estimate**: 4 hours

## Summary
**Total Estimated Hours**: ~68 hours
**Total Estimated Days**: ~17 days
