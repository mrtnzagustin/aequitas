# Create Implementation Plan

You are an AI assistant helping to create a detailed technical implementation plan for a feature in the Aequitas platform.

## Context
Aequitas uses:
- **Backend:** NestJS, LangChain, LangGraph, PostgreSQL
- **Frontend:** Next.js, Shadcn UI, TypeScript
- **Infrastructure:** Docker, Kubernetes (staging/prod)

## Your Task
Given a feature specification, create a step-by-step implementation plan.

## Plan Format

### 1. Architecture Overview
Provide a high-level diagram (ASCII art or description) showing:
- New or modified components
- Data flow
- Integration points
- External dependencies

### 2. Database Changes

#### 2.1 Schema Changes
For each table:
```sql
-- Migration: [timestamp]_[description]
CREATE TABLE [name] (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- fields
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 2.2 Indexes
List required indexes for performance

#### 2.3 Migration Strategy
- Forward migration SQL
- Rollback migration SQL
- Data migration scripts (if needed)

### 3. Backend Implementation

#### 3.1 Module Structure
```
src/
  modules/
    [feature-name]/
      [feature-name].module.ts
      [feature-name].controller.ts
      [feature-name].service.ts
      dto/
        create-[entity].dto.ts
        update-[entity].dto.ts
      entities/
        [entity].entity.ts
      guards/
        [custom-guard].guard.ts
      [feature-name].service.spec.ts
      [feature-name].controller.spec.ts
```

#### 3.2 Key Classes

For each major class:
```typescript
// Class name and purpose
// Key methods with signatures
// Dependencies (injected services)
```

#### 3.3 API Endpoints

| Method | Path | Auth | RBAC | Purpose |
|--------|------|------|------|---------|
| GET | /api/[resource] | Yes | Therapist, Teacher | List resources |
| POST | /api/[resource] | Yes | Therapist | Create resource |

For each endpoint, specify:
- Request validation (DTO)
- Business logic flow
- Response format
- Error codes

#### 3.4 AI Integration (if applicable)

**LangChain Components:**
- Chains or agents to implement
- Prompt templates
- Model configuration
- Retrieval strategies (for RAG)

**LangGraph Workflows:**
- State graph definition
- Node implementations
- Conditional edges
- Persistence strategy

### 4. Frontend Implementation

#### 4.1 Component Structure
```
src/
  components/
    [feature-name]/
      [Component].tsx
      [Component].module.css
      [Component].test.tsx
  hooks/
    use[Feature].ts
  pages/
    [route]/
      index.tsx
  i18n/
    locales/
      es/
        [feature].json
```

#### 4.2 Key Components

For each component:
```typescript
// Component name and purpose
// Props interface
// State management approach
// Key user interactions
```

#### 4.3 State Management
- What state needs to be shared?
- Context providers or store slices
- Async action patterns

#### 4.4 Routing
- New routes to add
- Dynamic route parameters
- Protected route guards

#### 4.5 i18n Strings
List all translatable strings with keys:
```json
{
  "featureName.title": "Title in English (for reference)",
  "featureName.action": "Action button text"
}
```

### 5. Testing Strategy

#### 5.1 Backend Tests
- Unit test cases for services
- Integration tests for controllers
- E2E API tests with Supertest

#### 5.2 Frontend Tests
- Component unit tests (React Testing Library)
- Integration tests for forms/flows
- E2E tests with Playwright

#### 5.3 AI Testing
- Prompt evaluation tests
- Mock LLM responses for consistency
- RAG retrieval accuracy tests

### 6. Security Implementation

#### 6.1 Authentication
- How is the user authenticated?
- Token validation approach

#### 6.2 Authorization (RBAC)
- Guards to implement
- Permission checks at service layer
- Field-level permission filtering

#### 6.3 Input Validation
- DTO validation rules
- Sanitization for XSS prevention
- SQL injection prevention (use ORMs properly)

#### 6.4 Audit Logging
- Events to log
- Log format and destination
- Retention policy

### 7. Implementation Steps

Break down into sequential tasks:

#### Phase 1: Foundation (Backend)
1. Create database migration
2. Run migration in dev environment
3. Generate entity classes
4. Implement service layer (business logic)
5. Write service unit tests
6. Implement controller layer
7. Write controller tests
8. Add RBAC guards

#### Phase 2: AI Integration (if applicable)
1. Define prompt templates
2. Implement LangChain components
3. Create LangGraph workflow
4. Add vector store (for RAG)
5. Test AI components in isolation

#### Phase 3: Frontend
1. Create component structure
2. Implement UI components (Shadcn)
3. Add i18n strings
4. Connect to backend API
5. Implement state management
6. Add form validation

#### Phase 4: Integration & Testing
1. E2E test critical paths
2. Accessibility audit (aXe)
3. Performance testing
4. Security review

#### Phase 5: Documentation & Deployment
1. Update API documentation
2. Write user documentation
3. Create deployment runbook
4. Deploy to staging
5. Conduct UAT
6. Deploy to production

### 8. Rollout Strategy

#### 8.1 Feature Flags
- Use feature flag for gradual rollout?
- Rollback plan if issues arise

#### 8.2 Monitoring
- Key metrics to monitor post-launch
- Alerts to configure
- Dashboard views to create

#### 8.3 User Communication
- Release notes
- In-app announcements
- Training materials (if needed)

### 9. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| [Description] | High/Med/Low | High/Med/Low | [Strategy] |

### 10. Estimated Effort

Provide t-shirt sizing or story points:
- Database: [X hours]
- Backend: [X hours]
- AI Integration: [X hours]
- Frontend: [X hours]
- Testing: [X hours]
- **Total: [X hours / X days]**

## Output Format
Write the plan in clear markdown following the structure above. Include code snippets and SQL examples. Be specific about file paths and class names.
