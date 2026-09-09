# CareerOS — Database Schema

## Overview

CareerOS uses PostgreSQL with Prisma ORM. All models use CUID for primary keys and include `createdAt`/`updatedAt` timestamps.

## Entity Relationship Summary

```
User
 ├── Profile (1:1)
 ├── Education (1:N)
 ├── Experience (1:N)
 ├── Skill (1:N)
 ├── Project (1:N)
 ├── Certification (1:N)
 ├── Achievement (1:N)
 ├── ProfessionalLink (1:N)
 ├── Resume (1:N)
 │    └── ResumeVersion (1:N)
 │         └── Document (1:N)
 ├── Job (1:N)
 │    └── JobMatch (1:N)
 ├── Application (1:N)
 │    ├── ApplicationEvent (1:N)
 │    ├── Interview (1:N)
 │    └── FollowUp (1:N)
 └── AgentTask (1:N)
```

## Models

### Auth Models (NextAuth compatible)
- **User** — Core user account (email, name, passwordHash)
- **Account** — OAuth provider accounts
- **Session** — Active sessions
- **VerificationToken** — Email verification

### Career Profile Models
- **Profile** — Professional title, summary, contact, visibility
- **Education** — Degrees, institutions, coursework
- **Experience** — Work history, achievements, technologies
- **Skill** — Skills with proficiency and category
- **Project** — Portfolio projects with full metadata
- **Certification** — Credentials and certificates
- **Achievement** — Awards and recognition
- **ProfessionalLink** — GitHub, LinkedIn, portfolio links

### Resume Models
- **Resume** — Named resume (e.g. "AI/ML Resume")
- **ResumeVersion** — Versioned snapshots of a resume (JSON content)

### Document Models
- **Document** — Uploaded files with storage path and extraction status

### Job Models
- **Company** — Normalized company records
- **JobSource** — Job source providers (Manual, LinkedIn, etc.)
- **Job** — Job listings with all metadata
- **JobMatch** — Match scores between user and job

### Application Models
- **Application** — Job application with status
- **ApplicationEvent** — Timeline of application events
- **FollowUp** — Reminders for follow-up actions

### Interview Models
- **Interview** — Scheduled interviews with type, outcome

### AI Models
- **AgentTask** — Audit log of all agent actions

## Enums

| Enum | Values |
|------|--------|
| `EmploymentType` | FULL_TIME, PART_TIME, CONTRACT, FREELANCE, INTERNSHIP, VOLUNTEER, OTHER |
| `SkillProficiency` | BEGINNER, INTERMEDIATE, ADVANCED, EXPERT |
| `DocumentStatus` | PENDING, PROCESSING, COMPLETED, FAILED |
| `RemoteType` | REMOTE, HYBRID, ONSITE, UNSPECIFIED |
| `JobStatus` | ACTIVE, EXPIRED, SAVED, IGNORED, ARCHIVED |
| `ApplicationStatus` | SAVED, INTERESTED, APPLIED, SCREENING, INTERVIEW, FINAL_INTERVIEW, OFFER, REJECTED, WITHDRAWN, ARCHIVED |
| `InterviewType` | HR, SCREENING, TECHNICAL, BEHAVIORAL, SYSTEM_DESIGN, FINAL, OTHER |
| `AgentStatus` | PENDING, RUNNING, COMPLETED, FAILED, CANCELLED |

## Indexes

All foreign keys are indexed. Additional indexes on:
- `skills.userId + name` (unique constraint for deduplication)
- `projects.userId + slug` (unique constraint)
- `jobs.status`, `jobs.companyId`
- `applications.userId`, `applications.status`
- `companies.normalizedName` (for deduplication)

## Data Privacy

Every private entity has `userId` — data is always scoped to the authenticated user.

Fields with `isPublic` flag control portfolio visibility:
- `Profile.isPublic`
- `Education.isPublic`
- `Experience.isPublic`
- `Skill.isPublic`
- `Project.isPublic`
- `Certification.isPublic`
- `Achievement.isPublic`
- `ProfessionalLink.isPublic`
