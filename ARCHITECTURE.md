# CareerOS — Architecture

## Overview

CareerOS is a Next.js 15 application using the App Router with a service-layer architecture. Business logic lives in server-side services, not in UI components or API handlers.

## System Diagram

```
Browser
  │
  ▼
Next.js App Router (Server + Client Components)
  │
  ├── Server Components (data fetching, auth checks)
  ├── Client Components (interactivity, forms)
  ├── Server Actions (form submissions, mutations)
  └── Route Handlers (REST API endpoints)
        │
        ▼
    Services Layer
    (profile.service.ts, job.service.ts, etc.)
        │
        ▼
    Prisma ORM
        │
        ▼
    PostgreSQL
```

## Frontend

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v3 with custom design tokens
- **Components**: Custom components built on Radix UI primitives
- **State**: React Server Components for data, minimal client state
- **Forms**: Server Actions with `useActionState` for progressive enhancement
- **Validation**: Zod schemas shared between client and server

## Backend

- **Pattern**: Service-layer architecture
- **API**: Route Handlers for REST endpoints (`/api/*`)
- **Mutations**: Server Actions for form submissions
- **Auth**: NextAuth.js v5 with JWT strategy
- **Validation**: Zod on every external input
- **Error handling**: Structured `ApiResponse<T>` and `ActionState<T>` types

## Database

- **Engine**: PostgreSQL 15+
- **ORM**: Prisma with full type safety
- **Schema**: Domain-oriented models (User, Profile, Education, Experience, Skill, Project, Resume, Job, Application, Interview, etc.)
- **Migrations**: Prisma migrate (never raw SQL)
- **Indexing**: All foreign keys and frequently queried fields indexed

See [DATABASE.md](DATABASE.md) for full schema documentation.

## Authentication

```
User → Credentials → NextAuth.js v5 → JWT Session → Server Auth Helper → Protected Resources
```

- **Provider**: Credentials (email + bcrypt password)
- **Session**: JWT stored in HTTP-only cookie
- **Authorization**: `requireAuth()` helper in every protected server component/action
- **User ID**: Always derived from server-side session — never trusted from client
- **Middleware**: `src/middleware.ts` protects `/dashboard/*` routes

## Storage (Phase 3+)

- **Provider**: Supabase Storage or S3-compatible
- **Files**: Resume PDFs, DOCX, certificates, portfolio images
- **Metadata**: Stored in PostgreSQL `documents` table
- **Access**: Private by default, explicit public flag per document

## AI Agents (Phase 8+)

```
User Request
    │
    ▼
Agent Orchestrator
    │
    ├── Profile Agent
    ├── Resume Agent
    ├── Job Research Agent
    ├── Matching Agent
    ├── Application Agent
    ├── Interview Agent
    └── Career Strategy Agent
```

Each agent has:
- Defined responsibilities
- Explicit allowed tools
- No unrestricted database access
- Structured output schemas (Zod-validated)
- Audit logging via `AgentTask` model

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages and layouts
│   ├── (auth)/             # Unauthenticated routes (sign-in, sign-up)
│   ├── (public)/           # Public portfolio (Phase 4)
│   ├── dashboard/          # Protected dashboard routes
│   └── api/                # REST API Route Handlers
├── components/
│   ├── ui/                 # Generic reusable components
│   └── dashboard/          # Dashboard shell components
├── lib/
│   ├── auth/               # NextAuth config + server helpers
│   ├── db/                 # Prisma client singleton
│   ├── ai/                 # AI utilities and prompts (Phase 8)
│   └── utils/              # Shared utilities
├── agents/                 # AI agent implementations (Phase 8)
├── tools/                  # Agent tool implementations (Phase 8)
├── services/               # Business logic (profile, job, application, etc.)
├── types/                  # Shared TypeScript type definitions
└── validators/             # Zod validation schemas
```

## Security Architecture

- All private data scoped to authenticated user ID
- Service role keys never in browser bundles
- External content (job descriptions, documents) treated as DATA not INSTRUCTIONS
- AI agents restricted to declared tools
- Rate limiting on auth endpoints (Phase 10)
- See [SECURITY.md](SECURITY.md) for full details
