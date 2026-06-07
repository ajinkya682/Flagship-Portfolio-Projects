# AI-POWERED TALENT INTELLIGENCE PLATFORM

## Complete Engineering Blueprint

---

# SECTION 1: PROJECT ANALYSIS

## Problem Statement

Hiring is broken in three specific ways. First, ATS systems built in the 2000s use keyword matching that filters out qualified candidates who don't game the system. Second, hiring managers make gut-feel decisions that are inconsistent, biased, and not repeatable. Third, recruiting teams have no visibility into pipeline health until it's too late — they discover problems after a position has been open for 90 days.

The downstream consequence is real: a mis-hire at the $80,000 salary level costs roughly $24,000 in recruiting, onboarding, productivity loss, and severance. Companies with 50 hires per year are hemorrhaging $500,000+ annually from bad hiring decisions alone.

## Who Experiences This Problem

Series A to Series C startups are the primary pain point. They are scaling fast, don't have dedicated talent operations teams, and are making 30 to 200 hires per year. Each bad hire at this stage is existential. Their HR team is typically one or two people using spreadsheets, Lever, or Greenhouse, and they have no AI anywhere in the pipeline.

Enterprise talent acquisition departments experience the same problem at scale. They have 10 to 50 recruiters managing thousands of applications per year and are drowning in manual work. They need automation but can't get budget for six-figure HCM platforms.

Staffing agencies are a third segment. They manage candidates across multiple client companies simultaneously and need multi-workspace support, bulk operations, and reporting by client.

## Current Solutions and Their Failures

Greenhouse charges $6,000 to $25,000 per year for a feature set that is essentially a structured database with email templates. Its AI features are bolted on and limited to basic resume parsing. It has no predictive scoring. Its UI is dated and its API is restrictive.

Lever is similarly priced and focuses more on CRM-style nurturing but still lacks real AI intelligence. It has good pipeline visualization but no bias detection, no sentiment analysis, and no explainable scoring.

Workable is the budget option at $300 to $600 per month. It covers the basics but the AI features are marketing language for keyword matching dressed up with a different label.

Ashby is the most technically modern competitor. It has clean UX and solid analytics. It is the most dangerous competitor and the benchmark to beat on product quality.

BambooHR is primarily HRIS with basic ATS features. It serves SMBs that need both but want one vendor.

## Weaknesses in Competitors

None of them have explainable AI scoring. They can tell you a candidate scored 78 but not why. This is a significant trust problem with hiring managers who won't act on a black box.

None of them do real bias detection in job descriptions at the time of creation. They might flag it in an audit but not in the workflow where it can actually be fixed.

None of them predict offer acceptance probability using actual data from the company's own history combined with market signals.

Their analytics are lagging indicators. They show you what happened, not what is about to happen. A pipeline intelligence layer that predicts time-to-hire based on current velocity is absent from every major competitor.

Integrations are shallow. Google Calendar sync exists but active coordination between calendar, scheduling, and the candidate profile is manual.

## Market Opportunity

The global ATS market is valued at approximately $2.9 billion in 2024 and growing at 7% annually. The talent intelligence sub-market which includes AI scoring and workforce analytics is growing at 18% annually. There are approximately 150,000 companies in the United States alone with more than 50 employees that hire more than 20 people per year. At $500 per month average contract value, that is a $900 million addressable market in the US alone.

The underserved segment is companies with 10 to 500 employees who need enterprise-grade AI but can't afford Greenhouse or Workday. This is where this platform wins.

## Revenue Opportunities

Primary revenue is subscription SaaS. Secondary revenue is usage-based AI credits for companies with high volume. Tertiary opportunities include white-labeling for staffing agencies, API access for HRIS integrations, and marketplace add-ons (background check integrations, LinkedIn enrichment).

## Risks

OpenAI API costs can become unpredictable at scale. If every resume parse, every scoring call, and every bias check costs tokens, high-volume customers will be expensive to serve. This requires caching, batching, and potentially fine-tuned local models over time.

Bias detection is a legal landmine. If the platform incorrectly flags or misses bias, companies could face liability. The platform's role must be advisory, not prescriptive.

Data privacy is significant. Candidate PII in a multi-tenant database requires meticulous isolation. A data leak between tenants would be catastrophic.

Regulatory risk around AI in hiring is increasing. The EU AI Act and US state laws in New York and Illinois already require disclosure and auditing when AI is used in hiring decisions. The platform must be built with compliance in mind from day one.

## SWOT Analysis

Strengths: Deep AI integration that competitors don't have. Explainable scoring builds trust. Modern stack enables fast iteration. Bias detection is a genuine differentiator. Multi-tenant from the ground up means you can serve agencies and enterprises.

Weaknesses: No existing customer base. AI costs are variable and hard to predict at scale. Building credibility in an established market takes time. Recruiting teams are notoriously resistant to changing their workflow.

Opportunities: The AI wave is making buyers receptive to AI-native tools right now. Competitors are retrofitting AI onto old architectures — this platform is built AI-first. Staffing agencies are underserved. International markets are years behind the US on ATS sophistication.

Threats: Greenhouse and Lever will add AI features. OpenAI could enter the market directly. A well-funded competitor could emerge. Economic downturns reduce hiring volume which is the core use case.

---

# SECTION 2: PRODUCT REQUIREMENTS DOCUMENT

## Vision

To become the operating system for talent acquisition at growing companies — a platform where every hiring decision is informed by AI, every workflow is automated, and every team member from recruiter to CEO has exactly the information they need.

## Goals

Cut time-to-hire by 50% for customers in the first 90 days. Reduce hiring manager time spent on screening by 70% through AI pre-scoring. Improve 90-day retention rates by 15% by improving candidate-role fit assessment. Make the platform self-serve from signup to first job post in under 30 minutes. Achieve net revenue retention above 110% by expanding within accounts.

## User Personas

Sarah is a Head of Talent at a 120-person Series B startup. She manages two recruiters and is personally accountable to the CEO for hiring 40 engineers this year. She is overwhelmed by volume, frustrated by her ATS giving her no intelligence, and spending 20 hours per week on manual screening. She is willing to pay $800 per month if it saves her 15 hours per week.

Marcus is a recruiter at a staffing agency managing 8 client companies simultaneously. He needs to switch context between clients, track candidates across multiple pipelines, and generate client-facing reports. He currently uses spreadsheets for half his workflow because his ATS can't handle multi-client work.

David is a Hiring Manager at a 500-person company who participates in interviews but is not in the ATS daily. He needs a simple view of his open roles, the candidates scheduled for interviews, and a way to submit scorecards without logging into a complex system. He is not technical.

Alex is a candidate who applied for a job and wants transparency about where they are in the process, clear communication, and a professional experience that reflects well on the company.

Elena is a Company Admin / HR Director who configures the platform, manages user accounts, and needs compliance reporting. She cares about data accuracy, audit trails, and GDPR.

## User Journeys

Recruiter core journey: Create job post (with AI assistance for description and bias check) → Review AI-scored candidates → Move candidates through pipeline stages → Schedule interviews → Collect interviewer scorecards → Generate offer letter → Close role.

Candidate journey: Receive invitation or apply via career page link → Complete profile → Upload resume → Submit application → Receive status updates via email → Complete any assessments or video screens → Accept or decline offer.

Hiring Manager journey: Get notified of candidates in their stage → Review AI summary of candidate → Conduct interview → Submit scorecard → See team's scorecards → Make decision.

Company Admin journey: Set up company workspace → Configure hiring stages → Invite users with roles → Set up Stripe billing → Configure email domain → View analytics dashboard.

## Functional Requirements

Authentication and user management with email/password and Google OAuth, invitation-based user onboarding, role-based access with six defined roles, password reset, and MFA support.

Job management including creation, editing, publishing, archiving, and duplication. AI description generation. Bias checking on save. Custom application form fields. Department and location fields. Salary range configuration.

Application management including resume upload and parsing, AI scoring on submission, manual override of scores, stage movement, bulk operations, notes, and activity log.

Interview management including scheduling with calendar integration, structured interview kits with AI-generated questions, interviewer assignment, scorecard collection, and aggregated feedback view.

Offer management including offer letter generation from templates, e-signature workflow, expiry tracking, and acceptance/decline recording.

Pipeline analytics including conversion rates by stage, time-in-stage averages, source tracking, recruiter performance, drop-off analysis, and offer acceptance rates.

Communication including automated email notifications at configurable trigger points, email template management, candidate messaging within the platform, and Slack notifications for recruiters.

Billing including Stripe subscription management, plan limits enforcement, usage metering for AI features, invoice access, and upgrade/downgrade flows.

## Non-Functional Requirements

API response times under 200ms at the 95th percentile for all endpoints except AI-heavy operations which are async. Frontend LCP under 2.5 seconds. Uptime SLA of 99.9%. Data encryption at rest and in transit. GDPR compliance including right to erasure and data export. Row-level tenant isolation with zero cross-tenant data leakage. File upload support up to 10MB for resumes, 100MB for video. Support for 10,000 concurrent users in year two.

## Success Metrics

Monthly Active Users per company above 80% of licensed seats. Time-to-first-job-post under 30 minutes after signup. AI score adoption rate (percentage of hiring decisions where AI score was viewed before decision) above 70%. Churn rate below 5% monthly. Net Promoter Score above 40.

## Business Goals

Reach $100,000 MRR within 12 months. Achieve 50 paying customers within 6 months. Maintain gross margin above 75% after AI and infrastructure costs. Land one enterprise customer above $2,000 MRR within 9 months.

## Product Roadmap

Phase 1 (Months 1 to 3): Core ATS with AI resume parsing and scoring. Multi-tenant auth. Job posting. Kanban pipeline. Email notifications. Stripe billing.

Phase 2 (Months 4 to 5): Interview scheduling. Scorecard system. Offer letter generation. Analytics dashboard. Bias detection.

Phase 3 (Months 6 to 8): Video interview analysis. Slack integration. Advanced analytics. API access. White-label mode.

Phase 4 (Months 9 to 12): Mobile app. Chrome extension. HRIS integrations. Custom AI model fine-tuning per company.

---

# SECTION 3: FEATURE BREAKDOWN

## P0 Features (MVP Critical)

Multi-tenant workspace isolation. Every company gets a completely isolated data environment. Business value is that it makes the product sellable to any company without fear of data exposure. Technical complexity is high — requires row-level security in PostgreSQL with a company_id on every table and middleware enforcement on every query.

User authentication with role-based access. Without this nothing else works. Six roles: Super Admin, Company Admin, Recruiter, Hiring Manager, Interviewer, Candidate. JWT with refresh tokens. Technical complexity is medium but critical to get right from day one because retrofitting RBAC later is extremely painful.

Job posting and management. Core workflow entry point. Create, edit, publish, archive jobs with department, location, salary range, and custom application fields. Technical complexity is low to medium. Depends on the tenant isolation layer.

Resume upload and parsing. Candidates submit PDFs. The system extracts structured data using OpenAI. Business value: eliminates manual data entry that takes recruiters 5 to 10 minutes per candidate. Technical complexity is medium. Requires async queue processing and reliable parsing prompt engineering.

AI candidate scoring. After parsing, every candidate is scored against job requirements using a configurable rubric. Produces a score with explanation. Business value is enormous — this is the primary differentiator. Technical complexity is high — requires well-designed prompts, reliable JSON output, and an explanation layer.

Kanban pipeline board. Visual drag-and-drop stage management. The primary recruiter interface. Must support custom stages per company. Technical complexity is medium — drag-and-drop with real-time sync is the hard part.

Application tracking. Move candidates between stages, add notes, view activity timeline. Core workflow. Medium complexity.

Email notifications. Automated emails at key workflow events: new application, stage change, interview scheduled, offer sent. Uses SendGrid. Medium complexity but requires a flexible template system.

Stripe subscription billing. Gate features by plan. Handle upgrades, downgrades, cancellations. Business value: this is how the company makes money. Technical complexity is medium — Stripe is well-documented but webhook handling requires care.

Candidate portal. Simple read-only view for candidates to see their application status. Low complexity but high user value — a bad candidate experience hurts employer brand.

## P1 Features (Version 1)

Interview scheduling with Google Calendar integration. Book time slots, send invites, sync with calendars. Technical complexity is high due to calendar API authentication and timezone handling.

Structured interview kits with AI-generated questions. Create a set of questions for each role. AI generates them based on job description and competency framework. Reduces interview prep time from 2 hours to 10 minutes. Medium AI complexity.

Scorecard system. Interviewers submit structured feedback after interviews. Aggregated view for decision makers. Medium complexity.

Offer letter generation. Template-based offer letter with merge fields. One-click generation from candidate and job data. Low-medium complexity.

Bias detection in job descriptions. Scans for gendered language, exclusionary terms, and ADA-risky language. Runs on save or publish. Shows inline warnings with suggestions. Medium AI complexity.

Pipeline analytics dashboard. Conversion rates, time-to-hire, source tracking, drop-off rates. Built with Recharts. Requires aggregation queries that must be optimized. Medium complexity.

Bulk candidate operations. Select multiple candidates and move stage, send email, or export. High user value for recruiters managing high volume. Medium complexity.

CSV export. Export candidate lists with full profile data. Required for compliance and reporting workflows. Low complexity.

Source tracking. Track where each candidate came from (job board, referral, direct, LinkedIn). Aggregate by source for quality analysis. Low-medium complexity.

## P2 Features (Future)

Video interview recording and AI analysis. Candidates record video answers. AI analyzes sentiment, keywords, and confidence. High AI complexity. High infrastructure cost.

Webhook support. Companies can push events to their own systems. Enables HRIS integration without building native connectors. Medium complexity.

Chrome extension for LinkedIn sourcing. Scrape public LinkedIn profiles and import into the platform. High complexity and has legal/ToS considerations.

White-label mode. Staffing agencies can deploy with custom branding and domains. Medium-high complexity — requires tenant-level theming and DNS configuration.

Mobile app for candidates. React Native app for application tracking and notifications. Medium complexity.

Predictive offer acceptance probability. Train on historical offer data to predict likelihood of acceptance. High AI complexity — requires enough data per company to be useful.

API marketplace. Public API for HRIS integrations. Requires API key management, rate limiting, and developer documentation. Medium-high complexity.

## MVP Scope

The MVP includes all P0 features. It must be deployable, billiable, and useful enough that a recruiter can manage a full hiring pipeline without leaving the platform. Target: 8 weeks of focused development.

## Version 1 Scope

MVP plus all P1 features. This is the product you sell to paying customers. Target: months 3 to 5.

## Future Scope

All P2 features prioritized by customer demand data.

---

# SECTION 4: SYSTEM ARCHITECTURE

## Overall Architecture Philosophy

The system is a multi-tenant SaaS platform with an event-driven backend, async AI processing pipeline, and a real-time collaborative frontend. Every architectural decision is made with three constraints: tenant data isolation is non-negotiable, AI operations are always async to prevent blocking, and the system must be horizontally scalable from day one without requiring architectural rewrites.

## Frontend Architecture

Next.js 14 with App Router is chosen for three reasons. Server Components reduce client bundle size and improve LCP scores. Built-in API routes simplify backend-for-frontend patterns. Vercel deployment is zero-config and gives preview deployments for every PR.

The frontend is split into four distinct dashboard experiences that share a component library but have separate layouts and routing trees. The recruiter dashboard is the primary view — complex, data-heavy, with the Kanban board and analytics. The hiring manager dashboard is simplified — primarily a list of candidates in their stage with scorecard submission. The candidate portal is public-facing and minimal. The admin dashboard covers billing, user management, and platform configuration.

State management uses Zustand for client state (current user, sidebar state, modal state) and TanStack Query for server state (API data fetching, caching, invalidation). This split avoids the performance problems of putting API data in Zustand and the complexity of managing UI state in React Query.

Forms use React Hook Form with Zod schemas. Every form has client-side validation that mirrors server-side validation. The Zod schemas are shared between frontend and backend via a shared types package in the monorepo.

Real-time features use Socket.io client. When a recruiter moves a candidate on the Kanban, other users viewing the same pipeline see the update within 500ms without refreshing.

The component library is built on shadcn/ui with Tailwind CSS. shadcn is chosen over Chakra or MUI because components are copied into the project and fully customizable, not locked behind a versioned package. This matters because hiring platform UIs have complex, non-standard interactions.

## Backend Architecture

NestJS is chosen for the backend for three reasons. Its module system maps cleanly to domain boundaries (Auth module, Jobs module, Applications module). Its dependency injection makes testing straightforward. Its decorator-based approach works well with TypeScript and produces readable, maintainable code.

The backend is a monolith-first architecture, deliberately. Not a microservices architecture. The system will be split into services only when there is a measurable performance problem that requires it. Premature microservices decomposition is one of the most common mistakes in early-stage startups and it dramatically increases operational complexity.

However, the monolith is structured to be modular: each domain is a self-contained NestJS module with its own controller, service, repository, and DTOs. The AI processing pipeline is the exception — it runs as a separate BullMQ worker process from day one because AI jobs are long-running and must not block the API server.

Modules: AuthModule, UsersModule, CompaniesModule, JobsModule, ApplicationsModule, InterviewsModule, OffersModule, NotificationsModule, BillingModule, AnalyticsModule, AiModule, StorageModule, WebsocketsModule.

The AI module is specifically not the same as the AI worker. The AI module exposes service methods that enqueue jobs. The AI worker is a separate process that picks up jobs from BullMQ and calls OpenAI.

BullMQ runs on top of Redis and handles five queue types: resume-parsing, candidate-scoring, bias-detection, interview-question-generation, and notification-dispatch. Each queue has configurable concurrency, retry logic with exponential backoff, and dead letter queue handling.

Prisma is the ORM for PostgreSQL. It provides type-safe database access, migration management, and a good developer experience. Every query that accesses tenant data goes through a middleware layer that automatically appends the company_id filter.

The Prisma middleware is a custom implementation that reads the current tenant from the request context (set by auth middleware) and appends a WHERE company_id = :id to every query on tenant-scoped tables. This is not RLS at the database level — it is application-level enforcement — but the architecture is designed so this middleware cannot be bypassed.

## Database Architecture

PostgreSQL 15 on AWS RDS is the primary database. It handles all relational data: users, companies, jobs, applications, interviews, offers, pipeline stages.

MongoDB via MongoDB Atlas handles unstructured and semi-structured data: parsed resume JSON, AI score breakdowns with full explanation arrays, interview notes with sentiment analysis, and AI-generated interview questions. The schema for these documents changes frequently as AI prompts are refined and MongoDB's schema flexibility is the right tool.

Redis on AWS ElastiCache serves three purposes: BullMQ job queue, session data caching, and application-level caching for frequently read data like active job listings and company configuration.

AWS S3 stores all binary files: resume PDFs, portfolio files, profile images, offer letter PDFs, and future video recordings. Files are accessed via signed URLs — never directly via public S3 URLs.

## Infrastructure Architecture

AWS is the primary cloud provider. The backend runs on AWS ECS with Fargate — containers without managing EC2 instances. This is the right choice for an early-stage platform: you pay for what you use, you can scale tasks independently, and there's no server management overhead.

The architecture is: Application Load Balancer → ECS Service (API containers) → RDS PostgreSQL + ElastiCache Redis + S3. A separate ECS Service runs the BullMQ workers. This separation is critical: AI workers consume heavy compute and should not impact API latency.

CloudFront sits in front of S3 for file delivery. Route 53 handles DNS. ACM handles SSL certificates.

The frontend deploys to Vercel. The API is on api.yourplatform.com. The frontend is on app.yourplatform.com. The candidate portal is on portal.yourplatform.com (or company-specific subdomains for white-label).

## AI Architecture

The AI pipeline has five distinct flows, each implemented as a BullMQ queue.

Resume parsing flow: Candidate uploads PDF → S3 upload → API creates application record → enqueues resume-parse job → worker downloads PDF from S3 → extracts text → sends to OpenAI with structured extraction prompt → receives JSON with skills, experience, education → stores in MongoDB → updates application record in PostgreSQL with parsed flag → triggers candidate-scoring job.

Candidate scoring flow: Triggered after resume parse or manually → loads job requirements from PostgreSQL → loads candidate parsed resume from MongoDB → constructs scoring prompt with rubric → sends to OpenAI → receives score (0-100) plus explanation array → stores in MongoDB → updates PostgreSQL application record with score → WebSocket event sent to connected clients.

Bias detection flow: Triggered on job post save → sends job description to OpenAI with bias detection prompt → receives flagged phrases with categories (gender-coded, age-biased, exclusionary) and suggestions → returns to frontend as inline warnings → not blocking (recruiter can publish anyway with flags noted).

Interview question generation flow: Triggered when interview kit is created → loads job description, required skills, seniority level → sends to OpenAI → receives structured question set with categories (behavioral, technical, culture) → stores in MongoDB → returns to frontend.

Sentiment analysis flow: Triggered when interview notes are saved → sends note text to OpenAI → receives sentiment score and key themes → stores alongside note in MongoDB → surfaces in aggregated feedback view.

OpenAI is the exclusive AI provider in v1. The system is architected with an AI provider abstraction layer so that specific models can be swapped, or Anthropic / local models can be added without changing the queues or the rest of the system.

## Event-Driven Architecture

Domain events are the communication mechanism between modules. When an application is created, an ApplicationCreated event is published. The NotificationsModule listens and sends the recruiter an email. The AnalyticsModule listens and increments the source counter. The AiModule listens and enqueues a resume parse job.

This decoupling means adding a new reaction to an event (for example, a Slack notification) requires adding a listener, not modifying existing code. This is the Open-Closed Principle applied to event handlers.

Events are implemented using NestJS EventEmitter for in-process events in the MVP. In a future scaling step, these migrate to an SQS or SNS bus for cross-process delivery.

## Notification Architecture

Notifications have two channels: email via SendGrid and in-app via WebSocket. SMS via Twilio is a P1 feature.

The notification system is template-based. Each notification type (ApplicationReceived, InterviewScheduled, OfferSent, etc.) has a corresponding HTML email template stored in the codebase. Templates use Handlebars for variable substitution. SendGrid handles delivery, open tracking, and bounce handling.

In-app notifications use a persistent notifications table in PostgreSQL. When a notification is created, it is written to the database and the user's active Socket.io connection receives a push. On next login if the user was offline, they see unread notifications from the database.

## Analytics Architecture

Analytics data flows through two mechanisms. Real-time counts (current pipeline stage counts, today's applications) come from PostgreSQL queries with appropriate indexes. Historical aggregations (weekly conversion rates, monthly time-to-hire) come from a separate analytics table populated by a nightly scheduled job.

The nightly job reads from the main tables, computes aggregations per company per time period, and writes to an analytics_snapshots table. This keeps analytics queries fast and prevents large aggregation queries from hitting production tables.

Charts are rendered with Recharts on the frontend, fetching from a dedicated /analytics API namespace.

## Billing Architecture

Stripe is the exclusive billing provider. The integration covers Checkout Sessions for new subscriptions, Customer Portal for self-service management, webhooks for subscription state changes, usage reporting for metered billing (AI credits), and invoice retrieval.

Each company record stores stripe_customer_id and stripe_subscription_id. Subscription status is synced via webhook into the companies table. Every API request goes through a subscription guard that checks the company's plan and enforces feature limits.

Plan limits are stored in the codebase as a configuration object (not in the database) because they change infrequently and need to be deployed atomically with feature changes.

---

# SECTION 5: DATABASE DESIGN

## PostgreSQL Schema

The companies table is the root of the multi-tenant structure. Every other table that contains tenant data has a company_id foreign key.

companies table fields: id (uuid, primary key), name (varchar 255), slug (varchar 100, unique), plan (enum: starter, growth, enterprise), stripe_customer_id (varchar, unique, nullable), stripe_subscription_id (varchar, unique, nullable), subscription_status (enum: active, past_due, canceled, trialing), max_users (integer), max_jobs (integer), created_at (timestamp), updated_at (timestamp), deleted_at (timestamp nullable for soft delete).

Index on slug for subdomain lookup. Index on stripe_customer_id for webhook processing.

users table fields: id (uuid), company_id (uuid, foreign key to companies), email (varchar 255), password_hash (varchar, nullable for OAuth users), first_name (varchar), last_name (varchar), role (enum: super_admin, company_admin, recruiter, hiring_manager, interviewer, candidate), is_active (boolean), email_verified (boolean), avatar_url (varchar, nullable), google_id (varchar, nullable, unique), created_at, updated_at, last_login_at (timestamp, nullable).

Index on (company_id, email) unique composite. Index on google_id. Index on company_id for listing users per tenant.

refresh_tokens table: id (uuid), user_id (uuid, foreign key), token_hash (varchar, indexed), expires_at (timestamp), revoked (boolean), ip_address (varchar), user_agent (text), created_at. This supports refresh token rotation — each token is stored hashed and marked revoked when used.

jobs table: id (uuid), company_id (uuid), created_by (uuid, foreign key to users), title (varchar 255), department (varchar 100), location (varchar 255), employment_type (enum: full_time, part_time, contract, internship), remote_type (enum: onsite, remote, hybrid), description (text), requirements (text), salary_min (integer, nullable), salary_max (integer, nullable), currency (varchar 3), status (enum: draft, published, closed, archived), ai_description_used (boolean), bias_check_score (integer, nullable), bias_check_results (jsonb, nullable), application_form_fields (jsonb), posted_at (timestamp, nullable), closed_at (timestamp, nullable), created_at, updated_at.

Index on (company_id, status). Index on company_id. The bias_check_results jsonb stores the raw AI response for audit purposes.

pipeline_stages table: id (uuid), company_id (uuid), job_id (uuid nullable — null means company default), name (varchar 100), order_index (integer), stage_type (enum: new, screening, interview, assessment, offer, hired, rejected), is_default (boolean), created_at.

Composite unique on (company_id, job_id, order_index).

applications table: id (uuid), company_id (uuid), job_id (uuid, foreign key), candidate_id (uuid, foreign key to users), current_stage_id (uuid, foreign key to pipeline_stages), source (enum: direct, linkedin, indeed, referral, other), source_detail (varchar, nullable), resume_url (varchar, s3 path), resume_parsed (boolean default false), ai_score (integer nullable 0-100), ai_score_computed_at (timestamp, nullable), rejection_reason (varchar, nullable), status (enum: active, withdrawn, rejected, hired), applied_at (timestamp), created_at, updated_at.

Index on (company_id, job_id). Index on (company_id, current_stage_id). Index on (company_id, ai_score) for sorting. Index on candidate_id.

application_stage_history table: id (uuid), company_id (uuid), application_id (uuid), from_stage_id (uuid, nullable), to_stage_id (uuid), moved_by (uuid, foreign key to users), moved_at (timestamp), time_in_previous_stage_hours (integer). This table is the source of truth for pipeline analytics.

interviews table: id (uuid), company_id (uuid), application_id (uuid), job_id (uuid), scheduled_at (timestamp), duration_minutes (integer), location_type (enum: video, phone, onsite), meeting_link (varchar, nullable), google_event_id (varchar, nullable), interview_kit_id (uuid, nullable), status (enum: scheduled, completed, cancelled), created_by (uuid), created_at, updated_at.

interview_interviewers table: interview_id (uuid), user_id (uuid), primary key on both.

interview_scorecards table: id (uuid), company_id (uuid), interview_id (uuid), submitted_by (uuid), overall_rating (enum: strong_yes, yes, no, strong_no), notes_text (text), sentiment_score (float, nullable), sentiment_computed_at (timestamp, nullable), submitted_at (timestamp).

scorecard_ratings table: id (uuid), scorecard_id (uuid), criterion (varchar 100), rating (integer 1-5), comment (text, nullable).

offers table: id (uuid), company_id (uuid), application_id (uuid), created_by (uuid), base_salary (integer), bonus (integer, nullable), equity (varchar, nullable), start_date (date), expiry_date (date), status (enum: draft, sent, accepted, declined, expired), offer_letter_url (varchar, nullable), sent_at (timestamp, nullable), responded_at (timestamp, nullable), created_at, updated_at.

notifications table: id (uuid), company_id (uuid), user_id (uuid), type (varchar 100), title (varchar 255), body (text), read (boolean default false), metadata (jsonb), created_at.

Index on (user_id, read, created_at) for fetching unread notifications.

audit_logs table: id (uuid), company_id (uuid), user_id (uuid), action (varchar 100), resource_type (varchar 100), resource_id (uuid), old_values (jsonb, nullable), new_values (jsonb, nullable), ip_address (varchar), user_agent (text), created_at. This table grows indefinitely — it gets partitioned by month in production.

email_templates table: id (uuid), company_id (uuid, nullable — null means platform default), type (varchar 100, unique per company), subject (varchar 255), html_body (text), variables (jsonb), created_at, updated_at.

## MongoDB Collections

parsed_resumes collection: \_id (ObjectId), application_id (UUID, indexed), company_id (UUID, indexed), candidate_name (string), contact (object with email, phone, linkedin, location), summary (string), experience (array of objects with company, title, start_date, end_date, description, technologies), education (array of objects with institution, degree, field, graduation_year), skills (array of strings), certifications (array), total_years_experience (float), parsed_at (ISODate), raw_text (string), openai_tokens_used (integer).

candidate_scores collection: \_id, application_id, job_id, company_id, overall_score (0-100), subscores (object with keys skills_match, experience_level, education_relevance, keywords_match each 0-100), explanation (array of strings, 5-10 bullet points explaining the score), strengths (array of strings), gaps (array of strings), computed_at, model_version (string to track which prompt version produced the score), openai_tokens_used.

interview_question_sets collection: \_id, job_id, company_id, created_by, categories (array of objects each with category_name and questions array, each question having text, follow_ups array, expected_answer_hints), created_at, model_version.

ai_bias_reports collection: \_id, job_id, company_id, analyzed_at, flags (array of objects with phrase, start_index, end_index, category enum of gender_coded, age_biased, disability_discriminatory, cultural_exclusionary, suggestion string), overall_severity (enum: low, medium, high), model_version.

## Data Modeling Decisions

The multi-tenant strategy is row-level isolation in PostgreSQL rather than schema-per-tenant or database-per-tenant. Schema-per-tenant requires N schema migrations for N tenants which becomes operationally painful after 50 companies. Database-per-tenant is extremely expensive. Row-level isolation with enforced company_id is the right tradeoff for 0 to 10,000 tenants.

All primary keys are UUIDs v4, not auto-increment integers. This prevents enumeration attacks and makes cross-database references (between PostgreSQL and MongoDB) consistent.

Soft deletes on companies and users. Hard deletes on everything else because storage is cheap and compliance requires audit trails.

The application_stage_history table is denormalized intentionally. It stores time_in_previous_stage_hours at write time rather than computing it at query time. This makes analytics queries trivially fast.

## Indexes

Every foreign key column has an index. Every column used in WHERE clauses for filtering has an index. Every column used for sorting (ai_score, applied_at, created_at) has an index. The audit_logs table has a partial index on company_id and created_at for time-range queries. The notifications table has a composite index on (user_id, read) for the unread count query that runs on every page load.

---

# SECTION 6: API DESIGN

## Versioning Strategy

All API routes are prefixed with /api/v1/. Version 2 routes will coexist at /api/v2/ with no routes removed until v1 is sunset with 6 months notice. The version is in the URL, not in headers, because URL versioning is easier to debug, test, and cache.

## Authentication Endpoints

POST /api/v1/auth/register — Public. Body: email, password, first_name, last_name, company_name. Creates company and first company_admin user. Returns: access_token, refresh_token, user object, company object. Validation: email format, password minimum 8 chars with complexity. Rate limited to 5 per IP per hour.

POST /api/v1/auth/login — Public. Body: email, password. Returns: access_token (expires 15 minutes), refresh_token (expires 30 days), user object. Rate limited to 10 per IP per minute. Increments failed_attempts counter, locks account after 10 failures.

POST /api/v1/auth/refresh — Public. Body: refresh_token. Returns new access_token and rotated refresh_token. Old refresh_token is immediately revoked. Prevents token replay.

POST /api/v1/auth/logout — Authenticated. Revokes the provided refresh_token. Body: refresh_token.

GET /api/v1/auth/google — Public. Redirects to Google OAuth consent screen.

GET /api/v1/auth/google/callback — Public. Handles Google callback, creates or connects account, returns tokens.

POST /api/v1/auth/forgot-password — Public. Body: email. Sends reset email. Always returns 200 to prevent email enumeration.

POST /api/v1/auth/reset-password — Public. Body: token, new_password. Validates token, updates password, revokes all existing refresh tokens for user.

## Users Endpoints

GET /api/v1/users/me — Authenticated. Returns current user with company and permissions.

PATCH /api/v1/users/me — Authenticated. Body: first_name, last_name, avatar (file upload). Updates profile.

GET /api/v1/users — Authenticated, requires role: company_admin. Query params: page, limit, role, search. Returns paginated user list for tenant.

POST /api/v1/users/invite — Authenticated, company_admin. Body: email, role. Sends invitation email with one-time token. Creates user record with is_active false.

PATCH /api/v1/users/:id/role — Authenticated, company_admin. Body: role. Updates user role. Cannot demote the last company_admin.

DELETE /api/v1/users/:id — Authenticated, company_admin. Soft deletes user. Cannot delete self.

## Jobs Endpoints

GET /api/v1/jobs — Authenticated. Query: status, department, location, page, limit, search. Returns tenant-scoped jobs with application count.

POST /api/v1/jobs — Authenticated, recruiter+. Body: title, department, location, employment_type, remote_type, description, requirements, salary_min, salary_max, currency, application_form_fields. Returns created job. Does not publish immediately.

GET /api/v1/jobs/:id — Authenticated. Returns full job with pipeline stages, application counts per stage.

PATCH /api/v1/jobs/:id — Authenticated, recruiter+. Body: any job fields. Returns updated job.

POST /api/v1/jobs/:id/publish — Authenticated, recruiter+. Sets status to published, sets posted_at. Triggers bias check if not yet run.

POST /api/v1/jobs/:id/close — Authenticated, recruiter+. Sets status to closed.

DELETE /api/v1/jobs/:id — Authenticated, company_admin. Soft deletes if no applications, hard closes if applications exist.

POST /api/v1/jobs/:id/ai-description — Authenticated, recruiter+. Body: brief_description, seniority, key_skills. Returns AI-generated full description. Does not save automatically.

POST /api/v1/jobs/:id/bias-check — Authenticated. Triggers bias analysis. Returns immediately with job_id, result available via webhook or polling at GET /api/v1/jobs/:id/bias-check.

GET /api/v1/jobs/:id/pipeline — Authenticated. Returns stages with candidates in each stage for the Kanban view.

## Applications Endpoints

GET /api/v1/applications — Authenticated. Query: job_id, stage_id, min_score, max_score, source, search, page, limit, sort_by, sort_dir. Tenant-scoped. Returns paginated list with candidate name, score, stage, applied_at.

POST /api/v1/applications — Public (for candidate portal) or Authenticated. Body: job_id, first_name, last_name, email, resume (file upload), custom_fields (jsonb). Creates candidate user if not exists. Creates application. Enqueues resume parse job. Returns application_id.

GET /api/v1/applications/:id — Authenticated. Returns full application with parsed resume, AI score, stage history, interviews, notes.

PATCH /api/v1/applications/:id/stage — Authenticated, recruiter+. Body: stage_id, rejection_reason (if moving to rejected). Moves candidate. Emits WebSocket event. Records stage history.

POST /api/v1/applications/:id/notes — Authenticated. Body: content. Creates note associated with application.

POST /api/v1/applications/bulk — Authenticated, recruiter+. Body: application_ids (array), action (enum: move_stage, reject, export), parameters (depends on action). Returns job_id for async bulk operations.

GET /api/v1/applications/export — Authenticated, recruiter+. Query: job_id, stage_id, date_from, date_to. Returns CSV file stream.

## Interviews Endpoints

GET /api/v1/interviews — Authenticated. Query: application_id, job_id, status, date_from, date_to. Returns tenant-scoped interviews.

POST /api/v1/interviews — Authenticated, recruiter+. Body: application_id, scheduled_at, duration_minutes, location_type, meeting_link, interviewer_ids. Creates interview record. Sends calendar invites if Google Calendar connected. Sends notification emails.

PATCH /api/v1/interviews/:id — Authenticated, recruiter+. Update scheduling details. Sends rescheduling notifications.

DELETE /api/v1/interviews/:id — Authenticated, recruiter+. Cancels interview. Sends cancellation emails.

POST /api/v1/interviews/:id/scorecards — Authenticated, interviewer. Body: overall_rating, notes_text, ratings (array of criterion, rating, comment). Creates scorecard. Triggers sentiment analysis job.

GET /api/v1/interviews/:id/scorecards — Authenticated, recruiter+. Returns all scorecards for interview.

POST /api/v1/interviews/:id/question-set — Authenticated. Triggers AI question generation for this interview.

## Offers Endpoints

POST /api/v1/offers — Authenticated, recruiter+. Body: application_id, base_salary, bonus, equity, start_date, expiry_date. Creates draft offer.

GET /api/v1/offers/:id — Authenticated. Returns offer details.

POST /api/v1/offers/:id/generate-letter — Authenticated. Generates PDF offer letter from template. Stores to S3. Returns signed URL.

POST /api/v1/offers/:id/send — Authenticated, recruiter+. Sends offer letter to candidate via email. Sets status to sent.

PATCH /api/v1/offers/:id/respond — Candidate authenticated. Body: response (enum: accepted, declined), reason (nullable). Records decision.

## Analytics Endpoints

GET /api/v1/analytics/pipeline — Authenticated. Query: job_id, date_from, date_to. Returns conversion rates by stage.

GET /api/v1/analytics/time-to-hire — Authenticated. Query: department, date_from, date_to. Returns average days from application to hire.

GET /api/v1/analytics/sources — Authenticated. Returns application volume and conversion rate by source.

GET /api/v1/analytics/team-performance — Authenticated, company_admin. Returns recruiter and hiring manager metrics.

## Error Handling

Every error response follows this structure: status (HTTP code), code (string constant like INVALID_CREDENTIALS, RESOURCE_NOT_FOUND, QUOTA_EXCEEDED), message (human-readable), details (array, for validation errors this is the list of field errors). This consistency means the frontend can handle errors generically with specific overrides.

Validation errors return 422 with a details array. Authentication errors return 401. Authorization errors return 403. Not found returns 404. Business logic errors return 409. Server errors return 500 with a request_id for log correlation.

---

# SECTION 7: AUTHENTICATION AND AUTHORIZATION

## Authentication Flow

Registration creates a company and the first user as company_admin. The password is hashed with bcrypt at cost factor 12. An access token (JWT, 15-minute expiry) and a refresh token (JWT, 30-day expiry) are returned. The refresh token is also stored hashed in the refresh_tokens table so it can be revoked server-side.

Login verifies password with bcrypt.compare. On success, generates the token pair. Failed login increments a Redis counter (key: failed_login:email). After 10 failures, the account is locked for 30 minutes. This prevents brute force without requiring CAPTCHA initially.

Every subsequent request sends the access token in the Authorization header as Bearer token. The auth guard validates the JWT signature, checks expiry, and loads the user from database (or Redis cache with 60-second TTL). The loaded user and their company are attached to the request context.

Access token refresh: client sends refresh token to /auth/refresh. Guard validates the JWT signature and checks that the token hash exists in the database and is not revoked. On success, the old token is marked revoked and a new token pair is issued. This is token rotation — a leaked refresh token can only be used once because the legitimate client's next refresh will fail and the user will be redirected to login.

## JWT Strategy

Access tokens contain: sub (user_id), company_id, role, email. They are signed with RS256 (asymmetric) so the frontend can verify signatures without the private key. The private key is stored in AWS Secrets Manager. The public key is exposed at /auth/jwks for frontend verification.

Refresh tokens contain: sub (user_id), jti (unique token ID, UUID). The jti is what gets stored hashed in the database. This allows revocation of individual tokens without affecting other active sessions.

## OAuth Integration

Google OAuth uses Passport.js with the Google strategy. The flow: user clicks "Sign in with Google" → redirected to /auth/google → Passport redirects to Google → user authenticates → callback at /auth/google/callback → Passport strategy validates the id_token → find user by google_id or email → if new, create user record → issue token pair → redirect to frontend with tokens in URL fragment (not query string, to prevent server logs capturing tokens).

LinkedIn OAuth follows the same pattern but is used for candidate enrichment, not authentication. A separate LinkedIn connect flow in account settings links a LinkedIn account to an existing user.

## RBAC Implementation

Roles form a hierarchy: super_admin > company_admin > recruiter > hiring_manager > interviewer > candidate.

Permissions are defined as a capability matrix in code. A capability is a string constant like jobs:create, applications:read, scorecards:submit. Each role has an array of capabilities. Guards on each controller method check for the required capability.

Example: the applications controller's PATCH stage endpoint requires the applications:move_stage capability. Recruiters and company admins have this. Hiring managers and interviewers do not.

A custom @RequireCapabilities() decorator is used on controller methods. The corresponding guard reads the user's role, looks up capabilities, and returns 403 if the required capability is absent.

The candidate role is special: candidates can only access their own applications, their own offer, and the public job listing. The candidate guard enforces this with an ownership check: is the resource's candidate_id equal to the authenticated user's id?

## Multi-Tenant Authorization

Every database query is automatically scoped to the authenticated user's company_id via Prisma middleware. A guard at the module level also validates that the resource's company_id matches the user's company_id for direct ID lookups.

This creates defense in depth: even if the Prisma middleware were somehow bypassed, the controller-level guard would catch cross-tenant access.

---

# SECTION 8: SECURITY DESIGN

## XSS Prevention

All user-generated content is rendered in React which escapes by default. The one exception is rich text (job descriptions). These are stored as raw HTML from a sanitized rich text editor and rendered with a strict DOMPurify allowlist. The allowlist includes: p, strong, em, ul, ol, li, h2, h3, a (with href validated as https:// only). All other tags and attributes are stripped.

Content-Security-Policy header is set to: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' (for styled-components); img-src 'self' data: https://s3.amazonaws.com; connect-src 'self' wss://yourplatform.com; frame-ancestors 'none'.

## CSRF Prevention

Since the API is stateless JWT, traditional CSRF doesn't apply to API endpoints. However, the Google OAuth callback sets a state parameter that is validated on return. File upload forms use the JWT in the Authorization header, not cookies, which prevents CSRF on uploads.

## SQL Injection Prevention

Prisma uses parameterized queries exclusively. Raw SQL is not used anywhere. If raw SQL becomes necessary for a specific analytics query, it uses Prisma's queryRaw with template literals which are automatically parameterized.

## NoSQL Injection Prevention

All MongoDB queries use Mongoose schema validation. Query parameters that come from user input are validated with class-validator before reaching the database layer. Object IDs are validated as valid ObjectId format before use in queries.

## SSRF Prevention

Any feature that fetches external URLs (for example, LinkedIn enrichment or webhook delivery) goes through an allowlist validator. The validator resolves the domain and checks that the IP is not in RFC 1918 private ranges (10.x.x.x, 172.16-31.x.x, 192.168.x.x) or loopback (127.x.x.x). Redirects are followed and re-validated. AWS metadata endpoint (169.254.169.254) is explicitly blocked.

## DDoS and Rate Limiting

AWS WAF sits in front of the ALB with rules for: rate limiting by IP (1000 requests per 5 minutes), SQL injection pattern blocking, known bad IP lists. NestJS also implements application-level rate limiting using Redis counters: authenticated endpoints are limited to 100 requests per minute per user, auth endpoints are limited to 10 per minute per IP, file uploads are limited to 20 per hour per user.

## File Upload Security

Uploads go through a validation pipeline: file extension whitelist (pdf, doc, docx, png, jpg for resumes; mp4, webm for future video), MIME type validation (checking the file magic bytes, not just the extension), maximum file size enforcement, filename sanitization (strip path traversal characters, generate a UUID-based storage name). Files are never executed. Files are stored in S3 with no public access — only signed URLs with 1-hour expiry are served.

Virus scanning: in production, files are routed through ClamAV running as a Lambda function before being stored to S3. The application record is not created until the scan passes.

## Secrets Management

All secrets are in AWS Secrets Manager. The application fetches secrets at startup, not at runtime per request. Secrets include: database credentials, Redis URL, OpenAI API key, Stripe secret key, SendGrid API key, Google OAuth credentials, JWT private key. Environment variables in the ECS task definition reference Secrets Manager ARNs — they are never stored in plain text anywhere.

No .env files in the repository. The .gitignore enforces this. A .env.example file with dummy values documents what is needed.

## Encryption

Data in transit: TLS 1.2 minimum enforced at the load balancer. HSTS header set with one-year max-age. Certificates managed by ACM, auto-renewed.

Data at rest: RDS encryption enabled at the storage level. S3 server-side encryption with AWS KMS. ElastiCache encryption at rest enabled.

Sensitive fields (social security numbers or similar PII that might appear in offer letters) are encrypted at the application level using AES-256-GCM before storage, with the encryption key in Secrets Manager. The key is rotated annually.

## Audit Logging

Every create, update, and delete operation on core entities (companies, users, jobs, applications, offers) writes an audit log entry with old_values and new_values as JSON. The audit log is write-only from the application — no endpoint allows modification or deletion of audit logs. Audit logs are retained for 3 years per SOC 2 requirements. Monthly partition archiving moves old partitions to S3 Glacier.

## Security Checklist

All endpoints require authentication except public job listing and application submission. Tenant isolation is enforced at both the ORM middleware level and the controller guard level. Password storage uses bcrypt with cost 12. Refresh token rotation implemented. Rate limiting on all sensitive endpoints. File type validation using magic bytes. Signed URLs for S3 access. HSTS header set. CSP header set. Input sanitization on all user-generated content. Audit log on all mutations. Webhook signatures validated using HMAC-SHA256. Stripe webhook signature validated. GDPR: data export endpoint and right-to-erasure endpoint implemented. MFA support built into the auth flow.

---

# SECTION 9: FRONTEND DESIGN

## Application Structure

The Next.js 14 App Router application is organized into route groups. The (app) route group contains authenticated layouts. The (portal) route group contains the candidate-facing portal. The (public) route group contains the public job listings and application form.

The /app directory structure:

app/
(app)/
layout.tsx — authenticated layout with sidebar and header
dashboard/page.tsx
jobs/
page.tsx — job list
new/page.tsx — create job
[id]/page.tsx — job detail
[id]/pipeline/page.tsx — kanban board
[id]/analytics/page.tsx
applications/
page.tsx — all applications across jobs
[id]/page.tsx — application detail
interviews/
page.tsx
[id]/page.tsx
offers/[id]/page.tsx
analytics/page.tsx
settings/
page.tsx — company settings
users/page.tsx
billing/page.tsx
pipeline/page.tsx — stage configuration
templates/page.tsx — email templates
(portal)/
layout.tsx — minimal layout, no sidebar
apply/[jobId]/page.tsx — public application form
status/page.tsx — candidate application status
(auth)/
login/page.tsx
register/page.tsx
forgot-password/page.tsx
reset-password/page.tsx
invite/page.tsx

## Routing

Routes are protected by a middleware.ts at the root that checks for a valid access token in cookies (stored as httpOnly). If absent, redirects to login. If present and expired, attempts refresh before redirecting.

Role-based routing: hiring_manager and interviewer roles cannot access the settings or billing routes. Candidate role only accesses the portal routes. This is enforced both in middleware and with a useRequireCapability hook on individual components.

## Layouts

The authenticated layout has a collapsible left sidebar with navigation icons, a top header with company logo, notification bell, and user avatar dropdown. The sidebar items change based on user role — candidates see nothing, interviewers see interviews only, recruiters see everything.

The sidebar state is persisted to localStorage so it remembers collapsed/expanded state.

## Component Architecture

The component hierarchy is: pages → layout components → feature components → UI primitives.

UI primitives come from shadcn/ui: Button, Input, Select, Dialog, Dropdown, Tabs, Badge, Card, Avatar, Toast. These are in /components/ui/ and are not modified structurally, only themed.

Feature components are domain-specific: ApplicationCard, CandidateScoreRing, KanbanColumn, InterviewScheduler, OfferLetterPreview, StageProgressBar. These are in /components/features/.

## Kanban Board

The Kanban board is the most complex frontend component. It uses dnd-kit for drag-and-drop because it is accessible, works with touch screens, and has good performance with large lists.

Each column is a pipeline stage. Each card is an application. Cards display: candidate name, AI score (color coded: green 80+, yellow 60-79, red below 60), days in stage, source badge.

Drag events call the PATCH /applications/:id/stage endpoint optimistically (update the UI immediately, revert on error) and emit via Socket.io so other users see the same movement.

The board handles large volumes by virtualizing card lists with @tanstack/virtual when a column has more than 50 cards.

## State Management

Zustand stores: auth store (current user, company, permissions), ui store (sidebar state, active modal, global loading), notifications store (unread count, notification list).

TanStack Query handles all API data. Each entity has a corresponding query hook: useJobs, useApplications, useApplication(id), useAnalytics. Invalidation is explicit — when a mutation succeeds, the relevant query cache keys are invalidated.

Real-time updates from Socket.io events also trigger query invalidations so the TanStack Query cache stays in sync with the server.

## Forms

All forms use React Hook Form with Zod resolver. Form state is never stored in Zustand. Forms are colocated with their pages.

The job creation form is multi-step with steps managed by a local state machine: Step 1 is Basic Info, Step 2 is Description with AI assist, Step 3 is Requirements and Salary, Step 4 is Application Form Builder. Each step validates before proceeding.

The application form builder on Step 4 allows recruiters to add custom fields (text, select, checkbox, file). It uses a dynamic field array managed by React Hook Form's useFieldArray.

## Accessibility

All interactive components have proper ARIA labels. The Kanban board has keyboard navigation support (arrow keys to select cards, Enter to open, Space to start drag mode). Color is never the only indicator — the score ring has a text label and icon as well as color. Focus management on modals (trap focus inside modal, restore focus on close). Screen reader announcements for async operations (job loading, AI processing).

## Mobile Responsiveness

The layout is responsive from 320px width. On mobile: sidebar becomes a bottom tab bar, Kanban board becomes a vertical list view (drag-and-drop disabled on touch, replaced with a move button), data tables collapse non-essential columns, forms go single column.

## Complete Folder Structure

src/
app/ (Next.js App Router as described above)
components/
ui/ (shadcn primitives)
features/
applications/
ApplicationCard.tsx
ApplicationDetail.tsx
ApplicationTable.tsx
AiScoreDisplay.tsx
StageHistoryTimeline.tsx
jobs/
JobCard.tsx
JobForm.tsx
BiasWarningPanel.tsx
AiDescriptionModal.tsx
kanban/
KanbanBoard.tsx
KanbanColumn.tsx
KanbanCard.tsx
DragOverlay.tsx
interviews/
InterviewScheduler.tsx
ScorecardForm.tsx
ScorecardSummary.tsx
QuestionSetDisplay.tsx
analytics/
PipelineFunnel.tsx
TimeToHireChart.tsx
SourceQualityChart.tsx
notifications/
NotificationBell.tsx
NotificationList.tsx
billing/
PlanCard.tsx
UsageBar.tsx
hooks/
useAuth.ts
useSocket.ts
useRequireCapability.ts
useApplications.ts
useJobs.ts
useAnalytics.ts
useDebounce.ts
useInfiniteScroll.ts
store/
auth.store.ts
ui.store.ts
notifications.store.ts
lib/
api.ts (axios instance with interceptors)
socket.ts (socket.io client singleton)
validations/ (shared Zod schemas)
utils.ts
types/
api.types.ts
domain.types.ts

---

# SECTION 10: BACKEND DESIGN

## Module Structure

Each NestJS module follows the pattern: Module file → Controller → Service → Repository (Prisma extension) → DTOs → Entities → Events.

## Auth Module

AuthController handles the endpoints defined in Section 6. AuthService contains login, register, refresh, logout, forgotPassword, resetPassword. The service depends on UsersService for user operations and a JwtService wrapper. RefreshTokenRepository handles CRUD on the refresh_tokens table. Two Passport strategies are defined: JwtStrategy (access token validation) and GoogleStrategy (OAuth).

Guards: JwtAuthGuard (validates access token on every protected route), RoleGuard (checks role hierarchy), CapabilityGuard (checks specific capability). The guards are applied globally via the AppModule with JwtAuthGuard as the default, and specific routes opt out with a @Public() decorator.

## Jobs Module

JobsController maps to all job endpoints. JobsService contains createJob, updateJob, publishJob, closeJob, generateAiDescription, requestBiasCheck. JobsRepository wraps Prisma calls, all automatically scoped to the current company_id via the tenant middleware. When a job is published, the service emits a JobPublished event.

The AI description generation calls a method on the AiService but does not enqueue a job — it calls OpenAI synchronously and returns the result. This is acceptable because the user is actively waiting for the response and it is a one-time operation per publish.

## Applications Module

ApplicationsService contains createApplication, moveStage, bulkOperation, getApplicationWithFullProfile, exportToCsv. When createApplication is called, it saves the resume to S3, creates the application record, and emits an ApplicationCreated event. The event handler in the AiModule enqueues the resume parse job.

The getApplicationWithFullProfile method fetches the PostgreSQL application record, then queries MongoDB for the parsed_resume and candidate_score documents, and assembles the full profile DTO.

## AI Module (Queue Definitions)

The AiModule defines five BullMQ queues with their processors. Each processor is in a separate file. The module does not expose HTTP endpoints — it is triggered by internal events and returns results by updating the database and emitting WebSocket events.

ResumeParseProcessor: fetches PDF from S3, extracts text (using pdf-parse library), sends to OpenAI with the extraction prompt, validates the response JSON against a Zod schema, saves to MongoDB, updates the application's resume_parsed flag, enqueues CandidateScoringJob.

CandidateScoringProcessor: loads job from PostgreSQL, loads parsed resume from MongoDB, constructs scoring prompt, calls OpenAI, validates response, saves to MongoDB, updates application.ai_score in PostgreSQL, emits ApplicationScored WebSocket event.

The OpenAI client is initialized once in the AiModule with the API key from config. All processors use the same client instance.

## Notifications Module

NotificationsService.send(type, recipientId, data) is the single public method. It: creates a database notification record, emits a WebSocket event to the recipient's room, and enqueues an email job. The email queue processor uses SendGrid with the appropriate template.

Email templates are stored in the codebase as Handlebars files in the /templates directory and compiled at startup. This avoids database roundtrips for every email.

## Billing Module

BillingService wraps the Stripe SDK. Methods: createCheckoutSession, createCustomerPortalSession, handleWebhook. The webhook handler is the critical piece: it validates the Stripe signature, then handles subscription.updated, subscription.deleted, payment_intent.succeeded, and invoice.payment_failed events by updating the company's subscription_status in PostgreSQL.

A SubscriptionGuard is applied to AI-heavy routes. It checks the company's subscription_status and plan limits. If the company is on the starter plan and has exceeded its monthly AI score quota, it returns 402 with an upgrade prompt.

## WebSocket Gateway

A single NestJS WebSocket gateway handles real-time connections. On connection, the gateway authenticates the connection using the JWT from the handshake query parameter and joins the user to two rooms: their user_id room (for personal notifications) and their company_id room (for team events like Kanban moves).

Events emitted to the company room: ApplicationMoved, ApplicationScored, NewApplicationReceived. Events emitted to the user room: NotificationCreated.

## Background Jobs

Beyond the AI queues, there are three scheduled jobs. The analytics aggregation job runs at 2 AM UTC daily and computes the previous day's pipeline statistics per company, writing to the analytics_snapshots table. The expired refresh token cleanup job runs weekly and deletes tokens past their expiry. The offer expiry check job runs daily and marks offers past their expiry_date as expired, sending a notification to the recruiter.

## Backend Folder Structure

src/
modules/
auth/
auth.module.ts
auth.controller.ts
auth.service.ts
strategies/
jwt.strategy.ts
google.strategy.ts
guards/
jwt-auth.guard.ts
capability.guard.ts
dto/
login.dto.ts
register.dto.ts
refresh-token.dto.ts
users/
users.module.ts
users.controller.ts
users.service.ts
users.repository.ts
dto/
update-user.dto.ts
invite-user.dto.ts
companies/
companies.module.ts
companies.service.ts
companies.repository.ts
jobs/
jobs.module.ts
jobs.controller.ts
jobs.service.ts
jobs.repository.ts
events/
job-published.event.ts
dto/
applications/
applications.module.ts
applications.controller.ts
applications.service.ts
applications.repository.ts
events/
application-created.event.ts
application-moved.event.ts
dto/
interviews/
offers/
ai/
ai.module.ts
processors/
resume-parse.processor.ts
candidate-scoring.processor.ts
bias-detection.processor.ts
interview-questions.processor.ts
sentiment-analysis.processor.ts
prompts/
resume-parse.prompt.ts
candidate-scoring.prompt.ts
bias-detection.prompt.ts
interview-questions.prompt.ts
ai.service.ts (queue enqueue methods)
notifications/
notifications.module.ts
notifications.service.ts
templates/ (Handlebars .hbs files)
billing/
billing.module.ts
billing.controller.ts
billing.service.ts
analytics/
analytics.module.ts
analytics.controller.ts
analytics.service.ts
jobs/
aggregate-analytics.job.ts
websockets/
websockets.module.ts
websockets.gateway.ts
common/
middleware/
tenant.middleware.ts (sets company context)
logger.middleware.ts
decorators/
current-user.decorator.ts
require-capabilities.decorator.ts
public.decorator.ts
tenant-id.decorator.ts
filters/
all-exceptions.filter.ts
interceptors/
audit-log.interceptor.ts
response-transform.interceptor.ts
pipes/
validation.pipe.ts
config/
database.config.ts
ai.config.ts
aws.config.ts
stripe.config.ts
prisma/
schema.prisma
migrations/
main.ts
app.module.ts

---

# SECTION 11: DEVOPS AND INFRASTRUCTURE

## Local Development

Docker Compose defines five services for local development: postgres (PostgreSQL 15), mongodb (MongoDB 7), redis (Redis 7), api (NestJS app in dev mode with hot reload), and worker (BullMQ workers).

A separate docker-compose.override.yml adds MinIO as a local S3 replacement and MailHog for email capture. This means local development requires zero real external service accounts.

The development workflow: clone repo → copy .env.example to .env.local → docker-compose up → npm run prisma:migrate → npm run seed. The seed script creates a demo company with sample jobs, candidates, and a mix of scored and unscored applications.

Hot reload is enabled via NestJS's built-in watch mode. Frontend Next.js runs natively (not in Docker) for the fastest hot module replacement.

## CI/CD Pipeline

GitHub Actions defines three workflows.

PR workflow (runs on every PR): checkout → install dependencies (cached) → lint (ESLint, Prettier) → type check (tsc --noEmit) → unit tests → integration tests → build frontend → Vercel preview deployment comment on PR with URL.

Staging deployment (runs on merge to develop branch): all PR checks → build Docker image → push to ECR → run Prisma migrations against staging database → deploy to ECS staging cluster → run smoke tests against staging URL → notify Slack.

Production deployment (runs on git tag vX.X.X): all staging checks → create GitHub release → build Docker image tagged with version → push to ECR → manual approval step (GitHub Environments) → blue-green deployment on ECS production → run smoke tests → monitor for 10 minutes → auto-rollback if error rate exceeds 1%.

Blue-green deployment works by updating the ECS task definition to the new Docker image, deploying a new task set, waiting for it to become healthy, shifting traffic via the ALB target group, then draining the old task set.

## Docker Configuration

The API Dockerfile is multi-stage. Build stage: node:20-alpine, copy package files, npm ci with cache mount, copy source, npx prisma generate, npm run build. Production stage: node:20-alpine, copy node_modules and dist from build stage, set NODE_ENV=production, CMD ["node", "dist/main.js"]. Image is approximately 180MB.

The worker uses the same Dockerfile with a different CMD: CMD ["node", "dist/worker.js"]. The worker entrypoint bootstraps only the AI and notification modules, not the HTTP server.

.dockerignore excludes: node_modules, .git, .env*, test/, *.spec.ts.

## Monitoring and Logging

Structured logging uses Pino. Every log line is JSON with: timestamp, level, requestId (UUID generated per request), userId, companyId, duration (for request logs), and message. Logs stream to CloudWatch Logs via the ECS log driver.

CloudWatch dashboards display: API error rate, average response time, queue depth (BullMQ jobs waiting), queue processing time, AI job success rate.

Application errors are tracked in Sentry. Every uncaught exception and every failed BullMQ job is sent to Sentry with full context including user ID, company ID, and request body (with PII fields redacted). Sentry alerts route to Slack for p1 errors.

Uptime monitoring uses Better Uptime. Synthetic checks run every 60 seconds against /api/v1/health. The health endpoint checks: database connection, Redis connection, MongoDB connection, and returns degraded if any are slow.

## Backup Strategy

RDS: automated daily snapshots retained for 7 days. Point-in-time recovery enabled with 5-minute granularity. Monthly snapshots exported to S3 and retained for 1 year.

MongoDB Atlas: automated daily backups with 7-day retention. Atlas handles this natively.

S3: versioning enabled on the resumes and documents bucket. No automatic deletion — files are retained indefinitely.

Before every production deployment, a manual database backup is triggered via GitHub Actions.

## Environment Management

Three environments: local (Docker Compose), staging (AWS ECS, shared database, synthetic data only), production (AWS ECS, production database, real data).

Environment variables are structured by category: APP* (port, environment name), DATABASE* (connection string), REDIS* (URL), MONGODB* (connection string), OPENAI* (API key), STRIPE* (secret key, webhook secret), SENDGRID* (API key), AWS* (region, S3 bucket, SES configuration), GOOGLE* (OAuth credentials), JWT* (private key reference in Secrets Manager).

Staging uses real integrations but test Stripe keys, test SendGrid sender, and a separate OpenAI API key with a $50/month hard limit.

---

# SECTION 12: SCALABILITY PLAN

## Expected Bottlenecks

The first bottleneck is the AI processing pipeline. OpenAI API calls are slow (2 to 8 seconds each) and rate limited. At 1,000 applications per day, that is 2,000 AI jobs (parse + score) consuming the API at volume. The queue architecture handles this via concurrency control and retry, but cost becomes significant.

The second bottleneck is the PostgreSQL write path. The application_stage_history and audit_log tables are append-only and grow continuously. At 10,000 users they will have millions of rows within months.

The third bottleneck is the analytics queries. Cross-application aggregations are expensive. The nightly snapshot approach helps but real-time analytics will require further caching.

The fourth bottleneck is the WebSocket connections. At 10,000 concurrent users, a single Socket.io server is insufficient. This requires Redis pub/sub for cross-instance message delivery.

## 100 Users Tier

Single ECS task for the API (2 vCPU, 4GB RAM), single ECS task for the worker, RDS db.t3.medium, ElastiCache cache.t3.micro. Total infrastructure cost approximately $200/month. No special caching — all queries hit the database. Queue concurrency at 3 for AI jobs.

## 1,000 Users Tier

Two ECS tasks for the API behind the ALB, two worker tasks for parallel AI processing. RDS db.t3.large. Redis queue depth monitoring — add a third worker task automatically via ECS auto-scaling if queue depth exceeds 100 jobs. Add CloudFront caching for public job listings (cache for 60 seconds). Total cost approximately $500/month.

## 10,000 Users Tier

Auto-scaling ECS service for API (min 3, max 10 tasks based on CPU). Dedicated worker cluster with 5 to 15 tasks. RDS db.r6g.large with read replica. Enable Redis read replicas for caching layer. Switch analytics to materialized views with hourly refresh. Implement database connection pooling via PgBouncer. Add rate limiting tier per company to prevent large companies from starving small ones. Total cost approximately $2,500/month.

## 100,000 Users Tier

At this scale, consider splitting the AI worker into a separate microservice with its own deployment pipeline, auto-scaling based on queue depth, and dedicated rate limit tracking per customer. PostgreSQL needs read replicas for each geographic region if you're serving multiple regions. The audit_log table needs monthly partitioning with automated archival to S3. Consider adopting Amazon Aurora PostgreSQL for better read replica performance. Implement a caching layer (Redis) for the most accessed job listings, company configurations, and active pipeline stages — cache hit rate should target 80%+. Total cost approximately $15,000/month.

## 1,000,000 Users Tier

At this scale the platform becomes a global SaaS requiring multi-region deployment. The database strategy shifts to Aurora Global Database for cross-region replication. AI processing moves to a dedicated service potentially with fine-tuned models hosted on dedicated infrastructure to reduce per-call costs. The BullMQ queue backend could migrate to Amazon SQS for managed infinite scalability. CDN coverage becomes global via CloudFront with edge caching. Cost modeling at this scale is complex — rough estimate $50,000 to $100,000/month depending on AI feature usage, with gross margins maintained through fine-tuned model cost reduction.

## Caching Strategy

Level 1: In-memory cache within each API container for static data that changes infrequently (plan limits, feature flags). TTL of 5 minutes. Cleared on deployment.

Level 2: Redis cache for user sessions, company configuration, and active job stage lists. TTL of 60 seconds for pipeline data, 300 seconds for company config.

Level 3: CloudFront cache for public job listing pages. TTL of 60 seconds with cache invalidation on job publish/close.

Cache invalidation follows the pattern: when a mutation occurs, invalidate the specific cache key synchronously and let the next read repopulate. No background refresh (it creates consistency issues).

---

# SECTION 13: TESTING STRATEGY

## Unit Tests

Coverage target: 80% across all modules, 95% on the AI prompt construction logic and scoring normalization functions.

Every service class has a corresponding .spec.ts file. Services are tested with all dependencies mocked using Jest's mock system. The test focus is business logic: does moveStage correctly create a stage history record, does the scoring processor correctly handle a failed OpenAI response, does the capability check correctly reject a hiring manager trying to access billing.

AI processor unit tests mock the OpenAI client and test the response parsing and error handling. There are test fixtures for valid and malformed OpenAI responses.

## Integration Tests

Integration tests use a real PostgreSQL test database (created fresh per test suite via Prisma migrate) and mock external services (OpenAI, Stripe, SendGrid). These are the most valuable tests because they catch issues in the Prisma middleware, the tenant isolation, and the event emission chain.

Key integration test scenarios: tenant isolation — a request authenticated as Company A cannot retrieve Company B's data; stage movement creates history record; publish job triggers bias check job enqueue; AI score update triggers WebSocket event.

## API Tests

API tests use Supertest against the full running NestJS application. They test the complete request/response cycle including auth guards, validation pipes, and serialization. These run in CI on every PR.

Test data is managed by a test factory module that creates realistic entities in the test database. Factories use a builder pattern: UserFactory.create({ role: 'recruiter', company: companyA }).

## E2E Tests

Playwright is used for E2E tests. Key user flows tested: register company and complete onboarding, create and publish job, submit application as candidate, AI score appears on application after async processing (tests the Socket.io update), recruiter moves candidate through stages, schedule interview, submit scorecard, generate offer letter.

E2E tests run against the staging environment on a schedule (every 6 hours) and before every production deployment. They do not run on every PR (too slow).

## Performance Tests

k6 is used for load testing. Scenarios: 100 concurrent users browsing job listings, 50 concurrent recruiters on the Kanban board, 200 simultaneous application submissions. Performance targets: 95th percentile response time below 200ms for read endpoints, below 500ms for write endpoints. Error rate below 0.1%.

Load tests run monthly against the staging environment and before major releases.

## Security Tests

OWASP ZAP runs against the staging API weekly. npm audit runs in CI on every PR. Snyk monitors dependencies for vulnerabilities with automated PR creation for patches. Periodic manual penetration tests from a security consultant quarterly once the product has paying customers.

---

# SECTION 14: ANALYTICS AND OBSERVABILITY

## Product Analytics

Posthog is used for product analytics (self-hosted or cloud). Events tracked: user signed up, job created, job published, AI description generated, application received, candidate scored, stage moved, interview scheduled, scorecard submitted, offer sent, offer accepted, offer declined, subscription upgraded, subscription canceled.

Every event includes: company_id (for cohort analysis by company), user_id, role, plan, and event-specific properties. This enables: which plan companies are most active, which features drive retention, where users drop off in the job creation flow.

Posthog funnels show: signup to first job post conversion, application received to offer accepted funnel, trial to paid conversion rate.

## Business Analytics

An internal admin dashboard (only for super_admin role) shows: MRR, churn rate, new companies this week, active companies (at least one job published in last 30 days), AI credits consumed this month, top companies by usage, support tickets by category.

This dashboard is built with the same Recharts components used in the customer-facing analytics, pulling from the admin analytics service that is completely separated from tenant data.

## Infrastructure Monitoring

CloudWatch dashboards display: ECS task CPU and memory utilization, RDS CPU, connections, read/write IOPS, ElastiCache hit rate and evictions, ALB request count and error rates by status code, BullMQ job queue depth by queue name.

Alarms: ECS CPU above 80% for 5 minutes triggers auto-scaling and PagerDuty alert. RDS CPU above 90% triggers PagerDuty. Queue depth above 500 jobs triggers PagerDuty. Error rate above 1% for 5 minutes triggers PagerDuty.

## Error Tracking

Sentry captures: all unhandled exceptions in the API, all failed BullMQ jobs with their input data, all frontend JavaScript errors. PII is scrubbed before sending to Sentry — the beforeSend hook removes fields containing email, phone, resume_text, and password.

Sentry alerts route to a dedicated #errors Slack channel. Alerts are deduplicated so a single error spike doesn't flood the channel.

## Audit Logs for Compliance

The audit trail is customer-accessible via a UI in the settings area (company_admin role). Customers can filter by date range, user, and resource type. They can export the audit log as CSV. This is a requirement for enterprise SOC 2 compliance.

Internally, audit logs are searchable in CloudWatch Logs Insights for incident investigation.

---

# SECTION 15: IMPLEMENTATION ROADMAP

## Phase 1: Foundation (Weeks 1 to 4)

Goal: Working multi-tenant auth, basic job management, and CI/CD pipeline.

Week 1: Project setup. Initialize NestJS monorepo. Set up Prisma with PostgreSQL schema for companies, users, refresh_tokens. Implement AuthModule with register, login, refresh, logout. Write unit tests for auth service. Set up GitHub Actions with lint and test. Configure Docker Compose for local dev.

Week 2: Multi-tenancy foundation. Implement tenant middleware. Implement RoleGuard and CapabilityGuard. Build UsersModule and CompaniesModule. Implement invitation flow. Build the settings/users UI page. Test cross-tenant isolation with integration tests.

Week 3: Jobs foundation. Build JobsModule with CRUD. Implement pipeline stages system (default stages plus custom per job). Build the Next.js job list and job creation form (without AI yet). Connect to the backend API. Add job publishing flow.

Week 4: CI/CD and deployment. Set up AWS infrastructure: RDS, ElastiCache, ECS cluster, S3 buckets, ALB. Configure Secrets Manager. Deploy the staging environment. Set up Vercel frontend deployment. Connect staging environment end-to-end. Achieve deployable staging URL.

Deliverable: A multi-tenant platform where companies can register, invite users, and create/publish job listings. Deployed to staging.

Risk: AWS infrastructure setup takes longer than expected. Mitigation: use Terraform or CDK from the start to make it reproducible.

## Phase 2: Core Application Flow (Weeks 5 to 8)

Goal: Complete application submission, AI pipeline, and Kanban board.

Week 5: Application submission. Build the public application form (React, Zod validation). Implement resume upload to S3. Create ApplicationsModule in the backend. Build the candidate record creation flow. Connect the form to the API.

Week 6: AI pipeline. Set up BullMQ with Redis. Implement ResumeParseProcessor with OpenAI integration. Implement CandidateScoringProcessor. Build the AI Module with queue enqueue methods. Write the resume parsing prompt and scoring prompt with careful engineering to get reliable JSON output. Test with 50 real resumes.

Week 7: Kanban board. Build the Kanban board with dnd-kit. Implement stage movement API. Set up Socket.io for real-time updates. Implement WebSocket gateway. Connect stage moves to Socket.io events. Build the application detail side panel with parsed resume display and AI score with explanation.

Week 8: Email notifications and Stripe. Implement NotificationsModule with SendGrid. Create email templates for all MVP notification types. Implement BillingModule with Stripe Checkout and webhook handling. Build the billing settings page. Implement SubscriptionGuard on AI endpoints. End-to-end test the complete flow: apply, parse, score, view, move.

Deliverable: Complete MVP. Companies can post jobs, candidates can apply, AI scores appear, recruiters can manage the pipeline. Stripe billing is live.

Risk: OpenAI responses are unreliable JSON. Mitigation: use structured outputs (response_format: json_object in the API), validate against Zod schemas, and implement retry logic.

## Phase 3: Interview and Offer Flow (Weeks 9 to 11)

Goal: Complete the hiring pipeline through offer acceptance.

Week 9: Interview management. Build interview scheduling UI. Implement Google Calendar OAuth and event creation. Build the scorecard form. Build ScorecardSummary component for the decision view. Implement interview question generation AI processor.

Week 10: Offer management. Build the offer creation form. Implement PDF offer letter generation (using a headless browser approach with Puppeteer or a PDF library). Implement offer email delivery. Build the candidate portal for offer response. Implement the offer expiry job.

Week 11: Bias detection and quality polish. Implement BiasDetectionProcessor. Build the BiasWarningPanel in the job creation form. Polish the recruiter experience: bulk operations, CSV export, search and filtering improvements. Implement in-app notifications. Fix all bugs from internal testing.

Deliverable: Complete hiring pipeline from job post to offer acceptance. Bias detection live.

## Phase 4: Analytics and Launch Prep (Weeks 12 to 14)

Goal: Analytics dashboard, production deployment, and first customer onboarding.

Week 12: Analytics. Build the analytics aggregation job. Build all analytics API endpoints. Build the analytics dashboard with Recharts. Implement source tracking throughout the application flow. Build the team performance metrics.

Week 13: Security and compliance. Implement GDPR data export and deletion endpoints. Implement audit log UI. Security audit: run OWASP ZAP, fix findings. Add MFA support. Full penetration test of the multi-tenant isolation. Load test with k6.

Week 14: Production launch. Deploy production AWS environment. DNS configuration. SSL certificates. Data seeding for demo environment. Onboard first 3 beta customers. Fix launch bugs. Set up Sentry, Posthog, PagerDuty. Create onboarding flow and documentation.

## Week by Week Summary

Week 1: Auth, monorepo setup, database schema, CI skeleton
Week 2: RBAC, tenant middleware, user invitation, tenant isolation tests
Week 3: Jobs CRUD, pipeline stages, basic job listing UI
Week 4: AWS infrastructure, staging deployment, Vercel setup
Week 5: Application submission, resume upload, S3 integration
Week 6: BullMQ setup, resume parsing AI, candidate scoring AI
Week 7: Kanban board, Socket.io, application detail view
Week 8: Email notifications, Stripe billing, subscription guard
Week 9: Interview scheduling, Google Calendar, scorecards
Week 10: Offer creation, PDF generation, candidate portal
Week 11: Bias detection, bulk operations, polish and bug fixes
Week 12: Analytics aggregation, dashboard, source tracking
Week 13: Security audit, GDPR compliance, load testing
Week 14: Production deployment, beta customers, monitoring setup

---

# SECTION 16: COST ANALYSIS

## Infrastructure Costs at 100 Users

RDS db.t3.medium: $45/month. ElastiCache cache.t3.micro: $15/month. ECS Fargate (2 tasks, API + worker, 1 vCPU, 2GB each): $60/month. S3 storage (10GB): $2/month. CloudFront: $5/month. Route 53: $1/month. Total infrastructure: approximately $130/month.

OpenAI costs: Assuming 100 users across 10 companies, 50 applications per month, 2 AI calls per application (parse + score). 1,000 AI calls per month, average 2,000 tokens each: $6/month at gpt-4o-mini pricing.

SendGrid: free tier covers 100 emails/day, more than sufficient. Total third-party: $10/month.

Total at 100 users: approximately $140/month. Revenue from 10 companies at $99/month: $990/month. Gross margin: 86%.

## Infrastructure Costs at 1,000 Users

RDS db.t3.large with read replica: $180/month. ElastiCache cache.t3.small: $30/month. ECS Fargate (4 API tasks, 4 worker tasks): $240/month. S3 (100GB): $5/month. CloudFront: $20/month. Total infrastructure: approximately $480/month.

OpenAI costs: 500 applications per month, 1,000 AI calls: $60/month at gpt-4o-mini.

SendGrid Essentials at $15/month. Total: $555/month. Revenue from 100 companies at average $150/month: $15,000/month. Gross margin: 96%.

## Infrastructure Costs at 10,000 Users

RDS db.r6g.large plus read replica: $500/month. ElastiCache cache.r6g.large: $150/month. ECS auto-scaling (average 8 API, 10 worker tasks): $800/month. S3 (1TB): $25/month. CloudFront (10TB transfer): $100/month. PgBouncer EC2 instance: $30/month. Total infrastructure: approximately $1,650/month.

OpenAI: 50,000 AI calls/month: $3,000/month at gpt-4o-mini. This is the dominant cost at scale. Mitigation: caching identical job+candidate score pairs, batching, exploring fine-tuned models.

SendGrid Pro: $90/month. Sentry: $26/month. Total: $4,800/month. Revenue from 1,000 companies at average $200/month: $200,000/month. Gross margin: 97%.

## Infrastructure Costs at 100,000 Users

Aurora PostgreSQL Global: $2,500/month. ElastiCache cluster: $600/month. ECS auto-scaling across two regions: $5,000/month. S3 (10TB): $250/month. CloudFront (100TB transfer): $1,000/month. Total infrastructure: approximately $10,000/month.

OpenAI: 500,000 AI calls/month: $30,000/month. This is the point at which fine-tuned local models become economically necessary. Switching to a self-hosted model at this scale could reduce AI costs by 70%.

Total operating costs: approximately $45,000/month. Revenue from 10,000 companies at average $250/month: $2,500,000/month. Gross margin: 98%.

---

# SECTION 17: MONETIZATION STRATEGY

## Pricing Model

Three subscription tiers targeting distinct segments.

Starter at $99/month: 3 active jobs, 5 team seats, 200 AI scores per month, basic analytics, email support. Targets startups and SMBs making fewer than 10 hires per month. Positioned against Workable's Starter plan.

Growth at $299/month: 15 active jobs, 20 team seats, 1,000 AI scores per month, full analytics including source tracking and team performance, Slack integration, Google Calendar sync, bias detection, interview question generation, chat support. Targets Series A/B companies. Positioned against Lever's base tier.

Enterprise at $999+/month: Unlimited jobs, unlimited seats, unlimited AI scores, custom pipeline stages, API access, webhook support, SSO, audit logs, dedicated onboarding, SLA, GDPR DPA, custom data retention. Targets enterprise talent acquisition teams and staffing agencies. Priced below Greenhouse's $6,000 minimum.

Annual billing discounts: 20% off for annual commitment. Converts MRR to ARR and improves cash flow.

## Usage-Based Add-Ons

Beyond the monthly AI score quota, additional AI credits are available at $0.10 per score. This keeps the base price low while allowing high-volume companies to self-select into higher revenue.

Video interview analysis (future feature): priced at $2 per video interview analyzed. This feature has high marginal cost and should be usage-priced.

## Revenue Streams

Primary: SaaS subscriptions. Secondary: AI credit overage. Tertiary: white-label licensing to staffing agencies at $2,000/month for a custom-branded instance. Future: API marketplace integrations with revenue sharing.

## Upgrade Strategy

The upgrade path is designed around friction reduction at plan limits. When a company hits 80% of their job limit, a banner appears in the UI. When they hit 100%, a modal blocks job creation and offers a one-click upgrade with a 14-day free trial of the next tier. Job creation is the highest-value action — blocking it creates immediate upgrade motivation.

The AI score quota is tracked in real-time via Redis. When a company hits 90% of their monthly quota, recruiters see a usage bar in the sidebar. At 100%, AI scoring is queued but not processed until the next month or the company upgrades — candidates are not lost, scoring is delayed. This is less aggressive than blocking and reduces churn.

## Trial Strategy

14-day free trial with no credit card required. Trial companies get Growth plan limits. The onboarding flow prompts them to create their first job, then upload 5 test resumes to experience AI scoring — this is the aha moment that drives conversion. A sequence of 5 automated emails during the trial explains value, shows case studies, and offers a live demo call with the trial ending at days 1, 3, 7, 10, and 14.

## Enterprise Strategy

Enterprise contracts are custom-priced, annual, and signed via DocuSign. They include a master services agreement, data processing addendum for GDPR, and a security review questionnaire response. The sales process is: free trial → demo call → security review → legal review → contract → onboarding. Target sales cycle is 30 to 60 days. Enterprise customers get a dedicated Slack channel for support.

---

# SECTION 18: HIRING MANAGER REVIEW

## As a Startup CTO

This project demonstrates judgment beyond technical execution. The decision to use row-level tenant isolation over schema-per-tenant is the right call for a startup — it is simpler operationally and still sufficient for security. The decision to build a modular monolith rather than microservices from day one is exactly right — microservices at this stage would add 40% to development time for zero user-facing benefit.

What is impressive: the AI pipeline architecture with BullMQ is production-realistic. The event-driven design makes the system extensible without breaking existing code. The billing integration is complete, not an afterthought. The audit logging is there from day one, which is rare.

What is missing: no mention of a disaster recovery runbook. No capacity planning spreadsheet. No mention of how you handle a corrupted AI score that gets stored in MongoDB (you need a reprocessing mechanism). The onboarding UX for new companies needs more thought — reducing time-to-first-value is critical for SaaS conversion.

What to improve: add a retry and reprocessing mechanism for failed AI jobs with an admin UI to trigger reprocessing. Add a feature flags system from the start — deploying new AI features behind flags is essential for safe rollout.

## As a Senior Engineer

The architecture is clean and defensible. Prisma middleware for tenant scoping is an elegant solution. The separation of the AI worker as a separate process is the right call. The audit log design with JSON old_values/new_values is exactly how you'd do it in production.

What is missing: there's no discussion of database migration strategy for zero-downtime deployments. Prisma migrations that add columns with NOT NULL without a default can lock a table. You need expand-contract migration patterns. The Socket.io scaling solution (Redis pub/sub for multi-instance) is mentioned but not detailed.

What to improve: detail the Prisma middleware implementation so it's clear it cannot be bypassed. Describe how BullMQ handles poison pill jobs (jobs that always fail and block the queue). Implement a circuit breaker pattern for OpenAI calls so a prolonged OpenAI outage doesn't cascade into the main API.

## As a Hiring Manager Evaluating a Candidate's Portfolio

This project tells a clear engineering story: multi-tenant SaaS architecture, AI pipeline integration, billing, real-time collaboration, security implementation. It hits all the categories that matter for a senior full-stack role.

What recruiters will ask in interviews: explain your tenant isolation strategy, walk me through what happens when a resume is uploaded, how do you prevent one company's data from appearing in another company's response, how does the refresh token rotation work, what happens if the AI call fails, how would you scale this to 1 million users.

You should be able to answer all of these fluently. The blueprint gives you the material to build that fluency.

Resume impact score: 9/10. This is a real product that solves a real problem with a clear monetization model. It demonstrates architectural thinking, not just implementation.

Technical depth score: 8/10. The architecture is solid. The gap is in the details of the trickier implementation problems: zero-downtime migrations, BullMQ poison pill handling, Socket.io horizontal scaling specifics.

Startup potential score: 8/10. The market is real, the differentiation is clear (AI-native vs AI-retrofit), and the pricing is competitive. The risk is AI cost at scale and regulatory changes to AI in hiring.

## As a FAANG Interviewer

This project maps to system design interview territory. You are designing a distributed task processing system (the AI pipeline), a multi-tenant SaaS (the data model and auth), and a real-time collaborative interface (the Kanban plus WebSocket).

What stands out: the candidate scoring architecture with explainability is product-differentiated, not just technically impressive. The cost analysis shows business thinking. The scaling roadmap from 100 to 1 million users covers the right inflection points.

What is missing from a systems perspective: there is no discussion of idempotency for critical operations. If a resume upload webhook fires twice (S3 events can do this), will you parse the resume twice and double-bill the AI credits? You need idempotency keys on all critical write operations. Also, the database schema doesn't address the read vs write path optimization — at scale you would want to separate the OLTP PostgreSQL from an OLAP read model for analytics.

---

# SECTION 19: FINAL BLUEPRINT

## Complete Tech Stack

Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, React Hook Form, Zod, Zustand, dnd-kit, Socket.io client, Recharts, Axios.

Backend: NestJS, TypeScript, Prisma ORM, BullMQ, Socket.io server, Passport.js, class-validator, class-transformer, Pino logger, Handlebars (email templates).

Databases: PostgreSQL 15 (RDS), MongoDB 7 (Atlas), Redis 7 (ElastiCache).

Storage: AWS S3, CloudFront CDN.

AI: OpenAI API (gpt-4o-mini for parsing and scoring, gpt-4o for bias detection and question generation).

Third-Party Services: Stripe (billing), SendGrid (email), Twilio (SMS, future), Google Calendar API (scheduling), Google OAuth, Sentry (errors), Posthog (analytics), Better Uptime (monitoring).

DevOps: Docker, Docker Compose, GitHub Actions, AWS ECS Fargate, AWS ECR, AWS ALB, AWS Secrets Manager, AWS CloudWatch, Vercel (frontend), Terraform (infrastructure as code).

Testing: Jest (unit and integration), Supertest (API), Playwright (E2E), k6 (load), OWASP ZAP (security).

## Complete Folder Structures

Monorepo root:

/
apps/
api/ (NestJS — full structure in Section 10)
web/ (Next.js — full structure in Section 9)
packages/
shared-types/ (TypeScript types shared between frontend and backend)
src/
dto/ (Zod schemas mirrored from backend DTOs)
enums.ts
api-types.ts
email-templates/ (Handlebars templates)
application-received.hbs
interview-scheduled.hbs
offer-sent.hbs
(all template files)
infrastructure/
terraform/
main.tf
vpc.tf
ecs.tf
rds.tf
redis.tf
s3.tf
cloudfront.tf
secrets.tf
.github/
workflows/
pr.yml
deploy-staging.yml
deploy-production.yml
docker-compose.yml
docker-compose.override.yml (local dev extras: MinIO, MailHog)
package.json (workspace root)
turbo.json (Turborepo build orchestration)

## Architecture Summary

The system is a multi-tenant SaaS with a NestJS API backend serving a Next.js frontend. All tenant data is stored in PostgreSQL with row-level isolation enforced by a Prisma middleware that cannot be bypassed. Heavy operations (AI processing, email delivery) are processed asynchronously by a BullMQ worker process that runs separately from the API. Real-time updates are delivered via Socket.io with Redis pub/sub enabling horizontal scaling. MongoDB stores unstructured AI outputs and parsed resume data. All files are stored in S3 with CloudFront CDN. Stripe handles all billing lifecycle events via webhooks.

## MVP Roadmap

Weeks 1 to 4: Auth, RBAC, tenant isolation, job CRUD, CI/CD, staging deployment.
Weeks 5 to 8: Application submission, AI parsing and scoring, Kanban board, WebSocket, email notifications, Stripe billing.
Result: Deployable, billable MVP with core AI differentiation.

## Production Roadmap

Weeks 9 to 11: Interview management, scorecard system, offer management, bias detection, bulk operations.
Weeks 12 to 14: Analytics dashboard, security audit, GDPR compliance, production deployment, beta customers.
Result: Feature-complete v1 with paying customers and monitoring.

## Scaling Roadmap

0 to 1,000 users: Current architecture with auto-scaling ECS. Add CloudFront caching. No architectural changes needed.

1,000 to 10,000 users: Add PgBouncer, read replicas, Redis caching layer, ECS auto-scaling. Migrate analytics to materialized views. Separate AI worker into its own auto-scaling group.

10,000 to 100,000 users: Evaluate fine-tuned models to reduce AI costs. Add database partitioning for audit logs and analytics tables. Implement multi-region if needed. Add separate read models for analytics.

100,000+ users: Multi-region Aurora, dedicated AI inference infrastructure, SQS migration for queue backend, global CDN strategy.

## Recommended Development Order

Build in this order to maximize learning, reduce rework, and reach a demo-able state as early as possible.

First: Database schema, Prisma setup, and the tenant middleware. Every feature builds on this. Getting it wrong is the most expensive mistake.

Second: Authentication with JWT rotation and RBAC. Every subsequent feature requires auth. Build it completely before moving on.

Third: Company and user management with invitation flow. Needed to onboard any team member for testing.

Fourth: Jobs CRUD with pipeline stages. The entry point for the core workflow.

Fifth: Application submission and S3 upload. Connect the external world to the platform.

Sixth: BullMQ and the AI pipeline. The core product differentiator. This takes the most iteration on prompt engineering.

Seventh: Kanban board with WebSocket. The primary recruiter interface. Needs to feel fast and reliable.

Eighth: Stripe billing. Required before any customer goes live. Do not skip this for beta.

Ninth: Email notifications. Required for the product to feel professional.

Tenth: Interview and offer management. Completes the hiring lifecycle.

Eleventh: Analytics. Completes the management interface.

Twelfth: Security hardening, compliance, load testing. Before production launch.

Do not build the Chrome extension, mobile app, video analysis, or API marketplace before you have 50 paying customers. Every hour spent on those features is an hour not spent on retention of your first customers.
