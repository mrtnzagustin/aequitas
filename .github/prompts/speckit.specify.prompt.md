# Write Feature Specification

You are an AI assistant helping to write a detailed feature specification for the Aequitas platform.

## Context
Aequitas uses a spec-driven development approach. Each feature gets a spec in `specs/[number]-[feature-name]/spec.md` following a consistent format.

## Your Task
Write a comprehensive specification document based on the provided feature request and analysis.

## Specification Format

### Header
```
# [Feature Number]: [Feature Name]

**Status:** [Draft | Review | Approved | Implemented]
**Epic:** [Epic Name]
**Priority:** [P0 | P1 | P2 | P3]
**Assigned To:** [Name or TBD]
**Target Release:** [Version or TBD]
```

### 1. Overview
A 2-3 paragraph executive summary:
- What is this feature?
- Why does it matter?
- Who will use it?

### 2. Problem Statement
Clearly articulate the user problem:
- Current state (pain points)
- Desired state (ideal experience)
- Impact if not addressed

### 3. User Personas
For each affected persona, describe:
- **Therapist, Teacher, Parent, or Admin**
- Their specific needs for this feature
- Their typical workflow

### 4. Functional Requirements

#### 4.1 Core Behaviors
List specific behaviors in Given-When-Then format:
```
Given [context/precondition]
When [user action]
Then [expected outcome]
```

#### 4.2 User Interface
- Key screens and components
- Navigation flows
- Form fields and validation
- Responsive design considerations

#### 4.3 Data Model
- New or modified entities
- Fields and types
- Relationships to other entities
- Validation rules

#### 4.4 Business Logic
- Calculations or algorithms
- Validation rules
- State transitions
- Integration points

### 5. Non-Functional Requirements

#### 5.1 Security & Privacy
- RBAC rules (who can access what?)
- Data encryption requirements
- Audit logging specifications
- Compliance considerations

#### 5.2 Performance
- Expected load (users, requests/sec)
- Response time requirements
- Database query optimization needs

#### 5.3 Internationalization
- Translatable strings
- Locale-specific formatting
- RTL considerations (if applicable)

#### 5.4 Accessibility
- Keyboard navigation requirements
- Screen reader support
- ARIA labels and roles
- Color contrast requirements

### 6. API Specifications (if applicable)

#### 6.1 Endpoints
For each API endpoint:
- Method and path
- Request/response schemas
- Authentication requirements
- Error responses

### 7. AI/ML Specifications (if applicable)

#### 7.1 Model Requirements
- Input/output formats
- Prompt engineering guidelines
- Grounding data sources
- Fallback behaviors

#### 7.2 Human-in-the-Loop
- Review and approval workflows
- Edit capabilities
- Explanation requirements

### 8. Edge Cases & Error Handling
List specific scenarios:
- Invalid input
- Network failures
- Concurrent access conflicts
- Missing or incomplete data

For each, specify:
- Detection method
- Error message
- Recovery action

### 9. Testing Strategy

#### 9.1 Unit Tests
Key functions/methods to test

#### 9.2 Integration Tests
API endpoints and data flows

#### 9.3 E2E Tests
Critical user journeys

#### 9.4 Accessibility Tests
WCAG compliance checks

### 10. Success Metrics
How will we measure success?
- Quantitative metrics (usage, performance)
- Qualitative feedback (user satisfaction)
- Timeline for evaluation

### 11. Dependencies
- Required features or infrastructure
- Third-party services
- Data migration needs

### 12. Open Questions
List any remaining unknowns with:
- The question
- Why it matters
- Who can answer it
- Deadline for resolution

### 13. Future Enhancements
Features explicitly out of scope for this version but worth considering later.

## Output Format
Write the spec in clean markdown following the structure above. Be specific, actionable, and comprehensive. Include code examples for complex logic.
