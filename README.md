# Aequitas - AI-Powered Therapeutic & Academic Support Platform

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%5E5.0.0-blue.svg)](https://www.typescriptlang.org/)

Aequitas is an AI-powered platform designed to provide therapeutic and academic support for students with specific learning conditions (dyslexia, ADHD, disabilities). The platform assists psycho-pedagogues, teachers, parents, and schools by facilitating the adaptation of academic tasks and maintaining holistic student profiles.

## 🌟 Features

### MVP (v1.0) - Core Features
- **User & Role Management** - RBAC system for Therapists, Teachers, Parents, and Admins
- **Holistic Student Profiles** - Unified view of student history, notes, and progress
- **AI-Powered Task Adaptation** - Automatic task adaptation using LangChain and LangGraph
- **Adaptation Review & Confirmation** - Human-in-the-loop refinement workflow
- **RAG-based Student History Chat** - Natural language queries on student data
- **Speech-to-Text Data Entry** - Hands-free note dictation

### v1.1 - Social-Emotional Learning & Engagement (In Progress)
- **🎯 Emotional Wellbeing Tracking (SEL)** - Daily mood check-ins, trend analysis, early intervention alerts ✅
- **🏆 Gamification & Progress Rewards** - Points, badges, streaks, leaderboards to boost engagement ✅
- **📊 Learning Analytics Dashboard** - Comprehensive metrics and insights for therapists
- **👨‍👩‍👧 Parent Portal & Communication Hub** - Dedicated parent dashboard with progress tracking
- **♿ Advanced Accessibility Toolbar** - Dyslexia-friendly fonts, high contrast, text-to-speech, magnifier, focus mode ✅

### v1.2 - AI-Powered Learning Support & Collaboration (In Progress)
- **🤖 AI-Powered Study Companion** - 24/7 chatbot for homework help, concept explanations, emotional support
- **🎨 Multi-Sensory Content Creator** - Auto-generate audio, visual, and interactive content versions
- **🎯 Adaptive Learning Paths** - AI-driven personalized learning journeys with dynamic difficulty
- **🔍 Smart Task Breakdown** - AI breaks complex assignments into manageable micro-tasks
- **💬 Parent-Teacher Communication Hub** - Centralized messaging, shared observations, progress reports
- **⏰ Time Management Coach** - AI-powered scheduling, time estimation, and planning assistance
- **🎵 Study Soundscapes** - Adaptive focus sounds, binaural beats, and calming music
- **🔔 Smart Reminder System** - Intelligent reminders that learn optimal timing for each student
- **📊 Progress Visualization Dashboard** - Interactive charts showing growth and skill development
- **🎯 Focus Mode & Distraction Blocker** - Eliminate distractions for deep work sessions
- **📝 AI Quiz & Flashcard Generator** - Auto-create practice materials with spaced repetition
- **📅 Calendar Integration** - Scheduling sessions with Google Calendar, Outlook sync (planned)
- **🎙️ Voice Notes & Audio Feedback** - Record notes and feedback instead of typing (planned)
- **🔗 LMS Integration** - Connect with Google Classroom, Canvas, Moodle (planned)
- **📚 Resource Library** - Curated educational resources and best practices (planned)

### v1.3+ - Advanced Features (Roadmap)
- **🤖 Predictive Analytics & Early Intervention** - AI-powered risk detection
- **📱 Mobile App with Offline Mode** - Native iOS/Android apps
- **🌍 Multilingual Expansion** - Portuguese, French, Italian, Catalan support
- **📈 Peer Benchmarking** - Anonymous performance comparisons
- **🤝 Real-time Collaboration** - Shared goals and live updates
- **🎨 Student Self-Assessment Tools** - Reflection journals and goal setting
- **📋 Automated Progress Reports** - AI-generated comprehensive reports
- **🔔 Customizable Notification System** - Multi-channel alerts
- **📊 Attendance & Engagement Tracking** - Automated monitoring
- **🎥 Multi-format Content Adaptation** - Video and audio support

## 🏗️ Architecture

### Technology Stack

#### Backend
- **Framework:** NestJS (TypeScript)
- **AI Integration:** LangChain, LangGraph
- **Database:** PostgreSQL with pgvector extension
- **ORM:** TypeORM
- **Authentication:** JWT with bcrypt
- **API Documentation:** Swagger/OpenAPI

#### Frontend
- **Framework:** Next.js 14 (App Router)
- **UI Library:** Shadcn UI + Tailwind CSS
- **State Management:** React Context / Zustand
- **Internationalization:** next-intl
- **Forms:** React Hook Form + Zod validation

#### Infrastructure
- **Development:** Docker Compose
- **Production:** Kubernetes (planned)
- **Storage:** AWS S3 (or compatible)
- **Monitoring:** Prometheus + Grafana (planned)

## 📋 Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0 (recommended) or npm
- Docker & Docker Compose
- PostgreSQL 15+ (or use Docker)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/mrtnzagustin/aequitas.git
cd aequitas
```

### 2. Install Dependencies
```bash
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

## 📁 Project Structure

```
aequitas/
├── .github/
│   └── prompts/              # Speckit AI prompts
│       ├── speckit.analyze.prompt.md
│       ├── speckit.clarify.prompt.md
│       ├── speckit.specify.prompt.md
│       └── ...
├── .specify/
│   └── constitution.md       # Project constitution
├── specs/                    # Feature specifications
│   ├── 001-user-role-management/
│   ├── 002-holistic-student-profile/
│   ├── 003-ai-task-adaptation/
│   └── ...
├── backend/                  # NestJS Backend
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── students/
│   │   │   ├── notes/
│   │   │   ├── adaptations/
│   │   │   └── ai/
│   │   ├── common/
│   │   ├── config/
│   │   ├── database/
│   │   └── main.ts
│   ├── test/
│   ├── package.json
│   └── tsconfig.json
├── frontend/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── [locale]/
│   │   │   └── api/
│   │   ├── components/
│   │   │   ├── ui/          # Shadcn components
│   │   │   ├── auth/
│   │   │   ├── students/
│   │   │   └── adaptations/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── i18n/
│   │       └── locales/
│   │           ├── es/
│   │           └── en/
│   ├── public/
│   ├── package.json
│   └── next.config.js
├── docker-compose.yml
├── .gitignore
└── README.md
```

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

## 📚 Documentation

- **API Documentation:** Available at `/api/docs` when running the backend
- **Feature Specifications:** See `specs/` directory
- **Architecture Decisions:** See `.specify/constitution.md`
- **Prompt Engineering:** See `.github/prompts/`

## 🛠️ Development Workflow

### 1. Spec-Driven Development
This project follows the [Spec-Kit](https://github.com/github/spec-kit) methodology:

1. **Analyze:** Use `speckit.analyze` to understand feature requests
2. **Clarify:** Use `speckit.clarify` to identify ambiguities
3. **Specify:** Create detailed specs in `specs/[number]-[feature-name]/`
4. **Plan:** Create implementation plans
5. **Implement:** Build features based on specs
6. **Review:** Use checklists to ensure quality

### 2. Branching Strategy
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/[spec-number]-[short-description]` - Feature branches
- `fix/[issue-number]-[short-description]` - Bug fixes

### 3. Commit Convention
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(spec-003): implement AI task adaptation
fix(auth): resolve JWT token refresh issue
docs(readme): update installation instructions
test(students): add unit tests for StudentService
```

## 🌍 Internationalization

The platform is built with i18n from the ground up:

- **Default Language:** Spanish (es-AR)
- **Supported Languages:** Spanish, English (more coming soon)
- **AI Responses:** Automatically respond in user's selected language
- **Date/Time Formatting:** Locale-aware

To add a new language:
1. Create `frontend/src/i18n/locales/[locale]/` directory
2. Translate all JSON files
3. Update `frontend/src/i18n/config.ts`

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

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Development Guidelines
1. All features must have a spec in `specs/` before implementation
2. Follow the code style (ESLint + Prettier)
3. Write tests for new features
4. Update documentation
5. Ensure accessibility (WCAG 2.1 AA)
6. All UI strings must be in locale files (no hardcoded strings)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Backend framework
- [Next.js](https://nextjs.org/) - Frontend framework
- [LangChain](https://js.langchain.com/) - AI orchestration
- [Shadcn UI](https://ui.shadcn.com/) - Component library
- [Spec-Kit](https://github.com/github/spec-kit) - Spec-driven development methodology

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/mrtnzagustin/aequitas/issues)
- **Discussions:** [GitHub Discussions](https://github.com/mrtnzagustin/aequitas/discussions)
- **Email:** support@aequitas.app

## 🗺️ Roadmap

### Q1 2026
- ✅ MVP Release (v1.0)
- [ ] User onboarding improvements
- [ ] Mobile-responsive design enhancements

### Q2 2026
- [ ] Proactive Intervention Suggestions
- [ ] Collaborative Goal Setting
- [ ] Advanced Analytics Dashboard

### Q3 2026
- [ ] Mobile Applications (iOS/Android)
- [ ] Offline Mode
- [ ] Multi-language expansion

### Q4 2026
- [ ] AI Model Fine-tuning
- [ ] Third-party Integrations (Google Classroom, etc.)
- [ ] Enterprise Features

---

**Built with ❤️ by the Aequitas Team**

*Empowering inclusive education through AI*
