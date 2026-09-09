# CareerOS

> AI-powered personal career management platform

CareerOS is your personal career operating system — manage your professional profile, resumes, job search, applications, interviews, and get AI-powered career guidance, all in one place.

## Features

- **Career Profile** — Professional identity, education, experience, skills, projects, certifications
- **Resume Management** — Multiple resume versions, AI analysis, PDF export
- **Public Portfolio** — Dynamic public career website driven by your profile data
- **Job Management** — Job discovery, import, filtering, and tracking
- **Application Tracker** — Kanban pipeline, timeline, recruiter tracking, follow-ups
- **Interview Management** — Schedule, prepare, and track interview outcomes
- **AI Career Agents** — Specialized agents for profile, resume, job matching, and strategy
- **Analytics** — Career performance metrics and insights

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| UI Components | Custom + Radix UI primitives |
| Backend | Next.js Route Handlers + Server Actions |
| Database | PostgreSQL + Prisma ORM |
| Authentication | NextAuth.js v5 (Auth.js) |
| Storage | Supabase Storage (Phase 3+) |
| AI | OpenAI / Anthropic (Phase 8+) |
| Vector Search | pgvector (Phase 8+) |

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+ (or a Supabase project)
- npm

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd CareerOS

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database URL and auth secret

# 4. Set up the database
npm run db:push         # Push schema to database
npm run db:seed         # Seed with development data (optional)

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

See [`.env.example`](.env.example) for all available environment variables.

**Required:**
- `DATABASE_URL` — PostgreSQL connection string
- `DIRECT_URL` — Direct PostgreSQL connection (same as DATABASE_URL for local dev)
- `AUTH_SECRET` — Secret for NextAuth.js (generate with `openssl rand -base64 32`)

**Optional:**
- `AI_API_KEY` — OpenAI/Anthropic API key (needed for Phase 8+ AI features)
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase credentials

### Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Apply schema to database
npm run db:push

# Run migrations (production)
npm run db:migrate:deploy

# Seed development data
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

### Development Credentials (after seeding)

```
Email:    demo@careeros.dev
Password: demo1234!
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type check |
| `npm run test` | Run tests |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:migrate` | Create and apply a migration |
| `npm run db:seed` | Seed development data |
| `npm run db:studio` | Open Prisma Studio |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth pages (sign-in, sign-up)
│   ├── dashboard/          # Protected dashboard
│   ├── api/                # API Route Handlers
│   └── layout.tsx          # Root layout
├── components/
│   ├── ui/                 # Reusable UI components
│   └── dashboard/          # Dashboard-specific components
├── lib/
│   ├── auth/               # Auth configuration and helpers
│   ├── db/                 # Prisma client singleton
│   └── utils/              # Utility functions
├── agents/                 # AI agents (Phase 8)
├── services/               # Business logic services
├── tools/                  # Agent tools (Phase 8)
├── types/                  # Shared TypeScript types
└── validators/             # Zod validation schemas
```

## Development Phases

| Phase | Status | Description |
|-------|--------|-------------|
| 0 | ✅ Done | Repository audit |
| 1 | ✅ Done | Foundation (auth, database, dashboard shell) |
| 2 | 🔜 Next | Career profile management |
| 3 | ⏳ | Resume system |
| 4 | ⏳ | Public portfolio |
| 5 | ⏳ | Job management |
| 6 | ⏳ | Application tracking |
| 7 | ⏳ | Job matching engine |
| 8 | ⏳ | AI agents |
| 9 | ⏳ | Analytics |
| 10 | ⏳ | Hardening |

## Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) — System architecture
- [DATABASE.md](DATABASE.md) — Database schema documentation
- [AI_AGENTS.md](AI_AGENTS.md) — AI agent architecture
- [SECURITY.md](SECURITY.md) — Security practices
- [DEPLOYMENT.md](DEPLOYMENT.md) — Deployment guide

## Security

- Authenticated users only access their own data
- Auth session derived server-side — never trust client-provided user ID
- Environment secrets never exposed to the browser
- All external input validated with Zod
- AI agents restricted to explicit tools only
- See [SECURITY.md](SECURITY.md) for full details

## License

Private — not for redistribution.
