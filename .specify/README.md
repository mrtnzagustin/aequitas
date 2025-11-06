# Speckit Workflow Guide

This directory contains the Speckit configuration and guidelines for the Aequitas project. Speckit ensures that all features are properly planned, documented, and implemented following a consistent workflow.

## 📋 What is Speckit?

Speckit is a workflow framework that enforces:
1. **Comprehensive specifications** before implementation
2. **Implementation planning** with clear phases and timelines
3. **Task breakdown** with time estimates and dependencies
4. **Mandatory testing** at every stage
5. **Documentation synchronization** with code changes

## 🏗️ The Speckit Workflow

```
📝 spec.md → 📐 plan.md → ✅ tasks.md → 💻 Implementation → 🧪 Testing → 📚 Documentation
```

### Step 1: Create Specification (spec.md)
Define the feature requirements, user stories, acceptance criteria, and technical specifications.

**Use**: `/speckit-new` command in Claude Code, or manually create in `specs/[number]-[name]/spec.md`

### Step 2: Generate Implementation Plan (plan.md)
Create a strategic implementation plan with phases, dependencies, risks, and timeline.

**Use**: `/speckit-plan` command in Claude Code

### Step 3: Generate Task Breakdown (tasks.md)
Break down the plan into granular, trackable tasks with time estimates.

**Use**: `/speckit-tasks` command in Claude Code

### Step 4: Implement
Follow the tasks in order, implementing one phase at a time.

### Step 5: Test & Document
- Write unit tests (>90% coverage)
- Write integration tests
- Run regression tests
- Update documentation
- Verify `npm run build` succeeds
- Verify `docker-compose up` works

## 🛠️ Available Commands

### Claude Code Slash Commands

```bash
/speckit-new         # Start a new feature with guided spec creation
/speckit-plan        # Generate implementation plan from spec.md
/speckit-tasks       # Generate task breakdown from plan.md
/speckit-validate    # Validate all specs have required files
```

### Scripts

```bash
# Validate Speckit structure
bash scripts/check-speckit.sh

# This runs automatically on:
# - git commit (pre-commit hook)
# - GitHub Actions (CI/CD)
```

## 📁 Directory Structure

```
specs/
├── 001-user-role-management/
│   ├── spec.md      # ✅ Required: Feature specification
│   ├── plan.md      # ✅ Required: Implementation plan
│   └── tasks.md     # ✅ Required: Task breakdown
├── 002-holistic-student-profile/
│   ├── spec.md
│   ├── plan.md
│   └── tasks.md
└── ...

.specify/
├── memory/
│   └── constitution.md        # ✅ Project principles and rules
├── AI_AGENT_INSTRUCTIONS.md   # 🤖 Mandatory AI agent workflow guide
└── README.md                  # 📖 This file
```

## 🚫 Enforcement Mechanisms

Speckit compliance is **automatically enforced** through:

### 1. Git Pre-Commit Hook
Blocks commits if:
- Specs are missing `plan.md` or `tasks.md`
- Implementation files are committed without corresponding spec files

**Location**: `.git/hooks/pre-commit`

**Bypass** (not recommended): `git commit --no-verify`

### 2. GitHub Actions
Validates Speckit structure on every PR and push to main/develop.

**Workflow**: `.github/workflows/speckit-validation.yml`

### 3. Validation Script
Can be run manually or by CI/CD.

**Command**: `bash scripts/check-speckit.sh`

## 📖 Constitution

The `memory/constitution.md` file defines:
- **Project principles** (Student-centric design, Privacy first, etc.)
- **Technical stack** (NestJS, Next.js, PostgreSQL, Redis, etc.)
- **Code quality standards** (TypeScript strict mode, testing requirements)
- **Mandatory testing requirements** (Unit, Integration, Regression)
- **Documentation synchronization** (README, API docs, specs)
- **Speckit workflow compliance** (The workflow you must follow)

**Read it**: [memory/constitution.md](./memory/constitution.md)

## 🤖 AI Agent Instructions

The `AI_AGENT_INSTRUCTIONS.md` file provides mandatory workflow instructions for all AI agents working on this project. It includes:
- Pre-implementation requirements (read constitution first)
- Speckit workflow verification steps
- Testing and code quality standards
- Pre-commit hook compliance
- Prohibited actions and best practices

**Read it**: [AI_AGENT_INSTRUCTIONS.md](./AI_AGENT_INSTRUCTIONS.md)

## 🎯 Success Criteria Checklist

Before marking a feature as complete:

- [ ] `spec.md` exists with complete requirements
- [ ] `plan.md` exists with implementation strategy
- [ ] `tasks.md` exists with detailed task breakdown
- [ ] All tasks are checked off (✅)
- [ ] Unit tests written (>90% coverage)
- [ ] Integration tests written
- [ ] E2E tests written for critical flows
- [ ] Regression tests pass
- [ ] `npm run build` succeeds (backend + frontend)
- [ ] `docker-compose up` succeeds
- [ ] API documentation updated
- [ ] README updated (if needed)
- [ ] i18n files updated (if UI changes)
- [ ] Code reviewed and approved
- [ ] Deployed to staging and tested

## 🚀 Quick Start for New Features

1. **Create a new feature**:
   ```bash
   # Using Claude Code
   /speckit-new

   # Or manually
   mkdir specs/048-new-feature
   ```

2. **Write the specification**:
   - Define the problem, solution, and requirements in `spec.md`
   - Include user stories, acceptance criteria, and technical specs

3. **Generate the plan**:
   ```bash
   # Using Claude Code (from the spec directory)
   /speckit-plan
   ```

4. **Generate tasks**:
   ```bash
   # Using Claude Code (from the spec directory)
   /speckit-tasks
   ```

5. **Validate**:
   ```bash
   bash scripts/check-speckit.sh
   ```

6. **Start implementation**:
   - Follow the tasks in `tasks.md` in order
   - Check off tasks as you complete them
   - Commit frequently with descriptive messages

## ⚠️ Common Mistakes

### ❌ Starting implementation without plan/tasks
**Why it fails**: Pre-commit hook will block your commits

**Fix**: Generate `plan.md` and `tasks.md` before coding

### ❌ Skipping tests
**Why it fails**: Constitution requires >90% test coverage

**Fix**: Write tests alongside implementation

### ❌ Not updating documentation
**Why it fails**: Constitution requires doc synchronization

**Fix**: Update README, API docs, and specs as you code

### ❌ Trying to bypass the workflow
**Why it fails**: Git hooks and CI/CD will catch it

**Fix**: Follow the workflow - it saves time in the long run

## 💡 Tips for Success

1. **Start with a clear spec**: A well-written spec makes planning and implementation much easier
2. **Be realistic with estimates**: It's better to overestimate than underestimate
3. **Test as you go**: Don't leave testing for the end
4. **Document while you code**: Documentation is easier when the code is fresh in your mind
5. **One feature at a time**: Complete the full Speckit cycle before moving to the next feature
6. **Use the slash commands**: They automate the boring parts

## 🤝 Getting Help

- **Read the constitution**: [memory/constitution.md](./memory/constitution.md)
- **Read AI agent instructions**: [AI_AGENT_INSTRUCTIONS.md](./AI_AGENT_INSTRUCTIONS.md)
- **Check existing specs**: See `specs/001-006/` for detailed MVP examples
- **Run validation**: `bash scripts/check-speckit.sh`
- **Ask Claude Code**: The AI assistant knows the Speckit workflow

## 📊 Project Status

Total features: **47**
- MVP features (001-006): ✅ Detailed plans
- Post-MVP features (007-047): ✅ Standard plans
- All specs have: ✅ spec.md, ✅ plan.md, ✅ tasks.md

## 🔄 Continuous Improvement

This workflow is a living document. If you find ways to improve it:
1. Discuss with the team
2. Update the constitution
3. Update this README
4. Update the scripts/hooks/workflows as needed

---

**Last Updated**: 2025-11-05
**Version**: 1.0
