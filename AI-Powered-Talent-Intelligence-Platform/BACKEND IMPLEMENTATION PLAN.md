# BACKEND IMPLEMENTATION PLAN — PROFESSIONAL REVIEW AND OPTIMIZATION

---

## CRITICAL ISSUES TO FIX FIRST

Before anything else, three architectural problems in the current plan will cause production failures if not addressed.

**Problem 1: AsyncLocalStorage is missing from the tenant middleware plan.**

The plan mentions reading companyId from AsyncLocalStorage in the Prisma middleware but never explains how to set it. Without this, the tenant scoping silently breaks and every query hits all tenant data.

The fix: in your tenant middleware, wrap every request in an AsyncLocalStorage run call that carries the companyId. The Prisma middleware then reads from that store. If the store is empty (a public route), the middleware does nothing. This is the correct pattern.

**Problem 2: The worker process shares no AppModule context with the API.**

The plan says worker.ts bootstraps a WorkerAppModule but never defines what that module imports. If the worker imports AiModule and AiModule imports PrismaModule and WebsocketsGateway, but the gateway requires a running HTTP server, the worker crashes on boot.

The fix: create a dedicated WorkerAppModule that imports only PrismaModule, MongoModule, AiModule (processors only), NotificationsModule (for email sending), and StorageModule. It must explicitly exclude AuthModule, BillingModule, and WebsocketsModule. The gateway should be injected as a service dependency only, and the worker should emit events to Redis pub/sub that the API process picks up and forwards to Socket.io clients.

**Problem 3: Stripe webhook endpoint must receive raw body, not parsed JSON.**

The plan mentions this but the NestJS default body parser will parse it before it reaches the controller. If you use the global ValidationPipe with transform enabled, Stripe signature verification will always fail.

The fix: in main.ts, configure the raw body middleware only for the billing webhook path before the global body parser is applied.

---

## MODULE 1: PROJECT BOOTSTRAP

**Current plan gaps:**

The plan does not specify the main.ts configuration. This is where you set global pipes, interceptors, filters, CORS, Helmet, raw body handling, and the Pino logger. Getting this wrong means rework on every subsequent module.

**Complete main.ts specification:**

Configure app with: NestExpressApplication platform. Enable CORS with origin set to FRONTEND_URL from config, credentials true. Apply Helmet with Content-Security-Policy headers. Apply global ValidationPipe with transform true, whitelist true, forbidNonWhitelisted true. Apply global ResponseTransformInterceptor. Apply global AllExceptionsFilter. Apply global AuditLogInterceptor (logs all mutations). Configure raw body capture for /api/v1/billing/webhook path before global JSON parser. Configure Pino logger with HTTP middleware. Set global prefix to api/v1. Listen on PORT from config.

**nest-cli.json must include:**

Set assets to include the templates folder so Handlebars files are copied to dist on build. Without this, SendGrid emails crash in production because the hbs files are not in dist.

---

## MODULE 2: CONFIGURATION

**Current plan gap:** No config module definition. Env variables are referenced but never validated at startup. A missing OPENAI_API_KEY causes a cryptic null pointer error on the first AI job, not a helpful startup crash.

**Add a validated ConfigModule:**

Use @nestjs/config with a Joi validation schema. Define every environment variable with its type, whether it is required or optional, and its default value. The validation runs at startup. If DATABASE_URL is missing, the app refuses to start with a clear message. This is the professional approach.

Group configs into namespaces: database, redis, jwt, google, openai, aws, sendgrid, stripe. Each namespace is a config factory function that reads from process.env. Inject them via ConfigService.get with the namespaced key.

---

## MODULE 3: PRISMA SERVICE

**Current plan gaps:** The plan shows a basic Prisma middleware but is missing connection management, query logging, and soft delete handling.

**Improved PrismaService:**

In onModuleInit, call this.$connect(). In onModuleDestroy, call this.$disconnect(). Add a query event listener in development that logs slow queries over 200ms to the Pino logger with the query text and duration. This catches N+1 problems during development.

For soft deletes, add a second middleware entry that filters deletedAt: null on all findMany and findFirst calls for the Company and User models. This prevents deleted records from appearing without requiring every query to remember to filter them.

**Idempotency middleware (missing from plan entirely):**

Add a mechanism to detect duplicate write operations. When a resume upload webhook fires twice from S3, you need the second createApplication call to be a no-op. The correct pattern: accept an idempotency key header on all POST endpoints that create resources. Store the key in Redis with the response for 24 hours. On duplicate key, return the cached response immediately without hitting the database.

---

## MODULE 4: AUTH MODULE

**Improvements:**

**Register endpoint:** The current plan creates the company and user in two separate operations. If the user creation fails after the company is created, you have an orphaned company record. Wrap both operations in a Prisma transaction using prisma.$transaction. Either both succeed or both roll back.

**Password hashing:** bcrypt at cost 12 is correct but slow (300ms). This is intentional for security but means your login endpoint takes 300ms minimum. That is acceptable. Do not reduce the cost factor.

**Refresh token storage:** The plan stores the token hash. Correct. But it does not specify the hashing algorithm. Use SHA-256 via Node's built-in crypto module, not bcrypt. Bcrypt is for passwords (intentionally slow). SHA-256 is for tokens (should be fast since the token itself is already a cryptographically random UUID).

**Account lockout:** The plan locks after 10 failures for 30 minutes using a Redis counter. This is correct. Add one detail: when you reset failedLogins on successful login, also delete the Redis lockout key. Otherwise a user who recovers via waiting and then logs in successfully still has stale lockout data.

**Missing endpoint — POST /api/v1/auth/verify-email:** The plan creates users with emailVerified: false but never defines the email verification flow. Add: on register, generate a verification token, store in Redis with 24-hour TTL, send verification email. Add GET /api/v1/auth/verify-email?token=xxx endpoint that marks the user as verified. Restrict certain actions (creating jobs, inviting users) to verified accounts only.

**JWT strategy optimization:** The current plan loads the user from the database on every request. At 10,000 users this is 10,000 database reads per second of API traffic. Add a Redis cache with 60-second TTL: on JWT validation, check Redis first. Cache miss hits the database and populates Redis. Cache invalidation: when user role or isActive changes, delete their Redis cache key.

---

## MODULE 5: TENANT MIDDLEWARE

This is the most important security component in the entire system. The current plan is underspecified.

**Complete implementation specification:**

Create a custom NestJS ClsModule (Continuation-Local Storage) or use AsyncLocalStorage directly. The tenant middleware is an NestJS middleware that runs after JWT validation. It reads user.companyId from the request object (set by JwtStrategy) and calls AsyncLocalStorage.run with a store containing companyId. All downstream code (services, repositories, Prisma middleware) reads from this store.

**Critical edge cases not in the current plan:**

Public routes (application submission, job listing, Google OAuth callback) do not have a companyId in the request. The tenant middleware must detect this and set the store to null. The Prisma middleware must check if the store is populated before appending the company filter. Do not throw an error for null store on public routes.

Super admin routes need special handling. A super_admin user's queries should NOT be tenant-scoped. Add a check: if user.role === super_admin, skip the tenant filter.

Add a controller-level guard that validates cross-tenant access on direct ID lookups. When a recruiter calls GET /api/v1/applications/some-uuid, the Prisma middleware scopes the underlying query correctly. But add an explicit check after the fetch: if the returned resource's companyId does not match the authenticated user's companyId, throw a NotFoundException (not a ForbiddenException, to prevent resource enumeration). This is defense in depth.

---

## MODULE 6: JOBS MODULE

**Missing from current plan:**

**Career page slug generation:** When a job is created, generate a URL-safe slug from the job title and a short random suffix. Example: senior-software-engineer-x7k2. This must be unique within the company. Store it and use it for the public career page URL.

**Application count in list response:** The GET /api/v1/jobs endpoint must return application counts per stage for each job. The naive implementation runs N+1 queries (one per job). The correct implementation uses a single Prisma query with _count: { applications: true } and a select on currentStageId. Do not loop and query.

**Publish validation:** Before publishing a job, validate: title is not empty, description is at least 100 characters, at least one skill or requirement is defined. Return 422 with specific field errors if validation fails, not 500.

**Soft delete behavior:** The plan says soft delete if no applications, hard close if applications exist. This is wrong — hard deleting a job with applications breaks foreign key constraints and destroys hiring history. The correct behavior: soft delete the job by setting deletedAt regardless of application status. Applications remain intact and accessible via their own routes.

---

## MODULE 7: APPLICATIONS MODULE

**Critical missing piece — duplicate application prevention:**

The current plan allows a candidate to apply to the same job multiple times. Add a unique constraint check before creating an application: if an application with the same candidateId and jobId already exists and status is active, return 409 with { code: 'DUPLICATE_APPLICATION' }.

**Resume upload race condition:**

The current flow is: upload to S3, create application record, enqueue parse job. If the S3 upload succeeds but the database write fails, you have an orphaned file in S3 and no application record. If the parse job fires before the transaction commits, it finds no application record.

The correct flow: create application record first with resumeParsed: false and a pending status. Then upload to S3. Then update the application record with the resumeUrl. Then emit the ApplicationCreated event. The event triggers the queue enqueue. If S3 upload fails, the application record exists but resumeParsed remains false and the recruiter sees a "resume processing failed" state.

**Stage movement validation:**

The current plan moves candidates to any stage. Add validation: a candidate cannot be moved to a stage that belongs to a different job's pipeline. Validate that the target stageId's jobId matches the application's jobId (for job-specific stages) or that it is a company default stage.

**Bulk operations:**

The current plan enqueues bulk operations as a job. Add a result mechanism: when bulk operation completes, emit a WebSocket event with { jobId, succeeded: [], failed: [], errors: {} }. The frontend should display a results toast showing how many succeeded and which failed.

**CSV export:**

Use the json2csv library. Stream the response using Node.js streams rather than building the entire CSV in memory. For a company with 10,000 applications, building in memory will crash the process. The controller should set Content-Type to text/csv, Content-Disposition to attachment with a filename, and pipe the CSV stream directly to the response.

---

## MODULE 8: AI PIPELINE

This is the most complex module. The current plan is good but missing several production-critical details.

**Retry logic specification:**

BullMQ has built-in retry. Configure each queue with: attempts: 3, backoff: { type: 'exponential', delay: 2000 }. This means: first retry after 2 seconds, second after 4 seconds. After 3 failures, the job moves to the failed queue (dead letter).

Add a dead letter queue handler: when a job fails all retries, update the application record to indicate the failure (aiScore remains null, add a flag resumeParseError: true) and send a notification to the recruiter: "We could not process this resume automatically. Please review manually."

**Poison pill protection:**

A poison pill is a job that always fails regardless of retries (malformed PDF, OpenAI refusing the content). BullMQ's failed queue holds these. Add a scheduled job that runs daily and notifies the super admin of any jobs stuck in the failed queue for more than 24 hours with a count and the error messages.

**Circuit breaker for OpenAI:**

If OpenAI is down or rate-limited, all 5 queues will fail simultaneously and hammer retry attempts. Implement a circuit breaker using the opossum library. After 5 consecutive OpenAI failures within 60 seconds, open the circuit. While open (30-second timeout), new AI jobs immediately fail without calling OpenAI, preserving rate limit recovery. On half-open, allow one test request. If it succeeds, close the circuit.

**Token cost tracking:**

The plan mentions storing openaiTokensUsed in MongoDB. Add a daily aggregation job that sums tokens used per company and writes to a usage_metrics table in PostgreSQL. This data powers the billing AI credits quota and the admin dashboard cost analysis.

**Prompt versioning:**

The plan mentions modelVersion in the MongoDB schemas. Implement this: each prompt file exports a VERSION constant (e.g., 'resume-parse-v1.2'). Store it with every AI output. When you improve a prompt, bump the version. This lets you query "show me all scores generated with the old prompt" and trigger a reprocessing job. The admin dashboard should show the distribution of scores by prompt version.

**Resume parse failure handling:**

Some PDFs are scanned images with no extractable text. pdf-parse will return an empty string. Before calling OpenAI, check if the extracted text length is under 100 characters. If so, do not call OpenAI (waste of tokens). Instead, mark the application with a parseError flag and notify the recruiter to upload a text-based PDF.

**OpenAI response validation:**

The plan says validate with Zod. Correct. But OpenAI occasionally returns JSON that is valid but semantically wrong (e.g., overallScore: 150, or explanation as an object instead of an array). Your Zod schemas must be strict. Use z.number().min(0).max(100) for scores. Use z.array(z.string()).min(3).max(10) for explanation arrays. On Zod validation failure, log the raw OpenAI response to Sentry and fail the job so it retries.

---

## MODULE 9: INTERVIEWS MODULE

**Missing from plan — calendar token management:**

Google Calendar integration requires storing OAuth tokens per user. The plan does not specify where these are stored. Store them in Redis with the key google_oauth_tokens:userId, encrypted using AES-256. The token includes access_token, refresh_token, and expiry. On each calendar API call, check if the access_token is expired (Google tokens expire in 1 hour) and refresh it automatically before the API call.

**Interview kit persistence:**

The plan has interview questions stored in MongoDB. Add a feature: when a question set is generated for a job, cache it so subsequent interviews for the same job reuse it rather than calling OpenAI again. Only regenerate if the recruiter explicitly requests a refresh.

**Scorecard aggregation:**

When GET /api/v1/interviews/:id/scorecards is called, compute an aggregated rating on the fly. Average the per-criterion ratings across all scorecards. Return both individual scorecards and the aggregated view in a single response. The frontend expects this structure.

---

## MODULE 10: OFFERS MODULE

**PDF generation approach:**

The plan suggests PDFKit. For formatted offer letters with company branding, PDFKit requires writing layout code manually. A better approach: use a Handlebars HTML template rendered to a string, then convert to PDF using the puppeteer library in headless mode. This lets you create visually polished offer letters using HTML and CSS. Cache the Puppeteer browser instance — launching a new browser per PDF is slow (800ms). Use a single browser instance with multiple pages.

**Offer expiry job:**

The plan mentions a daily offer expiry check job. Specify it completely: runs at 8 AM UTC daily, finds all offers where status is sent and expiryDate is before now, updates them to expired, sends a notification to the recruiter. Also add a warning job: 48 hours before expiry, notify the recruiter that an offer is expiring soon.

**E-signature:**

The plan does not mention how candidates sign. For v1, implement a simple approach: generate a unique candidate portal token, embed it in the offer email link. The portal page shows the offer letter and two buttons (Accept / Decline). No third-party e-signature in v1. Document this limitation and plan DocuSign integration for v2.

---

## MODULE 11: NOTIFICATIONS MODULE

**Missing architecture detail — notification deduplication:**

If a recruiter has 10 browser tabs open, they should not receive 10 copies of each WebSocket notification. The WebSocket gateway must track which socket IDs belong to each userId and emit only once per user, not once per connection.

**Email deliverability:**

The plan uses SendGrid. Add: configure a custom from domain (talent@yourcompany.com, not noreply@sendgrid.net). This requires DNS SPF, DKIM, and DMARC records. Document this in the README as a required DNS setup step. Without it, emails land in spam.

**Notification preferences:**

Add a notification_preferences table linked to users. Columns: userId, type (email or in_app or both), enabled, and the notification category (new_application, stage_moved, interview_scheduled, etc.). The NotificationsService checks preferences before sending. Default: all enabled.

---

## MODULE 12: WEBSOCKET GATEWAY

**Missing — horizontal scaling:**

The plan mentions Redis pub/sub for horizontal scaling but does not specify how. When the API runs as 3 ECS tasks, a WebSocket event emitted on task 1 only reaches clients connected to task 1. Clients on tasks 2 and 3 miss it.

The fix: use the @nestjs/socket.io Redis adapter. Install socket.io-redis. In the WebsocketsModule, configure the gateway with the Redis adapter. When emitToCompany is called on any task, it publishes to a Redis channel. The Redis adapter on all tasks receives it and emits to their local connected clients. This makes WebSocket scaling completely transparent.

**Reconnection handling:**

On client reconnect (browser tab reopened after sleep), the frontend should request any notifications generated while it was offline. Add a REST endpoint GET /api/v1/notifications?since=timestamp that the frontend calls on WebSocket reconnect. This fills in the gap.

---

## MODULE 13: BILLING MODULE

**Missing — plan limit enforcement in detail:**

The current plan checks quotas in the SubscriptionGuard. Specify what counts as an AI credit: one resume parse plus one candidate score together count as one credit. Bias detection does not consume credits. Interview question generation does not consume credits. Only candidate scoring counts.

Track quota usage in Redis with a monthly counter keyed by companyId and year-month. On the first day of each month, reset all counters. Increment by 1 on each successful candidate score. The SubscriptionGuard reads this counter and compares to the plan limit.

**Stripe price ID mapping:**

The plan has STRIPE_STARTER_PRICE_ID etc. as env variables. Add a plan_limits configuration object in code (not database) that maps Stripe price IDs to plan names and feature limits. This is the single source of truth. Both the subscription guard and the billing webhook handler use it.

**Trial handling:**

On company registration, create a Stripe customer but do not create a subscription. Set company.subscriptionStatus to trialing and company.plan to growth (trial gets growth features). Store a trialEndsAt date (14 days from registration). On trial end, run a scheduled job that downgrades to starter if no subscription exists and sends a "your trial has ended" email.

---

## MODULE 14: ANALYTICS MODULE

**N+1 query problem:**

The current plan runs analytics queries at request time against the main tables. For a company with 5,000 applications, the pipeline funnel query joins applications, stage_history, and stages tables and runs aggregations. This will take 2-5 seconds.

The correct approach for v1: the nightly snapshot job pre-computes all analytics. The GET /api/v1/analytics endpoints read only from the analytics_snapshots table (fast key-value lookups). For real-time counts (today's applications, current stage counts), use lightweight queries with proper indexes. Never run full aggregations on the main tables at request time.

**Analytics data shape:**

The plan says to return a shape matching analytics.types.ts exactly. Add a versioned analytics response with a cache-control header of 5 minutes. The frontend TanStack Query uses this to avoid refetching the full analytics dataset on every navigation. Analytics data should also be served with an ETag so the browser can use conditional GET requests.

---

## MODULE 15: GDPR AND COMPLIANCE

**Missing from the plan entirely:**

Add these endpoints before launch. They are legally required in the EU and increasingly required globally.

GET /api/v1/users/me/export-data: Exports all data associated with the authenticated user. Gathers from PostgreSQL (user record, applications, notes, scorecards), MongoDB (parsed resume, AI scores), and S3 (list of file keys). Packages into a ZIP file using the archiver library. Returns a download link (uploaded to S3 with 24-hour expiry). Because this takes time, implement it as an async job. Return 202 immediately and email the user when the export is ready.

DELETE /api/v1/users/me/delete-account: Implements right to erasure. Anonymizes the user record (replaces email, name with placeholder values), deletes the passwordHash and googleId, hard deletes all refresh tokens, deletes MongoDB documents for this user's applications, deletes S3 files (resume PDFs), marks the user as isActive: false. Does NOT delete the application records themselves (needed for audit trail) but removes all PII from them.

POST /api/v1/admin/gdpr/erasure-request: For company admins to initiate erasure on behalf of a candidate who requests it. Same process as above but initiated by admin rather than user.

Audit log retention: The plan mentions 3-year retention. Add a scheduled job that runs monthly and archives audit logs older than 3 years to S3 Glacier and deletes them from PostgreSQL. Use PostgreSQL table partitioning by month for the audit_logs table so monthly archival is a simple partition detach operation rather than a DELETE query on millions of rows.

---

## MODULE 16: ERROR HANDLING

**Global exception filter — missing details:**

The AllExceptionsFilter must handle: PrismaClientKnownRequestError (convert to appropriate HTTP errors — P2002 unique constraint becomes 409, P2025 record not found becomes 404), PrismaClientValidationError (becomes 422), ZodError (becomes 422 with field details), JsonWebTokenError (becomes 401), and generic Error (becomes 500 with a requestId for log correlation).

Every error response must follow the standard shape specified in the blueprint: { status, code, message, details, requestId }.

Log all 500 errors to Sentry with: user ID, company ID, request body (with PII fields redacted), and the stack trace.

**Request ID correlation:**

Generate a UUID for every incoming request in the logger middleware. Attach it to the response header as X-Request-ID. Include it in every log line. Include it in every error response. This lets you correlate a user-reported error (they see the requestId in the UI) with a specific log entry in CloudWatch.

---

## MODULE 17: CANDIDATE PORTAL

**Security — portal token design:**

The plan mentions a portal token but does not specify its properties. Use a cryptographically random UUID (not a sequential ID) generated at application creation. Store it hashed (SHA-256) in the applications table. When the candidate accesses their status page, the unhashed token in the URL is hashed and compared. The token does not expire. It can only be used to read the status of that specific application, not to perform any write actions except offer response. This is not a full authentication system — it is a capability token scoped to a single resource.

---

## MISSING MODULES NOT IN PLAN

**Rate limiting — needs full specification:**

Use @nestjs/throttler. Configure three rate limit tiers: general API endpoints at 100 requests per minute per user, auth endpoints at 10 per minute per IP, file upload endpoints at 20 per hour per user. Store throttle state in Redis (not in-process memory, which does not work with multiple ECS tasks). Add a custom rate limit exceeded response with a Retry-After header.

**Health check endpoint:**

Add GET /api/v1/health (public). Checks PostgreSQL connection (run SELECT 1), Redis connection (run PING), MongoDB connection (run db.admin().ping()). Returns { status: 'ok' or 'degraded', services: { postgres, redis, mongodb }, responseTimeMs }. Used by Better Uptime and by the ECS health check. If any service check takes more than 2 seconds, return 503 with status degraded.

**Seed script:**

Add a prisma/seed.ts that creates a demo company with realistic data: one company admin, two recruiters, three jobs (one published, one draft, one closed), 15 applications across various stages, five interviews, two scorecards, one pending offer. This seed data makes demos and development significantly easier. Document how to run it in the README.

**Request logging middleware:**

Every HTTP request should log: method, path, statusCode, durationMs, userId, companyId, requestId. Log at INFO level for 2xx and 3xx, WARN for 4xx, ERROR for 5xx. Use Pino's serializers to format the log output consistently.

---

## EXECUTION ORDER CORRECTIONS

The current week-by-week plan has some sequencing issues. Corrected order:

Week 1: Docker Compose, Prisma schema, ConfigModule with validation, PrismaService with tenant middleware and AsyncLocalStorage, health check endpoint, global exception filter, request logging.

Week 2: Auth module (register, login, refresh, logout, password reset). JWT strategy. Tenant middleware complete. Rate limiting on auth endpoints. Email verification flow.

Week 2-3: Users module, RBAC guards, invitation flow, Google OAuth.

Week 3: Jobs module, pipeline stages, AI description endpoint (synchronous). Companies module. Subscription guard (plan limits only, no Stripe yet).

Week 4: Storage module (MinIO local, S3 production). Applications module (submit, stage movement, notes). Resume upload flow. Idempotency keys.

Week 5: BullMQ setup, worker.ts entrypoint. Resume parse processor. Candidate scoring processor. WebSocket gateway with Redis adapter. Real-time score updates end-to-end test.

Week 6: Bias detection processor. Interview questions processor. Sentiment analysis processor. Notifications module with all email templates. SendGrid integration (MailHog for local dev).

Week 7: Interviews module including scheduling and scorecards. Google Calendar integration. Offers module with PDF generation.

Week 8: Stripe billing module including checkout, portal, and webhooks. Subscription guard with actual quota checking.

Week 9: Analytics module, nightly aggregation job, offer expiry job, trial expiry job.

Week 10: Candidate portal endpoints with capability token. GDPR export and deletion endpoints. CSV export with streaming.

Week 11: End-to-end testing of the complete flow. Frontend wiring (replacing all mocks). Performance testing of AI queue throughput. Security review.

---

## ENVIRONMENT VARIABLE ADDITIONS

The current .env.example is missing several variables:

Add: TRIAL_DURATION_DAYS (default 14), MAX_FILE_SIZE_MB (default 10), ALLOWED_FILE_TYPES (default pdf,doc,docx), CORS_ORIGIN (the frontend URL), SESSION_SECRET (for OAuth state), ENCRYPTION_KEY (32-byte hex for AES-256 used on Google OAuth tokens), SENTRY_DSN (for error tracking), POSTHOG_API_KEY (for product analytics), CRON_SECRET (a secret used to authenticate cron endpoint triggers from external schedulers), PUPPETEER_EXECUTABLE_PATH (for PDF generation in Docker, must point to Chromium binary).

---

## FINAL QUALITY CHECKLIST

Before considering the backend complete, verify each item:

All endpoints return the standard error shape on failure. No endpoint returns a raw Prisma error or stack trace. The tenant middleware cannot be bypassed on any route that accesses tenant data. All file uploads validate magic bytes, not just extension. All AI jobs have retry logic, dead letter handling, and circuit breaker protection. The Stripe webhook validates the signature before processing. Refresh tokens are hashed in the database. The resume CSV export streams rather than loading everything into memory. All scheduled jobs are idempotent (safe to run twice without double-counting). The health check passes before the application registers with the load balancer. All Handlebars templates are included in the Docker build via nest-cli.json assets configuration. The worker process boots independently of the API process and does not import HTTP-specific modules.





# AI-Powered Talent Intelligence Platform — Backend Implementation Plan

## Overview

Your frontend is a complete Next.js 14 app (in `talentiq/`) with all pages, hooks, stores, and UI components fully built. The entire app currently runs on **mock data in Zustand** — `domain.store.ts` seeds fake jobs/candidates/interviews, and `useAuth.ts` returns a hardcoded user after 800ms. This plan replaces all of that with a **real, production-grade NestJS backend** that connects to PostgreSQL, MongoDB, Redis, and external APIs.

The backend lives at `http://localhost:3001`, matching the `NEXT_PUBLIC_API_URL` already configured in your `.env.example`. Every frontend hook (`useJobs`, `useApplications`, `useAuth`, etc.) already calls `api.ts` — so the frontend wiring is already done. You just need to build the server it talks to.

---

## Architecture Decision Summary

| Concern | Decision | Reason |
|---|---|---|
| Framework | NestJS (TypeScript) | Matches README spec; module system maps cleanly to domain boundaries |
| Primary DB | PostgreSQL via Prisma ORM | Type-safe, migration-managed, tenant isolation via middleware |
| Document DB | MongoDB via Mongoose | AI outputs, parsed resumes — schema changes frequently |
| Queue | BullMQ on Redis | 5 AI queues; separate worker process so API latency is unaffected |
| Real-time | Socket.io | Already wired on frontend (`socket.ts`) |
| Auth | JWT + Passport (15 min access / 30 day refresh) + Google OAuth | Already expected by frontend `auth.ts` |
| AI | OpenAI (gpt-4o-mini + gpt-4o) | Per README spec |
| File Storage | AWS S3 (or local MinIO in dev) | Resume PDFs, offer letters |
| Email | SendGrid | Per README spec |
| Billing | Stripe | Per README spec |
| Monorepo strategy | Single repo: `talentiq/` (frontend) + `backend/` (NestJS) | Keeps it simple at this stage |

---

## Proposed Folder Structure

```
AI-Powered Talent Intelligence Platform/
├── talentiq/                          ← Existing Next.js frontend (unchanged)
├── backend/                           ← NEW: NestJS backend
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── refresh-token.repository.ts
│   │   │   │   ├── strategies/
│   │   │   │   │   ├── jwt.strategy.ts
│   │   │   │   │   └── google.strategy.ts
│   │   │   │   ├── guards/
│   │   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   │   └── role.guard.ts
│   │   │   │   └── dto/
│   │   │   │       ├── login.dto.ts
│   │   │   │       ├── register.dto.ts
│   │   │   │       └── refresh-token.dto.ts
│   │   │   ├── users/
│   │   │   │   ├── users.module.ts
│   │   │   │   ├── users.controller.ts
│   │   │   │   ├── users.service.ts
│   │   │   │   ├── users.repository.ts
│   │   │   │   └── dto/
│   │   │   │       ├── update-user.dto.ts
│   │   │   │       └── invite-user.dto.ts
│   │   │   ├── companies/
│   │   │   │   ├── companies.module.ts
│   │   │   │   ├── companies.service.ts
│   │   │   │   └── companies.repository.ts
│   │   │   ├── jobs/
│   │   │   │   ├── jobs.module.ts
│   │   │   │   ├── jobs.controller.ts
│   │   │   │   ├── jobs.service.ts
│   │   │   │   ├── jobs.repository.ts
│   │   │   │   └── dto/
│   │   │   │       ├── create-job.dto.ts
│   │   │   │       └── update-job.dto.ts
│   │   │   ├── applications/
│   │   │   │   ├── applications.module.ts
│   │   │   │   ├── applications.controller.ts
│   │   │   │   ├── applications.service.ts
│   │   │   │   ├── applications.repository.ts
│   │   │   │   └── dto/
│   │   │   │       ├── create-application.dto.ts
│   │   │   │       └── move-stage.dto.ts
│   │   │   ├── interviews/
│   │   │   │   ├── interviews.module.ts
│   │   │   │   ├── interviews.controller.ts
│   │   │   │   ├── interviews.service.ts
│   │   │   │   └── dto/
│   │   │   │       ├── create-interview.dto.ts
│   │   │   │       └── submit-scorecard.dto.ts
│   │   │   ├── offers/
│   │   │   │   ├── offers.module.ts
│   │   │   │   ├── offers.controller.ts
│   │   │   │   ├── offers.service.ts
│   │   │   │   └── dto/
│   │   │   │       └── create-offer.dto.ts
│   │   │   ├── analytics/
│   │   │   │   ├── analytics.module.ts
│   │   │   │   ├── analytics.controller.ts
│   │   │   │   ├── analytics.service.ts
│   │   │   │   └── jobs/
│   │   │   │       └── aggregate-analytics.job.ts
│   │   │   ├── notifications/
│   │   │   │   ├── notifications.module.ts
│   │   │   │   ├── notifications.controller.ts
│   │   │   │   ├── notifications.service.ts
│   │   │   │   └── templates/
│   │   │   │       ├── application-received.hbs
│   │   │   │       ├── interview-scheduled.hbs
│   │   │   │       ├── offer-sent.hbs
│   │   │   │       ├── stage-moved.hbs
│   │   │   │       └── invite-user.hbs
│   │   │   ├── billing/
│   │   │   │   ├── billing.module.ts
│   │   │   │   ├── billing.controller.ts
│   │   │   │   └── billing.service.ts
│   │   │   ├── ai/
│   │   │   │   ├── ai.module.ts
│   │   │   │   ├── ai.service.ts
│   │   │   │   ├── processors/
│   │   │   │   │   ├── resume-parse.processor.ts
│   │   │   │   │   ├── candidate-scoring.processor.ts
│   │   │   │   │   ├── bias-detection.processor.ts
│   │   │   │   │   ├── interview-questions.processor.ts
│   │   │   │   │   └── sentiment-analysis.processor.ts
│   │   │   │   └── prompts/
│   │   │   │       ├── resume-parse.prompt.ts
│   │   │   │       ├── candidate-scoring.prompt.ts
│   │   │   │       ├── bias-detection.prompt.ts
│   │   │   │       └── interview-questions.prompt.ts
│   │   │   ├── storage/
│   │   │   │   ├── storage.module.ts
│   │   │   │   └── storage.service.ts
│   │   │   └── websockets/
│   │   │       ├── websockets.module.ts
│   │   │       └── websockets.gateway.ts
│   │   ├── common/
│   │   │   ├── middleware/
│   │   │   │   ├── tenant.middleware.ts
│   │   │   │   └── logger.middleware.ts
│   │   │   ├── decorators/
│   │   │   │   ├── current-user.decorator.ts
│   │   │   │   ├── public.decorator.ts
│   │   │   │   └── roles.decorator.ts
│   │   │   ├── filters/
│   │   │   │   └── all-exceptions.filter.ts
│   │   │   ├── interceptors/
│   │   │   │   └── response-transform.interceptor.ts
│   │   │   └── guards/
│   │   │       └── subscription.guard.ts
│   │   ├── config/
│   │   │   ├── database.config.ts
│   │   │   ├── ai.config.ts
│   │   │   ├── aws.config.ts
│   │   │   ├── stripe.config.ts
│   │   │   └── mail.config.ts
│   │   ├── prisma/
│   │   │   ├── prisma.module.ts
│   │   │   ├── prisma.service.ts
│   │   │   └── schema.prisma
│   │   ├── mongo/
│   │   │   ├── schemas/
│   │   │   │   ├── parsed-resume.schema.ts
│   │   │   │   ├── candidate-score.schema.ts
│   │   │   │   ├── interview-questions.schema.ts
│   │   │   │   └── bias-report.schema.ts
│   │   │   └── mongo.module.ts
│   │   ├── worker.ts               ← BullMQ worker entrypoint (separate process)
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── Dockerfile
├── docker-compose.yml               ← PostgreSQL + MongoDB + Redis + MinIO + MailHog
└── docker-compose.override.yml      ← Local dev extras
```

---

## Phase 1 — Project Bootstrap & Database Foundation (Week 1)

### Step 1.1 — Initialize NestJS Project

**Create `backend/` directory with:**
```bash
npm i -g @nestjs/cli
nest new backend --package-manager npm
```

**Install all dependencies at once:**
```bash
npm install @nestjs/jwt @nestjs/passport @nestjs/config @nestjs/throttler \
  @nestjs/websockets @nestjs/platform-socket.io \
  @nestjs/mongoose @nestjs/bull \
  passport passport-jwt passport-google-oauth20 \
  @prisma/client prisma \
  bullmq bull \
  socket.io \
  mongoose \
  bcryptjs \
  class-validator class-transformer \
  @sendgrid/mail \
  stripe \
  openai \
  aws-sdk \
  multer \
  pdf-parse \
  handlebars \
  pino pino-http \
  uuid \
  date-fns \
  @nestjs/event-emitter
```

---

### Step 1.2 — Prisma Schema (PostgreSQL)

**File: `backend/prisma/schema.prisma`**

This is the single most important file. Get it right first. The full schema includes:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ── COMPANIES ────────────────────────────────────────────────────
model Company {
  id                   String             @id @default(uuid())
  name                 String
  slug                 String             @unique
  plan                 Plan               @default(starter)
  stripeCustomerId     String?            @unique
  stripeSubscriptionId String?            @unique
  subscriptionStatus   SubscriptionStatus @default(trialing)
  maxUsers             Int                @default(5)
  maxJobs              Int                @default(3)
  industry             String?
  size                 String?
  timezone             String             @default("UTC")
  currency             String             @default("USD")
  logoUrl              String?
  careerPageEnabled    Boolean            @default(true)
  portalThemeColor     String             @default("#0ea5e9")
  createdAt            DateTime           @default(now())
  updatedAt            DateTime           @updatedAt
  deletedAt            DateTime?

  users            User[]
  jobs             Job[]
  applications     Application[]
  interviews       Interview[]
  offers           Offer[]
  notifications    Notification[]
  pipelineStages   PipelineStage[]
  analyticsSnaps   AnalyticsSnapshot[]
  auditLogs        AuditLog[]
  emailTemplates   EmailTemplate[]

  @@index([slug])
  @@index([stripeCustomerId])
}

// ── USERS ────────────────────────────────────────────────────────
model User {
  id              String    @id @default(uuid())
  companyId       String
  email           String
  passwordHash    String?
  firstName       String
  lastName        String
  role            UserRole
  isActive        Boolean   @default(true)
  emailVerified   Boolean   @default(false)
  avatarUrl       String?
  googleId        String?   @unique
  failedLogins    Int       @default(0)
  lockedUntil     DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  lastLoginAt     DateTime?

  company          Company        @relation(fields: [companyId], references: [id])
  refreshTokens    RefreshToken[]
  notifications    Notification[]
  assignedApps     Application[]  @relation("AssignedTo")
  createdJobs      Job[]          @relation("CreatedBy")
  movedStages      ApplicationStageHistory[] @relation("MovedBy")
  createdInterviews Interview[]   @relation("CreatedBy")
  scorecards       InterviewScorecard[]
  createdOffers    Offer[]        @relation("CreatedBy")
  auditLogs        AuditLog[]

  @@unique([companyId, email])
  @@index([companyId])
  @@index([googleId])
}

// ── REFRESH TOKENS ───────────────────────────────────────────────
model RefreshToken {
  id          String   @id @default(uuid())
  userId      String
  tokenHash   String   @unique
  expiresAt   DateTime
  revoked     Boolean  @default(false)
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([tokenHash])
  @@index([userId])
}

// ── JOBS ─────────────────────────────────────────────────────────
model Job {
  id                   String         @id @default(uuid())
  companyId            String
  createdById          String
  title                String
  department           String?
  location             String?
  employmentType       EmploymentType @default(full_time)
  remoteType           RemoteType     @default(hybrid)
  description          String         @db.Text
  requirements         String[]
  skills               String[]
  niceToHaveSkills     String[]
  salaryMin            Int?
  salaryMax            Int?
  currency             String         @default("USD")
  status               JobStatus      @default(draft)
  aiDescriptionUsed    Boolean        @default(false)
  biasCheckScore       Int?
  biasCheckResults     Json?
  applicationFormFields Json?
  scoringWeights       Json?
  postedAt             DateTime?
  closedAt             DateTime?
  createdAt            DateTime       @default(now())
  updatedAt            DateTime       @updatedAt
  deletedAt            DateTime?

  company      Company         @relation(fields: [companyId], references: [id])
  createdBy    User            @relation("CreatedBy", fields: [createdById], references: [id])
  applications Application[]
  stages       PipelineStage[]
  interviews   Interview[]

  @@index([companyId, status])
  @@index([companyId])
}

// ── PIPELINE STAGES ──────────────────────────────────────────────
model PipelineStage {
  id          String    @id @default(uuid())
  companyId   String
  jobId       String?
  name        String
  color       String    @default("#2563EB")
  orderIndex  Int
  stageType   StageType @default(screening)
  isDefault   Boolean   @default(false)
  createdAt   DateTime  @default(now())

  company      Company       @relation(fields: [companyId], references: [id])
  job          Job?          @relation(fields: [jobId], references: [id])
  applications Application[]
  stageHistory ApplicationStageHistory[]

  @@unique([companyId, jobId, orderIndex])
  @@index([companyId])
}

// ── APPLICATIONS ─────────────────────────────────────────────────
model Application {
  id                 String      @id @default(uuid())
  companyId          String
  jobId              String
  candidateId        String
  currentStageId     String
  assignedToId       String?
  source             String      @default("direct")
  sourceDetail       String?
  resumeUrl          String?
  resumeParsed       Boolean     @default(false)
  aiScore            Int?
  aiScoreComputedAt  DateTime?
  rejectionReason    String?
  status             AppStatus   @default(active)
  tags               String[]
  appliedAt          DateTime    @default(now())
  createdAt          DateTime    @default(now())
  updatedAt          DateTime    @updatedAt

  company      Company               @relation(fields: [companyId], references: [id])
  job          Job                   @relation(fields: [jobId], references: [id])
  candidate    User                  @relation(fields: [candidateId], references: [id])
  currentStage PipelineStage         @relation(fields: [currentStageId], references: [id])
  assignedTo   User?                 @relation("AssignedTo", fields: [assignedToId], references: [id])
  stageHistory ApplicationStageHistory[]
  notes        ApplicationNote[]
  interviews   Interview[]
  offers       Offer[]

  @@index([companyId, jobId])
  @@index([companyId, currentStageId])
  @@index([companyId, aiScore])
  @@index([candidateId])
}

// ── STAGE HISTORY ────────────────────────────────────────────────
model ApplicationStageHistory {
  id                       String    @id @default(uuid())
  companyId                String
  applicationId            String
  fromStageId              String?
  toStageId                String
  movedById                String
  movedAt                  DateTime  @default(now())
  timeInPreviousStageHours Int?

  application Application   @relation(fields: [applicationId], references: [id])
  toStage     PipelineStage @relation(fields: [toStageId], references: [id])
  movedBy     User          @relation("MovedBy", fields: [movedById], references: [id])

  @@index([applicationId])
  @@index([companyId])
}

// ── APPLICATION NOTES ────────────────────────────────────────────
model ApplicationNote {
  id            String   @id @default(uuid())
  applicationId String
  authorId      String
  content       String   @db.Text
  createdAt     DateTime @default(now())

  application Application @relation(fields: [applicationId], references: [id])

  @@index([applicationId])
}

// ── INTERVIEWS ───────────────────────────────────────────────────
model Interview {
  id             String          @id @default(uuid())
  companyId      String
  applicationId  String
  jobId          String
  scheduledAt    DateTime
  durationMins   Int             @default(45)
  locationType   LocationType    @default(video)
  meetingLink    String?
  googleEventId  String?
  status         InterviewStatus @default(scheduled)
  createdById    String
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt

  company      Company              @relation(fields: [companyId], references: [id])
  application  Application          @relation(fields: [applicationId], references: [id])
  job          Job                  @relation(fields: [jobId], references: [id])
  createdBy    User                 @relation("CreatedBy", fields: [createdById], references: [id])
  interviewers InterviewInterviewer[]
  scorecards   InterviewScorecard[]

  @@index([companyId])
  @@index([applicationId])
}

model InterviewInterviewer {
  interviewId String
  userId      String

  interview Interview @relation(fields: [interviewId], references: [id])
  user      User      @relation(fields: [userId], references: [id])

  @@id([interviewId, userId])
}

// ── SCORECARDS ───────────────────────────────────────────────────
model InterviewScorecard {
  id               String        @id @default(uuid())
  companyId        String
  interviewId      String
  submittedById    String
  overallRating    Rating
  notesText        String        @db.Text
  sentimentScore   Float?
  sentimentAt      DateTime?
  submittedAt      DateTime      @default(now())

  interview   Interview          @relation(fields: [interviewId], references: [id])
  submittedBy User               @relation(fields: [submittedById], references: [id])
  ratings     ScorecardRating[]

  @@index([interviewId])
}

model ScorecardRating {
  id          String   @id @default(uuid())
  scorecardId String
  criterion   String
  rating      Int
  comment     String?

  scorecard InterviewScorecard @relation(fields: [scorecardId], references: [id])
}

// ── OFFERS ───────────────────────────────────────────────────────
model Offer {
  id             String      @id @default(uuid())
  companyId      String
  applicationId  String
  createdById    String
  baseSalary     Int
  bonus          Int?
  equity         String?
  startDate      DateTime
  expiryDate     DateTime
  status         OfferStatus @default(draft)
  offerLetterUrl String?
  letterContent  String?     @db.Text
  sentAt         DateTime?
  respondedAt    DateTime?
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt

  company     Company     @relation(fields: [companyId], references: [id])
  application Application @relation(fields: [applicationId], references: [id])
  createdBy   User        @relation("CreatedBy", fields: [createdById], references: [id])

  @@index([companyId])
  @@index([applicationId])
}

// ── NOTIFICATIONS ────────────────────────────────────────────────
model Notification {
  id        String   @id @default(uuid())
  companyId String
  userId    String
  type      String
  title     String
  body      String
  read      Boolean  @default(false)
  metadata  Json?
  link      String?
  createdAt DateTime @default(now())

  company Company @relation(fields: [companyId], references: [id])
  user    User    @relation(fields: [userId], references: [id])

  @@index([userId, read, createdAt])
}

// ── AUDIT LOGS ───────────────────────────────────────────────────
model AuditLog {
  id           String   @id @default(uuid())
  companyId    String
  userId       String
  action       String
  resourceType String
  resourceId   String
  oldValues    Json?
  newValues    Json?
  ipAddress    String?
  userAgent    String?
  createdAt    DateTime @default(now())

  company Company @relation(fields: [companyId], references: [id])
  user    User    @relation(fields: [userId], references: [id])

  @@index([companyId, createdAt])
}

// ── ANALYTICS SNAPSHOTS ──────────────────────────────────────────
model AnalyticsSnapshot {
  id              String   @id @default(uuid())
  companyId       String
  date            DateTime
  totalApps       Int      @default(0)
  hires           Int      @default(0)
  avgTimeToHire   Float?
  offerAcceptRate Float?
  data            Json

  company Company @relation(fields: [companyId], references: [id])

  @@unique([companyId, date])
}

// ── EMAIL TEMPLATES ──────────────────────────────────────────────
model EmailTemplate {
  id        String   @id @default(uuid())
  companyId String?
  type      String
  subject   String
  htmlBody  String   @db.Text
  variables Json?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  company Company? @relation(fields: [companyId], references: [id])
}

// ── ENUMS ────────────────────────────────────────────────────────
enum Plan {
  starter
  growth
  enterprise
}

enum SubscriptionStatus {
  active
  past_due
  canceled
  trialing
}

enum UserRole {
  super_admin
  company_admin
  recruiter
  hiring_manager
  interviewer
  candidate
}

enum JobStatus {
  draft
  published
  closed
  archived
}

enum EmploymentType {
  full_time
  part_time
  contract
  internship
}

enum RemoteType {
  onsite
  remote
  hybrid
}

enum StageType {
  new
  screening
  interview
  assessment
  offer
  hired
  rejected
}

enum AppStatus {
  active
  withdrawn
  rejected
  hired
}

enum LocationType {
  video
  phone
  onsite
}

enum InterviewStatus {
  scheduled
  completed
  cancelled
}

enum Rating {
  strong_yes
  yes
  no
  strong_no
}

enum OfferStatus {
  draft
  sent
  accepted
  declined
  expired
}
```

---

### Step 1.3 — MongoDB Schemas

**File: `backend/src/mongo/schemas/parsed-resume.schema.ts`**

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ collection: 'parsed_resumes', timestamps: true })
export class ParsedResume extends Document {
  @Prop({ required: true, index: true }) applicationId: string
  @Prop({ required: true, index: true }) companyId: string
  @Prop() candidateName: string
  @Prop({ type: Object }) contact: {
    email?: string; phone?: string; linkedin?: string; location?: string
  }
  @Prop() summary: string
  @Prop({ type: Array }) experience: Array<{
    company: string; title: string; startDate: string; endDate: string;
    description: string; technologies: string[]
  }>
  @Prop({ type: Array }) education: Array<{
    institution: string; degree: string; field: string; graduationYear: number
  }>
  @Prop({ type: [String] }) skills: string[]
  @Prop({ type: [String] }) certifications: string[]
  @Prop() totalYearsExperience: number
  @Prop() rawText: string
  @Prop() openaiTokensUsed: number
}
export const ParsedResumeSchema = SchemaFactory.createForClass(ParsedResume)
```

**File: `backend/src/mongo/schemas/candidate-score.schema.ts`**

```typescript
@Schema({ collection: 'candidate_scores', timestamps: true })
export class CandidateScore extends Document {
  @Prop({ required: true, index: true }) applicationId: string
  @Prop({ required: true, index: true }) jobId: string
  @Prop({ required: true }) companyId: string
  @Prop() overallScore: number        // 0–100
  @Prop({ type: Object }) subscores: {
    skillsMatch: number; experienceLevel: number;
    educationRelevance: number; keywordsMatch: number
  }
  @Prop({ type: [String] }) explanation: string[]
  @Prop({ type: [String] }) strengths: string[]
  @Prop({ type: [String] }) gaps: string[]
  @Prop() modelVersion: string
  @Prop() openaiTokensUsed: number
}
```

**File: `backend/src/mongo/schemas/bias-report.schema.ts`**

```typescript
@Schema({ collection: 'ai_bias_reports', timestamps: true })
export class BiasReport extends Document {
  @Prop({ required: true, index: true }) jobId: string
  @Prop({ required: true }) companyId: string
  @Prop({ type: Array }) flags: Array<{
    phrase: string; startIndex: number; endIndex: number;
    category: string; suggestion: string
  }>
  @Prop() overallSeverity: 'low' | 'medium' | 'high'
  @Prop() modelVersion: string
}
```

---

## Phase 2 — Authentication Module (Week 1–2)

### Step 2.1 — Auth Controller & Service

**File: `backend/src/modules/auth/auth.controller.ts`**

Endpoints to implement:

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Public | Create company + admin user |
| POST | `/api/v1/auth/login` | Public | Email/password login |
| POST | `/api/v1/auth/refresh` | Public | Rotate refresh token |
| POST | `/api/v1/auth/logout` | JWT | Revoke refresh token |
| GET | `/api/v1/auth/google` | Public | Start Google OAuth |
| GET | `/api/v1/auth/google/callback` | Public | Google OAuth callback |
| POST | `/api/v1/auth/forgot-password` | Public | Send reset email |
| POST | `/api/v1/auth/reset-password` | Public | Apply new password |

**File: `backend/src/modules/auth/auth.service.ts`** — Key logic:

```typescript
// register():
// 1. Hash password with bcrypt (cost 12)
// 2. Create company record (slug from company name)
// 3. Create user record as company_admin
// 4. Generate access_token (JWT, 15 min) + refresh_token (UUID, stored hashed in DB, 30 days)
// 5. Return { access_token, refresh_token, user, company }

// login():
// 1. Find user by email + companyId
// 2. Check failedLogins < 10, lockedUntil < now
// 3. Compare bcrypt hash
// 4. On failure: increment failedLogins, lock after 10
// 5. On success: reset failedLogins, update lastLoginAt
// 6. Generate + return tokens

// refresh():
// 1. Hash incoming token, find in DB
// 2. Check not revoked, not expired
// 3. Mark old token as revoked
// 4. Issue new access_token + new refresh_token (rotation)

// forgotPassword():
// 1. Find user by email (always return 200 to prevent enumeration)
// 2. Generate secure reset token, store hashed in Redis with 1-hour TTL
// 3. Send email with reset link
```

**File: `backend/src/modules/auth/strategies/jwt.strategy.ts`**

```typescript
// Validates Bearer token on every protected route
// Payload: { sub: userId, email, companyId, role }
// Attaches user to request.user
```

**File: `backend/src/modules/auth/strategies/google.strategy.ts`**

```typescript
// Google OAuth2 using passport-google-oauth20
// Scope: ['email', 'profile']
// On callback: find or create user with googleId
// If existing user: link googleId to their account
// If new user: create company + user record
```

**File: `backend/src/modules/auth/guards/role.guard.ts`**

```typescript
// Role hierarchy: super_admin > company_admin > recruiter > hiring_manager > interviewer > candidate
// @Roles('recruiter') means recruiter AND above can access
```

---

### Step 2.2 — Frontend Auth Wiring Changes

**Update `talentiq/src/hooks/useAuth.ts`** — Replace the mock setTimeout with real API calls:

```typescript
// BEFORE (mock):
const login = async () => new Promise(resolve => setTimeout(() => resolve(mockUser), 800))

// AFTER (real):
const login = async (credentials: LoginCredentials) => {
  const { data } = await api.post('/v1/auth/login', credentials)
  setToken(data.access_token)
  localStorage.setItem('talentiq_refresh_token', data.refresh_token)
  setUser(data.user)
  return data.user
}

const register = async (credentials: RegisterData) => {
  const { data } = await api.post('/v1/auth/register', credentials)
  setToken(data.access_token)
  localStorage.setItem('talentiq_refresh_token', data.refresh_token)
  setUser(data.user)
  return data.user
}
```

**Update `talentiq/src/lib/api.ts`** — Add token refresh interceptor:

```typescript
// Add 401 interceptor that tries to refresh the token
// before redirecting to /login
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true
      const refreshToken = localStorage.getItem('talentiq_refresh_token')
      if (refreshToken) {
        const { data } = await axios.post(`${BASE_URL}/v1/auth/refresh`, { refresh_token: refreshToken })
        setToken(data.access_token)
        localStorage.setItem('talentiq_refresh_token', data.refresh_token)
        error.config.headers['Authorization'] = `Bearer ${data.access_token}`
        return api(error.config)
      }
    }
    // ... existing error handling
  }
)
```

---

## Phase 3 — Users & Companies Module (Week 2)

### Step 3.1 — Users Controller

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/users/me` | JWT | Current user + company |
| PATCH | `/api/v1/users/me` | JWT | Update profile |
| GET | `/api/v1/users` | company_admin | List all users in tenant |
| POST | `/api/v1/users/invite` | company_admin | Send invitation email |
| PATCH | `/api/v1/users/:id/role` | company_admin | Change role |
| DELETE | `/api/v1/users/:id` | company_admin | Soft delete user |

**Invitation flow:**
1. Create user record (`isActive: false`)
2. Generate invite token (UUID, stored in Redis for 7 days)
3. Send invite email via SendGrid with link: `https://app.talentiq.com/invite?token=xxx`
4. On invite page: user sets password → `isActive: true`

### Step 3.2 — Tenant Middleware

**File: `backend/src/common/middleware/tenant.middleware.ts`**

```typescript
// This is the MOST CRITICAL piece of multi-tenancy security
// Runs on every request after JWT validation
// Reads companyId from request.user (set by JwtStrategy)
// Attaches companyId to request context
// The Prisma middleware reads this and appends WHERE company_id = :id
// to ALL queries on tenant-scoped tables
```

**File: `backend/src/prisma/prisma.service.ts`** — Tenant-scoped Prisma middleware:

```typescript
// In onModuleInit():
this.$use(async (params, next) => {
  const TENANT_MODELS = ['Job', 'Application', 'Interview', 'Offer', 'Notification', 'PipelineStage']
  const companyId = AsyncLocalStorage.getStore()?.companyId
  
  if (TENANT_MODELS.includes(params.model) && companyId) {
    if (params.action === 'findMany' || params.action === 'findFirst') {
      params.args.where = { ...params.args.where, companyId }
    }
    if (params.action === 'create') {
      params.args.data = { ...params.args.data, companyId }
    }
  }
  return next(params)
})
```

---

## Phase 4 — Jobs Module (Week 3)

### Step 4.1 — Jobs Controller

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/jobs` | JWT | List jobs (paginated, filtered) |
| POST | `/api/v1/jobs` | recruiter+ | Create job |
| GET | `/api/v1/jobs/:id` | JWT | Job detail with stage counts |
| PATCH | `/api/v1/jobs/:id` | recruiter+ | Update job |
| POST | `/api/v1/jobs/:id/publish` | recruiter+ | Publish + trigger bias check |
| POST | `/api/v1/jobs/:id/close` | recruiter+ | Close job |
| DELETE | `/api/v1/jobs/:id` | company_admin | Soft delete |
| POST | `/api/v1/jobs/:id/ai-description` | recruiter+ | Generate AI description (sync) |
| POST | `/api/v1/jobs/:id/bias-check` | recruiter+ | Enqueue bias check |
| GET | `/api/v1/jobs/:id/bias-check` | recruiter+ | Poll bias check result |
| GET | `/api/v1/jobs/:id/pipeline` | JWT | Kanban data (stages + apps) |
| GET | `/api/v1/jobs/public/:slug` | Public | Career page job detail |

### Step 4.2 — AI Description Generation (Synchronous)

```typescript
// This is the ONE synchronous AI call (user is waiting for it)
// POST /api/v1/jobs/:id/ai-description
// Input: { briefDescription, seniority, keySkills[] }
// Calls OpenAI directly (not via queue) — user expects immediate response
// Returns: { title, description, requirements[], skills[] }
// Does NOT auto-save — frontend displays it for the recruiter to accept

const prompt = `You are an expert technical recruiter. Write a compelling job description.
Role: ${briefDescription}
Seniority: ${seniority}
Key skills: ${keySkills.join(', ')}
Return JSON: { title, description, requirements: string[], skills: string[] }`
```

### Step 4.3 — Pipeline Stages

On company registration, seed default stages:
```typescript
const DEFAULT_STAGES = [
  { name: 'Screening',    color: '#2563EB', orderIndex: 0, stageType: 'screening' },
  { name: 'Phone Screen', color: '#3B82F6', orderIndex: 1, stageType: 'screening' },
  { name: 'Interview',    color: '#F59E0B', orderIndex: 2, stageType: 'interview' },
  { name: 'Assessment',   color: '#8B5CF6', orderIndex: 3, stageType: 'assessment' },
  { name: 'Offer',        color: '#10B981', orderIndex: 4, stageType: 'offer' },
  { name: 'Hired',        color: '#059669', orderIndex: 5, stageType: 'hired' },
]
```

---

## Phase 5 — Applications Module (Week 3–4)

### Step 5.1 — Applications Controller

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/applications` | JWT | List (jobId, stage, score filters) |
| POST | `/api/v1/applications` | Public | Submit application (candidate) |
| GET | `/api/v1/applications/:id` | JWT | Full profile (PG + Mongo joined) |
| PATCH | `/api/v1/applications/:id/stage` | recruiter+ | Move stage |
| POST | `/api/v1/applications/:id/notes` | JWT | Add note |
| PATCH | `/api/v1/applications/:id/assign` | recruiter+ | Assign recruiter |
| POST | `/api/v1/applications/bulk` | recruiter+ | Bulk move/reject/export |
| GET | `/api/v1/applications/export` | recruiter+ | CSV export |

### Step 5.2 — Resume Upload Flow

```typescript
// POST /api/v1/applications (multipart/form-data)
// 1. Validate request body (Zod/class-validator)
// 2. Find or create candidate user record (role: 'candidate')
// 3. Upload PDF to S3: resumes/{companyId}/{applicationId}/{timestamp}.pdf
// 4. Create Application record in PostgreSQL (resumeParsed: false)
// 5. Emit event: ApplicationCreated → AiModule listens → enqueues resume-parse job
// 6. Return { applicationId, status: 'processing' }
```

### Step 5.3 — Stage Movement

```typescript
// PATCH /api/v1/applications/:id/stage
// Body: { stageId, rejectionReason? }
// 1. Fetch current application
// 2. Calculate timeInPreviousStageHours (now - lastStageMove)
// 3. Create ApplicationStageHistory record
// 4. Update application.currentStageId
// 5. Emit ApplicationMoved event:
//    → NotificationsModule sends email
//    → WebSocket emits to company room
// 6. If stage is 'hired': update application.status = 'hired'
// 7. If stage is 'rejected': update application.status = 'rejected'
```

### Step 5.4 — Full Application Profile (Cross-DB Join)

```typescript
// GET /api/v1/applications/:id
// 1. Fetch from PostgreSQL: application + job + candidate + currentStage + stageHistory + interviews + offers + notes
// 2. Fetch from MongoDB: parsed_resumes where applicationId = :id
// 3. Fetch from MongoDB: candidate_scores where applicationId = :id
// 4. Assemble and return single DTO
```

---

## Phase 6 — AI Processing Pipeline (Week 4–5)

> [!IMPORTANT]
> This is the core differentiator of the platform. The queue architecture ensures AI calls (2–8 seconds each) never block the API server.

### Step 6.1 — BullMQ Queue Setup

**File: `backend/src/modules/ai/ai.module.ts`**

```typescript
BullModule.registerQueue(
  { name: 'resume-parse' },
  { name: 'candidate-scoring' },
  { name: 'bias-detection' },
  { name: 'interview-questions' },
  { name: 'sentiment-analysis' },
)
```

**File: `backend/src/worker.ts`** — Separate process entrypoint:

```typescript
// This file bootstraps ONLY the AI module and notification workers
// It does NOT start an HTTP server
// CMD in Dockerfile for worker: node dist/worker.js
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(WorkerAppModule)
  await app.init()
}
```

### Step 6.2 — Resume Parse Processor

**File: `backend/src/modules/ai/processors/resume-parse.processor.ts`**

```typescript
@Processor('resume-parse')
export class ResumeParseProcessor {
  @Process()
  async handle(job: Job<{ applicationId: string; resumeUrl: string; companyId: string }>) {
    // 1. Download PDF from S3 using signed URL
    const pdfBuffer = await this.storageService.download(job.data.resumeUrl)
    
    // 2. Extract text from PDF using pdf-parse
    const { text } = await pdfParse(pdfBuffer)
    
    // 3. Call OpenAI with structured extraction prompt
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: RESUME_PARSE_PROMPT },
        { role: 'user', content: text }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 2000,
    })
    
    // 4. Parse + validate JSON response with Zod schema
    const parsed = ResumeParseSchema.parse(JSON.parse(response.choices[0].message.content))
    
    // 5. Save to MongoDB
    await this.parsedResumeModel.create({ applicationId: job.data.applicationId, ...parsed })
    
    // 6. Mark application as parsed in PostgreSQL
    await this.prisma.application.update({
      where: { id: job.data.applicationId },
      data: { resumeParsed: true }
    })
    
    // 7. Enqueue candidate scoring job
    await this.scoringQueue.add('score', { applicationId: job.data.applicationId, jobId: ... })
  }
}
```

**Resume Parse Prompt:**

```typescript
export const RESUME_PARSE_PROMPT = `
You are a resume parsing expert. Extract structured data from the resume text.
Return valid JSON with this exact schema:
{
  "candidateName": string,
  "contact": { "email": string, "phone": string, "linkedin": string, "location": string },
  "summary": string,
  "experience": [{ "company": string, "title": string, "startDate": string, "endDate": string, "description": string, "technologies": string[] }],
  "education": [{ "institution": string, "degree": string, "field": string, "graduationYear": number }],
  "skills": string[],
  "certifications": string[],
  "totalYearsExperience": number
}
`
```

### Step 6.3 — Candidate Scoring Processor

**File: `backend/src/modules/ai/processors/candidate-scoring.processor.ts`**

```typescript
@Process()
async handle(job: Job<{ applicationId: string; jobId: string }>) {
  // 1. Load job requirements from PostgreSQL
  const dbJob = await this.prisma.job.findUnique({ where: { id: job.data.jobId } })
  
  // 2. Load parsed resume from MongoDB
  const parsedResume = await this.parsedResumeModel.findOne({ applicationId: job.data.applicationId })
  
  // 3. Build scoring prompt
  const prompt = buildScoringPrompt(dbJob, parsedResume)
  
  // 4. Call OpenAI
  const response = await this.openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'system', content: prompt }],
    response_format: { type: 'json_object' },
  })
  
  // 5. Parse + validate (Zod)
  const score = CandidateScoreSchema.parse(JSON.parse(response.choices[0].message.content))
  
  // 6. Save to MongoDB
  await this.candidateScoreModel.create({ applicationId: job.data.applicationId, ...score })
  
  // 7. Update PostgreSQL
  await this.prisma.application.update({
    where: { id: job.data.applicationId },
    data: { aiScore: score.overallScore, aiScoreComputedAt: new Date() }
  })
  
  // 8. Emit WebSocket event to company room
  this.websocketsGateway.emitToCompany(companyId, 'application:scored', {
    applicationId: job.data.applicationId,
    score: score.overallScore,
  })
  
  // 9. Create in-app notification for assigned recruiter
  await this.notificationsService.send('ai-score', recruiterId, {
    message: `AI score ready: ${score.overallScore}/100`,
    applicationId: job.data.applicationId,
  })
}
```

**Scoring Prompt:**

```typescript
export const buildScoringPrompt = (job, resume) => `
You are an expert technical recruiter. Score this candidate against this job.

JOB REQUIREMENTS:
Title: ${job.title}
Skills required: ${job.skills.join(', ')}
Requirements: ${job.requirements.join('\n')}

CANDIDATE PROFILE:
Skills: ${resume.skills.join(', ')}
Experience: ${resume.totalYearsExperience} years
Summary: ${resume.summary}

Return JSON:
{
  "overallScore": number (0-100),
  "subscores": {
    "skillsMatch": number (0-100),
    "experienceLevel": number (0-100),
    "educationRelevance": number (0-100),
    "keywordsMatch": number (0-100)
  },
  "explanation": string[] (5-8 bullet points explaining the score),
  "strengths": string[] (3-5 specific strengths),
  "gaps": string[] (2-4 specific gaps or risks)
}
`
```

### Step 6.4 — Bias Detection Processor

**File: `backend/src/modules/ai/processors/bias-detection.processor.ts`**

```typescript
@Process()
async handle(job: Job<{ jobId: string; description: string; companyId: string }>) {
  const response = await this.openai.chat.completions.create({
    model: 'gpt-4o',  // Use better model for bias detection (quality matters here)
    messages: [
      { role: 'system', content: BIAS_DETECTION_PROMPT },
      { role: 'user', content: job.data.description }
    ],
    response_format: { type: 'json_object' },
  })
  
  const report = BiasReportSchema.parse(JSON.parse(response.choices[0].message.content))
  
  // Store in MongoDB
  await this.biasReportModel.create({ jobId: job.data.jobId, ...report })
  
  // Update job with summary score
  await this.prisma.job.update({
    where: { id: job.data.jobId },
    data: { 
      biasCheckResults: report.flags,
      biasCheckScore: report.overallSeverity === 'low' ? 85 : report.overallSeverity === 'medium' ? 55 : 25
    }
  })
  
  // Emit to company room so frontend updates inline
  this.websocketsGateway.emitToCompany(job.data.companyId, 'job:bias-checked', { jobId: job.data.jobId, report })
}
```

### Step 6.5 — Interview Questions Processor

```typescript
// Triggered when POST /api/v1/interviews/:id/question-set is called
// Input: jobId, jobDescription, skills, seniority
// Uses gpt-4o for higher quality output
// Returns: { categories: [{ name, questions: [{ text, followUps, hints }] }] }
// Stores in MongoDB interview_question_sets collection
```

### Step 6.6 — Sentiment Analysis Processor

```typescript
// Triggered when interview scorecard notes are saved
// Input: notesText
// Uses gpt-4o-mini (simple task)
// Returns: { sentimentScore: float (-1 to 1), themes: string[] }
// Updates InterviewScorecard.sentimentScore in PostgreSQL
```

---

## Phase 7 — Interviews Module (Week 5)

### Step 7.1 — Interviews Controller

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/interviews` | JWT | List interviews for tenant |
| POST | `/api/v1/interviews` | recruiter+ | Schedule interview |
| PATCH | `/api/v1/interviews/:id` | recruiter+ | Reschedule |
| DELETE | `/api/v1/interviews/:id` | recruiter+ | Cancel |
| POST | `/api/v1/interviews/:id/scorecards` | interviewer+ | Submit scorecard |
| GET | `/api/v1/interviews/:id/scorecards` | recruiter+ | View all scorecards |
| POST | `/api/v1/interviews/:id/question-set` | recruiter+ | Generate AI questions |
| GET | `/api/v1/interviews/:id/question-set` | JWT | Get generated questions |

### Step 7.2 — Interview Scheduling Logic

```typescript
// POST /api/v1/interviews
// 1. Create Interview record
// 2. Create InterviewInterviewer records (many-to-many)
// 3. If Google Calendar connected: create calendar event via Google Calendar API
//    - OAuth token for user stored in Redis/DB
//    - Event includes candidate email, meeting link, description
// 4. Emit notifications:
//    → Candidate: "Interview scheduled" email
//    → All interviewers: "You have an interview" email + in-app notification
// 5. Return interview with generated meeting link (if video)
```

---

## Phase 8 — Offers Module (Week 5–6)

### Step 8.1 — Offers Controller

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/offers` | recruiter+ | Create draft offer |
| GET | `/api/v1/offers/:id` | JWT | Offer detail |
| POST | `/api/v1/offers/:id/generate-letter` | recruiter+ | Generate PDF offer letter |
| POST | `/api/v1/offers/:id/send` | recruiter+ | Send to candidate |
| PATCH | `/api/v1/offers/:id/respond` | candidate | Accept/decline |
| GET | `/api/v1/offers` | recruiter+ | List offers |

### Step 8.2 — PDF Offer Letter Generation

```typescript
// POST /api/v1/offers/:id/generate-letter
// Uses PDFKit (no Puppeteer needed for simple letters)
// Template variables: candidateName, role, salary, startDate, equity, companyName
// 1. Generate PDF buffer
// 2. Upload to S3: offer-letters/{companyId}/{offerId}.pdf
// 3. Update offer.offerLetterUrl in PostgreSQL
// 4. Return signed S3 URL (24-hour expiry)
```

---

## Phase 9 — Notifications Module (Week 6)

### Step 9.1 — Notifications Controller

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/notifications` | JWT | List notifications for user |
| PATCH | `/api/v1/notifications/:id/read` | JWT | Mark as read |
| PATCH | `/api/v1/notifications/read-all` | JWT | Mark all read |

### Step 9.2 — Notification Service Architecture

```typescript
// Single method: send(type, recipientId, data)
// 1. Create Notification record in PostgreSQL
// 2. Emit WebSocket event to user room: 'notification' event
//    (Frontend useNotifications hook already listens for this!)
// 3. Enqueue email via BullMQ notification queue
//    → Email queue processor calls SendGrid API
//    → Uses Handlebars template for the notification type
```

### Step 9.3 — Email Templates (Handlebars)

**File: `backend/src/modules/notifications/templates/application-received.hbs`**

```handlebars
<h2>New Application Received</h2>
<p>{{candidateName}} has applied for <strong>{{jobTitle}}</strong>.</p>
<p>AI Score: <strong>{{aiScore}}/100</strong></p>
<a href="{{applicationUrl}}">View Application</a>
```

Templates to create:
- `application-received.hbs`
- `stage-moved.hbs`
- `interview-scheduled.hbs`
- `scorecard-submitted.hbs`
- `offer-sent.hbs`
- `offer-responded.hbs`
- `invite-user.hbs`
- `forgot-password.hbs`
- `ai-score-ready.hbs`

---

## Phase 10 — WebSocket Gateway (Week 6)

### Step 10.1 — Gateway Implementation

**File: `backend/src/modules/websockets/websockets.gateway.ts`**

```typescript
@WebSocketGateway({ cors: { origin: process.env.FRONTEND_URL } })
export class WebsocketsGateway {
  @WebSocketServer() server: Server

  handleConnection(client: Socket) {
    // 1. Extract JWT from handshake.auth.token
    // 2. Verify JWT (same JwtService as auth module)
    // 3. On success: join rooms
    client.join(`user:${user.id}`)       // Personal notifications
    client.join(`company:${user.companyId}`) // Team events (Kanban moves)
  }

  emitToCompany(companyId: string, event: string, data: any) {
    this.server.to(`company:${companyId}`).emit(event, data)
  }

  emitToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data)
  }
}
```

**Events emitted to company room:**
- `application:moved` — when a candidate is moved to a new stage (Kanban updates live)
- `application:scored` — when AI score is computed (score appears without refresh)
- `application:new` — when a new application arrives (notification appears)

**Events emitted to user room:**
- `notification` — any new notification (bell icon updates)

> [!NOTE]
> The frontend `socket.ts` already connects to `NEXT_PUBLIC_SOCKET_URL` and `useNotifications.ts` already calls `subscribeToEvent('notification', handler)`. The WebSocket layer on the frontend is complete — you just need to implement the server side.

---

## Phase 11 — Billing Module (Week 6–7)

### Step 11.1 — Billing Controller

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/billing/checkout` | company_admin | Create Stripe Checkout session |
| GET | `/api/v1/billing/portal` | company_admin | Stripe Customer Portal URL |
| POST | `/api/v1/billing/webhook` | Public (Stripe sig) | Handle Stripe events |
| GET | `/api/v1/billing/subscription` | company_admin | Current subscription info |
| GET | `/api/v1/billing/invoices` | company_admin | Invoice list |

### Step 11.2 — Webhook Handler (Critical Path)

```typescript
// POST /api/v1/billing/webhook (raw body, no JSON parsing — Stripe requires this)
// 1. Verify Stripe signature: stripe.webhooks.constructEvent(rawBody, sig, secret)
// 2. Handle events:

switch (event.type) {
  case 'checkout.session.completed':
    // Update company: stripeCustomerId, stripeSubscriptionId, plan, subscriptionStatus: 'active'
    break
  
  case 'customer.subscription.updated':
    // Update company: plan (based on priceId), subscriptionStatus, maxUsers, maxJobs
    break
  
  case 'customer.subscription.deleted':
    // Update company: subscriptionStatus: 'canceled', downgrade to starter
    break
  
  case 'invoice.payment_failed':
    // Update company: subscriptionStatus: 'past_due'
    // Send payment failed email to company_admin
    break
}
```

### Step 11.3 — Subscription Guard

**File: `backend/src/common/guards/subscription.guard.ts`**

```typescript
// Applied to AI-heavy routes and job creation
// Checks company.plan against PLAN_LIMITS (mirrors frontend constants.ts)
// If AI score quota exceeded: return 402 { code: 'QUOTA_EXCEEDED', upgradeUrl }
// If job limit exceeded: return 402 { code: 'JOB_LIMIT_EXCEEDED', upgradeUrl }

const PLAN_LIMITS = {
  starter:    { jobs: 3,  seats: 5,   aiScores: 200 },
  growth:     { jobs: 15, seats: 20,  aiScores: 1000 },
  enterprise: { jobs: -1, seats: -1,  aiScores: -1 },  // -1 = unlimited
}
```

---

## Phase 12 — Analytics Module (Week 7)

### Step 12.1 — Analytics Controller

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/analytics` | JWT | Full analytics data object |
| GET | `/api/v1/analytics/pipeline` | JWT | Funnel conversion rates |
| GET | `/api/v1/analytics/time-to-hire` | JWT | Weekly time-to-hire trend |
| GET | `/api/v1/analytics/sources` | JWT | Source quality breakdown |
| GET | `/api/v1/analytics/team` | company_admin | Team performance metrics |
| GET | `/api/v1/analytics/jobs` | JWT | Job-level metrics |

### Step 12.2 — Analytics Service Implementation

```typescript
// GET /api/v1/analytics returns the full AnalyticsData object
// that matches frontend analytics.types.ts exactly:
{
  funnel: FunnelStage[],        // Stage conversion rates from ApplicationStageHistory
  timeToHire: TimeToHireDataPoint[], // Weekly avg from analytics_snapshots
  sources: SourceData[],         // Source breakdown from applications table
  teamMetrics: TeamMemberMetrics[], // Recruiter performance
  jobMetrics: JobMetrics[],      // Per-job stats
  keyMetrics: {
    totalApplications: number,
    avgTimeToHire: number,
    offerAcceptanceRate: number,
    pipelineConversionRate: number
  }
}
```

### Step 12.3 — Nightly Analytics Aggregation Job

**File: `backend/src/modules/analytics/jobs/aggregate-analytics.job.ts`**

```typescript
@Cron('0 2 * * *') // 2 AM UTC daily
async aggregate() {
  const companies = await this.prisma.company.findMany({ where: { deletedAt: null } })
  
  for (const company of companies) {
    const yesterday = startOfDay(subDays(new Date(), 1))
    
    // Compute metrics for yesterday
    const metrics = await this.computeMetrics(company.id, yesterday)
    
    // Upsert analytics snapshot
    await this.prisma.analyticsSnapshot.upsert({
      where: { companyId_date: { companyId: company.id, date: yesterday } },
      create: { companyId: company.id, date: yesterday, ...metrics },
      update: { ...metrics }
    })
  }
}
```

---

## Phase 13 — Storage Module

### Step 13.1 — Storage Service

**File: `backend/src/modules/storage/storage.service.ts`**

```typescript
// Wraps AWS S3 SDK (or MinIO in local dev)
// Methods:
upload(buffer: Buffer, key: string, mimeType: string): Promise<string>
  // Returns S3 key (not URL — URLs are generated on demand)
  
getSignedUrl(key: string, expiresInSeconds = 3600): Promise<string>
  // Returns presigned URL for secure file access
  
delete(key: string): Promise<void>
  // For GDPR right-to-erasure

download(key: string): Promise<Buffer>
  // For AI worker to read resume PDFs

// S3 bucket structure:
// talentiq-resumes/{companyId}/{applicationId}/{filename}.pdf
// talentiq-offers/{companyId}/{offerId}/offer-letter.pdf  
// talentiq-avatars/{userId}/avatar.jpg
```

---

## Phase 14 — Candidate Portal Endpoints

The frontend has a complete portal UI at `talentiq/src/app/(portal)/`. These are the backend endpoints it needs:

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/portal/application/:token` | Portal token | Candidate's application status |
| GET | `/api/v1/portal/jobs/:slug` | Public | Job detail for career page |
| POST | `/api/v1/portal/jobs/:slug/apply` | Public | Submit application |
| PATCH | `/api/v1/portal/offers/:id/respond` | Portal token | Accept/decline offer |

Portal token: A secure UUID stored in the application record, sent to the candidate in their application confirmation email. Used instead of JWT since candidates don't have accounts in the initial flow.

---

## Phase 15 — Docker Compose (Local Dev)

**File: `docker-compose.yml`** (at root level):

```yaml
version: '3.9'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: talentiq
      POSTGRES_USER: talentiq
      POSTGRES_PASSWORD: talentiq_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: talentiq
      MINIO_ROOT_PASSWORD: talentiq_dev
    volumes:
      - minio_data:/data

  mailhog:
    image: mailhog/mailhog
    ports:
      - "1025:1025"   # SMTP
      - "8025:8025"   # Web UI

volumes:
  postgres_data:
  mongo_data:
  redis_data:
  minio_data:
```

**File: `backend/.env.example`**:

```env
# App
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://talentiq:talentiq_dev@localhost:5432/talentiq

# MongoDB
MONGODB_URI=mongodb://localhost:27017/talentiq

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_DAYS=30

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/v1/auth/google/callback

# OpenAI
OPENAI_API_KEY=sk-...

# AWS / MinIO (local dev uses MinIO)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=talentiq
AWS_SECRET_ACCESS_KEY=talentiq_dev
AWS_S3_BUCKET=talentiq-dev
AWS_S3_ENDPOINT=http://localhost:9000  # Remove in production

# SendGrid (local dev uses MailHog SMTP)
SENDGRID_API_KEY=SG...
MAIL_FROM=noreply@talentiq.com

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_GROWTH_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...
```

---

## Frontend Wiring Changes Required

These are the changes needed in the existing `talentiq/` frontend to connect to the real backend:

### 1. `useAuth.ts` — Replace mock with real API calls
Replace all `setTimeout(resolve, 800)` mock patterns with actual `api.post()` calls.

### 2. `domain.store.ts` — Remove mock data seeding
The `INITIAL_JOBS`, `INITIAL_CANDIDATES`, `INITIAL_INTERVIEWS` etc. should be removed from the Zustand store. The store should only hold UI state (sidebar open, selected stage, filters). All data comes from TanStack Query via the hooks that already call `api.ts`.

### 3. `useJobs.ts`, `useApplications.ts`, etc. — Already correct
These hooks already call `api.get('/jobs')`, `api.get('/applications')`, etc. They will work once the backend is running.

### 4. Add token refresh interceptor to `api.ts`
The current `api.ts` clears the token and redirects on 401. It needs to first attempt a token refresh before giving up.

### 5. Update `NEXT_PUBLIC_API_URL` to include `/v1`
Current: `http://localhost:3001/api`
The hooks call `/jobs`, `/applications` etc. which becomes `http://localhost:3001/api/jobs`.
The backend routes will be `/api/v1/jobs`. Either:
- Option A: Set `NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1` (simplest)
- Option B: Add `/v1` prefix to all hook calls

### 6. `useSocket.ts` hook changes
Add the companyId to the socket room join payload.

---

## Backend `package.json`

```json
{
  "name": "talentiq-backend",
  "version": "1.0.0",
  "scripts": {
    "build": "nest build",
    "start": "node dist/main.js",
    "start:dev": "nest start --watch",
    "start:worker": "nest start --watch --entryFile worker",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "seed": "ts-node prisma/seed.ts",
    "test": "jest",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  }
}
```

---

## Execution Order (Week-by-Week)

| Week | Deliverable | Key Files |
|---|---|---|
| **1** | Project bootstrap, Prisma schema, Docker Compose up | `schema.prisma`, `docker-compose.yml`, `prisma.service.ts` |
| **1** | Auth module (register, login, refresh, logout) | `auth.controller.ts`, `auth.service.ts`, `jwt.strategy.ts` |
| **2** | Google OAuth, password reset | `google.strategy.ts`, forgot/reset endpoints |
| **2** | Users module, tenant middleware, RBAC guards | `users.controller.ts`, `tenant.middleware.ts`, `role.guard.ts` |
| **2** | Invitation flow + email | `invite-user.hbs`, invitation endpoint |
| **3** | Jobs module (CRUD + pipeline stages) | `jobs.controller.ts`, `jobs.service.ts` |
| **3** | AI description generation (sync) | AI description endpoint, OpenAI call |
| **3** | Applications module (submit + stage movement) | `applications.controller.ts`, `applications.service.ts` |
| **4** | S3/MinIO storage service | `storage.service.ts` |
| **4** | BullMQ + Redis setup | `ai.module.ts`, `worker.ts` |
| **4** | Resume parse AI processor | `resume-parse.processor.ts`, `resume-parse.prompt.ts` |
| **5** | Candidate scoring AI processor | `candidate-scoring.processor.ts` |
| **5** | Bias detection processor | `bias-detection.processor.ts` |
| **5** | WebSocket gateway | `websockets.gateway.ts` |
| **5** | Notifications module + SendGrid | `notifications.service.ts`, all `.hbs` templates |
| **6** | Interviews module (schedule + scorecards) | `interviews.controller.ts` |
| **6** | Interview questions AI processor | `interview-questions.processor.ts` |
| **6** | Sentiment analysis processor | `sentiment-analysis.processor.ts` |
| **6** | Offers module + PDF generation | `offers.service.ts` |
| **7** | Stripe billing module + webhooks | `billing.controller.ts`, `billing.service.ts` |
| **7** | Subscription guard | `subscription.guard.ts` |
| **7** | Analytics module + nightly job | `analytics.service.ts`, `aggregate-analytics.job.ts` |
| **8** | Candidate portal endpoints | portal controller |
| **8** | GDPR endpoints (export, delete) | GDPR endpoints |
| **8** | Frontend wiring (replace all mocks) | `useAuth.ts`, `domain.store.ts`, `api.ts` |
| **8** | End-to-end testing + bug fixes | Full flow test |

---

## Open Questions

> [!IMPORTANT]
> Please clarify these before we start execution:

1. **OpenAI API Key** — Do you have one? We need it before Week 4 (AI pipeline). If not, the job creation and analytics still work but AI scoring won't.

2. **Stripe Account** — Do you have test keys? We need them for the billing module in Week 7.

3. **SendGrid vs SMTP** — For local dev, MailHog (in Docker Compose) can capture emails without needing a real SendGrid key. But for real email delivery we need `SENDGRID_API_KEY`. Is this available?

4. **Google OAuth** — Do you have a Google Cloud Console project with OAuth credentials? This is needed for Google login and Google Calendar integration.

5. **Deployment target** — For now, are we targeting localhost only (laptop demo), or do you want to deploy to a cloud (Vercel frontend + Railway/Render backend)? This affects how we configure environment variables and CORS.

6. **Existing user data** — The Zustand store currently has hardcoded mock candidates (Jennifer Park, David Chen, Emily Watson). Should we keep them as a seed script that populates the database on first run? This makes demos easier.

---

## Verification Plan

### After Each Module
- Unit test the service layer with Jest
- Test endpoints with Postman/Thunder Client
- Verify tenant isolation: register 2 companies, confirm Company A cannot see Company B's data

### Full Integration Tests
- Register → create job → publish → apply (as candidate with resume) → watch AI score appear via WebSocket → move through Kanban stages → schedule interview → submit scorecard → generate offer → candidate accepts

### Performance
- Verify AI jobs don't block API responses (enqueue returns < 50ms)
- Verify WebSocket events arrive within 500ms of database update
