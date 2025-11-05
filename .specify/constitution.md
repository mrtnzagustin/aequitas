# Aequitas Platform Constitution

## Project Identity

**Name:** Aequitas - AI-Powered Therapeutic & Academic Support Platform
**Version:** 1.0 (MVP)
**Mission:** Democratize access to quality educational adaptations for students with specific learning conditions by leveraging AI to assist psycho-pedagogues, teachers, parents, and schools.

## Core Principles

### 1. Student-Centric Design
Every feature, every line of code, every decision must be evaluated through the lens of: "Does this help the student succeed?"

The platform exists to serve students with specific conditions (dyslexia, ADHD, disabilities) by empowering their support network with better tools.

### 2. Privacy & Security First
Student data is sacred. We handle Personal Health Information (PHI) and academic records that can profoundly impact a child's future.

**Non-negotiables:**
- Role-Based Access Control (RBAC) must be enforced at every layer
- All data encrypted at rest and in transit
- Immutable audit trails for all data modifications
- "Need-to-know" access model strictly enforced
- Compliance with local data privacy laws (Argentina's Personal Data Protection Act)

### 3. Human-in-the-Loop AI
AI is a powerful tool, but it must never replace human judgment in therapeutic and educational contexts.

**AI Guidelines:**
- AI generates suggestions and adaptations, humans review and approve
- Every AI-generated output must be reviewable and editable
- AI decisions must be explainable and grounded in the student's profile
- RAG queries must respect user permissions and RBAC

### 4. Internationalization from Day One
The platform must be usable globally, but we start with Argentina.

**i18n Requirements:**
- All UI strings in locale files (i18n/es.json, i18n/en.json)
- Spanish (es-AR) is the default and first supported language
- UTF-8 encoding everywhere
- AI responses must be in the user's selected language
- Date, time, and number formatting must respect locale

### 5. Accessibility & Inclusion
If we're building a platform for inclusive education, the platform itself must be inclusive.

**Accessibility Standards:**
- WCAG 2.1 AA compliance minimum
- Keyboard navigation for all features
- Screen reader compatibility
- Speech-to-text for hands-free data entry
- Clear, simple language in all UI text

### 6. Iterative Development, Clear Documentation
We build features incrementally, with clear specifications before implementation.

**Development Process:**
- Each feature has a numbered spec in `specs/[number]-[feature-name]/spec.md`
- Specs define Problem, Solution, Behaviors, and Success Metrics
- Code without specs is technical debt
- Tests are written alongside features, not after
- Documentation is code

## Technical Stack Principles

### Backend Architecture
- **Framework:** NestJS for structure, modularity, and TypeScript support
- **AI Integration:** LangChain for LLM orchestration, LangGraph for stateful AI workflows
- **Database:** PostgreSQL for relational data, robust ACID compliance
- **API Design:** RESTful with clear versioning, GraphQL considered for complex queries

### Frontend Architecture
- **Framework:** Next.js for SSR, SEO, and performance
- **UI Library:** Shadcn UI for consistent, accessible components
- **State Management:** React Context or Zustand for simplicity
- **i18n:** next-i18next or similar for seamless language switching

### Code Quality Standards
- **TypeScript:** Strict mode enabled, no `any` types without justification
- **Testing:** Unit tests (Jest), integration tests (Supertest), E2E tests (Playwright)
- **Code Reviews:** All changes require review, no direct commits to main
- **Linting:** ESLint + Prettier for consistent formatting
- **Commit Messages:** Conventional Commits format (feat, fix, docs, etc.)

## Feature Priority Framework

### MVP (Phase 1)
Features that are absolutely necessary for the platform to be useful:
1. User & Role Management
2. Holistic Student Profile
3. AI-Powered Task Adaptation
4. Adaptation Review & Confirmation
5. RAG-based Student History Chat
6. Speech-to-Text Data Entry

### Post-MVP (Phase 2)
Features that enhance the platform but aren't critical for initial launch:
1. Proactive Intervention Suggestions
2. Collaborative Goal Setting
3. Advanced Analytics & Reporting
4. Mobile Applications

## Success Metrics

### User Adoption
- 90% of therapists onboard within first month of school deployment
- Average of 5 task adaptations per student per month
- 70% of teachers using the platform weekly

### System Performance
- API response time < 500ms for 95th percentile
- AI adaptation generation < 10 seconds
- RAG query response < 3 seconds
- 99.5% uptime SLA

### Educational Impact
- 80% of adaptations approved on first generation (low revision rate)
- Teachers report 30% time savings on adaptation tasks
- Parents report improved understanding of student progress

## Data Model Principles

### Core Entities
- **User:** Persona-based (Therapist, Teacher, Parent, Admin)
- **Student:** Central entity with profile, history, and relationships
- **Note:** Polymorphic (Therapeutic, Academic, Family) with RBAC
- **TaskAdaptation:** Original task + AI-generated adaptation + confirmation status
- **HistoryEntry:** Chronological record of all student interactions

### Relationships
- Users → Students (many-to-many with role-specific access)
- Students → Notes (one-to-many with type discrimination)
- Students → TaskAdaptations (one-to-many)
- Students → HistoryEntries (one-to-many, append-only)

## Deployment & Operations

### Environments
- **Development:** Local Docker Compose setup
- **Staging:** Kubernetes cluster with production-like configuration
- **Production:** Kubernetes with auto-scaling, monitoring, and backups

### Monitoring & Observability
- Application logs: Structured JSON with correlation IDs
- Metrics: Prometheus + Grafana
- Tracing: OpenTelemetry for distributed tracing
- Alerts: PagerDuty for critical issues

### Backup & Disaster Recovery
- Database backups: Daily full, hourly incremental
- Point-in-time recovery capability (30 days)
- Cross-region replication for production
- Disaster recovery plan tested quarterly

## Ethical Considerations

### Bias & Fairness
- AI models must be regularly audited for bias
- Adaptation suggestions should not reinforce stereotypes
- Diverse dataset representation in training data
- User feedback loop to report problematic AI outputs

### Transparency
- Users must know when they're interacting with AI
- Clear explanation of how AI generates adaptations
- Visible audit trail of all AI decisions
- Privacy policy in plain language

### Consent & Autonomy
- Parents must consent to student data collection
- Students (when age-appropriate) should understand how their data is used
- Users can request data export or deletion (GDPR/local law compliance)
- No data monetization or third-party sharing

## Amendment Process

This constitution is a living document. Amendments require:
1. Documented rationale for the change
2. Review by technical lead and product owner
3. Consensus from core team
4. Updated documentation and communication to stakeholders

---

**Established:** 2025-11-05
**Last Updated:** 2025-11-05
**Next Review:** 2026-02-05
