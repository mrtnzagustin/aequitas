# Create New Feature with Speckit

Start a new feature following the complete Speckit workflow.

## Instructions

1. **Ask the user for feature details**:
   - Feature number (e.g., 048)
   - Feature name (kebab-case, e.g., "ai-learning-companion")
   - Brief description

2. **Create the spec directory**:
   ```bash
   mkdir -p specs/[number]-[name]
   ```

3. **Create spec.md** with the following template:

```markdown
# [Number]: [Feature Name]

**Status:** Draft
**Epic:** [Epic Name]
**Priority:** P0/P1/P2/P3
**Assigned To:** TBD
**Target Release:** v[X.Y]

## 1. Overview
[What is this feature and why is it important?]

## 2. Problem Statement

**Current State:**
[Describe the problem]

**Desired State:**
[Describe the solution]

**Impact if Not Addressed:**
[Why this matters]

## 3. User Personas
[Who will use this feature and how?]

## 4. Functional Requirements

### 4.1 Core Behaviors
[Gherkin scenarios for main functionality]

### 4.2 User Interface
[UI mockups and descriptions]

### 4.3 Data Model
[Entities, relationships, schemas]

### 4.4 Business Logic
[Rules, validations, workflows]

## 5. Non-Functional Requirements

### 5.1 Security & Privacy
[RBAC, audit logging, data protection]

### 5.2 Performance
[Response times, scalability targets]

### 5.3 Internationalization
[i18n requirements, supported locales]

### 5.4 Accessibility
[WCAG compliance, keyboard navigation]

## 6. API Specifications
[Endpoint definitions with examples]

## 7. Edge Cases & Error Handling
[Known edge cases and how to handle them]

## 8. Testing Strategy
[Unit, integration, E2E test plans]

## 9. Success Metrics
[How we measure success]

## 10. Dependencies
[Required infrastructure, libraries, features]

## 11. Open Questions
[Decisions pending]

## 12. Future Enhancements
[Phase 2, Phase 3 ideas]

---

**Specification Last Updated:** [Date]
**Next Review:** [Date + 30 days]
```

4. **Guide the user** through filling out the spec.md

5. **Once spec.md is complete**:
   - Offer to run `/speckit-plan` to generate plan.md
   - After plan.md is created, offer to run `/speckit-tasks` to generate tasks.md

6. **Validate** that all three files exist before declaring the feature ready for implementation

## Speckit Workflow Reminder
✅ spec.md → ✅ plan.md → ✅ tasks.md → ✅ Implementation

This is the mandatory workflow per the constitution.
