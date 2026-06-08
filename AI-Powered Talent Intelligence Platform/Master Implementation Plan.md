# AI-Powered Talent Intelligence Platform
## Master Implementation Plan

---

> [!IMPORTANT]
> **Total Duration:** 14 Weeks (84 Days) | **Daily Commitment:** 6–8 hours
> This plan is organized in 5 sequential phases. Each phase has a clear goal, week-by-week breakdown, daily tasks, explicit deliverables, and risk mitigations. Build in the exact order specified — every layer depends on the one beneath it.

---

## Tech Stack Summary

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, Zustand, React Hook Form + Zod, dnd-kit, Socket.io client, Recharts, Axios |
| **Backend** | NestJS, TypeScript, Prisma ORM, BullMQ, Socket.io server, Passport.js, class-validator, Pino logger, Handlebars |
| **Databases** | PostgreSQL 15 (RDS) — relational data; MongoDB 7 (Atlas) — AI outputs & parsed resumes; Redis 7 (ElastiCache) — queues & caching |
| **Storage** | AWS S3 + CloudFront CDN |
| **AI** | OpenAI API — gpt-4o-mini (parsing/scoring), gpt-4o (bias detection/question generation) |
| **Services** | Stripe (billing), SendGrid (email), Google Calendar API, Google OAuth, Sentry, Posthog, Better Uptime |
| **DevOps** | Docker Compose (local), GitHub Actions (CI/CD), AWS ECS Fargate, ECR, ALB, Secrets Manager, CloudWatch, Vercel (frontend), Terraform |
| **Testing** | Jest (unit/integration), Supertest (API), Playwright (E2E), k6 (load), OWASP ZAP (security) |

---

## Monorepo Structure

```
talent-platform/           ← Turborepo root
├── apps/
│   ├── api/               ← NestJS backend (HTTP + WebSocket)
│   ├── web/               ← Next.js 14 frontend
│   └── worker/            ← BullMQ AI worker (separate process)
├── packages/
│   ├── shared-types/      ← Zod schemas + TypeScript types shared by both apps
│   ├── config/            ← Shared ESLint, Prettier, TypeScript configs
│   └── database/          ← Prisma client + tenant middleware
├── infrastructure/
│   └── terraform/         ← All AWS infrastructure as code
├── .github/workflows/     ← CI/CD pipeline definitions
├── docker-compose.yml
├── turbo.json
└── package.json
```

---

# PHASE 1 — Foundation & Authentication
## Weeks 1–2 | Days 1–14

**Phase Goal:** Working multi-tenant authentication system, monorepo skeleton, database schema, and CI/CD pipeline. At the end of this phase, any team member can register a company, invite users, and the platform enforces role-based access control.

---

### Week 1 — Project Skeleton, Database, and Auth Core

#### Day 1 — Monorepo Setup & Dev Environment
**Goal:** Full project scaffolding with all infrastructure running locally.

**Morning (3h):**
- Initialize Git repo, `.gitignore`, root `package.json` for Turborepo workspaces
- Install Turborepo globally: `npm install -g turbo`
- Create `turbo.json` with pipeline config for `build`, `dev`, `lint`, `test`, `typecheck`
- Create directory tree: `apps/api`, `apps/web`, `apps/worker`, `packages/shared-types`, `packages/config`, `packages/database`

**Afternoon (3h):**
- Initialize NestJS API: `nest new apps/api --package-manager npm --skip-git`
- Initialize Next.js: `npx create-next-app@latest apps/web --typescript --tailwind --eslint --app`
- Create `docker-compose.yml` with services: **PostgreSQL 15**, **MongoDB 7**, **Redis 7**, **MailHog**, **MinIO** (local S3)
- Start infrastructure: `docker-compose up -d`
- Create `.env.example` with all environment variable placeholders
- Copy to `.env` and fill local values

**✅ Deliverable:** `docker-compose ps` shows all 5 services healthy. All apps scaffold without errors.

---

#### Day 2 — Database Schema & NestJS Core Configuration
**Goal:** Complete Prisma schema migrated to PostgreSQL. NestJS starts cleanly.

**Morning (3h):**
- Install Prisma: `npm install prisma @prisma/client` in `apps/api`
- Define the **full PostgreSQL schema** in `prisma/schema.prisma`:
  - `companies` — root of multi-tenant structure (id, name, slug, plan, stripe IDs, subscription_status, limits)
  - `users` — all user types unified (role enum: `super_admin`, `company_admin`, `recruiter`, `hiring_manager`, `interviewer`, `candidate`)
  - `refresh_tokens` — hashed tokens for rotation
  - `invitations` — pending team invites
  - `jobs` — job postings with jsonb for bias results and form fields
  - `pipeline_stages` — per-job or company-default stages
  - `applications` — candidate applications with AI score
  - `application_stage_history` — immutable audit trail for analytics
  - `application_notes` — with mentioned_users array
  - `interviews` + `interview_interviewers` + `interview_scorecards` + `scorecard_ratings`
  - `offers`
  - `notifications` — persistent, per-user
  - `audit_logs` — monthly partitioned in production
  - `email_templates` — per-tenant or platform default
  - `analytics_snapshots` — nightly aggregation results
  - `subscription_events` — Stripe idempotency records
- Run `npx prisma migrate dev --name initial_schema`
- Verify with `npx prisma studio` at `localhost:5555`

**Afternoon (3h):**
- Install core NestJS dependencies: `@nestjs/config`, `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `passport-google-oauth20`, `bcrypt`, `class-validator`, `class-transformer`, `bullmq`, `@nestjs/bull`, `socket.io`, `@aws-sdk/client-s3`, `@sendgrid/mail`, `mongoose`, `ioredis`, `pino`, `stripe`, `uuid`
- Create config files for: `app`, `database`, `redis`, `aws`, `openai`, `stripe`, `sendgrid` using `registerAs` pattern
- Wire `ConfigModule.forRoot({ isGlobal: true })` in `AppModule`
- Apply global `ValidationPipe` and `api/v1` prefix in `main.ts`

**✅ Deliverable:** Prisma migrations succeed. NestJS starts with `npm run start:dev`. All 18 tables visible in Prisma Studio.

---

#### Day 3 — Authentication: Registration & Login
**Goal:** POST `/auth/register` creates a company + admin user. POST `/auth/login` returns RS256 JWT pair.

**Morning (3h):**
- Generate RSA-256 key pair locally: `openssl genrsa -out private.pem 2048`
- Create `AuthModule` file structure: `strategies/`, `guards/`, `decorators/`, `dto/`, `events/`
- Build `register.dto.ts` with Zod-backed class-validator decorators
- Implement `AuthService.register()`:
  1. Check email uniqueness
  2. Generate company slug from name
  3. Create `Company` record (plan: `FREE`, `trial_ends_at: now + 14d`)
  4. Hash password with bcrypt (cost: 12)
  5. Create `User` as `COMPANY_ADMIN`
  6. Generate email verification token (32-byte hex), store hash
  7. Generate JWT access token (15 min) + refresh token (30 days), both RS256
  8. Store hashed refresh token in `refresh_tokens`
  9. Emit `UserRegistered` event
  10. Return token pair + user + company

**Afternoon (3h):**
- Create `JwtStrategy` using RS256 public key from base64 env var
- Create `JwtAuthGuard` + `@Public()` decorator (skip auth for public routes)
- Implement `AuthService.login()` with bcrypt compare + account lockout after 10 failures
- Create `AuthController` with: `POST /register`, `POST /login`, `POST /refresh`, `POST /logout`
- Apply global `JwtAuthGuard` in `AppModule` with `@Public()` on auth routes
- Rate limit: 5 registrations/IP/hour, 10 logins/IP/minute

**✅ Deliverable:** `POST localhost:3001/api/v1/auth/register` creates a company and returns JWT tokens. Protected test endpoint rejects requests without tokens.

---

#### Day 4 — Refresh Token Rotation, Password Reset & Email Verification
**Goal:** Full secure auth lifecycle complete.

**Morning (3h):**
- Create `AuthRepository` with all DB operations (clean separation from service)
- Implement **refresh token rotation** in `AuthService.refresh()`:
  1. Verify JWT signature, extract JTI
  2. SHA-256 hash the raw token, look up in DB
  3. If not found or revoked → revoke ALL user tokens (replay attack detected) → throw 401
  4. Mark old token revoked
  5. Issue new token pair, store new hash
- Implement `AuthService.logout()` — mark refresh token revoked

**Afternoon (3h):**
- Install `nodemailer` for local MailHog SMTP; SendGrid for production
- Create `EmailService` with environment-aware transport (MailHog on local, SendGrid in prod)
- Implement `forgot-password`: generate 32-byte hex reset token, hash and store with 1h expiry, always return 200
- Implement `reset-password`: validate token hash, update password, revoke all refresh tokens
- Implement `verify-email`: hash token, mark `email_verified: true`, clear token
- Create Handlebars templates for verification and password reset emails (store at `notifications/templates/email/`)

**✅ Deliverable:** Full auth flow tested: register → verify email in MailHog → login → refresh → logout → reset password.

---

#### Day 5 — Tenant Middleware, RBAC Guards & Google OAuth
**Goal:** Every request is tenant-scoped. Roles control access. Google login works.

**Morning (3h):**
- Install `cls-hooked` for Continuation Local Storage
- Create `TenantContext` class with `setCompanyId()` / `getCompanyId()` using CLS namespace
- Create **Prisma tenant middleware** in `packages/database/src/tenant-middleware.ts`:
  - Intercepts every query on tenant-scoped models
  - Appends `WHERE company_id = :currentCompanyId` automatically
  - Cannot be bypassed — only `super_admin` requests skip it
- Define **6 user roles** and their capability sets:

| Role | Key Capabilities |
|---|---|
| `super_admin` | All capabilities, cross-tenant access |
| `company_admin` | All company capabilities + billing + users |
| `recruiter` | Jobs CRUD, applications, interviews, offers |
| `hiring_manager` | View applications in their stage, submit scorecards |
| `interviewer` | View assigned interviews, submit scorecards |
| `candidate` | View own application status, respond to offers |

- Create `CapabilityGuard` + `@RequireCapabilities()` decorator

**Afternoon (3h):**
- Install `passport-google-oauth20`
- Create `GoogleStrategy` — on callback: look up by `google_id` → link by email if found → create new account if not
- Create endpoints: `GET /auth/google` (redirect) and `GET /auth/google/callback` (redirect to frontend with tokens in URL fragment)
- Set up Husky + lint-staged pre-commit hooks at root

**✅ Deliverable:** Google OAuth works. RBAC blocks unauthorized endpoints. Tenant middleware isolates data per company.

---

#### Day 6 — Users Module & Companies Module
**Goal:** Team management and company settings APIs fully functional.

**Morning (3h):**
- Create `UsersModule` with controller, service, repository
- Endpoints: `GET /users/me`, `PATCH /users/me`, `GET /users`, `POST /users/invite`, `PATCH /users/:id/role`, `DELETE /users/:id`
- Implement **invitation flow**:
  1. Check for existing member or pending invite
  2. Generate 64-byte random token
  3. Store token hash with 7-day expiry in `invitations` table
  4. Send invitation email via `EmailService`
- Create invite acceptance endpoints: `GET /auth/invite/validate`, `POST /auth/invite/accept`

**Afternoon (3h):**
- Create `CompaniesModule`
- Endpoints: `GET /companies/me`, `PATCH /companies/me`, `GET /companies/me/usage`
- Create `plan-limits.constants.ts` with plan limit config object (not in DB — deployed atomically with code)
- Create `SubscriptionGuard` — checks `subscription_status` and plan limits on AI-heavy routes
- `getUsage()` queries active jobs count, team member count, AI scores used this month

**✅ Deliverable:** Company admin can invite team members, change roles. Invitation email appears in MailHog. Usage correctly compared against plan limits.

---

#### Day 7 — Frontend Authentication Pages
**Goal:** All auth pages built and functional. User can complete the full auth flow in the browser.

**Morning (3h):**
- Install frontend deps: `axios`, `@tanstack/react-query`, `zustand`, `react-hook-form`, `@hookform/resolvers`, `zod`, `socket.io-client`, `lucide-react`
- Initialize shadcn/ui with Slate color base
- Install shadcn components: `button`, `input`, `label`, `card`, `form`, `toast`, `badge`, `avatar`, `dropdown-menu`, `dialog`, `separator`
- Create `lib/api/client.ts` — Axios instance with:
  - Request interceptor: reads access token from cookie
  - Response interceptor: on 401 → auto-refresh tokens → retry; on refresh fail → redirect to `/login`
- Create Zustand `auth.store.ts` with `user`, `company`, `isLoading`, `setUser`, `logout`

**Afternoon (3h):**
- Build auth pages:
  - `/login` — email + password + Google OAuth button + "Forgot password" link
  - `/register` — first_name, last_name, email, password, company_name
  - `/forgot-password` — email form only
  - `/reset-password` — password + confirm with token from URL param
  - `/callback` — client-side page that reads tokens from URL fragment, stores in cookies, redirects to `/dashboard`
- Create `middleware.ts` — protects all `/dashboard/*` routes, redirects authenticated users away from auth pages

**✅ Deliverable:** All auth pages functional. Register → verify email → login → dashboard redirect works entirely in the browser.

---

### Week 2 — Jobs Foundation & Infrastructure

#### Day 8 — Jobs Module Backend
**Goal:** Complete jobs CRUD with automatic pipeline stage creation.

**Morning (3h):**
- Create `JobsModule` with controller, service, repository
- Implement `createJob()`:
  1. Check active job count against plan limit
  2. Create job in `DRAFT` status
  3. Auto-create 8 default pipeline stages: New Application → Resume Review → Phone Screen → Technical Interview → Final Interview → Offer → Hired → Rejected
  4. Emit `JobCreated` event
- Implement `publishJob()`:
  1. Verify `DRAFT` status
  2. Set `status: PUBLISHED`, `posted_at: now`
  3. Trigger bias check (enqueue if not already run)
  4. Emit `JobPublished` event

**Afternoon (3h):**
- Create `PipelineStagesController`: list, create, update, delete (only if no applications), reorder stages
- Create all DTOs: `CreateJobDto`, `UpdateJobDto`, `JobFiltersDto` (with pagination)
- Implement all job endpoints: `GET /jobs`, `POST /jobs`, `GET /jobs/:id`, `PATCH /jobs/:id`, `POST /jobs/:id/publish`, `POST /jobs/:id/close`, `DELETE /jobs/:id`
- Test all endpoints in Postman: tenant isolation verified (Company A cannot access Company B's jobs)

**✅ Deliverable:** Full jobs backend. Creating a job auto-creates 8 pipeline stages. Tenant isolation verified.

---

#### Day 9 — BullMQ Setup & AI Module Foundation
**Goal:** Queue infrastructure running. Worker process starts. AI module can enqueue jobs.

**Morning (3h):**
- Install `bullmq`, `@nestjs/bullmq`
- Create `QUEUE_NAMES` constants: `RESUME_PARSE`, `CANDIDATE_SCORE`, `BIAS_DETECT`, `INTERVIEW_QUESTIONS`, `SENTIMENT`, `EMAIL`, `ANALYTICS`
- Configure `BullModule.forRootAsync()` using Redis from config
- Create `AiModule` — imports all 5 BullMQ queues, exports `AiService`
- Create `AiService` with enqueue-only methods (no processing): `enqueueResumeParse()`, `enqueueCandidateScore()`, `enqueueBiasDetect()`, `enqueueInterviewQuestions()`, `enqueueSentimentAnalysis()`
- Install `openai`, create `OpenAIProvider` singleton

**Afternoon (3h):**
- Create `apps/api/src/worker.ts` entry point (separate process, no HTTP server)
- Create `WorkerModule` — imports only AI, Notifications, Analytics modules
- Create processor skeleton files for each queue (each just logs job data for now)
- Add `start:worker` script to `package.json`
- Verify worker starts: `npm run start:worker`
- Manually enqueue a test job and verify it appears in Redis

**✅ Deliverable:** BullMQ queues configured. Worker process starts without errors. Jobs can be enqueued and consumed.

---

#### Day 10 — Applications Module Backend
**Goal:** Application submission stores to DB. Resume upload signed URLs work. File stored in MinIO.

**Morning (3h):**
- Create `CandidatesModule`: `findOrCreate()`, `findById()`, `update()`, `search()`, `addTag()`, `removeTag()`
- Create `ApplicationsModule` with repository and service
- Implement `createApplication()`:
  1. Verify job is published
  2. Check for duplicate (same email + same job)
  3. `findOrCreate` candidate record
  4. Get first pipeline stage
  5. Create application record
  6. Create first `ApplicationStageHistory` entry
  7. Emit `ApplicationCreated` event
- Implement `moveStage()`:
  1. Calculate `time_in_previous_stage_hours` from last stage history entry
  2. Update `application.current_stage_id`
  3. Create stage history record
  4. Emit `ApplicationMoved` event

**Afternoon (3h):**
- Create `StorageModule` with `StorageService`:
  - `getPresignedUploadUrl(key, contentType, maxSizeBytes)` — 10-min expiry
  - `getPresignedDownloadUrl(key)` — 1-hr expiry
  - Configure to use MinIO endpoint locally (`forcePathStyle: true`)
- Storage key format: `uploads/{companyId}/{type}/{uuid}/{filename}` (tenant-isolated at storage level)
- Create `StorageController`: `GET /storage/upload-url`, `GET /storage/download-url`
- Create file type validator: allow PDF, DOCX; max 10MB for resumes

**✅ Deliverable:** Applications created via API. Pre-signed upload URL works. File stored in MinIO bucket.

---

#### Day 11 — Applications Controller & Public Submission
**Goal:** Public application endpoint works. Filtering, pagination, and CSV export functional.

**Morning (3h):**
- Create `ApplicationsController` with all endpoints
- `POST /applications/public` — decorated `@Public()` with tight rate limit (5/IP/15min)
- Install `@nestjs/throttler`; create Redis-backed `ThrottleGuard` (works across multiple API instances)
- Public submission returns `tracking_token` (separate UUID — candidates use this without authentication)

**Afternoon (3h):**
- Create `pagination.util.ts` with `paginate()` and `buildPaginatedResponse()` helpers
- Applications list supports filtering: `job_id`, `stage_id`, `status`, `source`, `min_score`/`max_score`, text search, sort, pagination
- Install `json2csv`; implement `GET /applications/export` that streams CSV response with headers: Name, Email, Phone, Job, Stage, AI Score, Source, Applied Date

**✅ Deliverable:** Public application form can submit. List with all filters works. CSV downloads properly.

---

#### Day 12 — Frontend Layout & Dashboard
**Goal:** Authenticated app shell with sidebar, header, and live metrics dashboard.

**Morning (3h):**
- Create `app/(app)/layout.tsx` — authenticated layout that validates session on mount
- Create `Sidebar` component:
  - Company name/logo at top
  - Role-filtered navigation links
  - Collapsible with toggle button
  - User menu at bottom (avatar, logout)
- Create `Header` component: breadcrumbs, notification bell, user dropdown

**Afternoon (3h):**
- Set up `TanStack Query` provider + shadcn `Toaster` in root layout
- Create API layer `lib/api/jobs.api.ts`, `lib/api/companies.api.ts`
- Create custom hooks: `useJobs()`, `useJob()`, `useCreateJob()`, `usePublishJob()`
- Create `Dashboard` page with 4 metric cards (Active Jobs, Applications This Month, Interviews This Week, Open Offers) — fetches from `GET /companies/me/usage`
- Create Jobs list page with status filter, search, and loading skeleton

**✅ Deliverable:** Authenticated layout with sidebar. Dashboard shows real company metrics. Jobs list loads from API.

---

#### Day 13 — Job Creation Multi-Step Form
**Goal:** Recruiter can create and publish a job entirely through the UI including AI description generation.

**Morning (3h):**
- Create `app/(app)/jobs/new/page.tsx` with local step state
- Create `StepIndicator` component (shows current and completed steps)
- Define Zod schema `job.schema.ts` for the full form

**Afternoon (3h):**
- Build 5 form steps:
  - **Step 1 — Basic Info:** Title, Department (combobox with suggestions), Location, Employment Type, Remote Type
  - **Step 2 — Description:** Markdown editor (`@uiw/react-md-editor`), "Generate with AI" dialog (brief description + seniority + key technologies → calls `POST /jobs/ai-description`)
  - **Step 3 — Requirements:** Rich text for requirements and nice-to-haves, salary range, currency
  - **Step 4 — Application Form Builder:** Default fields (name, email, resume), drag-to-reorder custom fields with `dnd-kit`
  - **Step 5 — Review & Publish:** Read-only preview, "Save as Draft" and "Publish Now" buttons

**✅ Deliverable:** Multi-step form creates and publishes jobs end-to-end. AI description generation fills the editor.

---

#### Day 14 — WebSocket Gateway & Real-Time Foundation
**Goal:** Socket.io gateway running. Frontend connected. Stage moves trigger WebSocket events visible in browser.

**Morning (3h):**
- Install `@socket.io/redis-adapter`
- Create `WebsocketsGateway`:
  - On connect: verify JWT from handshake query → join `company:{id}` room and `user:{id}` room
  - On connect fail: disconnect immediately
  - After init: configure Redis adapter for multi-instance pub/sub
  - Methods: `emitToCompany()`, `emitToUser()`
- Wire: `ApplicationsService.moveStage()` calls `gateway.emitToCompany('application:moved', data)`

**Afternoon (3h):**
- Create `lib/socket.ts` — singleton Socket.io client (reconnects on disconnect)
- Create `hooks/use-socket.ts` — returns socket instance, initialized with access token
- Create `hooks/use-socket-event.ts` — subscribes to a named event, calls callback on receive
- Test: log in → DevTools Network WS tab → move application via Postman → see event appear in browser WS tab

**✅ Deliverable:** WebSocket gateway running with Redis adapter. Frontend receives live events when application stages are moved via API.

---

## Phase 1 Summary

| Deliverable | Status |
|---|---|
| Turborepo monorepo with 3 apps + 3 packages | ✅ |
| Full PostgreSQL schema (18 tables) migrated | ✅ |
| RS256 JWT auth with refresh token rotation | ✅ |
| Password reset + email verification | ✅ |
| Google OAuth | ✅ |
| Multi-tenant middleware (cannot be bypassed) | ✅ |
| RBAC with 6 roles and capability guards | ✅ |
| Team invitation flow | ✅ |
| Jobs CRUD with auto pipeline stages | ✅ |
| BullMQ worker process | ✅ |
| Applications module with public submission | ✅ |
| Authenticated frontend app shell | ✅ |
| Multi-step job creation form with AI description | ✅ |
| Socket.io gateway with Redis adapter | ✅ |

> [!NOTE]
> **Phase 1 Risk:** AWS infrastructure setup in Week 4 can run over schedule. Mitigate by using Terraform from Day 1 so infrastructure is reproducible and not manually configured.

---

# PHASE 2 — Core Application Flow & AI Pipeline
## Weeks 3–5 | Days 15–35

**Phase Goal:** Complete the hiring pipeline's primary user journey — from candidate application submission through AI-powered resume parsing and scoring, to real-time Kanban board management. End of phase: a recruiter can post a job, a candidate can apply, AI scores appear automatically on the Kanban board, and the platform is billable via Stripe.

---

### Week 3 — Kanban Board & AI Pipeline

#### Day 15 — Kanban Board Frontend
**Goal:** Drag-and-drop Kanban fully functional. Dropping a card calls the API and other browser tabs update via WebSocket.

**Morning (3h):**
- Install `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `@dnd-kit/modifiers`
- Create `app/(app)/jobs/[id]/pipeline/page.tsx` — loads `GET /jobs/:id/pipeline`
- Create `KanbanBoard` component wrapping `DndContext`
- Implement `handleDragEnd`:
  1. Determine target stage from drop zone
  2. **Optimistic update** — move card in local state immediately
  3. Call `PATCH /applications/:id/stage`
  4. On error → revert state + toast "Failed to move candidate"

**Afternoon (3h):**
- Create `KanbanColumn` with `SortableContext`, stage header with color and count, "Load More" button
- Create `KanbanCard` with:
  - Candidate name and applied date
  - AI score ring (SVG: green ≥80, yellow 60–79, red <60, spinning dashes = processing)
  - Source badge, days in stage
  - Hover actions: View, Schedule Interview, Reject
- Wire `useSocketEvent('application:moved')` and `useSocketEvent('application:scored')` to update local state

**✅ Deliverable:** Kanban with drag-and-drop. Moving a card updates the DB and other tabs see the move via WebSocket within 500ms.

---

#### Day 16 — Resume Parsing AI Processor
**Goal:** Uploading a PDF resume triggers parsing. Structured data appears in MongoDB within 30 seconds.

**Morning (3h):**
- Install `pdf-parse`, `mammoth`
- Build `ResumeParseProcessor.process()` step by step:
  1. `downloadFromS3(key)` — stream S3 object to Buffer
  2. `extractText(buffer, fileType)` — pdf-parse for PDFs, mammoth for DOCX
  3. `cleanResumeText(text)` — normalize whitespace, strip non-printable chars, truncate to ~30,000 chars

**Afternoon (3h):**
- Build `parseWithOpenAI(cleanedText)`:
  - Model: `gpt-4o-mini`, `response_format: { type: 'json_object' }`, `temperature: 0`
  - System prompt instructs structured extraction: name, contact, summary, experience array, education array, skills array, total years experience
  - Validate response with `ParsedResumeSchema` Zod validator
- On success:
  1. Store to MongoDB `parsed_resumes` collection
  2. Update `application.resume_parsed: true` in PostgreSQL
  3. Enqueue `CANDIDATE_SCORE` job
  4. Emit `application:resume-parsed` WebSocket event
- On `ZodError`: store error metadata, throw `UnrecoverableError` (BullMQ won't retry)
- On API error: throw normally (BullMQ retries with exponential backoff)

**✅ Deliverable:** Upload a real PDF resume → watch worker logs → see structured data in MongoDB → `resume_parsed: true` in PostgreSQL.

---

#### Day 17 — Candidate Scoring AI Processor
**Goal:** After parsing, every candidate gets a 0–100 AI score with full explanation. Score appears on Kanban card in real time.

**Morning (3h):**
- Build `CandidateScoringProcessor.process()`:
  1. Load `application` from PostgreSQL (get `job_id`)
  2. Load `job` from PostgreSQL (description, requirements, skills)
  3. Load `parsed_resume` from MongoDB
  4. Build experience summary string from parsed data
  5. Call `buildCandidateScoringPrompt(job, candidate)` — structured prompt
  6. Call OpenAI with `gpt-4o-mini`, `response_format: json_object`
  7. Validate with `CandidateScoreSchema` Zod validator (overall_score, confidence, subscores, strengths, gaps, explanation, skill_gap_analysis, recommendation)

**Afternoon (3h):**
- Store score document to MongoDB `candidate_scores` collection
- Update `application.ai_score` in PostgreSQL
- Atomic increment `company.ai_scores_used_this_month`
- Emit `application:scored` WebSocket event
- Create `AiScoreBreakdown` component in frontend:
  - Large score ring (120px), recommendation badge (color-coded)
  - 5 progress bars for subscores (Skills Match, Experience Level, Education, Culture, Keywords)
  - Strengths (green checkmarks), Gaps (yellow warnings), Explanation text
  - Skill gap analysis table: Required Skills "Has" vs "Missing"
- Create application detail slide-over panel with tabs: Overview (score), Resume, Timeline, Notes
- Wire `useSocketEvent('application:scored')` to update TanStack Query cache → card score ring updates without refresh

**✅ Deliverable:** Submit a resume → parse + score runs automatically → score appears on Kanban card in real time without page refresh.

---

#### Day 18 — Application Detail Page & Notes
**Goal:** Recruiter can see full candidate profile, parsed resume, activity timeline, and collaborate via notes.

**Morning (3h):**
- Create `app/(app)/applications/[id]/page.tsx` — two-column layout
  - Left (60%): contact info, summary, work experience cards, education, skills badges
  - Right (40%): activity timeline, team notes, interview schedule
- Activity timeline combines stage history + key events in chronological order

**Afternoon (3h):**
- Create `Notes` component with `POST /applications/:id/notes`
- Implement @mention: typing `@` opens a floating team member selector
- Mentioned user IDs stored in `mentioned_users` array → notifications sent on save
- Notes list updates via `useSocketEvent('note:created')` or 30-second polling fallback

**✅ Deliverable:** Full application detail page. Recruiters can read parsed resume and collaborate on notes with @mentions.

---

#### Day 19 — Bias Detection Feature
**Goal:** When a job is reviewed before publish, biased language is highlighted with AI-generated suggestions.

**Morning (3h):**
- Build `BiasDetectProcessor.process()`:
  1. Load job description + requirements
  2. Build bias detection prompt — detect: `gender_coded`, `age_biased`, `disability_discriminatory`, `cultural_exclusionary`
  3. Call OpenAI with `gpt-4o` (better nuance for bias detection)
  4. Store `ai_bias_reports` document in MongoDB
  5. Update `job.bias_check_run: true`
  6. Emit `job:bias-checked` WebSocket event

**Afternoon (3h):**
- Create `BiasWarningPanel` component for job creation Step 5:
  - States: Loading (spinner), Clean (green checkmark), Issues Found (list of flags)
  - For each flag: exact phrase highlighted yellow, category badge, severity, explanation, suggested replacement
  - Two buttons: "Publish Anyway" / "Go Back to Edit"
- Auto-trigger on Step 5 mount: call `POST /jobs/:id/bias-check`, poll `GET /jobs/:id/bias-check` every 3s until done

**✅ Deliverable:** Bias detection runs automatically on job review step. Biased phrases highlighted with actionable suggestions.

---

#### Day 20 — Notification System
**Goal:** In-app notification bell works. New applications and stage moves trigger notifications. Emails appear in MailHog.

**Morning (3h):**
- Create `NotificationsService.send()`:
  - Creates DB notification record
  - Emits WebSocket event to user's personal room
  - Enqueues email job (respects user notification preferences per-channel per-type)
- Connect to domain events:
  - `ApplicationCreated` → notify recruiters for the job
  - `ApplicationMoved` → notify job owner (if not the mover)
  - `InterviewScheduled` → notify interviewers + candidate
  - `OfferSent` → notify candidate
  - `ScorecardSubmitted` → notify recruiter
- Create notification CRUD endpoints: `GET /notifications`, `PATCH /notifications/:id/read`, `PATCH /notifications/read-all`, `GET /notifications/unread-count`

**Afternoon (3h):**
- Create `NotificationBell` component with unread count badge (refetched every 30s + WebSocket update)
- Create `NotificationCenter` slide-over with notification list, time-ago, read/unread state, click-to-navigate
- Wire `useSocketEvent('notification:created')` to prepend new notification and increment badge count

**✅ Deliverable:** Notification bell updates in real time. New applications and stage moves send emails to MailHog. In-app notifications persist across sessions.

---

#### Day 21 — Integration Testing & Bug Fixes
**Goal:** Full happy-path flow passes end-to-end. Consistent error responses across the entire API.

**Morning (3h):**
- Test complete happy path:
  1. Register company → verify email → login
  2. Create job with AI description → see bias warning → publish
  3. Navigate to public form `/apply/:jobId` → submit real PDF resume
  4. Watch Kanban board — candidate appears in "New Application"
  5. AI score ring shows spinner → then score appears (10–30s)
  6. Click card → read score breakdown
  7. Drag candidate to "Resume Review"
  8. Incognito window of same pipeline should see card move via WebSocket
- Fix all bugs found (common: CORS, cookie JWT reading, MongoDB URI, worker not running)

**Afternoon (3h):**
- Create `AllExceptionsFilter` — maps Prisma errors (P2002 → 409, P2025 → 404), validation errors (→ 422), to consistent `{ status, code, message, details, request_id }` response shape
- Create `ResponseTransformInterceptor` — wraps all success responses in `{ success: true, data, timestamp, request_id }`
- Apply both globally in `main.ts`

**✅ Deliverable:** Complete integration test passes. Consistent error format across all API endpoints.

---

### Week 4 — Interviews, Offers & Billing

#### Day 22 — Interviews Module Backend
**Goal:** Interviews can be scheduled, interviewers assigned, and Google Calendar events created.

**Morning (3h):**
- Create `InterviewsModule` with service, repository, controller
- `createInterview()`: create interview record → create `InterviewInterviewer` records → emit `InterviewScheduled` → create Google Calendar event if connected
- Install `googleapis`; create `GoogleCalendarService` with `createEvent()`, `updateEvent()`, `deleteEvent()`
- Store encrypted Google refresh tokens on user record (install `node-encrypt-aes`)

**Afternoon (3h):**
- Scorecard endpoints: `POST /interviews/:id/scorecards` (verify interviewer assignment, no duplicate scorecard), `GET /interviews/:id/scorecards`
- `GET /interviews/:id/summary` — aggregated view: rating distribution, per-criterion averages, pending submissions count

**✅ Deliverable:** Interviews scheduled, interviewers assigned, scorecards submitted. Google Calendar events created if connected.

---

#### Day 23 — Interview Frontend & AI Question Generation
**Goal:** Interview scheduling UI works. AI-generated question sets appear in interview kits.

**Morning (3h):**
- Create `InterviewScheduler` multi-step drawer: Type → Interviewers → Date/Time → Interview Kit
- Interviews list page at `/interviews` — role-filtered (interviewers see only theirs; recruiters see all)

**Afternoon (3h):**
- Build `InterviewQuestionsProcessor`:
  - Use `gpt-4o` for quality; generate 5 categories × 3–4 questions each
  - Categories: Technical Skills, System Design, Behavioral, Problem Solving, Culture & Values
  - Store in MongoDB `interview_question_sets`
- Create `QuestionSetDisplay` component: questions grouped by category, expandable follow-ups and evaluation hints, inline edit

**✅ Deliverable:** Interview scheduling UI complete. AI generates interview question sets based on job requirements.

---

#### Day 24 — Offers Module
**Goal:** Recruiters can generate PDF offer letters and send them. Candidates can accept or decline from their portal.

**Morning (3h):**
- Install `puppeteer`
- Create `OffersModule` with `createOffer()`, `generateOfferLetter()` (Puppeteer renders HTML → PDF → S3), `sendOffer()` (email with PDF link), `respondOffer()` (validates tracking token, marks hired/declined)
- Offer expiry daily cron job: marks past-expiry offers as `EXPIRED`, notifies recruiter

**Afternoon (3h):**
- Offer creation form: base salary, bonus, equity, start date, expiry date
- HTML preview before PDF generation
- Candidate portal at `app/(portal)/status/page.tsx` — accessed with tracking token: shows application timeline, offer details, "Accept / Decline" buttons

**✅ Deliverable:** Full offer lifecycle works. Candidates can respond from the portal without logging in.

---

#### Day 25 — Stripe Billing Backend
**Goal:** Stripe checkout creates subscriptions. Webhooks correctly update company plan status.

**Morning (3h):**
- Create `BillingModule` with `BillingService`
- `createOrGetStripeCustomer()`, `createCheckoutSession()` (with 14-day trial), `createCustomerPortalSession()`

**Afternoon (3h):**
- Webhook endpoint: validate Stripe signature → idempotency check (prevent duplicate processing) → handle:
  - `checkout.session.completed` → activate subscription + update plan
  - `customer.subscription.updated` → sync plan and period
  - `customer.subscription.deleted` → set `CANCELED`, downgrade to FREE (data preserved)
  - `invoice.payment_failed` → set `PAST_DUE`, email company admin
  - `invoice.payment_succeeded` → set `ACTIVE`
- Test locally with `stripe listen --forward-to localhost:3001/api/v1/billing/webhook`

**✅ Deliverable:** Stripe checkout + webhook + customer portal fully functional.

---

#### Day 26 — Billing Frontend & Plan Enforcement
**Goal:** Billing page shows accurate usage. Plan limits enforced in the UI. Upgrade flow works end-to-end.

**Morning (3h):**
- Build `Settings > Billing` page: current plan badge, renewal date, 3 usage bars (Jobs / Team / AI Scores), plan comparison cards side-by-side, "Manage Billing" button (→ Stripe Customer Portal), invoice history table

**Afternoon (3h):**
- Create `usePlanLimits()` hook: `canCreateJob`, `canInviteUser`, `isAtAiQuota`
- Disable job creation button with tooltip when at limit
- Create `UpgradeModal` — appears when hitting a plan limit; shows next plan benefits and one-click upgrade

**✅ Deliverable:** Billing page shows real usage. Limits enforced in UI. Upgrade via Stripe works.

---

#### Day 27 — Analytics Module Backend
**Goal:** All analytics queries functional. Nightly aggregation job runs.

**Morning (3h):**
- Create `AnalyticsModule` with queries:
  - `getPipelineConversionRates()` — from `application_stage_history`, count movements between stage pairs
  - `getTimeToHire()` — `AVG(hired_at - applied_at)` for `HIRED` applications
  - `getSourceQuality()` — applications and hire rates grouped by source
  - `getTeamPerformance()` — per-recruiter: jobs created, applications moved, interviews scheduled, offers sent

**Afternoon (3h):**
- Create `AggregateAnalyticsJob` — runs at 2 AM UTC daily via NestJS `@Cron`, writes to `analytics_snapshots` table per company
- Create `AnalyticsController` endpoints: `GET /analytics/pipeline`, `GET /analytics/time-to-hire`, `GET /analytics/sources`, `GET /analytics/team-performance`

**✅ Deliverable:** All analytics endpoints return real data. Nightly aggregation job runs and populates snapshots table.

---

#### Day 28 — Analytics Frontend Dashboard
**Goal:** Beautiful analytics dashboard with all charts functional.

**Morning (3h):**
- Install `recharts`
- Create `app/(app)/analytics/page.tsx` with date range filter (last 7d / 30d / 90d / custom)
- Build `PipelineFunnelChart` — horizontal bar chart showing candidates at each stage with conversion rates

**Afternoon (3h):**
- `TimeToHireChart` — line chart over time with trend indicator
- `SourceQualityChart` — grouped bar (applications vs hires) per source
- `TeamPerformanceTable` — sortable table with recruiter metrics
- All charts hook into TanStack Query with the analytics endpoints

**✅ Deliverable:** Full analytics dashboard with 4 chart types. Date range filter updates all charts.

---

#### Day 29 — Bulk Operations & CSV Export (Frontend)
**Goal:** Recruiters can select multiple candidates and perform bulk actions.

**Morning (3h):**
- Add checkbox to each `KanbanCard` and `ApplicationListRow`
- Create `BulkActionsBar` that appears when 1+ candidates selected: shows count, "Move Stage", "Reject", "Export CSV" buttons
- `POST /applications/bulk` with `{ application_ids, action, parameters }`

**Afternoon (3h):**
- CSV export from application list page: respects current filters, streams file download
- Source tracking UI: each application card shows source badge (LinkedIn, Indeed, Referral, Direct)
- Source filter added to application list sidebar

**✅ Deliverable:** Recruiters can bulk-move or export candidates. Source tracking visible and filterable.

---

#### Day 30 — AWS Infrastructure Setup
**Goal:** Staging environment deployed on AWS. Complete stack accessible via staging URL.

**Morning (3h):**
- Write Terraform files in `infrastructure/terraform/`:
  - `vpc.tf` — VPC with public and private subnets
  - `rds.tf` — PostgreSQL 15 `db.t3.medium` in private subnet
  - `redis.tf` — ElastiCache Redis `cache.t3.micro`
  - `ecs.tf` — ECS cluster, task definitions for API and worker, ALB
  - `s3.tf` — resumes bucket + documents bucket (versioning enabled)
  - `cloudfront.tf` — CloudFront distribution in front of S3
  - `secrets.tf` — Secrets Manager secrets for JWT keys, DB password

**Afternoon (3h):**
- Write `Dockerfile` for API (multi-stage: build → production, ~180MB final image)
- Write worker `Dockerfile` (same image, different `CMD`)
- Create `.dockerignore`
- Push Docker images to ECR
- Run `terraform apply` for staging
- Configure Vercel project for `apps/web`, set env vars pointing to staging API

**✅ Deliverable:** Staging environment deployed. Frontend on Vercel. API on ECS. End-to-end flow works in staging.

---

#### Day 31–35 — GitHub Actions CI/CD & Week Review

**Days 31–32 — CI/CD Pipeline:**
- **PR workflow** (on every PR): checkout → install (cached) → lint → type-check → unit tests → integration tests → Vercel preview deployment
- **Staging deployment** (on `develop` merge): build Docker → push to ECR → run Prisma migrations → deploy ECS → smoke tests → Slack notify
- **Production deployment** (on git tag `vX.X.X`): all staging checks → manual approval step (GitHub Environments) → blue-green ECS deployment → smoke tests → 10-min monitor → auto-rollback if error rate >1%

**Days 33–35 — Integration Testing & Fixes:**
- End-to-end test every feature built so far on staging
- Fix all staging-specific bugs (env vars, CORS, SSL)
- Write unit tests for: `AuthService`, `ApplicationsService.moveStage()`, `ResumeParseProcessor`, `CandidateScoringProcessor`, `BillingService.handleWebhookEvent()`
- Target 80% coverage across modules, 95% on AI prompt construction

**✅ Phase 2 Deliverable:** Deployable, billable MVP. Companies can post jobs, candidates can apply, AI scores appear on Kanban, Stripe billing is live.

---

# PHASE 3 — Interview, Offer & Bias Polish
## Weeks 6–8 | Days 36–56

**Phase Goal:** Complete the full hiring lifecycle from job post to offer acceptance. Add all remaining P1 features: structured interview kits, scorecard aggregation, offer PDF generation, bias detection in the UI, and bulk operations polish.

---

### Week 6 — Days 36–42: Interview Management Polish

**Day 36–37 — Scorecard Aggregation View:**
- Build `ScorecardSummaryView` component for the "Make a Decision" step
- Shows: rating distribution donut chart, per-criterion radar chart (if 2+ interviewers), individual scorecard cards with notes (visible to recruiter/admin)
- Sentiment analysis display alongside each scorecard (positive/neutral/negative indicator)
- Pending interviewers section: who hasn't submitted yet, with "Send Reminder" button

**Day 38–39 — Google Calendar OAuth Flow:**
- Build Google Calendar connection UI in Settings
- Show connected/disconnected state, connect button triggers OAuth flow, disconnect removes stored tokens
- Calendar availability view in scheduler: show busy times as grayed-out slots (requires `freebusy` API call)

**Day 40–41 — Interview Reminder Notifications:**
- Cron job sends reminder emails 24h before interview to all interviewers and candidate
- Interviewer reminder includes: candidate name, interview kit link, "Submit Scorecard" link
- Candidate reminder includes: company name, interviewer names, meeting link

**Day 42 — Week Review:**
- Integration test full interview flow: schedule → interviewers receive email → submit scorecards → recruiter sees aggregated view

---

### Week 7 — Days 43–49: Offer Management & Candidate Portal Polish

**Day 43–44 — Offer Letter Templates:**
- Create offer letter HTML template in Handlebars with merge fields: `{{candidateName}}`, `{{jobTitle}}`, `{{baseSalary}}`, `{{startDate}}`, `{{companyName}}`, `{{signatoryName}}`
- Company admins can customize the template in Settings
- Preview renders in browser before PDF generation

**Day 45–46 — Candidate Portal Enhancement:**
- Candidate portal shows full application journey: applied → resume reviewed → interviews → offer
- Interview preparation section: when interview is scheduled, candidate sees date/time, interviewer names, preparation tips
- Offer response page: shows full offer details with PDF download link, Accept/Decline with optional decline reason

**Day 47–48 — Email Template Manager:**
- Build Settings page for email template management (company_admin only)
- Templates for: Application Received, Interview Scheduled, Offer Sent, Rejection, Stage Update
- Handlebars variable reference shown alongside editor
- "Send Test Email" button sends to the current admin's email

**Day 49 — Week Review:**
- Test complete hiring lifecycle: apply → parse → score → screen → interview → scorecard → offer → accept
- Measure end-to-end time for AI pipeline with 10 real resumes

---

### Week 8 — Days 50–56: Polish, Refinement & V1 Prep

**Day 50–51 — Bulk Operations Polish:**
- Bulk reject with reason (sent via email to all selected candidates simultaneously)
- Bulk export with custom column selection dialog
- Bulk email: select candidates, pick email template, preview, send
- Progress indicator for async bulk operations (polling `GET /applications/bulk/:jobId`)

**Day 52–53 — Search & Filtering Improvements:**
- Global search bar in header: search across candidates, jobs, companies
- Advanced filter drawer on applications list: multi-select stages, score range slider, date range, source multi-select
- Save filter presets per user

**Day 54–55 — Recruiter Dashboard Improvements:**
- "My Tasks" widget on dashboard: unsubmitted scorecards, pending offers, stalled candidates (no activity in 7+ days)
- Quick action buttons directly from task items
- Team activity feed showing recent stage moves and notes

**Day 56 — V1 Release Candidate:**
- Complete feature audit against P0 and P1 checklists
- Fix all remaining bugs
- Performance audit: check LCP under 2.5s, API 95th percentile under 200ms

**✅ Phase 3 Deliverable:** Feature-complete V1 ready for paying customers. Full hiring lifecycle from job post to offer acceptance works without leaving the platform.

---

# PHASE 4 — Analytics, Security & Compliance
## Weeks 9–11 | Days 57–77

**Phase Goal:** Production-grade security, GDPR compliance, full analytics visibility, and audit trails. Platform is ready for enterprise evaluation and SOC 2 preparation.

---

### Week 9 — Days 57–63: Security Hardening

**Day 57–58 — Security Audit:**
- Run OWASP ZAP against staging API; fix all High and Medium severity findings
- `npm audit` in CI enforced as blocking check
- Add Snyk to GitHub Actions for dependency vulnerability monitoring
- Content Security Policy headers in Next.js `next.config.js`
- Rate limiting review: tighten limits on auth endpoints, add IP-based blocking after repeated 401s

**Day 59–60 — MFA Support:**
- TOTP-based MFA using `otplib`
- Settings page: show QR code for authenticator app setup, verify with one-time code
- MFA required for `company_admin` role (configurable in company settings)
- Backup codes: 10 single-use codes generated on MFA enable

**Day 61–62 — Tenant Isolation Penetration Test:**
- Automated test suite that specifically attacks tenant isolation:
  - JWT with tampered `company_id` claim
  - Direct ID guessing in API routes
  - S3 key enumeration attempts
  - WebSocket room subscription hijacking
- All tests must fail with 403 (not 404, which leaks existence)

**Day 63 — Week Review & Security Report:**
- Document all findings and fixes in a security report
- Set up Sentry with PII scrubbing (`beforeSend` removes email, phone, resume_text, password fields)

---

### Week 10 — Days 64–70: GDPR Compliance

**Day 64–65 — Data Export (Right to Portability):**
- `POST /api/v1/gdpr/export` (company_admin only) — triggers async job that aggregates all company data
- Export package: JSON files for all entities + CSV for applications + all uploaded files as ZIP
- Delivered via signed S3 URL, expires in 24h, email sent when ready

**Day 66–67 — Right to Erasure:**
- `DELETE /api/v1/gdpr/candidates/:id` — permanently deletes candidate PII
- Cascade: anonymizes candidate name/email to "Deleted User", removes parsed resume from MongoDB, removes resume file from S3
- Preserves application record with anonymized data for analytics integrity
- Audit log entry created for the erasure event

**Day 68–69 — Audit Log UI:**
- Build `Settings > Audit Log` page (company_admin only)
- Filter by: date range, user, action type, resource type
- Export as CSV
- Shows: who, what action, what resource, when, from what IP
- This is required for enterprise SOC 2 compliance evaluation

**Day 70 — Cookie Consent & Privacy:**
- Cookie consent banner on candidate portal and public pages
- Privacy policy and DPA (Data Processing Addendum) pages
- GDPR-compliant email preferences with one-click unsubscribe

---

### Week 11 — Days 71–77: Load Testing & Performance

**Day 71–72 — Load Testing Setup:**
- Install k6; write load test scripts:
  - 100 concurrent users browsing job listings
  - 50 concurrent recruiters on Kanban board
  - 200 simultaneous application submissions
- Run against staging; analyze results

**Day 73–74 — Performance Optimization:**
- Fix any endpoints exceeding 200ms 95th percentile
- Add Redis caching for: company config (TTL 300s), active job stages (TTL 60s), pipeline counts (TTL 30s)
- Add database indexes identified from slow query log
- Implement PgBouncer connection pooling if connection count is high

**Day 75–76 — Monitoring & Alerting Setup:**
- CloudWatch dashboards: API error rate, avg response time, queue depth, queue processing time
- Alarms: ECS CPU >80% → auto-scale + PagerDuty; queue depth >500 → PagerDuty; error rate >1% → PagerDuty
- Better Uptime synthetic health checks every 60s against `/api/v1/health`
- Health endpoint: checks DB, Redis, MongoDB connections; returns `degraded` if any are slow

**Day 77 — Backup & Disaster Recovery:**
- Verify RDS automated daily snapshots (7-day retention)
- Enable point-in-time recovery (5-min granularity)
- MongoDB Atlas backup verified (7-day retention)
- S3 versioning enabled on all buckets
- Document disaster recovery runbook: RTO < 4h, RPO < 1h

**✅ Phase 4 Deliverable:** Platform passes security audit. GDPR compliant. Load tested to 200 concurrent users. Monitoring and alerting live. Enterprise sales-ready.

---

# PHASE 5 — Production Launch & Beta Customers
## Weeks 12–14 | Days 78–84+

**Phase Goal:** Production environment deployed. First 3–5 beta customers onboarded. Monitoring live. Platform generating revenue.

---

### Week 12 — Days 78–80: Production Deployment

**Day 78 — Production AWS Setup:**
- Run Terraform for production environment (separate from staging)
- RDS in Multi-AZ (automatic failover), ElastiCache with cluster mode
- CloudFront with custom domain `app.yourplatform.com` and `api.yourplatform.com`
- ACM SSL certificates; Route 53 DNS configuration
- AWS Secrets Manager with production secrets
- Separate OpenAI API key for production (no $50 cap)

**Day 79 — Production Deployment:**
- Deploy production Docker images via GitHub Actions production workflow
- Run Prisma migrations against production DB (expand-contract pattern — additive changes only)
- Seed demo company for onboarding showcasing
- Stripe production mode: activate live keys, configure webhooks for production URL
- SendGrid production: verify sending domain (SPF, DKIM, DMARC)

**Day 80 — Production Smoke Tests:**
- Run Playwright E2E suite against production
- Verify: registration, job creation, application submission, AI scoring, Stripe checkout
- Verify email delivery from production SendGrid (not MailHog)
- Verify WebSocket connections work through CloudFront/ALB
- Activate Sentry for production, Posthog for analytics

---

### Week 13 — Days 81–82: Beta Customer Onboarding

**Day 81 — Onboarding Flow:**
- Build onboarding wizard for new companies (post-registration):
  - Step 1: Company logo upload, timezone selection
  - Step 2: Invite first team member
  - Step 3: Create first job (guided)
  - Step 4: "Try AI scoring" — upload sample resume to see AI in action
- Progress saved, onboarding resumes if interrupted
- Onboarding completion = "Aha Moment" → triggers Posthog funnel event

**Day 82 — First 3 Beta Customers:**
- Onboard first beta customers personally
- Provide: live demo call, custom onboarding, dedicated Slack channel for support
- Set up 5-email trial sequence (Posthog automated):
  - Day 1: Welcome + quick start guide
  - Day 3: "Have you tried AI scoring?" with screen recording
  - Day 7: Case study + tips for getting value from bias detection
  - Day 10: "Book a call" offer from founder
  - Day 14: Trial ending + upgrade CTA

---

### Week 14 — Days 83–84: Iteration & Roadmap

**Day 83 — First Week Feedback Loop:**
- Review Posthog funnels: where are users dropping off?
- Review Sentry errors: any recurring issues?
- Review CloudWatch: any endpoints consistently slow?
- Schedule feedback calls with each beta customer

**Day 84 — Post-Launch Roadmap Planning:**
- Analyze which P1 features customers use most
- Prioritize P2 feature backlog based on customer requests
- Plan technical debt sprints (database indexing review, test coverage gaps)
- Document onboarding learnings for future customers

**✅ Phase 5 Deliverable:** Platform live in production. 3+ beta customers onboarded. Revenue flowing via Stripe. Monitoring and alerting operational. Feedback loop established.

---

## Full Week-by-Week Summary

| Week | Focus | Key Deliverable |
|---|---|---|
| 1 | Monorepo, schema, auth core | RS256 JWT auth + refresh rotation |
| 2 | Tenant middleware, RBAC, jobs CRUD | Multi-tenant enforced, jobs backend |
| 3 | Kanban, AI parse + score pipeline | Real-time Kanban with AI scoring |
| 4 | Notifications, bias detection, auth pages | Full frontend auth, notifications |
| 5 | Interviews, offers, Stripe billing | Complete hiring lifecycle, billing live |
| 6 | Analytics, CSV export, bulk ops | Analytics dashboard, bulk operations |
| 7 | AWS Terraform, CI/CD pipeline | Staging deployed end-to-end |
| 8 | Integration tests, performance | MVP verified, sub-200ms API |
| 9 | Security audit, MFA, OWASP ZAP | Security hardened |
| 10 | GDPR export/erasure, audit log UI | GDPR compliant, enterprise-ready |
| 11 | Load testing, Redis caching, monitoring | 200+ concurrent users supported |
| 12 | Production AWS, SSL, production deploy | Production live |
| 13 | Beta customer onboarding | 3 paying customers |
| 14 | Feedback, iteration, roadmap | Feedback loop established |

---

## Recommended Build Order (Strict Dependency Order)

```
1. Database schema + Prisma + tenant middleware  ← Foundation for everything
2. Authentication (JWT rotation + RBAC)           ← Required by every subsequent feature
3. Company + user management + invitations        ← Required to add team members for testing
4. Jobs CRUD + pipeline stages                    ← Entry point for the core workflow
5. Application submission + S3 upload             ← Connects the external world
6. BullMQ + AI pipeline (parse + score)           ← Core differentiator — takes most iteration
7. Kanban board + WebSocket real-time             ← Primary recruiter interface
8. Stripe billing                                 ← Required before any customer goes live
9. Email notifications                            ← Required for professional feel
10. Interview + offer management                  ← Completes the hiring lifecycle
11. Analytics dashboard                           ← Completes the management interface
12. Security hardening + GDPR compliance          ← Required before production launch
```

> [!CAUTION]
> **Do NOT build** the Chrome extension, mobile app, video interview analysis, or API marketplace before you have 50 paying customers. Every hour spent on those features is an hour not spent on retaining your first customers.

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| OpenAI returns malformed JSON | High | Medium | Use `response_format: json_object` + Zod validation + retry logic |
| OpenAI API outage | Low | High | Circuit breaker pattern; queue jobs during outage; retry with backoff |
| AI costs spike at scale | Medium | High | Cache identical job+candidate pairs; batch processing; evaluate fine-tuned models at 10k users |
| Tenant isolation breach | Low | Critical | Prisma middleware + integration test suite that specifically attacks isolation |
| Stripe webhook fires twice | Medium | Medium | Idempotency key stored per Stripe event ID |
| BullMQ poison pill job | Medium | Medium | `UnrecoverableError` for Zod validation failures (no retry); dead letter queue for others |
| Zero-downtime Prisma migrations | Medium | High | Expand-contract pattern: additive columns only, no NOT NULL without defaults |
| Socket.io multi-instance issue | Low | Medium | Redis pub/sub adapter configured from Day 14 |
| GDPR/AI compliance (EU AI Act) | Medium | High | Bias detection is advisory only; explainable scores; disclosure in candidate portal |

---

## Cost Projections

| Scale | Monthly Infra | OpenAI | Total | Revenue | Gross Margin |
|---|---|---|---|---|---|
| 100 users / 10 companies | ~$130 | ~$6 | ~$140 | $990 ($99/mo avg) | ~86% |
| 1,000 users / 100 companies | ~$480 | ~$60 | ~$555 | $15,000 ($150/mo avg) | ~96% |
| 10,000 users / 1,000 companies | ~$1,650 | ~$3,000 | ~$4,800 | $200,000 ($200/mo avg) | ~97% |

> [!TIP]
> At 10,000+ users, OpenAI costs become the dominant cost center. At this scale, evaluate fine-tuned local models (Llama, Mistral) to reduce AI costs by 60–80% while maintaining quality.
