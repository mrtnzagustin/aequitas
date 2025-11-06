# Aequitas - AI-Powered Therapeutic & Academic Support Platform

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%5E5.0.0-blue.svg)](https://www.typescriptlang.org/)

> Empowering inclusive education through AI

**Aequitas** is an AI-powered platform designed to democratize access to quality educational adaptations for students with specific learning conditions (dyslexia, ADHD, disabilities). The platform assists psycho-pedagogues, teachers, parents, and schools by facilitating the adaptation of academic tasks and maintaining holistic student profiles.

---

## 📑 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
- [Development Workflow](#-development-workflow)
- [Internationalization](#-internationalization)
- [Security](#-security)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [Roadmap](#-roadmap)
- [README Maintenance Rules](#-readme-maintenance-rules)
- [License](#-license)
- [Support](#-support)

---

## 🌟 Features

### MVP (v1.0) - Core Features ✅

- **User & Role Management** - RBAC system for Therapists, Teachers, Parents, and Admins
- **Holistic Student Profiles** - Unified view of student history, notes, and progress
- **AI-Powered Task Adaptation** - Automatic task adaptation using LangChain and LangGraph
- **Adaptation Review & Confirmation** - Human-in-the-loop refinement workflow
- **RAG-based Student History Chat** - Natural language queries on student data
- **Speech-to-Text Data Entry** - Hands-free note dictation

### v1.1 - Social-Emotional Learning & Engagement ✅

- **Emotional Wellbeing Tracking (SEL)** - Daily mood check-ins, trend analysis, early intervention alerts
- **Gamification & Progress Rewards** - Points, badges, streaks, leaderboards to boost engagement
- **Advanced Accessibility Toolbar** - Dyslexia-friendly fonts, high contrast, text-to-speech, magnifier, focus mode

### v1.2 - AI-Powered Learning Support & Collaboration 🚧

- AI-Powered Study Companion
- Multi-Sensory Content Creator
- Adaptive Learning Paths
- Smart Task Breakdown
- Parent-Teacher Communication Hub
- Time Management Coach
- Study Soundscapes
- Smart Reminder System
- Progress Visualization Dashboard
- Focus Mode & Distraction Blocker
- AI Quiz & Flashcard Generator

### v1.3+ - Advanced Features (Roadmap) 🗺️

See the [Roadmap](#-roadmap) section for detailed planning and timelines.

---

## 🏗️ Architecture

### Technology Stack

<table>
<tr>
<td valign="top" width="50%">

**Backend**
- Framework: NestJS (TypeScript)
- AI Integration: LangChain, LangGraph
- Database: PostgreSQL + pgvector
- ORM: TypeORM
- Authentication: JWT + bcrypt
- API Docs: Swagger/OpenAPI

</td>
<td valign="top" width="50%">

**Frontend**
- Framework: Next.js 14 (App Router)
- UI Library: Shadcn UI + Tailwind CSS
- State: React Context / Zustand
- i18n: next-intl
- Forms: React Hook Form + Zod

</td>
</tr>
</table>

**Infrastructure**
- Development: Docker Compose
- Production: Kubernetes (planned)
- Storage: AWS S3 (or compatible)
- Monitoring: Prometheus + Grafana (planned)

---

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (recommended) or npm
- **Docker** & Docker Compose
- **PostgreSQL** 15+ (or use Docker)

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/mrtnzagustin/aequitas.git
cd aequitas
```

### 2. Install Dependencies

```bash
# Install root dependencies (includes Husky for git hooks)
npm install

# Install backend dependencies
cd backend
pnpm install

# Install frontend dependencies
cd ../frontend
pnpm install
```

### 3. Environment Configuration

Create `.env` files in both `backend/` and `frontend/` directories:

**backend/.env**
```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=aequitas
DATABASE_PASSWORD=aequitas_dev_password
DATABASE_NAME=aequitas_dev

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=30m
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRES_IN=7d

# OpenAI (for LangChain)
OPENAI_API_KEY=your-openai-api-key

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_S3_BUCKET=aequitas-uploads
AWS_REGION=us-east-1

# App
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

**frontend/.env.local**
```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Locales
NEXT_PUBLIC_DEFAULT_LOCALE=es-AR
```

### 4. Start Development Environment

**Option A: Using Docker Compose (Recommended)**
```bash
# Start all services (PostgreSQL, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Access:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:3001
# - API Docs: http://localhost:3001/api/docs
```

**Option B: Manual Setup**
```bash
# Terminal 1: Start PostgreSQL
docker-compose up postgres

# Terminal 2: Start Backend
cd backend
pnpm run start:dev

# Terminal 3: Start Frontend
cd frontend
pnpm run dev
```

### 5. Run Database Migrations

```bash
cd backend
pnpm run migration:run
pnpm run seed  # Optional: Load sample data
```

### 6. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **API Documentation:** http://localhost:3001/api/docs

**Default Admin Credentials** (after seeding):
- Email: `admin@aequitas.local`
- Password: `Admin123!`

---

## 📁 Project Structure

```
aequitas/
├── .github/
│   └── prompts/              # Speckit AI prompts
├── .specify/
│   ├── memory/
│   │   └── constitution.md   # Project constitution
│   ├── AI_AGENT_INSTRUCTIONS.md
│   └── README.md
├── specs/                    # Feature specifications
│   ├── 001-user-role-management/
│   │   ├── spec.md
│   │   ├── plan.md
│   │   └── tasks.md
│   └── ...
├── backend/                  # NestJS Backend
│   ├── src/
│   │   ├── modules/
│   │   ├── common/
│   │   ├── config/
│   │   └── main.ts
│   └── test/
├── frontend/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── i18n/
│   └── public/
├── scripts/
│   └── check-speckit.sh      # Speckit validation script
├── .husky/                   # Git hooks
├── docker-compose.yml
├── CLAUDE.md                 # AI agent instructions
└── README.md
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

### Frontend Tests

```bash
cd frontend

# Unit tests
pnpm run test

# E2E tests (Playwright)
pnpm run test:e2e

# E2E UI mode
pnpm run test:e2e:ui
```

### Testing Requirements

Every feature implementation **MUST include**:
- ✅ **Unit tests** (>90% coverage)
- ✅ **Integration tests** (API endpoints, DB interactions)
- ✅ **Regression tests** (complete test suite)
- ✅ **Build verification** (`npm run build` succeeds)

---

## 🛠️ Development Workflow

### Spec-Driven Development with Speckit

This project follows the **Speckit methodology** with **automatic enforcement**:

```
📝 spec.md → 📐 plan.md → ✅ tasks.md → 💻 Code → 🧪 Test → 📚 Docs
```

#### Required Files for Each Feature

Every feature in `specs/[number]-[feature-name]/` **MUST have**:
- ✅ `spec.md` - Feature specification with requirements and acceptance criteria
- ✅ `plan.md` - Implementation plan with phases, timeline, and dependencies
- ✅ `tasks.md` - Detailed task breakdown with time estimates

#### Automatic Enforcement

**🔒 Husky Pre-Commit Hook** - Blocks commits if:
- Speckit files are missing for feature branches
- Tests fail
- No changes are staged

```bash
# Located at: .husky/pre-commit
# ⚠️ Never use: git commit --no-verify
# Fix the underlying issue instead!
```

**🔍 Manual Validation**
```bash
bash scripts/check-speckit.sh
```

**🤖 GitHub Actions** - Runs on every PR/push
- Speckit structure validation
- Backend and frontend tests
- Build verification

#### Claude Code Commands

```bash
/speckit-new       # Start a new feature with guided spec creation
/speckit-plan      # Generate implementation plan from spec.md
/speckit-tasks     # Generate task breakdown from plan.md
/speckit-validate  # Validate all specs have required files
```

#### Workflow Example

1. **Create feature**: `mkdir specs/048-feature-name` or `/speckit-new`
2. **Write spec.md** with requirements and acceptance criteria
3. **Generate plan.md**: `/speckit-plan`
4. **Generate tasks.md**: `/speckit-tasks`
5. **Implement** following tasks
6. **Test comprehensively** (unit, integration, regression, build)
7. **Update documentation** (README, API docs, i18n files)
8. **Commit** (pre-commit hook validates everything)

**📖 Full Speckit Guide**: [.specify/README.md](.specify/README.md)
**📜 Project Constitution**: [.specify/memory/constitution.md](.specify/memory/constitution.md)
**🤖 AI Agent Instructions**: [CLAUDE.md](CLAUDE.md)

### Branching Strategy

- `main` - Production-ready code
- `develop` - Integration branch
- `NNN-feature-name` - Feature branches (must match `specs/NNN-*/`)
- `fix/issue-description` - Bug fixes
- `chore/description` - Maintenance tasks
- `hotfix/description` - Urgent production fixes

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(spec-003): implement AI task adaptation
fix(auth): resolve JWT token refresh issue
docs(readme): update installation instructions
test(students): add unit tests for StudentService
chore(deps): update dependencies
```

---

## 🌍 Internationalization

The platform is built with i18n from the ground up:

- **Default Language:** Spanish (es-AR)
- **Supported Languages:** Spanish (es), English (en)
- **AI Responses:** Automatically respond in user's selected language
- **Date/Time Formatting:** Locale-aware
- **All UI strings** must be in locale files (no hardcoded strings)

### Adding a New Language

1. Create `frontend/src/i18n/locales/[locale]/` directory
2. Translate all JSON files
3. Update `frontend/src/i18n/config.ts`
4. Update this README's supported languages list

---

## 🔒 Security

### Best Practices Implemented

- ✅ Role-Based Access Control (RBAC)
- ✅ JWT authentication with refresh tokens
- ✅ Password hashing with bcrypt (cost factor 12)
- ✅ Input validation with DTOs (class-validator)
- ✅ SQL injection prevention (TypeORM)
- ✅ XSS prevention (DOMPurify)
- ✅ CSRF protection (NestJS default)
- ✅ HTTPS required in production
- ✅ Audit logging for all sensitive operations

### Compliance

- **Argentina Personal Data Protection Act** (Ley 25.326)
- **GDPR-ready** (data export, deletion, consent tracking)
- **WCAG 2.1 AA** accessibility compliance

---

## 📚 Documentation

- **API Documentation:** Available at `/api/docs` when running the backend
- **Feature Specifications:** See `specs/` directory
- **Project Constitution:** [.specify/memory/constitution.md](.specify/memory/constitution.md)
- **AI Agent Instructions:** [CLAUDE.md](CLAUDE.md)
- **Speckit Workflow Guide:** [.specify/README.md](.specify/README.md)
- **Prompt Engineering:** [.github/prompts/](.github/prompts/)

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Guidelines

1. **All features must have a spec** in `specs/` before implementation
2. **Follow the code style** (ESLint + Prettier)
3. **Write tests** for new features (>90% coverage)
4. **Update documentation** (README, API docs, inline comments)
5. **Ensure accessibility** (WCAG 2.1 AA)
6. **All UI strings in locale files** (no hardcoded strings)
7. **Never bypass pre-commit hooks** (`--no-verify`)

### Pull Request Process

1. Create a feature branch: `NNN-feature-name`
2. Follow the Speckit workflow (spec → plan → tasks → code)
3. Write comprehensive tests
4. Update documentation
5. Ensure all tests pass and build succeeds
6. Submit PR with clear description
7. Address review comments

For more details, see [CONTRIBUTING.md](CONTRIBUTING.md) (if available).

---

## 🗺️ Roadmap

### Q1 2026

- ✅ MVP Release (v1.0) - Core features
- ✅ Emotional Wellbeing Tracking (SEL)
- ✅ Gamification & Progress Rewards
- ✅ Advanced Accessibility Toolbar
- [ ] User onboarding improvements
- [ ] Mobile-responsive design enhancements

### Q2 2026

- [ ] Learning Analytics Dashboard
- [ ] Parent Portal & Communication Hub
- [ ] AI-Powered Study Companion
- [ ] Multi-Sensory Content Creator
- [ ] Adaptive Learning Paths
- [ ] Proactive Intervention Suggestions
- [ ] Collaborative Goal Setting

### Q3 2026

- [ ] Mobile Applications (iOS/Android)
- [ ] Offline Mode
- [ ] Multi-language expansion (Portuguese, French, Italian, Catalan)
- [ ] Real-time Collaboration Features
- [ ] Advanced Analytics Dashboard

### Q4 2026

- [ ] Predictive Analytics & Early Intervention
- [ ] AI Model Fine-tuning
- [ ] Third-party Integrations (Google Classroom, Canvas, Moodle)
- [ ] Enterprise Features
- [ ] Automated Progress Reports
- [ ] Peer Benchmarking

---

## 📋 README Maintenance Rules

This README is a **living document** that evolves with the project. To keep it accurate and useful, follow these maintenance rules:

### When to Update This README

**You MUST update this README when:**

1. **Adding new features or versions**
   - Update the [Features](#-features) section with the new feature
   - Add version markers (✅ implemented, 🚧 in progress, 🗺️ planned)
   - Update the [Roadmap](#-roadmap) section accordingly

2. **Changing the technology stack**
   - Update the [Architecture](#-architecture) section
   - Update badges at the top if versions change
   - Document why the change was made in the commit message

3. **Adding new environment variables**
   - Update the environment configuration examples in [Quick Start](#-quick-start)
   - Document what each new variable does
   - Mark required vs optional variables

4. **Adding new scripts or commands**
   - Update relevant sections (Testing, Development Workflow, etc.)
   - Include usage examples
   - Document what each command does

5. **Changing setup/installation steps**
   - Update [Prerequisites](#-prerequisites)
   - Update [Quick Start](#-quick-start)
   - Test the instructions on a clean environment

6. **Adding new dependencies or prerequisites**
   - Update [Prerequisites](#-prerequisites)
   - Update installation instructions if needed
   - Document any system requirements

7. **Changing the project structure**
   - Update [Project Structure](#-project-structure)
   - Keep the tree diagram accurate
   - Add comments for important directories

8. **Adding new documentation**
   - Update [Documentation](#-documentation) section
   - Add links to new docs
   - Keep the documentation organized

9. **Changing security practices or compliance**
   - Update [Security](#-security) section
   - Document new compliance requirements
   - Update best practices list

10. **Adding new languages (i18n)**
    - Update [Internationalization](#-internationalization)
    - Update supported languages list
    - Document how to add new languages

11. **Updating the roadmap**
    - Mark completed features with ✅
    - Move items between quarters as needed
    - Add new planned features
    - Remove deprecated/cancelled features

### How to Update This README

**Follow these guidelines:**

1. **Keep it organized**
   - Respect the existing structure and hierarchy
   - Don't create new top-level sections without good reason
   - Use the Table of Contents structure as a guide

2. **Be concise but complete**
   - Feature descriptions should be 1-2 lines maximum
   - Use bullet points for lists
   - Link to detailed docs instead of copying content

3. **Maintain consistency**
   - Use the same formatting style throughout
   - Keep emoji usage consistent with existing patterns
   - Follow the same heading hierarchy (H1 → H2 → H3)

4. **Test examples**
   - Verify all code examples work
   - Test all commands on a clean environment
   - Ensure links are not broken

5. **Update the Table of Contents**
   - Add new sections to the TOC
   - Keep TOC links working
   - Keep TOC order matching document order

6. **Use semantic versioning for features**
   - v1.0 = MVP (core features)
   - v1.1, v1.2 = Minor enhancements
   - v2.0 = Major architectural changes

7. **Document breaking changes prominently**
   - Add a "⚠️ Breaking Change" notice
   - Explain migration steps
   - Link to detailed migration guide if needed

### Prohibited Actions

**You MUST NEVER:**

- ❌ Remove sections without documenting why
- ❌ Add marketing fluff or exaggerations
- ❌ Copy-paste large blocks of code (link to files instead)
- ❌ Use overly technical jargon without explanation
- ❌ Include outdated information
- ❌ Break existing links without fixing them
- ❌ Change the structure drastically without team consensus

### Review Checklist

Before committing README changes, verify:

- [ ] All links work (internal and external)
- [ ] All code examples are tested and work
- [ ] All commands execute successfully
- [ ] Version numbers are accurate
- [ ] No spelling or grammar errors
- [ ] Table of Contents is updated
- [ ] Formatting is consistent
- [ ] No broken markdown syntax
- [ ] Mobile-friendly (no super-wide tables)

### Commit Message Format

When updating the README, use these commit message prefixes:

```bash
docs(readme): add new feature to features section
docs(readme): update installation instructions
docs(readme): fix broken links in documentation section
docs(readme): reorganize architecture section
docs(readme): update roadmap for Q2 2026
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Backend framework
- [Next.js](https://nextjs.org/) - Frontend framework
- [LangChain](https://js.langchain.com/) - AI orchestration
- [Shadcn UI](https://ui.shadcn.com/) - Component library
- [Spec-Kit](https://github.com/github/spec-kit) - Spec-driven development methodology

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/mrtnzagustin/aequitas/issues)
- **Discussions:** [GitHub Discussions](https://github.com/mrtnzagustin/aequitas/discussions)
- **Email:** support@aequitas.app

---

**Built with ❤️ by the Aequitas Team**

*Empowering inclusive education through AI*
