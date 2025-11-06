# AI Agent Instructions for Aequitas Platform Development

## Purpose

This document defines **mandatory instructions** for all AI agents (including Claude Code, GitHub Copilot, Cursor, and any other AI assistants) working on the Aequitas platform. Following these instructions ensures code quality, consistency, and compliance with the project's Speckit workflow.

---

## Critical Pre-Implementation Requirements

### Step 1: Read the Constitution FIRST

**Before any implementation work**, you MUST read:

```bash
.specify/memory/constitution.md
```

This is the **source of truth** for:
- Project principles (Student-centric design, Privacy first, Human-in-the-loop AI)
- Technical stack (NestJS, Next.js, PostgreSQL, Redis, LangChain)
- Code quality standards (TypeScript strict mode, testing requirements)
- Mandatory testing requirements (Unit, Integration, Regression)
- Documentation synchronization rules

**If you haven't read the constitution, STOP and read it now.**

---

## Step 2: Understand the Speckit Workflow

Read the Speckit workflow guide:

```bash
.specify/README.md
```

This explains:
- The spec → plan → tasks → implementation → testing cycle
- How to use `/speckit-new`, `/speckit-plan`, `/speckit-tasks` commands
- Enforcement mechanisms (pre-commit hooks, GitHub Actions)
- Success criteria checklist

---

## Step 3: Verify Feature Documentation Exists

### For Feature Branches

If the current branch follows the pattern `NNN-feature-name` (e.g., `001-user-auth`, `012-task-adaptation`):

1. **Extract the feature number** (e.g., `001`, `012`)
2. **Locate the spec folder**: `specs/NNN-*/`
3. **Verify these files exist**:
   - `specs/NNN-*/spec.md` - Feature requirements and acceptance criteria
   - `specs/NNN-*/plan.md` - Implementation strategy and phases
   - `specs/NNN-*/tasks.md` - Detailed task breakdown with estimates

### If ANY of These Files Are Missing:

**STOP IMMEDIATELY. Do NOT write or modify any code.**

**Actions to take:**
1. Inform the user that Speckit artifacts are missing
2. Propose to create the missing artifacts:
   - Use `/speckit-new` to create a new spec with `spec.md`
   - Use `/speckit-plan` to generate `plan.md` from the spec
   - Use `/speckit-tasks` to generate `tasks.md` from the plan
3. **Only proceed with code changes AFTER all artifacts exist**

### For Non-Feature Branches

If the branch does NOT start with a numeric feature ID (e.g., `hotfix/fix-auth`, `chore/update-deps`):
- You may proceed with implementation
- Inform the user that Speckit validation is skipped for non-feature branches

---

## Step 4: Respect Spec Boundaries

**The Golden Rule:**

> **No code without a spec. No commit without tests. No shortcuts.**

### What This Means:

- **NEVER** modify `backend/src/` or `frontend/src/` in ways not explicitly covered by the current `spec.md`, `plan.md`, and `tasks.md`
- If you need to implement functionality not in the spec, **stop and ask the user** to update the spec first
- The spec is the source of truth - code must match the spec, not the other way around
- If implementation deviates from spec, update the spec and note why

---

## Mandatory Testing Requirements

### Every Feature Implementation MUST Include:

1. **Unit Tests:**
   - Test all business logic, services, and utilities
   - Use Jest for backend (`npm test`)
   - Use Jest + React Testing Library for frontend (`npm run test`)
   - Aim for >90% code coverage
   - Mock external dependencies appropriately

2. **Integration Tests:**
   - Test API endpoints with Supertest
   - Test database interactions
   - Verify service integrations

3. **Regression Tests:**
   - Run the **complete test suite** after implementing ANY feature
   - Ensure no existing functionality is broken
   - Command: `cd backend && npm test && cd ../frontend && npm run test`

4. **Build Verification:**
   - Verify `npm run build` succeeds for both backend and frontend
   - Ensure no TypeScript errors or warnings
   - Command: `cd backend && npm run build && cd ../frontend && npm run build`

5. **Docker Compose Validation:**
   - Ensure `docker-compose up` works after changes
   - Verify all services start correctly (postgres, redis, backend, frontend)
   - Check health endpoints

### If Tests Fail:

- **Fix the tests before committing**
- Do NOT suggest bypassing tests
- Do NOT suggest using `git commit --no-verify`

---

## Husky Pre-Commit Hook Compliance

### Respect the Pre-Commit Checks

The project uses Husky pre-commit hooks to enforce:
1. **Speckit validation:** All feature branches must have complete spec/plan/tasks artifacts
2. **Test execution:** All tests must pass before committing
3. **Empty commit prevention:** No commits if there are no staged changes

### You MUST:

- Always respect the pre-commit checks
- **NEVER** suggest or use `git commit --no-verify` unless explicitly requested by the user
- If the pre-commit hook fails, **fix the underlying issue** rather than bypassing the hook

### If Pre-Commit Fails:

1. **Read the error message carefully** - it will tell you what's wrong
2. **Fix the issue:**
   - If Speckit files are missing: Create them using `/speckit-plan` or `/speckit-tasks`
   - If tests are failing: Fix the failing tests before committing
   - If files are not staged: Stage the necessary files with `git add`
3. **Re-run the commit** - the hook will validate again

---

## Code Quality Standards

### TypeScript:
- **Strict mode enabled** - no `any` types without explicit justification
- Use proper typing for all functions, parameters, and return values
- Prefer interfaces over types for object shapes

### Code Style:
- Use existing ESLint and Prettier configurations
- Descriptive variable, function, and class names
- Add comments for complex logic, not obvious code
- DRY principle: Don't Repeat Yourself

### Backend (NestJS):
- Use modular architecture (modules, controllers, services)
- Dependency injection for all services
- DTOs for request/response validation
- Use TypeORM for database interactions (no raw SQL)
- JWT authentication for protected endpoints

### Frontend (Next.js):
- Functional components only (no class components)
- Use React hooks for state management
- Shadcn UI components for consistency
- Tailwind CSS for styling
- next-i18next for internationalization

---

## Internationalization (i18n)

### All User-Facing Strings MUST Be in Locale Files

- **Default language:** Spanish (es-AR)
- **Supported languages:** Spanish (es), English (en)
- Update `i18n/es.json` and `i18n/en.json` for any new UI text
- **NEVER** hardcode user-facing strings in components

### Example:

```tsx
// ❌ BAD
<button>Submit</button>

// ✅ GOOD
<button>{t('common.submit')}</button>
```

---

## Security & Privacy

### RBAC Enforcement:
- Always check user permissions before data access
- Respect role boundaries (Therapist, Teacher, Parent, Admin)
- Students can only be accessed by users with the correct permissions

### Data Sanitization:
- Use DOMPurify for user-generated content
- Validate all user inputs
- Use TypeORM parameterized queries (prevents SQL injection)

### Secrets Management:
- **NEVER** hardcode secrets or API keys
- Use environment variables (`.env` files)
- Do NOT commit `.env` files to git

---

## AI-Specific Guidelines

### When Using LangChain/LangGraph:
- **RAG queries:** Respect user permissions - only query data the user has access to
- **Prompt engineering:** Keep prompts clear, concise, and in the user's language
- **Error handling:** Always handle API failures gracefully
- **Token management:** Monitor token usage to avoid quota exhaustion
- **Human-in-the-loop:** AI generates suggestions, humans review and approve

### When Generating Specs/Plans/Tasks:
- **Be specific:** Avoid vague requirements like "improve performance"
- **Be realistic:** Time estimates should account for testing and documentation
- **Be comprehensive:** Include edge cases, error handling, and validation
- **Be consistent:** Follow the format of existing specs/plans/tasks

---

## Documentation Synchronization

### Always Update Documentation When:
- Adding new features or endpoints
- Changing environment variables or configuration
- Adding new dependencies or scripts
- Modifying the architecture or data model
- Changing the development workflow

### What to Update:
- `README.md` - Setup instructions, prerequisites, quick start
- `specs/NNN-*/spec.md` - If implementation deviates from original plan
- Inline code comments - JSDoc/TSDoc for all new functions and classes
- API documentation - Swagger annotations for new endpoints
- `i18n/*.json` - Translations for new UI strings

---

## Prohibited Actions

### You MUST NEVER:
- Bypass Husky pre-commit hooks with `--no-verify`
- Commit code without corresponding Speckit artifacts
- Skip writing tests for new features
- Hardcode secrets or API keys
- Use `any` types in TypeScript without justification
- Modify `backend/src/` or `frontend/src/` without a spec
- Push directly to `main` or `develop` branches
- Ignore ESLint or TypeScript errors
- Leave TODO comments without creating tasks
- Deploy without running tests and build verification
- Use unapproved technologies not listed in the constitution

---

## Workflow Examples

### Example 1: Implementing a New Feature

```bash
# User: "Implement feature 007-notification-system"

# Step 1: Check current branch
git branch --show-current
# Output: 007-notification-system

# Step 2: Read foundational docs
cat .specify/memory/constitution.md
cat .specify/README.md
cat README.md

# Step 3: Read spec artifacts
cat specs/007-notification-system/spec.md
cat specs/007-notification-system/plan.md
cat specs/007-notification-system/tasks.md

# Step 4: Implement according to plan and tasks
# ... write code ...

# Step 5: Write tests
# ... write unit and integration tests ...

# Step 6: Run tests
cd backend && npm test
cd ../frontend && npm run test

# Step 7: Build verification
cd backend && npm run build
cd ../frontend && npm run build

# Step 8: Update documentation
# ... update README, API docs, i18n files ...

# Step 9: Commit (pre-commit hook will validate)
git add .
git commit -m "feat(notifications): implement notification system"
```

### Example 2: Missing Speckit Artifacts

```bash
# User: "Implement feature 015-calendar-integration"

# Step 1: Check current branch
git branch --show-current
# Output: 015-calendar-integration

# Step 2: Try to read spec artifacts
cat specs/015-calendar-integration/spec.md
# Output: File not found

# Step 3: STOP - Inform user and propose solution
# "The spec folder for feature 015 is missing. I need to create
# the Speckit artifacts before proceeding. Let me create:
# 1. specs/015-calendar-integration/spec.md
# 2. Generate plan.md using /speckit-plan
# 3. Generate tasks.md using /speckit-tasks"

# Step 4: Create artifacts (don't code yet!)
# ... create spec.md, plan.md, tasks.md ...

# Step 5: NOW proceed with implementation
```

### Example 3: Pre-Commit Hook Failure

```bash
# User: "Commit my changes"

# Step 1: Stage changes
git add .

# Step 2: Try to commit
git commit -m "feat: add new feature"

# Output from pre-commit hook:
# ❌ COMMIT BLOCKED: No matching spec directory found for feature 020
# Expected: specs/020-feature-name/
# Create the folder and its spec.md/plan.md/tasks.md before committing.

# Step 3: Fix the issue - Create missing Speckit artifacts
# ... create specs/020-feature-name/ with all required files ...

# Step 4: Re-commit
git commit -m "feat: add new feature"
# Output: ✅ All Speckit checks and tests passed. Proceeding with commit.
```

---

## Helpful Commands

### Speckit Workflow:
- `/speckit-new` - Create a new feature spec
- `/speckit-plan` - Generate implementation plan from spec
- `/speckit-tasks` - Generate task breakdown from plan
- `/speckit-validate` - Validate all specs have required files

### Development:
- `npm test` - Run tests (backend or frontend)
- `npm run build` - Build the project
- `npm run lint` - Run linter
- `npm run format` - Format code with Prettier
- `bash scripts/check-speckit.sh` - Validate Speckit structure

### Git:
- `git branch --show-current` - Show current branch name
- `git status` - Show working tree status
- `git diff` - Show changes
- `git log --oneline -10` - Show recent commits

---

## When in Doubt

1. **Read the constitution:** `.specify/memory/constitution.md` has the answers
2. **Check existing specs:** Look at `specs/001-006/` for detailed examples
3. **Run validation:** `bash scripts/check-speckit.sh`
4. **Ask the user:** If something is unclear, ask before proceeding

---

## Summary

**Remember the golden rule:**

> **No code without a spec. No commit without tests. No shortcuts.**

The Speckit-first workflow exists to ensure quality, consistency, and maintainability. Following it may seem slower at first, but it prevents technical debt, reduces bugs, and makes the codebase easier to maintain in the long run.

**Thank you for respecting these guidelines and helping build a better Aequitas platform!**

---

**Established:** 2025-11-06
**Last Updated:** 2025-11-06
**Version:** 1.0
