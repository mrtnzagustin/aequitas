# Implementation Checklist

You are an AI assistant helping to verify that a feature implementation is complete and meets the Aequitas platform standards.

## Context
Before a feature can be marked as "Done" and deployed, it must pass all quality gates.

## Your Task
Review the implementation and create a comprehensive checklist covering all aspects of the feature.

## Checklist Format

### 1. Specification Compliance
- [ ] All acceptance criteria from the spec are met
- [ ] Behaviors match the Given-When-Then scenarios
- [ ] Edge cases are handled as specified
- [ ] Out-of-scope items are not included

### 2. Code Quality

#### Backend
- [ ] TypeScript strict mode with no `any` types
- [ ] Proper error handling with appropriate exceptions
- [ ] Logging with correlation IDs for distributed tracing
- [ ] Services properly injected via dependency injection
- [ ] DTOs validate all inputs with class-validator
- [ ] Entities have proper relationships and constraints
- [ ] Business logic in service layer, not controllers

#### Frontend
- [ ] Components follow single responsibility principle
- [ ] Props properly typed with TypeScript interfaces
- [ ] No prop drilling (use Context or state management)
- [ ] Proper loading and error states
- [ ] Optimistic updates where appropriate
- [ ] No console.log in production code

### 3. Testing

#### Unit Tests
- [ ] Services have unit tests with >80% coverage
- [ ] Controllers have unit tests mocking services
- [ ] Components have unit tests for key behaviors
- [ ] Utility functions have unit tests
- [ ] Mocks properly simulate external dependencies

#### Integration Tests
- [ ] API endpoints have integration tests
- [ ] Database operations tested with test database
- [ ] Authentication/authorization flows tested
- [ ] Form submissions tested end-to-end

#### E2E Tests
- [ ] Critical user journeys have E2E tests (Playwright)
- [ ] Tests run against staging environment
- [ ] Tests cover multiple personas (Therapist, Teacher, etc.)
- [ ] Tests verify RBAC (users see only what they should)

#### AI Tests
- [ ] Prompt templates tested with sample inputs
- [ ] LangChain chains tested with mock LLMs
- [ ] RAG retrieval tested for accuracy and relevance
- [ ] AI outputs tested for language consistency

### 4. Security & Privacy

#### Authentication & Authorization
- [ ] All endpoints require authentication (except public ones)
- [ ] RBAC enforced at controller level with guards
- [ ] RBAC enforced at service level (defense in depth)
- [ ] Field-level filtering based on user role
- [ ] JWT tokens properly validated and not expired

#### Input Validation & Sanitization
- [ ] All inputs validated with DTOs
- [ ] String inputs have max length limits
- [ ] Enum fields validated against allowed values
- [ ] File uploads have type and size restrictions
- [ ] HTML content sanitized to prevent XSS

#### Audit & Compliance
- [ ] All data modifications logged to audit table
- [ ] Logs include user ID, timestamp, action, entity
- [ ] Logs are immutable (append-only)
- [ ] Sensitive data (PHI) not logged
- [ ] User consent captured for data collection

#### Data Protection
- [ ] Sensitive fields encrypted at rest (if applicable)
- [ ] SSL/TLS enforced for all connections
- [ ] Database credentials in environment variables, not code
- [ ] API keys not exposed in client-side code
- [ ] CORS properly configured

### 5. Internationalization (i18n)

#### Strings
- [ ] All UI strings in locale files (no hardcoded strings)
- [ ] Spanish (es-AR) translations complete
- [ ] Locale files use clear, hierarchical keys
- [ ] Pluralization handled correctly
- [ ] String interpolation works (e.g., "Hello, {name}")

#### Formatting
- [ ] Dates formatted with user's locale
- [ ] Numbers formatted with user's locale
- [ ] Currency formatted correctly
- [ ] Time zones handled (if applicable)

#### AI Responses
- [ ] AI prompts include target language
- [ ] AI responses tested in Spanish
- [ ] AI responses maintain terminology consistency

### 6. Accessibility (a11y)

#### Keyboard Navigation
- [ ] All interactive elements keyboard accessible
- [ ] Tab order logical and intuitive
- [ ] Focus indicators visible (outline or custom style)
- [ ] No keyboard traps
- [ ] Skip links for repetitive navigation

#### Screen Readers
- [ ] ARIA labels on all interactive elements
- [ ] Form fields have associated labels
- [ ] Error messages announced
- [ ] Dynamic content changes announced
- [ ] Landmark roles used (nav, main, aside, etc.)

#### Visual
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Text resizable to 200% without breaking layout
- [ ] No information conveyed by color alone
- [ ] Sufficient spacing between clickable elements

#### Testing
- [ ] Tested with keyboard only (no mouse)
- [ ] Tested with screen reader (VoiceOver or NVDA)
- [ ] aXe DevTools run with no violations
- [ ] Lighthouse accessibility score >90

### 7. Performance

#### Backend
- [ ] Database queries optimized (no N+1 queries)
- [ ] Proper indexes on frequently queried fields
- [ ] Pagination for large result sets
- [ ] Caching for expensive operations
- [ ] API response time <500ms for 95th percentile

#### Frontend
- [ ] Images optimized and served in WebP/AVIF
- [ ] Code split to reduce initial bundle size
- [ ] Lazy loading for below-the-fold content
- [ ] Debouncing/throttling for expensive operations
- [ ] Lighthouse performance score >80

#### AI
- [ ] LLM calls are async with loading states
- [ ] Streaming used for long responses (if applicable)
- [ ] Timeouts set to prevent hanging requests
- [ ] Fallback behavior for model unavailability

### 8. Documentation

#### Code Documentation
- [ ] JSDoc comments on public APIs
- [ ] Complex logic explained with inline comments
- [ ] README in feature directory (if complex)

#### API Documentation
- [ ] Swagger/OpenAPI specs updated
- [ ] Request/response examples provided
- [ ] Error responses documented
- [ ] Authentication requirements stated

#### User Documentation
- [ ] User guide updated (if user-facing feature)
- [ ] Screenshots or videos (if complex UI)
- [ ] FAQ updated with common questions

#### Developer Documentation
- [ ] Architecture diagrams updated
- [ ] Database schema diagram updated
- [ ] Deployment runbook updated
- [ ] Troubleshooting guide updated

### 9. Deployment Readiness

#### Configuration
- [ ] Environment variables documented in .env.example
- [ ] Feature flags configured (if applicable)
- [ ] Database migrations tested (up and down)
- [ ] Seed data scripts updated (if needed)

#### CI/CD
- [ ] All CI tests passing (unit, integration, E2E)
- [ ] Linting passing (ESLint, Prettier)
- [ ] Type checking passing (tsc --noEmit)
- [ ] Build succeeds for production

#### Monitoring
- [ ] Key metrics added to dashboard
- [ ] Alerts configured for critical errors
- [ ] Logging level appropriate (not too verbose)
- [ ] APM tracing added for new endpoints

#### Rollback Plan
- [ ] Database migration rollback tested
- [ ] Feature flag can disable feature
- [ ] Rollback procedure documented
- [ ] Stakeholders notified of deployment

### 10. User Acceptance

#### Stakeholder Review
- [ ] Demo conducted with product owner
- [ ] Feedback incorporated
- [ ] User stories accepted

#### Pilot Testing
- [ ] Feature tested by internal users
- [ ] Feature tested by beta users (if applicable)
- [ ] Critical bugs fixed before full rollout

## Output Format

Generate a checklist in markdown with clear sections. For each item:
- Use `[ ]` for unchecked
- Use `[x]` for checked
- Add `⚠️` for critical blockers
- Add `📝` for items needing more information

Include a summary section at the top:
```markdown
## Summary
- **Total Items:** [count]
- **Completed:** [count] ([percentage]%)
- **Critical Blockers:** [count]
- **Status:** [Ready | Needs Work | Blocked]
```

Be thorough but practical. Focus on items that matter for quality and safety.
