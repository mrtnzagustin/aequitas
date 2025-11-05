# Create or Update Project Constitution

You are an AI assistant helping to create or update the project constitution for the Aequitas platform.

## Context
The constitution is the foundational document that governs all development decisions. It serves as:
- **North Star:** Guiding principles when making trade-offs
- **Contract:** Agreement between stakeholders on what matters
- **Living Document:** Evolves as the project matures

## Your Task
Create or update the `.specify/constitution.md` file based on project discussions, user requirements, and emerging needs.

## Constitution Structure

### 1. Project Identity
```markdown
## Project Identity

**Name:** [Project Name]
**Version:** [Current Version]
**Mission:** [One sentence mission statement]
**Vision:** [What the world looks like when you succeed]
```

Define the "why" behind the project. This should inspire and align the team.

### 2. Core Principles
List 5-10 fundamental principles that guide all decisions:

```markdown
### 1. [Principle Name]
[2-3 sentence description]

**Non-negotiables:**
- [Specific rule or requirement]
- [Another rule]

**Example:**
[Concrete example of this principle in action]
```

**Example Principles:**
- User Privacy & Security
- Accessibility First
- AI Ethics & Transparency
- Performance & Reliability
- Simplicity over Complexity

### 3. Technical Stack Principles
Define the "how" - the technical foundation:

```markdown
### Backend Architecture
- **Framework:** [Choice] for [reasons]
- **Database:** [Choice] for [reasons]
- **Design Pattern:** [Pattern] to achieve [goal]

### Frontend Architecture
- **Framework:** [Choice] for [reasons]
- **State Management:** [Approach] for [reasons]
- **Styling:** [Approach] for [reasons]

### Code Quality Standards
- **Language:** [Language + Version]
- **Testing:** [Testing strategy and coverage targets]
- **Linting:** [Tools and rules]
- **Documentation:** [Approach to documenting code]
```

### 4. Feature Priority Framework
Define how to decide what to build:

```markdown
### MVP (Phase 1)
Features that are absolutely necessary:
1. [Feature] - [Why it's critical]
2. [Feature] - [Why it's critical]

### Post-MVP (Phase 2)
Features that enhance but aren't critical:
1. [Feature] - [Why it's valuable but can wait]
2. [Feature] - [Why it's valuable but can wait]

### Future Vision (Phase 3+)
Aspirational features for long-term:
1. [Feature] - [Why it's exciting but distant]
```

### 5. Success Metrics
Define what success looks like:

```markdown
### User Adoption
- [Metric]: [Target]
- [Metric]: [Target]

### System Performance
- [Metric]: [SLA]
- [Metric]: [SLA]

### Business Impact
- [Metric]: [Goal]
- [Metric]: [Goal]
```

### 6. Data Model Principles
Define the core data entities and relationships:

```markdown
### Core Entities
- **[Entity]:** [Description and purpose]
- **[Entity]:** [Description and purpose]

### Relationships
- [Entity] → [Entity]: [Relationship type and rationale]
- [Entity] → [Entity]: [Relationship type and rationale]

### Data Integrity Rules
- [Rule]: [Reason]
- [Rule]: [Reason]
```

### 7. Security & Compliance
Define non-negotiable security requirements:

```markdown
### Authentication
- [Requirement]
- [Requirement]

### Authorization
- [RBAC model]
- [Permission hierarchy]

### Data Protection
- [Encryption requirements]
- [Privacy requirements]
- [Compliance requirements]

### Audit & Logging
- [What to log]
- [Retention policy]
- [Access controls]
```

### 8. Operational Excellence
Define how the system should run:

```markdown
### Environments
- **Development:** [Setup]
- **Staging:** [Setup]
- **Production:** [Setup]

### Monitoring & Observability
- **Logs:** [Strategy]
- **Metrics:** [Strategy]
- **Tracing:** [Strategy]
- **Alerts:** [Strategy]

### Backup & Disaster Recovery
- [Backup strategy]
- [Recovery time objective (RTO)]
- [Recovery point objective (RPO)]
```

### 9. Ethical Considerations
For AI-driven systems, define ethical guardrails:

```markdown
### Bias & Fairness
- [Mitigation strategy]
- [Testing approach]

### Transparency
- [How users know they're interacting with AI]
- [How decisions are explained]

### Consent & Autonomy
- [User control over data]
- [Opt-in/opt-out policies]

### No-Go Zone
- [Things we will never do]
- [Lines we will not cross]
```

### 10. Amendment Process
Define how the constitution can evolve:

```markdown
## Amendment Process

This constitution is a living document. Amendments require:
1. [Stakeholder or role] proposes change
2. [Review process]
3. [Approval threshold]
4. [Documentation and communication]

**Review Cadence:** [How often to review]
```

## Output Format
Write a complete constitution in clean markdown following the structure above. Be specific but concise. Use examples to illustrate principles.

The constitution should be:
- **Aspirational:** Sets a high bar
- **Practical:** Provides actionable guidance
- **Stable:** Changes infrequently but can evolve
- **Aligned:** Everyone on the team understands and agrees

**Length:** Aim for 2000-4000 words - comprehensive but readable in one sitting.

Include a footer:
```markdown
---
**Established:** [Date]
**Last Updated:** [Date]
**Next Review:** [Date]
```
