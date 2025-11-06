# Generate Implementation Plan (Speckit)

You are tasked with generating a comprehensive implementation plan for a feature specification.

## Context
Read the spec.md file in the current spec directory. Based on the specification, create a detailed plan.md file following the Speckit format.

## Instructions

1. **Read the spec.md** file to understand:
   - Feature requirements
   - Technical constraints
   - Dependencies
   - Success criteria

2. **Generate plan.md** with the following structure:

```markdown
# Implementation Plan: [Feature Name]

## Feature Summary
[Brief 2-3 sentence summary of what this feature does]

## Technical Approach

### Architecture
- **Backend**: [Technologies and frameworks]
- **Database**: [Data storage approach]
- **Frontend**: [UI framework and libraries]
- **External Services**: [Any third-party integrations]

### Key Components
1. [Component 1] - [Purpose]
2. [Component 2] - [Purpose]
3. [Component 3] - [Purpose]

## Implementation Phases

### Phase 1: [Phase Name] (Days X-Y)
- [Major task 1]
- [Major task 2]
- [Major task 3]

### Phase 2: [Phase Name] (Days X-Y)
- [Major task 1]
- [Major task 2]

[... continue for all phases ...]

## Dependencies

### External Dependencies
- [Library/package 1] - [Purpose]
- [Library/package 2] - [Purpose]

### Internal Dependencies
- [Feature/spec that must be completed first]

### Feature Dependencies
- Spec XXX: [Feature name]

## Risks & Mitigations

### Risk 1: [Risk description]
- **Mitigation**: [How to address this risk]

### Risk 2: [Risk description]
- **Mitigation**: [How to address this risk]

## Success Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

## Estimated Timeline
**Total: X days (Y weeks)**

## Notes
[Any additional considerations or observations]
```

3. **Ensure the plan**:
   - Aligns with the constitution.md principles
   - Uses the project's tech stack (NestJS, Next.js, PostgreSQL, Redis)
   - Includes mandatory testing requirements
   - Considers RBAC and security
   - Plans for documentation updates

4. **Write the plan.md file** in the spec directory

5. **Confirm completion** by showing:
   - Location of the created file
   - Summary of phases and timeline
   - Key risks identified

## Important
- Be realistic with time estimates
- Consider dependencies carefully
- Always include testing and documentation phases
- Reference the constitution for mandatory requirements
