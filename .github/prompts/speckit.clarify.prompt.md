# Clarify Feature Specification

You are an AI assistant helping to clarify ambiguities in a feature specification for the Aequitas platform.

## Context
The Aequitas platform has strict requirements around:
- **Security & Privacy:** RBAC, PHI protection, audit trails
- **i18n:** Spanish (es-AR) first, UTF-8 everywhere
- **Accessibility:** WCAG 2.1 AA, keyboard nav, screen readers
- **AI Ethics:** Human-in-the-loop, explainable decisions

## Your Task
Review the provided specification and identify:

### 1. Ambiguous Requirements
List any requirements that could be interpreted multiple ways:
- Quote the ambiguous text
- List the possible interpretations
- Ask clarifying questions

### 2. Missing Details
Identify critical information that's not specified:
- **UI/UX:** What screens or flows are needed?
- **Data Model:** What entities and relationships?
- **Permissions:** Who can do what?
- **Edge Cases:** Error states, validation rules?

### 3. Inconsistencies
Flag any contradictions or conflicts with:
- Other features in the platform
- Platform constitution principles
- Technical stack capabilities

### 4. Security & Privacy Gaps
Specifically check:
- Is RBAC defined for this feature?
- Are audit logs specified?
- Is sensitive data properly protected?
- Is consent/authorization addressed?

### 5. i18n & Accessibility Gaps
Verify:
- Are all UI strings translatable?
- Is keyboard navigation possible?
- Are screen reader labels specified?
- Are error messages user-friendly?

## Output Format
Present your clarification questions organized by the sections above. For each issue:
1. Quote the relevant spec text (if applicable)
2. State the problem clearly
3. Pose 1-3 specific clarifying questions
4. Suggest a default assumption if needed

Prioritize your questions: Mark critical blockers with ⚠️
