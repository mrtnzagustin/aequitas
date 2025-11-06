# Generate Task Breakdown (Speckit)

You are tasked with generating a detailed task breakdown for a feature implementation.

## Context
Read both spec.md and plan.md from the current spec directory. Based on these documents, create a comprehensive tasks.md file with granular, actionable tasks.

## Instructions

1. **Read existing files**:
   - spec.md - Feature requirements and acceptance criteria
   - plan.md - Implementation strategy and phases

2. **Generate tasks.md** with the following structure:

```markdown
# Implementation Tasks: [Feature Name]

## Phase 1: [Phase Name]

### Task 1.1: [Task Name]
- [ ] [Specific action item 1]
- [ ] [Specific action item 2]
- [ ] [Specific action item 3]
- **Estimate**: X hours

### Task 1.2: [Task Name]
- [ ] [Specific action item 1]
- [ ] [Specific action item 2]
- **Estimate**: X hours

[... continue for all tasks in phase ...]

## Phase 2: [Phase Name]

[... continue for all phases ...]

## Summary
**Total Estimated Hours**: ~X hours
**Total Estimated Days**: ~Y days (assuming Z hours productive work per day)

## Dependencies
- [Prerequisite 1]
- [Prerequisite 2]

## Notes
- [Important consideration 1]
- [Important consideration 2]
```

3. **Task Guidelines**:
   - Each task should be completable in 2-8 hours
   - Include specific, actionable checkboxes
   - Always add "Write unit tests" or "Write component tests"
   - Break down large tasks into smaller subtasks
   - Provide realistic time estimates
   - Consider the actual implementation order

4. **Mandatory Task Categories** (based on constitution):
   - Database migrations and entities
   - Service layer implementation
   - API endpoints with RBAC
   - Frontend components
   - **Unit tests** (for all business logic)
   - **Integration tests** (for API endpoints)
   - **E2E tests** (for critical user flows)
   - **Accessibility tests** (aXe DevTools, keyboard nav)
   - **Documentation** (API docs, README updates, inline comments)

5. **Testing Requirements** (from constitution):
   - Unit tests must achieve >90% coverage
   - Integration tests for all endpoints
   - Regression testing of existing features
   - Build verification (npm run build)
   - Docker verification (docker-compose up)

6. **Write the tasks.md file** in the spec directory

7. **Confirm completion** by showing:
   - Location of the created file
   - Total estimated hours and days
   - Number of tasks per phase
   - Testing coverage planned

## Important
- Tasks must be granular enough to track progress
- Each task should have clear completion criteria
- Include time estimates for resource planning
- Don't forget documentation and testing tasks
- Reference spec.md acceptance criteria in tasks
