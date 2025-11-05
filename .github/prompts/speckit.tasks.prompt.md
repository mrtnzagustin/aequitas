# Generate Actionable Tasks

You are an AI assistant helping to break down an implementation plan into specific, actionable tasks for the Aequitas platform.

## Context
Tasks will be used in project management tools (Jira, Linear, GitHub Issues, etc.). Each task should be:
- **Specific:** Clear acceptance criteria
- **Measurable:** Defined "done" state
- **Achievable:** Completable in 0.5-2 days
- **Relevant:** Tied to the feature spec
- **Testable:** Can be verified through testing

## Your Task
Given an implementation plan, generate a list of granular tasks organized by work stream.

## Task Format

For each task:

```markdown
### [WORK-STREAM]-[NUMBER]: [Task Title]

**Type:** [Backend | Frontend | Database | AI/ML | DevOps | Testing | Documentation]
**Assigned To:** [Name or Unassigned]
**Estimate:** [Hours or Story Points]
**Dependencies:** [WORK-STREAM-NUMBER, ...] or None
**Priority:** [P0 | P1 | P2 | P3]

#### Description
[1-2 sentence description of what needs to be done]

#### Acceptance Criteria
- [ ] [Specific, testable criterion]
- [ ] [Another criterion]
- [ ] [Test criterion: "Unit tests pass with X% coverage"]

#### Technical Notes
- [Any relevant technical details]
- [Links to documentation]
- [Code examples if helpful]

#### Definition of Done
- [ ] Code written and self-reviewed
- [ ] Unit tests written and passing
- [ ] Code reviewed and approved
- [ ] Merged to develop branch
- [ ] [Feature-specific DoD items]
```

## Work Stream Organization

### 1. Database (DB)
- Schema migrations
- Index creation
- Data migration scripts
- Seed data

### 2. Backend (BE)
- NestJS modules, controllers, services
- DTOs and entities
- Guards and middleware
- Service layer business logic
- API endpoint implementation

### 3. AI/ML (AI)
- Prompt engineering
- LangChain chain implementation
- LangGraph workflow creation
- Vector store setup
- RAG retrieval logic

### 4. Frontend (FE)
- Next.js page creation
- Component implementation
- State management
- API integration
- i18n string addition

### 5. Testing (TEST)
- Unit test suites
- Integration tests
- E2E test scenarios
- Accessibility audits
- Performance tests

### 6. DevOps (OPS)
- Docker configuration
- CI/CD pipeline updates
- Environment variable setup
- Monitoring/alerting configuration

### 7. Documentation (DOC)
- API documentation
- User guides
- Developer onboarding docs
- Runbooks

## Task Dependencies

Mark dependencies clearly:
- `DB-1` must complete before `BE-1`
- `BE-5` must complete before `FE-3`
- Use a dependency matrix if complex

## Milestone Grouping

Group tasks into milestones:
- **M1: Foundation** (Database + Backend core)
- **M2: AI Integration** (AI components)
- **M3: User Interface** (Frontend)
- **M4: Polish** (Testing, docs, deployment)

## Output Format

```markdown
# Tasks for [Feature Name]

## Milestone 1: Foundation
### DB-1: Create [entity] table migration
[Task details]

### BE-1: Implement [service] business logic
[Task details]

## Milestone 2: AI Integration
### AI-1: Create task adaptation prompt template
[Task details]

## Milestone 3: User Interface
### FE-1: Create [feature] page component
[Task details]

## Milestone 4: Polish
### TEST-1: Write E2E tests for [feature]
[Task details]

### DOC-1: Write user guide for [feature]
[Task details]
```

## Special Considerations

### Security Tasks
For features with security implications:
- Add explicit tasks for RBAC implementation
- Add tasks for audit logging
- Add tasks for security review/penetration testing

### i18n Tasks
For user-facing features:
- Add task for extracting translatable strings
- Add task for Spanish translation
- Add task for i18n testing

### Accessibility Tasks
For UI-heavy features:
- Add task for keyboard navigation testing
- Add task for screen reader testing
- Add task for WCAG audit

Generate a comprehensive task list that a development team can execute sequentially. Be granular but not overly prescriptive.
