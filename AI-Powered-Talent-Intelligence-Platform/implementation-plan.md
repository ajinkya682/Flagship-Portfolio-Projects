# AI-POWERED TALENT INTELLIGENCE PLATFORM

## Day-by-Day Implementation Plan

---

# OVERVIEW

Total Duration: 84 Days (12 Weeks)
Daily commitment assumed: 6 to 8 hours
Format: Each day tells you exactly what to build, in what order, what commands to run, what files to create, and what the end-of-day deliverable is.

---

# WEEK 1: PROJECT FOUNDATION AND AUTH CORE

---

## DAY 1: Monorepo Setup and Development Environment

Morning session (3 hours): Initialize the entire project structure.

Open your terminal and run these commands in exact order:

mkdir talent-platform
cd talent-platform
git init
echo "node_modules" >> .gitignore
echo ".env\*" >> .gitignore
echo "!.env.example" >> .gitignore
echo "dist" >> .gitignore
echo ".next" >> .gitignore
echo "coverage" >> .gitignore

Install Turborepo globally:
npm install -g turbo

Create the root package.json manually:

{
"name": "talent-platform",
"private": true,
"workspaces": ["apps/*", "packages/*"],
"scripts": {
"dev": "turbo run dev",
"build": "turbo run build",
"lint": "turbo run lint",
"test": "turbo run test",
"typecheck": "turbo run typecheck"
},
"devDependencies": {
"turbo": "^1.13.0",
"prettier": "^3.2.0",
"husky": "^9.0.0",
"lint-staged": "^15.2.0"
}
}

Create turbo.json:

{
"$schema": "https://turbo.build/schema.json",
"pipeline": {
"build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
"dev": { "cache": false, "persistent": true },
"lint": { "outputs": [] },
"test": { "cache": false, "outputs": ["coverage/**"] },
"typecheck": { "dependsOn": ["^build"], "outputs": [] }
}
}

Create the directory structure:
mkdir -p apps/api apps/web apps/worker
mkdir -p packages/shared-types packages/config packages/database

Afternoon session (3 hours): Initialize each application.

Initialize the NestJS API:
cd apps/api
npm install -g @nestjs/cli
nest new . --package-manager npm --skip-git
cd ../..

Initialize the Next.js frontend:
cd apps/web
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/\*"
cd ../..

Initialize the shared-types package:
cd packages/shared-types
npm init -y
mkdir -p src/enums src/schemas src/types
touch src/index.ts
cd ../..

Set up Docker Compose for local development. Create docker-compose.yml at the root:

version: '3.9'
services:
postgres:
image: postgres:15-alpine
environment:
POSTGRES_USER: postgres
POSTGRES_PASSWORD: postgres
POSTGRES_DB: talent_platform
ports: - '5432:5432'
volumes: - postgres_data:/var/lib/postgresql/data
mongodb:
image: mongo:7-jammy
ports: - '27017:27017'
volumes: - mongodb_data:/data/db
redis:
image: redis:7-alpine
ports: - '6379:6379'
volumes: - redis_data:/data
command: redis-server --appendonly yes
mailhog:
image: mailhog/mailhog
ports: - '1025:1025' - '8025:8025'
volumes:
postgres_data:
mongodb_data:
redis_data:

Start the infrastructure:
docker-compose up -d

Create .env.example at the root. Copy every environment variable from Section 1 of the blueprint into this file.

Copy .env.example to .env and fill in the local values (use localhost for all URLs, postgres/postgres for database credentials).

End of day deliverable: All three apps initialized, Docker containers running, infrastructure ready, developer can run docker-compose ps and see all services healthy.

---

## DAY 2: Database Schema and NestJS Core Configuration

Morning session (3 hours): Prisma setup and schema.

Navigate to apps/api and install Prisma:
cd apps/api
npm install prisma @prisma/client
npm install -D prisma
npx prisma init

Replace the generated prisma/schema.prisma with the complete schema from Phase 3 of the blueprint. This is the full schema with all models: Company, User, Candidate, RefreshToken, Invitation, Job, PipelineStage, Application, ApplicationStageHistory, ApplicationNote, Interview, InterviewInterviewer, InterviewScorecard, ScorecardRating, Offer, Notification, AuditLog, EmailTemplate, Webhook, AnalyticsSnapshot, SubscriptionEvent, and all enums.

Copy the DATABASE_URL from your .env file and verify it points to localhost:5432.

Run the initial migration:
npx prisma migrate dev --name initial_schema

Verify it worked:
npx prisma studio

This opens a browser at localhost:5555. You should see all your tables in the sidebar.

Afternoon session (3 hours): NestJS core module configuration.

Install core dependencies for the API:
cd apps/api
npm install @nestjs/config @nestjs/jwt @nestjs/passport
npm install passport passport-jwt passport-google-oauth20 passport-linkedin-oauth2
npm install bcrypt class-validator class-transformer
npm install @nestjs/event-emitter bullmq @nestjs/bull bull
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
npm install handlebars @sendgrid/mail twilio
npm install mongoose @nestjs/mongoose
npm install ioredis
npm install pino pino-http nest-pino
npm install stripe
npm install -D @types/bcrypt @types/passport-jwt @types/passport-google-oauth20 @types/multer

Create the configuration files in apps/api/src/common/config/:

app.config.ts:
import { registerAs } from '@nestjs/config';
export default registerAs('app', () => ({
port: parseInt(process.env.PORT, 10) || 3001,
nodeEnv: process.env.NODE_ENV || 'development',
frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
apiUrl: process.env.API_URL || 'http://localhost:3001',
}));

Create similar config files for database, redis, aws, openai, stripe, sendgrid. Each follows the same registerAs pattern.

Update apps/api/src/app.module.ts to import ConfigModule globally:
ConfigModule.forRoot({ isGlobal: true, load: [appConfig, databaseConfig, redisConfig, awsConfig] })

End of day deliverable: Prisma schema migrated to database successfully, NestJS app starts without errors (npm run start:dev in apps/api).

---

## DAY 3: Authentication Module - Registration and Login

Morning session (3 hours): Auth module structure and registration.

Create the auth module structure:
cd apps/api/src/modules
mkdir -p auth/strategies auth/guards auth/decorators auth/dto auth/events

Create apps/api/src/modules/auth/dto/register.dto.ts with exact validation as shown in Phase 4.

Create apps/api/src/modules/auth/auth.service.ts. Focus on the register method first:

The register method must:

1. Check if email exists (query users table with the email)
2. Generate company slug from company_name
3. Create company record with plan FREE and trial_ends_at as now plus 14 days
4. Hash password with bcrypt cost 12
5. Create user record as COMPANY_ADMIN
6. Generate email verification token (crypto.randomBytes(32).toString('hex'))
7. Store hashed verification token on user
8. Generate JWT access and refresh token pair
9. Store hashed refresh token in refresh_tokens table
10. Emit UserRegistered event
11. Return token pair and user data

Install the crypto module (it is built into Node.js, no install needed) and the uuid package:
npm install uuid
npm install -D @types/uuid

Create apps/api/src/modules/auth/strategies/jwt.strategy.ts:

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
constructor(
private configService: ConfigService,
private usersService: UsersService,
) {
super({
jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
secretOrKey: Buffer.from(configService.get('JWT_PUBLIC_KEY'), 'base64').toString('utf8'),
algorithms: ['RS256'],
});
}

async validate(payload: any) {
const user = await this.usersService.findById(payload.sub);
if (!user || !user.is_active) {
throw new UnauthorizedException();
}
return { ...user, company_id: payload.company_id };
}
}

Afternoon session (3 hours): Login, JWT generation, and guards.

Generate the RS256 key pair for local development. Run in terminal:
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
cat private.pem | base64 | tr -d '\n'
cat public.pem | base64 | tr -d '\n'

Copy these base64 encoded values into your .env file as JWT_PRIVATE_KEY and JWT_PUBLIC_KEY.

Create the token generation utility in apps/api/src/common/utils/token.util.ts:

import _ as jwt from 'jsonwebtoken';
import _ as crypto from 'crypto';

export function generateAccessToken(payload: object, privateKey: string, expiresIn: string): string {
return jwt.sign(payload, Buffer.from(privateKey, 'base64').toString('utf8'), {
algorithm: 'RS256',
expiresIn,
});
}

export function generateRefreshToken(userId: string, jti: string, privateKey: string): string {
return jwt.sign({ sub: userId, jti }, Buffer.from(privateKey, 'base64').toString('utf8'), {
algorithm: 'RS256',
expiresIn: '30d',
});
}

export function hashToken(token: string): string {
return crypto.createHash('sha256').update(token).digest('hex');
}

Create JwtAuthGuard that extends AuthGuard('jwt'). Create the @Public() decorator that uses SetMetadata to mark routes as public. Update JwtAuthGuard to skip validation on @Public() routes.

Create apps/api/src/modules/auth/auth.controller.ts with these endpoints for today:
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/refresh

Apply the ValidationPipe globally in main.ts:
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));

Set the global prefix:
app.setGlobalPrefix('api/v1');

End of day deliverable: Can register a new company via Postman (POST localhost:3001/api/v1/auth/register), receive access and refresh tokens, and use the access token to hit a protected test endpoint.

---

## DAY 4: Refresh Token Rotation, Password Reset, Email Verification

Morning session (3 hours): Refresh token rotation and security.

Create apps/api/src/modules/auth/auth.repository.ts to handle all database operations related to auth, keeping the service clean:

The repository needs these methods:

- createRefreshToken(userId, tokenHash, expiresAt, ipAddress, userAgent)
- findRefreshToken(tokenHash)
- revokeRefreshToken(id)
- revokeAllUserTokens(userId)
- findUserByEmail(email)
- findUserById(id)
- createUser(data)
- createCompany(data)
- updateUser(id, data)

Implement the refresh token rotation logic in AuthService.refresh:

1. Extract the JTI from the refresh token JWT (verify signature first)
2. Hash the raw token with SHA-256
3. Look up the hashed token in refresh_tokens table
4. If not found or revoked: revoke ALL tokens for this user (compromise detected), throw UnauthorizedException
5. If expired: throw UnauthorizedException
6. Mark old token as revoked
7. Generate new token pair
8. Store new refresh token hash
9. Return new token pair

Implement logout: mark the provided refresh token as revoked.

Afternoon session (3 hours): Password reset and email verification.

Install the email sending dependency and set up MailHog for local testing:
The SENDGRID_API_KEY in local .env should point to MailHog SMTP: configure nodemailer with MailHog settings for local, SendGrid for production.

Actually install nodemailer as a fallback for local dev:
npm install nodemailer
npm install -D @types/nodemailer

Create a simple EmailService that uses nodemailer with MailHog in development (host: localhost, port: 1025) and SendGrid's SMTP in production. This is simpler than the SendGrid SDK for now.

Implement forgot-password endpoint:

1. Look up user by email
2. Always return 200 (prevent email enumeration)
3. If user exists: generate random 32-byte hex token, hash it, store on user with 1-hour expiry
4. Send reset email via EmailService to MailHog (check localhost:8025 to see the email)

Implement reset-password endpoint:

1. Hash the provided token
2. Look up user by reset token hash and verify not expired
3. Hash new password with bcrypt
4. Update user password
5. Clear reset token fields
6. Revoke all refresh tokens for user

Implement email verification:

1. After registration, send verification email with token
2. GET /auth/verify-email?token=xyz endpoint
3. Hash token, look up user, mark email_verified true, clear token

Create a simple Handlebars email template for verification and password reset. Store templates in apps/api/src/modules/notifications/templates/email/.

End of day deliverable: Can register, receive verification email in MailHog (localhost:8025), click verify link, log in, use refresh endpoint to rotate tokens, request password reset, and reset password.

---

## DAY 5: Tenant Middleware, RBAC Guards, and Google OAuth

Morning session (3 hours): Tenant middleware and RBAC.

Create apps/api/src/common/middleware/tenant.middleware.ts:

The tenant middleware runs on every request. It reads the user from the request (set by Passport after JWT validation) and stores the company_id in the request context. Use cls-hooked for Continuation Local Storage so the company_id is available throughout the request lifecycle:

npm install cls-hooked
npm install -D @types/cls-hooked

Create a TenantContext class:

import \* as cls from 'cls-hooked';

const namespace = cls.createNamespace('tenant');

export class TenantContext {
static setCompanyId(companyId: string) {
namespace.set('company_id', companyId);
}

static getCompanyId(): string | undefined {
return namespace.get('company_id');
}

static run(fn: () => void) {
namespace.run(fn);
}
}

Create the Prisma extension for tenant scoping. In packages/database/src/tenant-middleware.ts:

This extension adds a middleware to every Prisma query that automatically appends WHERE company_id = :id on tenant-scoped models. The list of tenant-scoped models: Job, Application, Candidate, User, PipelineStage, Interview, Offer, Notification, AuditLog.

Create the capability guard as shown in Phase 4. Create the @RequireCapabilities() decorator. Apply JwtAuthGuard globally in AppModule, with @Public() used on auth routes.

Afternoon session (3 hours): Google OAuth.

Install Google OAuth strategy:
npm install passport-google-oauth20
npm install -D @types/passport-google-oauth20

Create apps/api/src/modules/auth/strategies/google.strategy.ts as shown in Phase 4.

Create the Google auth endpoints in AuthController:
GET /api/v1/auth/google (redirects to Google)
GET /api/v1/auth/google/callback (handles callback)

The callback handler redirects to the frontend with tokens in the URL fragment:
res.redirect(`${frontendUrl}/auth/callback#access_token=${accessToken}&refresh_token=${refreshToken}`)

In the GoogleStrategy validate method implement AuthService.validateGoogleUser:

1. Look up user by google_id
2. If found: return user
3. If not found: look up by email
4. If found by email: link google_id to existing account, return user
5. If not found: create new account (email, google_id, name, avatar_url). For Google registrations, company_name is not available. Either prompt the user after OAuth (redirect to /onboarding) or require it in a post-OAuth step.

For local testing of Google OAuth, set the callback URL in Google Cloud Console to http://localhost:3001/api/v1/auth/google/callback and set GOOGLE_CALLBACK_URL in .env accordingly.

Set up Husky and lint-staged at the root:
npx husky init
echo "npx lint-staged" > .husky/pre-commit

Add to root package.json:
"lint-staged": {
"_.{ts,tsx}": ["eslint --fix", "prettier --write"],
"_.{json,md}": ["prettier --write"]
}

End of day deliverable: Google OAuth works (test with real Google account). RBAC guards block unauthorized access. Tenant middleware sets company context on every request.

---

## DAY 6: Users Module and Company Module

Morning session (3 hours): Users Module.

Create the full UsersModule:

apps/api/src/modules/users/users.controller.ts endpoints:
GET /api/v1/users/me - Returns current user with company
PATCH /api/v1/users/me - Update own profile
GET /api/v1/users - List team members (requires USERS_MANAGE capability)
POST /api/v1/users/invite - Send invitation (requires USERS_INVITE capability)
PATCH /api/v1/users/:id/role - Change role (requires USERS_MANAGE capability)
DELETE /api/v1/users/:id - Deactivate user (requires USERS_MANAGE capability)

Implement invitation flow:

1. Check if email is already a member
2. Check if pending invitation exists for this email in this company
3. Generate 64-byte random token
4. Store token hash with 7-day expiry in invitations table
5. Send invitation email via EmailService
6. Create invitation template in Handlebars

The accept invitation endpoint:
GET /api/v1/auth/invite/validate?token=xyz - Returns invitation details
POST /api/v1/auth/invite/accept - Creates account and marks invitation accepted

Afternoon session (3 hours): Companies Module.

Create CompaniesModule:

apps/api/src/modules/companies/companies.controller.ts:
GET /api/v1/companies/me - Current company details
PATCH /api/v1/companies/me - Update company settings
GET /api/v1/companies/me/usage - Current usage vs limits

CompaniesService.getUsage method queries:

- Active job count
- Team member count
- AI scores used this month
- Returns alongside the plan limits from the plan-limits config

Create the apps/api/src/common/constants/plan-limits.constants.ts with the plan limits object from Phase 14.

Create a SubscriptionGuard that checks company.subscription_status and plan limits before allowing access to plan-gated features:

@Injectable()
export class SubscriptionGuard implements CanActivate {
canActivate(context: ExecutionContext): boolean {
const { user } = context.switchToHttp().getRequest();
const company = user.company;

    if (company.subscription_status === 'CANCELED') {
      throw new PaymentRequiredException('Subscription canceled');
    }

    return true;

}
}

End of day deliverable: Users module complete. Company admin can list team members, invite new members, change roles. Invitation email appears in MailHog. Invited user can accept invitation and log in.

---

## DAY 7: Frontend Authentication Pages

Morning session (3 hours): Next.js auth setup.

Install frontend dependencies:
cd apps/web
npm install axios @tanstack/react-query zustand
npm install react-hook-form @hookform/resolvers zod
npm install socket.io-client
npm install lucide-react
npx shadcn-ui@latest init

When prompted by shadcn: use TypeScript yes, style Default, base color Slate, global CSS at app/globals.css, CSS variables yes, tailwind config at tailwind.config.ts, components at components/ui, utils at lib/utils.ts.

Install shadcn components you'll need:
npx shadcn-ui@latest add button input label card form toast badge avatar dropdown-menu dialog separator

Create the API client in apps/web/lib/api/client.ts:

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const apiClient = axios.create({
baseURL: API_URL,
headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
if (typeof window !== 'undefined') {
const token = document.cookie.match(/access_token=([^;]+)/)?.[1];
if (token) config.headers.Authorization = `Bearer ${token}`;
}
return config;
});

apiClient.interceptors.response.use(
(response) => response,
async (error) => {
if (error.response?.status === 401) {
// Attempt refresh
try {
const refreshToken = document.cookie.match(/refresh_token=([^;]+)/)?.[1];
const response = await axios.post(`${API_URL}/auth/refresh`, { refresh_token: refreshToken });
const { access_token, refresh_token } = response.data.data;
document.cookie = `access_token=${access_token}; path=/; max-age=900; SameSite=Lax`;
document.cookie = `refresh_token=${refresh_token}; path=/; max-age=2592000; SameSite=Lax`;
error.config.headers.Authorization = `Bearer ${access_token}`;
return axios(error.config);
} catch {
window.location.href = '/login';
}
}
return Promise.reject(error);
}
);

Create the Zustand auth store in apps/web/store/auth.store.ts:

import { create } from 'zustand';

interface AuthStore {
user: User | null;
company: Company | null;
isLoading: boolean;
setUser: (user: User | null) => void;
setCompany: (company: Company | null) => void;
logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
user: null,
company: null,
isLoading: true,
setUser: (user) => set({ user }),
setCompany: (company) => set({ company }),
logout: () => set({ user: null, company: null }),
}));

Afternoon session (3 hours): Auth pages.

Create apps/web/app/(auth)/login/page.tsx:

The login page has an email input, password input, "Forgot password" link, submit button, Google OAuth button, and a "Don't have an account? Register" link. Use React Hook Form with Zod validation. On success, store tokens in httpOnly cookies via the API and redirect to /dashboard. For now store in regular cookies (httpOnly is server-set).

Create apps/web/app/(auth)/register/page.tsx:

Same form but with first_name, last_name, company_name. On success, show "Check your email for verification" message.

Create apps/web/app/(auth)/forgot-password/page.tsx: Simple email form.

Create apps/web/app/(auth)/reset-password/page.tsx: Password and confirm password with the token from URL params.

Create apps/web/middleware.ts:

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/middleware';

const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/apply', '/jobs'];

export function middleware(request: NextRequest) {
const accessToken = request.cookies.get('access_token')?.value;
const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));

if (!accessToken && !isPublicPath) {
return NextResponse.redirect(new URL('/login', request.url));
}

if (accessToken && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
return NextResponse.redirect(new URL('/dashboard', request.url));
}

return NextResponse.next();
}

export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'] };

Create the OAuth callback handler at apps/web/app/(auth)/callback/page.tsx:
This page runs client-side, reads tokens from the URL fragment (window.location.hash), stores them in cookies, then redirects to dashboard.

End of day deliverable: All auth pages built and functional. User can register, verify email (check MailHog), log in, and be redirected to an empty dashboard page.

---

# WEEK 2: JOBS AND PIPELINE FOUNDATION

---

## DAY 8: Jobs Module Backend

Morning session (3 hours): Jobs Module core.

Create apps/api/src/modules/jobs/jobs.module.ts and connect all parts.

Create jobs.repository.ts with these methods:

- create(data, companyId)
- findAll(companyId, filters)
- findById(id, companyId)
- update(id, data, companyId)
- publish(id, companyId)
- close(id, companyId)
- softDelete(id, companyId)
- countActiveJobs(companyId)

Create jobs.service.ts:

The createJob method:

1. Check company's active job count against plan limits
2. Create job record with status DRAFT
3. Create default pipeline stages by copying from company defaults (or creating standard stages if none exist)
4. Emit JobCreated event
5. Return job with pipeline stages

Default pipeline stages to create:

- New Application (order: 0, type: NEW, color: #6b7280)
- Resume Review (order: 1, type: SCREENING, color: #3b82f6)
- Phone Screen (order: 2, type: SCREENING, color: #8b5cf6)
- Technical Interview (order: 3, type: INTERVIEW, color: #f59e0b)
- Final Interview (order: 4, type: INTERVIEW, color: #ec4899)
- Offer (order: 5, type: OFFER, color: #10b981)
- Hired (order: 6, type: HIRED, color: #22c55e)
- Rejected (order: 7, type: REJECTED, color: #ef4444)

The publishJob method:

1. Check plan limits again
2. Verify job is in DRAFT status
3. Set status to PUBLISHED and posted_at to now
4. Emit JobPublished event
5. Return updated job

Afternoon session (3 hours): Pipeline stages and job controller.

Create pipeline-stages.controller.ts:
GET /api/v1/jobs/:jobId/stages - List stages
POST /api/v1/jobs/:jobId/stages - Create stage
PATCH /api/v1/jobs/:jobId/stages/:id - Update stage
DELETE /api/v1/jobs/:jobId/stages/:id - Delete stage (only if no applications)
POST /api/v1/jobs/:jobId/stages/reorder - Reorder stages

Create jobs.controller.ts with all endpoints from the API design.

Create the DTOs:

create-job.dto.ts includes: title (required), department, location, employment_type (enum), remote_type (enum), description, requirements, salary_min, salary_max, currency, application_form_fields (optional JSON array).

publish-job.dto.ts is empty (no body needed for publish).

job-filters.dto.ts includes: status, department, search, page, limit, sort_by, sort_dir. All optional.

Test all endpoints with Postman:
POST /api/v1/jobs - Create job
GET /api/v1/jobs - List jobs (should only return this company's jobs)
PATCH /api/v1/jobs/:id - Update
POST /api/v1/jobs/:id/publish - Publish
GET /api/v1/jobs/:id - Get with pipeline stages

End of day deliverable: Complete jobs backend. All endpoints tested in Postman. Creating a job automatically creates default pipeline stages.

---

## DAY 9: BullMQ Setup and AI Module Foundation

Morning session (3 hours): BullMQ infrastructure.

Install BullMQ:
cd apps/api
npm install bullmq @nestjs/bullmq

Create the queue constants file apps/api/src/common/constants/queue-names.constants.ts:
export const QUEUE_NAMES = {
RESUME_PARSE: 'resume-parse',
CANDIDATE_SCORE: 'candidate-score',
BIAS_DETECT: 'bias-detect',
INTERVIEW_QUESTIONS: 'interview-questions',
SENTIMENT: 'sentiment-analysis',
EMAIL: 'email-send',
SMS: 'sms-send',
ANALYTICS: 'analytics-aggregate',
};

Configure BullMQ in AppModule:

BullModule.forRootAsync({
useFactory: (configService: ConfigService) => ({
connection: {
host: configService.get('REDIS_HOST', 'localhost'),
port: configService.get<number>('REDIS_PORT', 6379),
},
}),
inject: [ConfigService],
})

Register each queue in its module with BullModule.registerQueue.

Create the AiModule at apps/api/src/modules/ai/ai.module.ts. This module imports all five BullMQ queues and exports the AiService.

Create AiService with these public methods (only enqueue operations, no processing):

- enqueueResumeParse(applicationId, companyId, resumeUrl, fileType)
- enqueueCandidateScore(applicationId, jobId, companyId)
- enqueueBiasDetect(jobId, companyId, description)
- enqueueInterviewQuestions(jobId, companyId, createdBy)
- enqueueSentimentAnalysis(scorecardId, companyId, notesText)

Create the OpenAI provider:
cd apps/api
npm install openai

apps/api/src/modules/ai/providers/openai.provider.ts:
import OpenAI from 'openai';

export const OpenAIProvider = {
provide: 'OPENAI_CLIENT',
useFactory: (configService: ConfigService) => new OpenAI({
apiKey: configService.get('OPENAI_API_KEY'),
maxRetries: parseInt(configService.get('OPENAI_MAX_RETRIES', '3')),
}),
inject: [ConfigService],
};

Afternoon session (3 hours): Resume parse processor skeleton.

Create the Worker entry point at apps/api/src/worker.ts:

import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';

async function bootstrap() {
const app = await NestFactory.createApplicationContext(WorkerModule);
console.log('Worker started');
}
bootstrap();

Create apps/api/src/worker.module.ts that imports only the AI module, Notifications module, and Analytics module. No HTTP server, no WebSocket gateway.

Create the resume parse processor skeleton at apps/api/src/modules/ai/processors/resume-parse.processor.ts:

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUE_NAMES } from '../../common/constants/queue-names.constants';

@Processor(QUEUE_NAMES.RESUME_PARSE)
export class ResumeParseProcessor extends WorkerHost {
async process(job: Job) {
const { applicationId, resumeUrl, fileType } = job.data;
console.log(`Processing resume parse for application ${applicationId}`);
// Full implementation on Day 16
}
}

Create the same skeleton for each of the five processors. Each just logs the job data for now.

Add the start:worker script to apps/api/package.json:
"start:worker": "ts-node -r tsconfig-paths/register src/worker.ts"

Verify the worker starts without errors: npm run start:worker

End of day deliverable: BullMQ queues configured. Worker process starts successfully. AI service can enqueue jobs (test by manually calling enqueueResumeParse and verifying the job appears in Redis).

---

## DAY 10: Applications Module Backend

Morning session (3 hours): Candidates and Applications core.

Create the CandidatesModule:

candidates.service.ts methods:

- findOrCreate(companyId, email, firstName, lastName, phone) - Creates if not exists, returns existing if does
- findById(id, companyId)
- update(id, data, companyId)
- search(companyId, filters)
- addTag(id, tag, companyId)
- removeTag(id, tag, companyId)

Create the ApplicationsModule:

applications.repository.ts methods:

- create(data)
- findAll(companyId, filters) - returns paginated list
- findById(id, companyId)
- findByJobAndCandidate(jobId, candidateId, companyId)
- moveStage(id, toStageId, movedBy, companyId)
- getLastStageEntry(applicationId)
- createStageHistory(data)
- updateAiScore(id, score)
- reject(id, reason, companyId)

applications.service.ts createApplication method:

1. Verify job exists and is published
2. Check for duplicate: same candidate email + same job
3. Find or create candidate record
4. Get the first stage of the job's pipeline
5. Create application record
6. Create first stage history entry
7. Emit ApplicationCreated event
8. Return application with candidate data

applications.service.ts moveStage method:

1. Load application
2. Load last stage history entry to calculate time in previous stage
3. Calculate time_in_previous_stage_hours
4. Update application.current_stage_id
5. Create stage history record
6. Emit ApplicationMoved event

Afternoon session (3 hours): Storage Module and file upload.

Install AWS SDK:
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner

Create apps/api/src/modules/storage/storage.service.ts:

getPresignedUploadUrl(key, contentType, maxSizeBytes):

1. Create PutObjectCommand
2. Use getSignedUrl from @aws-sdk/s3-request-presigner with 10-minute expiry
3. Return the signed URL and the key

getPresignedDownloadUrl(key):

1. Create GetObjectCommand
2. Return signed URL with 1-hour expiry

For local development, configure the AWS SDK to point to MinIO:
endpoint: 'http://localhost:9000', forcePathStyle: true

Create storage.controller.ts:
GET /api/v1/storage/upload-url?type=resume&filename=resume.pdf
GET /api/v1/storage/download-url?key=uploads/...

The upload URL generates a key in the format: uploads/{companyId}/{type}/{uuid}/{filename}. This namespacing ensures tenant isolation at the storage level.

Create file validator:
apps/api/src/modules/storage/validators/file-type.validator.ts

Allowed resume types: application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document
Max size for resume: 10MB (10485760 bytes)

Test the upload flow manually:

1. Call GET /storage/upload-url
2. Use curl to PUT a file to the returned URL
3. Verify file appears in MinIO console (localhost:9001, minioadmin/minioadmin)

End of day deliverable: Applications module complete. Can create applications via Postman. File upload pre-signed URL works. Files appear in MinIO.

---

## DAY 11: Applications Controller and Public Submission

Morning session (3 hours): Applications controller.

Create apps/api/src/modules/applications/applications.controller.ts:

GET /api/v1/applications - List with filters (requires APPLICATIONS_READ)
POST /api/v1/applications/public - Public submission (no auth)
GET /api/v1/applications/:id - Full application detail (requires APPLICATIONS_READ)
PATCH /api/v1/applications/:id/stage - Move stage (requires APPLICATIONS_MOVE)
POST /api/v1/applications/:id/notes - Add note (requires APPLICATIONS_READ)
GET /api/v1/applications/:id/notes - Get notes (requires APPLICATIONS_READ)
POST /api/v1/applications/bulk - Bulk operations (requires APPLICATIONS_MOVE)
GET /api/v1/applications/export - CSV export (requires APPLICATIONS_EXPORT)

The public submission endpoint (/applications/public) is decorated with @Public() to skip auth. It has its own rate limiting: 5 requests per IP per 15 minutes.

Implement rate limiting. Install:
npm install @nestjs/throttler

Configure ThrottlerModule in AppModule with global defaults. Create a custom ThrottleGuard that uses Redis for distributed rate limiting (so rate limits work across multiple API instances).

The public application response returns a tracking_token (separate from application_id — a random UUID stored on the application record that candidates use to check status without being authenticated).

Afternoon session (3 hours): Pagination, filtering, and CSV export.

Create a generic pagination utility in apps/api/src/common/utils/pagination.util.ts:

export function paginate(page: number, limit: number) {
const skip = (page - 1) \* limit;
return { skip, take: limit };
}

export function buildPaginatedResponse<T>(data: T[], total: number, page: number, limit: number) {
return {
data,
meta: {
total,
page,
limit,
total_pages: Math.ceil(total / limit),
has_next: page < Math.ceil(total / limit),
has_prev: page > 1,
},
};
}

Implement CSV export. Install:
npm install csv-writer

The export endpoint builds a CSV with these columns: Candidate Name, Email, Phone, Job Title, Current Stage, AI Score, Source, Applied Date, LinkedIn URL.

Install a JSON-to-CSV library:
npm install json2csv

The export controller streams the CSV response:
res.setHeader('Content-Type', 'text/csv');
res.setHeader('Content-Disposition', 'attachment; filename=candidates.csv');

Add pagination helper to applications list query. The findAll method should support:

- Filter by job_id
- Filter by stage_id
- Filter by status
- Filter by source
- Filter by score range (min_score, max_score)
- Text search on candidate name/email
- Sort by applied_at, ai_score, name
- Pagination with page and limit

End of day deliverable: Complete applications backend. Public submission endpoint works. List endpoint with filtering and pagination works. CSV export downloads properly.

---

## DAY 12: Frontend Layout and Dashboard

Morning session (3 hours): App layout with sidebar.

Create apps/web/app/(app)/layout.tsx:

This is the authenticated layout. It renders a sidebar on the left and the page content on the right. It checks if the user is authenticated by loading /users/me on mount. If the request fails with 401, redirect to login.

Create the sidebar component apps/web/components/features/layout/sidebar.tsx:

The sidebar has:

- Company logo / name at the top
- Navigation links based on user role
- Collapse toggle button
- User menu at the bottom with name, avatar, logout

Navigation items based on role:
RECRUITER sees: Dashboard, Jobs, Applications, Candidates, Interviews, Analytics
HIRING_MANAGER sees: Dashboard, Applications, Interviews
INTERVIEWER sees: Interviews
COMPANY_ADMIN sees: everything plus Settings

Use the useAuthStore to read the current user role and filter nav items.

Create the header component apps/web/components/features/layout/header.tsx:

- Breadcrumbs showing current page location
- Notification bell (badge with unread count)
- User avatar with dropdown (profile link, settings link, logout)

Create apps/web/app/(app)/dashboard/page.tsx:

A simple dashboard with four metric cards: Active Jobs, Total Applications This Month, Interviews This Week, Open Offers. Each card shows a number and a trend indicator.

Fetch these metrics from GET /api/v1/companies/me/usage.

Afternoon session (3 hours): TanStack Query setup and API hooks.

Create the TanStack Query provider. Wrap the app layout in a QueryClientProvider:

In apps/web/app/layout.tsx (the root layout):

- Add QueryClientProvider
- Add Toaster from shadcn for toast notifications

Create apps/web/lib/api/jobs.api.ts:
Functions that wrap API calls: getJobs, getJob, createJob, updateJob, publishJob, closeJob.

Create apps/web/hooks/use-jobs.ts:
Custom hooks wrapping TanStack Query:

- useJobs(filters) - uses useQuery
- useJob(id) - uses useQuery
- useCreateJob() - uses useMutation
- usePublishJob() - uses useMutation

Pattern for all hooks:
export function useJobs(filters?: JobFilters) {
return useQuery({
queryKey: ['jobs', filters],
queryFn: () => jobsApi.getJobs(filters),
});
}

Create apps/web/app/(app)/jobs/page.tsx:

- Job list page with filters (status dropdown, search input)
- Each job shows: title, department, location, status badge, application count, posted date
- "Create Job" button in the top right
- Loading skeleton while fetching

End of day deliverable: Authenticated layout complete with sidebar and header. Dashboard shows company metrics. Jobs list page loads real data.

---

## DAY 13: Job Creation Form

Morning session (3 hours): Multi-step form structure.

Create apps/web/app/(app)/jobs/new/page.tsx:

The page contains a multi-step form. Steps are tracked in local state (not URL because you don't want partial job data in the URL).

Create apps/web/components/features/jobs/job-form-steps.tsx:

A step indicator component showing the current step and completed steps. Clicking a completed step goes back to it. Clicking a future step is disabled.

Create the Zod schema for the complete job form in apps/web/lib/validations/job.schema.ts:

import { z } from 'zod';

export const jobSchema = z.object({
title: z.string().min(1, 'Job title is required').max(255),
department: z.string().optional(),
location: z.string().optional(),
employment_type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE']),
remote_type: z.enum(['ONSITE', 'REMOTE', 'HYBRID']),
description: z.string().min(50, 'Description must be at least 50 characters'),
requirements: z.string().optional(),
salary_min: z.number().positive().optional(),
salary_max: z.number().positive().optional(),
currency: z.string().length(3).default('USD'),
salary_public: z.boolean().default(false),
application_form_fields: z.array(z.object({
id: z.string(),
type: z.enum(['text', 'textarea', 'select', 'file', 'url', 'boolean']),
label: z.string(),
required: z.boolean(),
options: z.array(z.string()).optional(),
})).optional(),
});

Afternoon session (3 hours): Form steps implementation.

Step 1 component: Basic Info

- Title (text input)
- Department (combobox that suggests existing departments from the company's jobs)
- Location (text input)
- Employment Type (select with all enum values)
- Remote Type (select)
- Target Hire Count (number input)

Step 2 component: Description

- Rich text editor. Use @uiw/react-md-editor (simpler than TipTap for initial version):
  cd apps/web && npm install @uiw/react-md-editor
- "Generate with AI" button that opens a dialog
- The AI dialog asks for: brief description (textarea), key technologies (text), seniority level (select)
- On submit, calls POST /api/v1/jobs/ai-description and replaces the description field value

Step 3 component: Requirements

- Rich text editor for requirements
- Rich text editor for nice-to-have
- Salary range: two number inputs with currency selector
- Show salary publicly checkbox

Step 4 component: Application Form Builder

- Default fields shown (non-removable): Full Name, Email, Resume Upload
- "Add Field" button with field type selector
- Each custom field can be dragged to reorder, renamed, marked required, deleted
- For select fields: ability to add options

Step 5 component: Review and Publish

- Read-only preview of the full job
- "Save as Draft" button and "Publish Now" button

On publish, call the createJob mutation then the publishJob mutation, then redirect to /jobs/:id/pipeline.

End of day deliverable: Multi-step job creation form works end-to-end. Jobs appear in the job list after creation.

---

## DAY 14: WebSocket Gateway and Real-time Foundation

Morning session (3 hours): WebSocket gateway.

Install the Socket.io Redis adapter for multi-instance support:
cd apps/api
npm install @socket.io/redis-adapter

Create apps/api/src/modules/websockets/websockets.gateway.ts:

import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'ioredis';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: { origin: process.env.FRONTEND_URL, credentials: true } })
export class WebsocketsGateway implements OnGatewayConnection, OnGatewayDisconnect {
@WebSocketServer() server: Server;

async afterInit(server: Server) {
const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();
await Promise.all([pubClient.connect(), subClient.connect()]);
server.adapter(createAdapter(pubClient, subClient));
}

async handleConnection(client: Socket) {
const token = client.handshake.query.token as string;
try {
const payload = this.jwtService.verify(token, { algorithms: ['RS256'] });
client.data.userId = payload.sub;
client.data.companyId = payload.company_id;

      // Join company room (for team events like Kanban updates)
      client.join(`company:${payload.company_id}`);
      // Join user room (for personal notifications)
      client.join(`user:${payload.sub}`);
    } catch {
      client.disconnect();
    }

}

async handleDisconnect(client: Socket) {
// No cleanup needed - rooms are automatically cleaned up
}

emitToCompany(companyId: string, event: string, data: any) {
this.server.to(`company:${companyId}`).emit(event, data);
}

emitToUser(userId: string, event: string, data: any) {
this.server.to(`user:${userId}`).emit(event, data);
}
}

Wire up the WebSocket events. In ApplicationsService, after moveStage succeeds, call WebsocketsGateway.emitToCompany with the ApplicationMoved event.

Afternoon session (3 hours): Frontend Socket.io client.

Create apps/web/lib/socket.ts:

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(token: string): Socket {
if (!socket || !socket.connected) {
socket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3001', {
query: { token },
reconnection: true,
reconnectionAttempts: 5,
reconnectionDelay: 1000,
});
}
return socket;
}

export function disconnectSocket() {
if (socket) {
socket.disconnect();
socket = null;
}
}

Create apps/web/hooks/use-socket.ts:

import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket } from '@/lib/socket';
import { useAuthStore } from '@/store/auth.store';

export function useSocket() {
const socketRef = useRef<Socket | null>(null);
const accessToken = /_ read from cookie _/;

useEffect(() => {
if (accessToken) {
socketRef.current = getSocket(accessToken);
}
return () => { /_ don't disconnect on every unmount, keep the socket alive _/ };
}, [accessToken]);

return socketRef.current;
}

Create apps/web/hooks/use-socket-event.ts:

This hook subscribes to a specific socket event and calls a callback when it fires:

export function useSocketEvent(event: string, callback: (data: any) => void) {
const socket = useSocket();

useEffect(() => {
if (!socket) return;
socket.on(event, callback);
return () => { socket.off(event, callback); };
}, [socket, event, callback]);
}

Test the WebSocket connection:

1. Log in on the frontend
2. Open browser DevTools > Network > WS tab
3. Should see a WebSocket connection to localhost:3001
4. Move an application via Postman
5. Should see the event appear in the WS tab

End of day deliverable: WebSocket gateway running. Frontend connected to it. Moving a stage via API triggers a WebSocket event visible in browser DevTools.

---

# WEEK 3: KANBAN BOARD AND AI PIPELINE

---

## DAY 15: Kanban Board Frontend

Morning session (3 hours): Kanban board structure.

Install dnd-kit:
cd apps/web
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities @dnd-kit/modifiers

Create apps/web/app/(app)/jobs/[id]/pipeline/page.tsx:

This page loads the full pipeline data via GET /api/v1/jobs/:id/pipeline and renders the KanbanBoard component.

Create apps/web/components/features/kanban/kanban-board.tsx:

The KanbanBoard component:

- Takes stages (array of stage objects with their applications) as props
- Wraps everything in DndContext from @dnd-kit/core
- Renders a KanbanColumn for each stage
- Handles the drag end event

The drag end handler (this is the most important piece):

function handleDragEnd(event: DragEndEvent) {
const { active, over } = event;

if (!over || active.id === over.id) return;

// Determine if dropped on a column or a card
const overId = over.id as string;
const activeId = active.id as string;

// Find which column the card was dropped into
const targetStageId = findTargetStage(stages, overId);

if (!targetStageId) return;

// Optimistic update - move the card in local state immediately
setStages(moveCardOptimistically(stages, activeId, targetStageId));

// API call
moveStage.mutate({ applicationId: activeId, stageId: targetStageId }, {
onError: () => {
// Revert on failure
setStages(originalStages);
toast.error('Failed to move candidate');
}
});
}

Create apps/web/components/features/kanban/kanban-column.tsx:

Uses SortableContext from @dnd-kit/sortable. Shows stage name, application count, and color indicator at top. Renders KanbanCard for each application. Has a "Load More" button if there are more applications.

Afternoon session (3 hours): Kanban card and real-time updates.

Create apps/web/components/features/kanban/kanban-card.tsx:

Each card shows:

- Candidate name
- AI score ring (small version, 40px diameter)
- Days in current stage (calculated client-side from stage history)
- Source badge (LinkedIn icon, Indeed icon, etc.)
- Applied date
- Quick action buttons on hover: View, Schedule Interview, Reject

The AI score ring is a simple SVG circle with stroke-dasharray to show the percentage. Color: green for 80+, yellow for 60-79, red below 60. If score is null (still processing), show a spinning animation.

The score ring SVG component:

function ScoreRing({ score }: { score: number | null }) {
const radius = 16;
const circumference = 2 _ Math.PI _ radius;
const strokeDashoffset = score !== null
? circumference - (score / 100) \* circumference
: 0;
const color = score === null ? '#9ca3af' : score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';

return (
<svg width="40" height="40" viewBox="0 0 40 40">
<circle cx="20" cy="20" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="4" />
{score !== null ? (
<circle cx="20" cy="20" r={radius} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          strokeLinecap="round" transform="rotate(-90 20 20)" />
) : (
<circle cx="20" cy="20" r={radius} fill="none" stroke="#9ca3af" strokeWidth="4"
          strokeDasharray="4 4" className="animate-spin origin-center" />
)}
<text x="20" y="20" textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="bold" fill={color}>
{score !== null ? score : '?'}
</text>
</svg>
);
}

Wire up real-time updates. In the pipeline page, use useSocketEvent to listen for application:moved and application:scored events. On application:moved, update the local stages state. On application:scored, update the specific card's score.

End of day deliverable: Kanban board fully functional with drag-and-drop. Moving a card updates the database and other browser windows see the update via WebSocket.

---

## DAY 16: Resume Parsing AI Processor

Morning session (3 hours): PDF extraction and OpenAI integration.

Install PDF and document parsing libraries:
cd apps/api
npm install pdf-parse mammoth
npm install -D @types/pdf-parse

Create the complete ResumeParseProcessor in apps/api/src/modules/ai/processors/resume-parse.processor.ts:

Step 1 - Download from S3:
private async downloadFromS3(key: string): Promise<Buffer> {
const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
const response = await this.s3Client.send(command);
const chunks: Buffer[] = [];
for await (const chunk of response.Body as any) {
chunks.push(chunk);
}
return Buffer.concat(chunks);
}

Step 2 - Extract text:
private async extractText(buffer: Buffer, fileType: string): Promise<string> {
if (fileType === 'application/pdf') {
const data = await pdfParse(buffer);
return data.text;
} else if (fileType.includes('word') || fileType.includes('docx')) {
const result = await mammoth.extractRawText({ buffer });
return result.value;
}
throw new Error(`Unsupported file type: ${fileType}`);
}

Step 3 - Clean text:
private cleanResumeText(text: string): string {
return text
.replace(/\r\n/g, '\n')
.replace(/\n{3,}/g, '\n\n')
.replace(/[ \t]{2,}/g, ' ')
.replace(/[^\x20-\x7E\n]/g, '') // Remove non-printable characters
.trim()
.substring(0, 30000); // Truncate to ~8000 tokens
}

Afternoon session (3 hours): OpenAI call and result storage.

Step 4 - OpenAI call:
private async parseWithOpenAI(resumeText: string): Promise<ParsedResume> {
const completion = await this.openai.chat.completions.create({
model: 'gpt-4o-mini',
response_format: { type: 'json_object' },
messages: [
{ role: 'system', content: RESUME_PARSE_PROMPT },
{ role: 'user', content: `Resume text:\n\n${resumeText}` },
],
temperature: 0,
});

const rawResponse = completion.choices[0].message.content;
const parsed = JSON.parse(rawResponse);

// Validate with Zod
return ParsedResumeSchema.parse(parsed);
}

Create the Zod validation schema for the parsed resume in apps/api/src/modules/ai/validators/resume-parse.validator.ts. This schema matches the MongoDB document structure exactly.

Step 5 - Store in MongoDB:
Store the parsed resume document. Update the PostgreSQL application record.

Step 6 - Enqueue scoring:
After successful parse, call this.aiService.enqueueCandidateScore(applicationId, jobId, companyId).

Step 7 - Emit WebSocket event:
this.websocketsGateway.emitToCompany(companyId, 'application:resume-parsed', { applicationId });

Complete the full process method connecting all steps with try-catch:

async process(job: Job): Promise<void> {
const { applicationId, companyId, resumeUrl, fileType } = job.data;

try {
const buffer = await this.downloadFromS3(resumeUrl);
const rawText = await this.extractText(buffer, fileType);
const cleanedText = this.cleanResumeText(rawText);
const parsed = await this.parseWithOpenAI(cleanedText);

    await this.mongoService.parsedResumes.create({ ...parsed, application_id: applicationId, company_id: companyId });
    await this.prisma.application.update({
      where: { id: applicationId },
      data: { resume_parsed: true, resume_parsed_at: new Date() },
    });

    await this.aiService.enqueueCandidateScore(applicationId, job.data.jobId, companyId);
    this.websocketsGateway.emitToCompany(companyId, 'application:resume-parsed', { applicationId });

} catch (error) {
if (error.name === 'ZodError') {
// Validation failure - store error, don't retry
await this.prisma.application.update({
where: { id: applicationId },
data: { resume_parsed: false },
});
throw new UnrecoverableError('Invalid AI response structure');
}
throw error; // BullMQ will retry
}
}

Test the complete pipeline: submit an application via Postman, watch the worker logs, verify parsed resume appears in MongoDB (check via mongo-express at localhost:8081), verify application.resume_parsed is true in PostgreSQL.

End of day deliverable: Resume parsing pipeline works end-to-end. Upload a real PDF resume and see structured data appear in MongoDB.

---

## DAY 17: Candidate Scoring AI Processor

Morning session (3 hours): Scoring processor implementation.

Create the complete CandidateScoringProcessor:

The process method:

1. Load application from PostgreSQL (get job_id)
2. Load job from PostgreSQL (get description, requirements)
3. Load parsed resume from MongoDB (get skills, experience, education)
4. Build the scoring prompt using buildCandidateScoringPrompt function from Phase 10

The buildCandidateScoringPrompt function takes:

- Job title, description, required_skills array, preferred_skills array
- Candidate name, total years experience, experience summary, skills array, education string

The experience summary is constructed from the MongoDB parsed_resume:
experience.map(e => `${e.title} at ${e.company} (${e.duration_months} months): ${e.description}`).join('\n')

5. Call OpenAI with the scoring prompt
6. Validate response with CandidateScoreSchema Zod validator

Create the CandidateScoreSchema:
const CandidateScoreSchema = z.object({
overall_score: z.number().int().min(0).max(100),
confidence: z.number().min(0).max(1),
subscores: z.object({
skills_match: z.number().int().min(0).max(100),
experience_level: z.number().int().min(0).max(100),
education_relevance: z.number().int().min(0).max(100),
culture_indicators: z.number().int().min(0).max(100),
keywords_match: z.number().int().min(0).max(100),
}),
strengths: z.array(z.string()).min(1).max(5),
gaps: z.array(z.string()).max(5),
explanation: z.string().min(50),
skill_gap_analysis: z.object({
required_skills_present: z.array(z.string()),
required_skills_missing: z.array(z.string()),
preferred_skills_present: z.array(z.string()),
preferred_skills_missing: z.array(z.string()),
}),
recommendation: z.enum(['pass', 'consider', 'interview', 'strong_recommend']),
});

7. Store score document in MongoDB candidate_scores collection
8. Update application.ai_score in PostgreSQL
9. Increment company.ai_scores_used_this_month via atomic increment
10. Emit 'application:scored' WebSocket event with the application_id and score

Afternoon session (3 hours): Score display in frontend.

Create apps/web/components/features/ai/ai-score-breakdown.tsx:

This component shows the full score details. It appears in the application detail side panel.

Sections:

- Overall score (large ring, 120px diameter)
- Recommendation badge (color-coded: red=Pass, orange=Consider, blue=Interview, green=Strong Recommend)
- Subscores as five progress bars (Skills Match, Experience Level, Education, Culture, Keywords)
- Strengths section (green bullet points with checkmark icons)
- Gaps section (yellow bullet points with warning icons)
- Explanation paragraph (italic, muted color)
- Skill gap analysis: two-column table showing Required Skills as "Has" vs "Missing"

Create the application detail slide-over panel. When a user clicks a candidate card, a right-side panel slides in showing:

- Candidate name, contact info, tags
- Tabs: Overview, Resume, Timeline, Notes

The Overview tab shows the AI score breakdown component.

Wire up the 'application:scored' WebSocket event: when received, update the specific application in the TanStack Query cache with the new score. The Kanban card's score ring updates instantly.

Test the full flow: submit application, watch the worker parse and score, see the score appear on the Kanban board in real-time.

End of day deliverable: Full AI pipeline operational. Submit a resume, watch it get parsed and scored, see the score appear on the Kanban board without refreshing.

---

## DAY 18: Application Detail Page and Notes

Morning session (3 hours): Application detail.

Create apps/web/app/(app)/applications/[id]/page.tsx:

This is the full application detail page (not the slide-over). It shows everything about a candidate's application.

Layout: Two columns. Left column (60%): candidate info, parsed resume, AI score. Right column (40%): activity timeline, team notes, interview schedule.

The parsed resume display shows:

- Contact information section
- Professional summary if present
- Work experience: each role as a card with company, title, dates, description, technologies as badges
- Education: simple list
- Skills: all skills as badges grouped by category (Technical, Soft, Languages, Certifications)

The activity timeline shows all events in chronological order:

- Application submitted
- Resume parsed
- Stage moved (with who moved it)
- Interview scheduled
- Scorecard submitted
- Offer sent

Fetch the timeline by combining stage_history records from the API with a structured response.

Afternoon session (3 hours): Notes and mentions.

Create the notes component for the application detail page.

The notes section shows existing notes and an "Add Note" form.

The Add Note form is a textarea with a submit button. Notes support @mention of team members.

Implement @mention: when the user types @, show a dropdown of team members. This requires a combobox overlay positioned relative to the cursor. Use a simple implementation: on keystroke, if the last word starts with @, filter team members by the remaining characters and show a floating list.

Store the mentioned user IDs in the application_notes.mentioned_users array. When a note with mentions is saved, send notifications to the mentioned users.

Create the notes API endpoints and frontend hooks:
POST /api/v1/applications/:id/notes
GET /api/v1/applications/:id/notes

The frontend note list polls for new notes every 30 seconds OR listens for a 'note:created' WebSocket event (emit this from the API when a note is saved).

End of day deliverable: Complete application detail page. Recruiters can see full candidate profile, parsed resume, AI score breakdown, timeline, and collaborate via notes.

---

## DAY 19: Bias Detection Feature

Morning session (3 hours): Bias detection processor and API.

Create the complete BiasDetectProcessor:

The process method:

1. Load the job from PostgreSQL
2. Combine description and requirements into one text block
3. Build the bias detection prompt

The bias detection prompt sends the full job text and asks for JSON output listing all biased phrases with their location, category, severity, and suggested replacement.

Categories to detect:

- gender_coded: words that research shows skew applications by gender (rockstar, ninja, competitive, dominant, collaborative, warm)
- age_biased: phrases that discourage certain age groups (young, energetic, digital native, recent graduate preferred, fresh ideas)
- disability_discriminatory: requirements that aren't job-necessary (must be able to lift 50 pounds for a desk job)
- cultural_exclusionary: assuming specific cultural background (must be familiar with American football analogies)

4. Store bias report in MongoDB ai_bias_reports collection
5. Update job.bias_check_run to true, job.bias_check_passed based on severity
6. Emit 'job:bias-checked' event

Create the API endpoint: POST /api/v1/jobs/:id/bias-check (triggers manually) and GET /api/v1/jobs/:id/bias-check (fetches latest report).

Afternoon session (3 hours): Bias warning panel in job creation form.

Create apps/web/components/features/jobs/bias-warning-panel.tsx:

This component appears on the Review step of the job creation form. It shows the bias check results.

States:

- Loading: "Checking for biased language..." with spinner
- No issues: green checkmark, "No bias detected"
- Issues found: warning icon, count of issues, list of flagged phrases

For each flag, show:

- The exact phrase highlighted in yellow
- Category badge (Gender-Coded, Age-Biased, etc.)
- Severity badge (Low, Medium, High)
- Explanation of why it's a problem
- Suggested replacement

The recruiter sees two buttons at the bottom: "Publish Anyway" and "Go Back to Edit". Clicking "Go Back to Edit" takes them to the description step.

When the bias check runs, it automatically highlights the flagged phrases in the description preview. Implement this by replacing the flagged phrase text in the preview with a highlighted span.

Trigger the bias check on Step 5 load: when the component mounts, call POST /api/v1/jobs/:id/bias-check. Poll GET /api/v1/jobs/:id/bias-check every 3 seconds until bias_check_run is true.

End of day deliverable: Bias detection runs automatically when a job is reviewed before publishing. Biased phrases are highlighted with suggestions.

---

## DAY 20: Notification System

Morning session (3 hours): Notifications backend.

Create apps/api/src/modules/notifications/notifications.service.ts:

The send method:
async send(options: SendNotificationOptions): Promise<void> {
const { type, recipientIds, title, body, metadata, actionUrl, channels = ['in_app', 'email'] } = options;

for (const recipientId of recipientIds) {
const user = await this.usersService.findById(recipientId);
const prefs = user.preferences?.notifications || {};
const userChannels = channels.filter(ch => prefs[type]?.[ch] !== false);

    // In-app notification
    if (userChannels.includes('in_app')) {
      const notification = await this.notificationsRepository.create({
        company_id: user.company_id, user_id: recipientId, type, title, body,
        metadata, action_url: actionUrl,
      });
      this.websocketsGateway.emitToUser(recipientId, 'notification:created', notification);
    }

    // Email
    if (userChannels.includes('email')) {
      await this.emailQueue.add('send', {
        to: user.email, templateType: type,
        variables: { name: user.first_name, ...metadata },
      });
    }

}
}

Connect notifications to domain events. Add event listeners for:

- ApplicationCreated → notify all recruiters for the job
- ApplicationMoved → notify the recruiter who owns the job (if not the person who moved it)
- InterviewScheduled → notify interviewers and candidate
- OfferSent → notify candidate
- ScorecardSubmitted → notify recruiter

Create apps/api/src/modules/notifications/notifications.controller.ts:
GET /api/v1/notifications - List user's notifications (paginated)
PATCH /api/v1/notifications/:id/read - Mark as read
PATCH /api/v1/notifications/read-all - Mark all as read
GET /api/v1/notifications/unread-count - Get count for bell badge

Afternoon session (3 hours): Frontend notification center.

Create apps/web/components/features/notifications/notification-bell.tsx:

A bell icon button that shows an unread count badge. Clicking opens the NotificationCenter panel.

The badge shows the count from GET /api/v1/notifications/unread-count, refetched every 30 seconds and updated via WebSocket when a new notification arrives.

Create apps/web/components/features/notifications/notification-center.tsx:

A slide-over panel showing the notification list. Each notification has:

- Icon based on type (envelope for email, calendar for interview, etc.)
- Title and body
- Time ago (e.g., "2 hours ago")
- Read/unread visual indicator (bold text and blue dot for unread)
- Clicking marks as read and navigates to the action_url

Use the useSocketEvent hook to listen for 'notification:created'. When received, add the notification to the top of the list and increment the unread count.

End of day deliverable: In-app notifications working. New applications trigger notifications visible in the bell. Emails appear in MailHog.

---

## DAY 21: Week Review, Bug Fixes, and Integration Testing

This is a consolidation day. No new features.

Morning session (3 hours): Integration testing the complete flow.

Test the complete happy path end-to-end:

1. Register a company
2. Verify email (MailHog)
3. Create a job with AI-generated description
4. See bias warning and dismiss it
5. Publish the job
6. Navigate to the public application form (/apply/:jobId)
7. Submit an application with a real PDF resume
8. Watch the Kanban board — the candidate appears in "New Application"
9. See the AI score appear on the card after 10-30 seconds
10. Click the card and read the score breakdown
11. Drag the candidate to "Resume Review"
12. Other browser window (opened in incognito) should see the card move

Fix every bug found in this flow. Common issues at this point:

- CORS errors (ensure CORS is configured in NestJS main.ts with credentials: true)
- JWT not being sent (ensure axios interceptor reads the cookie correctly)
- MongoDB connection issues (ensure MONGODB_URI is set correctly)
- BullMQ job not being picked up (ensure worker is running)

Afternoon session (3 hours): Error handling and validation polish.

Add the global exception filter to apps/api/src/main.ts:

app.useGlobalFilters(new AllExceptionsFilter());

Create apps/api/src/common/filters/all-exceptions.filter.ts:

This filter catches all exceptions and returns a consistent error response:
{ status, code, message, details, request_id }

For Prisma errors: P2002 (unique constraint violation) → 409 DUPLICATE_RESOURCE. P2025 (record not found) → 404 RESOURCE_NOT_FOUND. P2003 (foreign key constraint) → 400 INVALID_REFERENCE.

For class-validator ValidationError → 422 VALIDATION_ERROR with details array.

Add the response transform interceptor that wraps all successful responses in:
{ success: true, data: originalResponse, timestamp, request_id }

End of day deliverable: Complete integration test passed. All bugs fixed. Consistent error and response formats throughout the API.

---

# WEEK 4: INTERVIEWS, OFFERS, AND STRIPE

---

## DAY 22: Interviews Module Backend

Morning session (3 hours): Interviews module.

Create apps/api/src/modules/interviews/interviews.service.ts:

createInterview method:

1. Verify application exists and is active
2. Create interview record
3. Create InterviewInterviewer records for each interviewer
4. Emit InterviewScheduled event (triggers notifications)
5. If recruiter has Google Calendar connected, create Calendar event
6. Return full interview with interviewers populated

For Google Calendar, create a GoogleCalendarService:
npm install googleapis

The service needs these methods:

- createEvent(userAccessToken, event details) → returns event ID
- updateEvent(userAccessToken, eventId, updates)
- deleteEvent(userAccessToken, eventId)

The refresh token for Google Calendar is stored encrypted on the user record. Create a helper that decrypts and uses it:
npm install node-encrypt-aes

The createEvent call:
const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
const event = await calendar.events.insert({
calendarId: 'primary',
requestBody: {
summary: `Interview: ${candidateName} - ${jobTitle}`,
start: { dateTime: scheduledAt.toISOString() },
end: { dateTime: endTime.toISOString() },
attendees: interviewerEmails.map(email => ({ email })),
conferenceData: locationTypes === 'VIDEO' ? { createRequest: { requestId: uuid() } } : undefined,
},
conferenceDataVersion: 1,
});

Afternoon session (3 hours): Scorecards.

Create scorecard endpoints:
POST /api/v1/interviews/:id/scorecards - Submit scorecard
GET /api/v1/interviews/:id/scorecards - Get all scorecards for interview

The scorecard submission:

1. Verify interview exists and user is assigned as interviewer (or is recruiter/admin)
2. Check no existing scorecard from this user for this interview
3. Create scorecard and ratings
4. Enqueue sentiment analysis job
5. Emit ScorecardSubmitted event
6. Return scorecard

Create a separate endpoint for the aggregated view:
GET /api/v1/interviews/:id/summary - Returns all scorecards aggregated

The summary response:

- Overall rating distribution (count of STRONG_YES, YES, etc.)
- Per-criterion average rating across all scorecards
- Whether all interviewers have submitted (for deadline tracking)
- Individual scorecard previews (no full notes, just ratings)

End of day deliverable: Can schedule interviews, assign interviewers, submit scorecards. Google Calendar events created if connected.

---

## DAY 23: Interview Frontend and AI Question Generation

Morning session (3 hours): Interview scheduling UI.

Create apps/web/components/features/interviews/interview-scheduler.tsx:

A multi-step drawer (right-side panel) with steps:
Step 1: Select type (Video/Phone/Onsite), duration, meeting link or location
Step 2: Select interviewers (multi-select from team members with INTERVIEWER role or higher)
Step 3: Select date and time (date picker with time slots in 30-minute intervals)
Step 4: Optional - select interview kit

On submit, call POST /api/v1/interviews with the form data.

The interview list page at /interviews shows all upcoming interviews for the current user. Interviewers see only their interviews. Recruiters see all. Each interview card shows: candidate name, job title, date/time, interviewers list, status, "Add Scorecard" button if status is COMPLETED.

Afternoon session (3 hours): AI question generation.

Create the InterviewQuestionsProcessor:

process method:

1. Load job from PostgreSQL
2. Build the question generation prompt including job title, required skills, seniority
3. Call OpenAI with gpt-4o (use the smarter model for question quality)
4. Parse and validate response
5. Store in MongoDB interview_question_sets collection
6. Emit 'job:questions-ready' event

The question generation prompt asks for 5 categories, 3-4 questions each. Categories: Technical Skills, System Design, Behavioral, Problem Solving, Culture and Values.

Create apps/web/components/features/interviews/question-set-display.tsx:

Shows the generated questions organized by category. Each question has:

- Question text
- Expand arrow to see follow-ups and evaluation criteria
- Edit button (opens an inline text input)
- Delete button

"Generate Questions" button appears on the interview kit step of the scheduler. Clicking it calls POST /api/v1/interviews/generate-questions?jobId=:id.

Poll for the result with GET /api/v1/jobs/:id/question-set until the data is available (BullMQ is async).

End of day deliverable: Complete interview management. Interviewers can submit scorecards. AI-generated questions appear in the interview kit.

---

## DAY 24: Offers Module

Morning session (3 hours): Offers backend.

Install Puppeteer for PDF generation:
npm install puppeteer

Create apps/api/src/modules/offers/offers.service.ts:

createOffer method:

1. Load application and candidate
2. Create offer record with status DRAFT
3. Return offer

generateOfferLetter method:

1. Load offer with application, candidate, job, company
2. Build HTML from the offer letter template
3. Use Puppeteer to render HTML to PDF:

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setContent(offerHtml, { waitUntil: 'networkidle0' });
const pdf = await page.pdf({ format: 'A4', margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' } });
await browser.close();

4. Upload PDF to S3 with key: offers/{companyId}/{offerId}/offer-letter.pdf
5. Update offer.offer_letter_url with the S3 key
6. Return the signed download URL

sendOffer method:

1. Generate the offer letter PDF if not already generated
2. Get signed download URL
3. Send email to candidate with offer details and PDF attached (or link to signed URL)
4. Update offer.status to SENT and offer.sent_at to now
5. Emit OfferSent event

respondOffer method (called by the candidate from their portal):

1. Validate the tracking token (candidates are not authenticated users)
2. Update offer.status to ACCEPTED or DECLINED
3. If accepted, update application.status to HIRED and application.hired_at
4. If declined, application remains active
5. Emit OfferAccepted or OfferDeclined event

Afternoon session (3 hours): Offer frontend and candidate portal.

Create the offer form page at apps/web/app/(app)/offers/[applicationId]/new/page.tsx:

Form fields: Base salary, Bonus (optional), Equity (text, optional), Benefits (textarea), Start date (date picker), Expiry date (date picker, default 7 days from today).

Preview button shows the offer letter HTML before generating PDF.

Create the candidate portal at apps/web/app/(portal)/status/page.tsx:

Candidates access this with their tracking token (from the confirmation email). The page shows:

- Job title and company name
- Current application status with a simple visual timeline
- If an offer has been sent: offer details summary, "Accept Offer" and "Decline Offer" buttons
- Accept/decline calls PATCH /api/v1/offers/:id/respond

End of day deliverable: Complete offer flow. Recruiter can create offer, generate PDF letter, send to candidate. Candidate can accept or decline from the portal.

---

## DAY 25: Stripe Billing Backend

Morning session (3 hours): Stripe setup and checkout.

Install Stripe:
cd apps/api
npm install stripe

Create apps/api/src/modules/billing/billing.service.ts:

createOrGetStripeCustomer(company):

1. If company.stripe_customer_id exists, return it
2. Create Stripe customer: stripe.customers.create({ email, name, metadata: { company_id } })
3. Update company.stripe_customer_id
4. Return customer ID

createCheckoutSession(companyId, planType):

1. Get or create customer
2. Get the Stripe Price ID for the plan from environment config
3. Create session:

const session = await stripe.checkout.sessions.create({
customer: customerId,
mode: 'subscription',
payment_method_types: ['card'],
line_items: [{ price: priceId, quantity: 1 }],
success_url: `${frontendUrl}/settings/billing?success=true`,
cancel_url: `${frontendUrl}/settings/billing?canceled=true`,
metadata: { company_id: companyId },
subscription_data: { trial_period_days: 14 },
allow_promotion_codes: true,
});

4. Return session.url

createCustomerPortalSession(companyId):

1. Get customer ID
2. Create portal session: stripe.billingPortal.sessions.create({ customer: customerId, return_url: billingPageUrl })
3. Return portal URL

Afternoon session (3 hours): Stripe webhook handler.

The webhook endpoint is critical. It must receive the raw body (not parsed JSON) for signature validation.

In main.ts, configure the billing route to skip body parsing:
app.use('/api/v1/billing/webhook', express.raw({ type: 'application/json' }));

Create apps/api/src/modules/billing/billing.controller.ts:

The webhook endpoint:
@Post('webhook')
@HttpCode(200)
async handleWebhook(@Req() req: Request, @Headers('stripe-signature') signature: string) {
let event: Stripe.Event;

try {
event = this.stripe.webhooks.constructEvent(req.body, signature, this.webhookSecret);
} catch (err) {
throw new BadRequestException('Invalid webhook signature');
}

// Idempotency check
const existing = await this.billingRepository.findEventByStripeId(event.id);
if (existing?.processed) return { received: true };

await this.billingService.handleWebhookEvent(event);
return { received: true };
}

Implement handleWebhookEvent with switch on event.type:

checkout.session.completed:

- Extract company_id from metadata
- Update company plan, stripe_subscription_id, subscription_status: ACTIVE

customer.subscription.updated:

- Find company by stripe_subscription_id
- Update plan, current_period_end, subscription_status

customer.subscription.deleted:

- Find company
- Set subscription_status: CANCELED
- Downgrade plan to FREE (but keep data)

invoice.payment_failed:

- Find company
- Set subscription_status: PAST_DUE
- Send email to company_admin

invoice.payment_succeeded:

- Set subscription_status: ACTIVE

Always mark the event as processed after handling.

Test webhooks locally using the Stripe CLI:
stripe login
stripe listen --forward-to localhost:3001/api/v1/billing/webhook
stripe trigger checkout.session.completed

End of day deliverable: Stripe checkout creates a subscription. Webhooks update the company's plan. Customer portal works.

---

## DAY 26: Billing Frontend and Plan Enforcement

Morning session (3 hours): Billing settings page.

Create apps/web/app/(app)/settings/billing/page.tsx:

The billing page shows:

- Current plan badge
- Billing cycle and next renewal date
- Current usage bars:
  - Active Jobs: X / Y
  - Team Members: X / Y
  - AI Scores This Month: X / Y
- "Upgrade Plan" section with plan cards side by side
- "Manage Billing" button that redirects to Stripe Customer Portal
- Invoice history table (fetched from Stripe via API)

Plan cards show: plan name, price, feature list, current plan badge if active, upgrade button.

Clicking "Upgrade" calls POST /api/v1/billing/checkout?plan=GROWTH and redirects to the returned Stripe Checkout URL.

Afternoon session (3 hours): Plan limit enforcement in frontend.

Create a useCompany hook that fetches the current company with usage:

export function useCompany() {
return useQuery({
queryKey: ['company'],
queryFn: () => companiesApi.getMe(),
staleTime: 5 _ 60 _ 1000, // 5 minutes
});
}

Create a usePlanLimits hook that returns the limit check helpers:

export function usePlanLimits() {
const { data: company } = useCompany();
return {
canCreateJob: company?.active_jobs < company?.max_active_jobs || company?.max_active_jobs === -1,
canInviteUser: company?.team_members < company?.max_team_members || company?.max_team_members === -1,
isAtAiQuota: company?.ai_scores_used >= company?.max_ai_scores_per_month,
};
}

Use this hook in the job creation button: if canCreateJob is false, disable the button and show a tooltip: "You've reached your plan's job limit. Upgrade to create more jobs."

Create the upgrade modal (UpgradeModal component) that appears when a user hits a limit. It shows the current plan, the next plan with its benefits, and a direct upgrade button.

End of day deliverable: Billing page shows accurate usage. Plan limits enforced in UI. Upgrading via Stripe works end-to-end.

---

## DAY 27: Analytics Module Backend

Morning session (3 hours): Analytics queries.

Create apps/api/src/modules/analytics/analytics.service.ts:

getPipelineConversionRates(companyId, jobId, dateFrom, dateTo):
Query application_stage_history to calculate the count of applications that moved from each stage to the next. This gives conversion rates.

SQL approach using Prisma:

1. Get all stages for the job in order
2. For each consecutive pair of stages, count how many applications moved from stage N to stage N+1 within the date range
3. Divide by the count entering stage N for the conversion rate

getTimeToHire(companyId, dateFrom, dateTo):
SELECT AVG(EXTRACT(EPOCH FROM (hired_at - applied_at)) / 86400) as avg_days
FROM applications
WHERE company_id = :companyId
AND status = 'HIRED'
AND hired_at BETWEEN :dateFrom AND :dateTo

getSourceQuality(companyId, dateFrom, dateTo):
Count applications and hires grouped by source. Conversion rate = hires / applications for each source.

getTeamPerformance(companyId, dateFrom, dateTo):
For each recruiter: count jobs they created, count applications they moved, count interviews they scheduled, count offers they sent.

Afternoon session (3 hours): Daily aggregation job.

Create apps/api/src/modules/analytics/jobs/daily-aggregation.job.ts:

This is a cron job that runs at 2 AM UTC daily:

@Cron(CronExpression.EVERY_DAY_AT_2AM)
async aggregatePreviousDay() {
const yesterday = startOfDay(subDays(new Date(), 1));
const endOfYesterday = endOfDay(yesterday);

const companies = await this.companiesRepository.findAllActive();

for (const company of companies) {
await this.aggregateForCompany(company.id, yesterday, endOfYesterday);
}
}

Install the cron module:
npm install @nestjs/schedule
npm install -D @types/cron

The aggregateForCompany method computes all analytics for a company for the given day and upserts the AnalyticsSnapshot record.

The analytics endpoints use the AnalyticsSnapshot table for historical data (fast) and real-time queries for today's data.

End of day deliverable: Analytics endpoints return real data. Daily aggregation job runs (test by calling it manually). Historical data accumulates in analytics_snapshots.

---

## DAY 28: Analytics Dashboard Frontend

Morning session (3 hours): Analytics page and charts.

Install Recharts:
cd apps/web
npm install recharts

Create apps/web/app/(app)/analytics/page.tsx:

The main analytics page has four sections:

Section 1: Summary metrics row
Four metric cards: Total Applications (period), Total Hires (period), Average Time to Hire, Offer Acceptance Rate.
Each card shows the metric value and a trend vs previous period (up/down arrow with percentage).

Section 2: Pipeline Funnel Chart
A Recharts FunnelChart showing stages on X axis, application count on Y axis. Each bar shows the count and the conversion rate below it (e.g., "65% from previous stage").

Section 3: Source Quality Chart
A BarChart with grouped bars: one group per source (LinkedIn, Indeed, Direct, Referral). Each group has two bars: Total Applications and Hires. Hovering shows conversion rate.

Section 4: Time to Hire Trend
A LineChart over the selected date range showing average days to hire per week.

Create a DateRangePicker component that lets users select preset ranges (Last 7 days, Last 30 days, Last 90 days, Custom) and custom ranges via a calendar.

Afternoon session (3 hours): Analytics filtering and team performance.

Create apps/web/app/(app)/analytics/team/page.tsx:

A data table showing per-recruiter metrics. Columns: Name, Jobs Owned, Applications Reviewed, Avg Time in Review, Interviews Scheduled, Offers Sent, Hires Made.

Add the date range filter at the top. When the date range changes, refetch all analytics data.

Create apps/web/app/(app)/analytics/pipeline/page.tsx:

A more detailed pipeline view showing per-job analytics. Each job has its own funnel showing where candidates drop off.

Wire up all the analytics API hooks using TanStack Query with the date range as part of the query key. When date range changes, the query key changes and data is refetched.

End of day deliverable: Analytics dashboard shows real data. Charts render correctly. Date range filtering works.

---

# WEEK 5: SECURITY, TESTING, AND DEVOPS

---

## DAY 29: Security Headers and Rate Limiting

Morning session (3 hours): Security headers and CORS.

Install Helmet for security headers:
cd apps/api
npm install helmet

Add to main.ts:
app.use(helmet({
contentSecurityPolicy: {
directives: {
defaultSrc: ["'self'"],
scriptSrc: ["'self'"],
styleSrc: ["'self'", "'unsafe-inline'"],
imgSrc: ["'self'", "data:", "https://s3.amazonaws.com"],
connectSrc: ["'self'", "wss://localhost:3001"],
frameAncestors: ["'none'"],
},
},
hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
}));

Configure CORS properly:
app.enableCors({
origin: [process.env.FRONTEND_URL, process.env.PORTAL_URL],
credentials: true,
methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
allowedHeaders: ['Content-Type', 'Authorization'],
});

Afternoon session (3 hours): Rate limiting with Redis.

Create a Redis-based rate limiter that works across multiple API instances.

Install:
npm install rate-limiter-flexible

Create a custom ThrottlerGuard that uses rate-limiter-flexible with Redis:

const rateLimiter = new RateLimiterRedis({
storeClient: redisClient,
keyPrefix: 'rl',
points: 100, // Requests
duration: 60, // Per minute
blockDuration: 60, // Block for 1 minute if exceeded
});

Create specific limiters for sensitive endpoints:

- Login: 10 per minute per IP
- Register: 5 per hour per IP
- Forgot password: 3 per 15 minutes per IP
- Upload URL: 20 per hour per user
- AI description: 10 per hour per company
- Public application: 5 per 15 minutes per IP

Apply limiters using a decorator on controller methods.

End of day deliverable: All security headers set. Rate limiting active. Test with Apache Bench: ab -n 1000 -c 10 http://localhost:3001/api/v1/jobs and verify rate limit kicks in.

---

## DAY 30: GDPR Compliance and Audit Logging

Morning session (3 hours): Audit logging interceptor.

Create apps/api/src/common/interceptors/audit-log.interceptor.ts:

This interceptor runs after every successful mutating request (POST, PATCH, DELETE):

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
const request = context.switchToHttp().getRequest();
const { method, url, user, ip, headers } = request;

    if (!['POST', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(async (response) => {
        if (!user?.id) return; // Skip unauthenticated requests

        const action = method === 'POST' ? 'CREATE' : method === 'PATCH' ? 'UPDATE' : 'DELETE';
        const resourceType = extractResourceType(url);
        const resourceId = extractResourceId(url, response);

        await this.auditLogRepository.create({
          company_id: user.company_id,
          user_id: user.id,
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          ip_address: ip,
          user_agent: headers['user-agent'],
          new_values: sanitizeForAudit(response), // Remove PII fields
        });
      }),
    );

}
}

Apply this interceptor globally.

Afternoon session (3 hours): GDPR endpoints.

Create GDPR endpoints:

GET /api/v1/users/me/export - Download all data for the current user as JSON. Include: user profile, all applications, all notes written, all scorecards submitted, all notifications.

DELETE /api/v1/candidates/:id/data - Anonymize candidate data (right to erasure):

1. Replace candidate.first_name with "Deleted"
2. Replace candidate.last_name with "User"
3. Replace candidate.email with "{uuid}@deleted.com"
4. Set candidate.phone, linkedin_url, portfolio_url to null
5. Delete resume from S3
6. Delete parsed_resume document from MongoDB
7. Keep application records for analytics (they're now anonymized)
8. Keep audit logs (anonymized)

Create the audit log UI at settings/audit-logs:

- Data table with columns: Date, User, Action, Resource Type, Resource ID, IP Address
- Filters: date range, user, action type
- Export to CSV button
- Accessible only to COMPANY_ADMIN

End of day deliverable: Audit logs recorded for all mutations. GDPR data export downloads real data. Right to erasure anonymizes candidate data.

---

## DAY 31: Unit Tests

Morning session (3 hours): Auth service unit tests.

Set up Jest configuration in apps/api:

install test dependencies:
npm install -D jest @nestjs/testing ts-jest supertest @types/jest @types/supertest jest-mock-extended

Create apps/api/test/factories/user.factory.ts:
A factory function that creates a mock User object with sensible defaults, overridable via partial input.

Write tests for AuthService:

describe('AuthService', () => {
let service: AuthService;
let authRepository: MockType<AuthRepository>;

beforeEach(async () => {
const module = await Test.createTestingModule({
providers: [
AuthService,
{ provide: AuthRepository, useValue: createMock<AuthRepository>() },
{ provide: JwtService, useValue: createMock<JwtService>() },
{ provide: ConfigService, useValue: { get: jest.fn().mockImplementation(key => process.env[key]) } },
],
}).compile();
service = module.get(AuthService);
authRepository = module.get(AuthRepository);
});

describe('register', () => {
it('should throw ConflictException if email already exists', async () => {
authRepository.findUserByEmail.mockResolvedValue(createUser());
await expect(service.register(createRegisterDto())).rejects.toThrow(ConflictException);
});

    it('should hash password before storing', async () => {
      authRepository.findUserByEmail.mockResolvedValue(null);
      authRepository.createUser.mockResolvedValue(createUser());
      authRepository.createCompany.mockResolvedValue(createCompany());
      const dto = createRegisterDto({ password: 'TestPass1!' });
      await service.register(dto);
      const storedHash = authRepository.createUser.mock.calls[0][0].password_hash;
      expect(await bcrypt.compare('TestPass1!', storedHash)).toBe(true);
    });

});
});

Afternoon session (3 hours): Application service and tenant isolation unit tests.

Write tests for ApplicationsService.moveStage:

- Happy path: moves to new stage, creates history record with correct time
- Not found: throws NotFoundException
- Emits ApplicationMoved event on success

Write tests for tenant isolation in the Prisma middleware:

- Create mock Prisma client
- Call a query without company_id in context
- Verify WHERE clause is automatically added

Write tests for the CapabilityGuard:

- RECRUITER with applications:move capability passes
- HIRING_MANAGER without applications:move capability is rejected
- SUPER_ADMIN passes all capability checks

Target coverage for today: AuthService, ApplicationsService, CapabilityGuard, SubscriptionGuard above 90%.

End of day deliverable: Unit test suite running. 80%+ coverage on tested modules. Tests pass in CI.

---

## DAY 32: Integration Tests

Morning session (3 hours): Integration test setup.

Create a test module factory that starts the full NestJS application with a test database:

Create apps/api/test/test-app.ts:

export async function createTestApp(): Promise<{ app: INestApplication, prisma: PrismaService }> {
const moduleRef = await Test.createTestingModule({
imports: [AppModule],
}).overrideProvider('OPENAI_CLIENT').useValue(mockOpenAI)
.overrideProvider(EmailService).useValue(mockEmailService)
.overrideProvider(StripeService).useValue(mockStripeService)
.compile();

const app = moduleRef.createNestApplication();
// Apply same middleware as main.ts
app.setGlobalPrefix('api/v1');
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
app.useGlobalFilters(new AllExceptionsFilter());

await app.init();
const prisma = moduleRef.get(PrismaService);
return { app, prisma };
}

Write the critical tenant isolation integration test:

describe('Tenant Isolation', () => {
it('should not return Company B data to Company A user', async () => {
const { app, prisma } = await createTestApp();
const [companyA, companyB] = await Promise.all([
createTestCompany(prisma), createTestCompany(prisma)
]);
const [userA, userB] = await Promise.all([
createTestUser(prisma, companyA.id), createTestUser(prisma, companyB.id)
]);
const jobB = await createTestJob(prisma, companyB.id);
const tokenA = generateTestToken(userA);

    const response = await request(app.getHttpServer())
      .get(`/api/v1/jobs/${jobB.id}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .expect(404); // Not 403 - don't reveal it exists

    expect(response.body.code).toBe('RESOURCE_NOT_FOUND');

});
});

Afternoon session (3 hours): More integration tests.

Write integration tests for:

- Register → receive token → use token to access /users/me
- Invite user → accept invitation → log in as invited user → verify role
- Create job → publish → check plan limit (create second job on FREE plan → expect 402)
- Submit application → verify candidate created → verify application in first stage
- Move application stage → verify stage history record created with correct time

End of day deliverable: Integration test suite running. All critical paths tested. Tests catch real cross-tenant queries (test should fail if middleware is removed).

---

## DAY 33: Docker Production Build and CI Pipeline

Morning session (3 hours): Docker production configuration.

Create apps/api/Dockerfile (production-ready, multi-stage):

FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY package*.json turbo.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/ ./packages/
RUN npm ci --workspace=apps/api --workspace=packages/shared-types --workspace=packages/config
COPY apps/api ./apps/api
COPY packages ./packages
RUN npm run build --workspace=apps/api
RUN npm run db:generate --workspace=apps/api

FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/prisma ./prisma
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
 CMD wget -qO- http://localhost:3001/api/v1/health || exit 1
CMD ["node", "dist/main.js"]

Create apps/api/Dockerfile.worker (same as above but different CMD):
CMD ["node", "dist/worker.js"]

Create the health endpoint:
GET /api/v1/health returns:
{
"status": "ok",
"database": "connected",
"redis": "connected",
"mongodb": "connected",
"timestamp": "2024-01-01T00:00:00Z",
"version": "1.0.0"
}

Afternoon session (3 hours): GitHub Actions CI pipeline.

Create .github/workflows/pr.yml:

name: PR Checks
on:
pull_request:
branches: [develop, main]
jobs:
checks:
runs-on: ubuntu-latest
services:
postgres:
image: postgres:15-alpine
env:
POSTGRES_PASSWORD: postgres
POSTGRES_DB: talent_test
ports: ['5432:5432']
options: --health-cmd pg_isready --health-interval 10s --health-timeout 5s --health-retries 5
redis:
image: redis:7-alpine
ports: ['6379:6379']
steps: - uses: actions/checkout@v4 - uses: actions/setup-node@v4
with: { node-version: '20', cache: 'npm' } - run: npm ci - run: npm run lint - run: npm run typecheck - run: |
cp .env.example .env
echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/talent_test" >> .env
echo "REDIS_URL=redis://localhost:6379" >> .env
npm run db:migrate --workspace=apps/api
npm run test --workspace=apps/api - run: npm run build

Build and test the Docker image locally:
docker build -f apps/api/Dockerfile -t talent-api:local .
docker run --env-file .env -p 3001:3001 talent-api:local

End of day deliverable: Docker image builds and runs. CI pipeline passes on a clean branch. Health check endpoint returns all services as connected.

---

## DAY 34: AWS Infrastructure Setup

Morning session (3 hours): Terraform setup and VPC.

Install Terraform locally:
brew install terraform (Mac) or follow terraform.io download instructions.

Create infrastructure/terraform/main.tf:

terraform {
required_providers {
aws = {
source = "hashicorp/aws"
version = "~> 5.0"
}
}
backend "s3" {
bucket = "your-terraform-state-bucket"
key = "talent-platform/terraform.tfstate"
region = "us-east-1"
}
}

provider "aws" {
region = var.aws_region
}

Create the VPC with public and private subnets:

infrastructure/terraform/vpc.tf:

resource "aws_vpc" "main" {
cidr_block = "10.0.0.0/16"
enable_dns_hostnames = true
tags = { Name = "talent-platform-vpc" }
}

resource "aws_subnet" "public" {
count = 2
vpc_id = aws_vpc.main.id
cidr_block = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index)
availability_zone = data.aws_availability_zones.available.names[count.index]
map_public_ip_on_launch = true
}

resource "aws_subnet" "private" {
count = 2
vpc_id = aws_vpc.main.id
cidr_block = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index + 10)
availability_zone = data.aws_availability_zones.available.names[count.index]
}

Afternoon session (3 hours): RDS, ElastiCache, and ECR.

Create infrastructure/terraform/rds.tf with:

- db.t3.medium PostgreSQL 15
- Multi-AZ disabled initially (enable for production)
- Automated backups 7-day retention
- Database in private subnets

Create infrastructure/terraform/elasticache.tf with:

- cache.t3.micro Redis 7
- Redis in private subnet
- Encryption at rest enabled

Create infrastructure/terraform/ecr.tf:
Two ECR repositories: talent-platform-api and talent-platform-worker.

Create infrastructure/terraform/s3.tf:

- Files bucket with server-side encryption
- Versioning enabled
- CORS configuration for direct uploads

Run terraform init and terraform plan to verify the configuration is valid. Do not apply yet.

End of day deliverable: Complete Terraform configuration verified with terraform plan. Infrastructure ready to deploy.

---

## DAY 35: Staging Deployment

Morning session (3 hours): ECS and ALB configuration.

Create infrastructure/terraform/ecs.tf:

ECS cluster. Fargate launch type. API task definition pointing to the ECR image. Worker task definition. API ECS Service with 1 desired task, connected to the ALB target group. Worker ECS Service with 1 desired task.

Create infrastructure/terraform/alb.tf:

Application Load Balancer in public subnets. HTTPS listener on port 443 with ACM certificate. HTTP listener on port 80 that redirects to HTTPS. Target group pointing to ECS API tasks on port 3001. Health check on /api/v1/health.

Run terraform apply for the staging environment.

After apply:

1. Get the ALB DNS name from Terraform output
2. Push the Docker image to ECR:
   aws ecr get-login-password | docker login --username AWS --password-stdin ECR_REGISTRY
   docker build -f apps/api/Dockerfile -t ECR_REGISTRY/talent-platform-api:latest .
   docker push ECR_REGISTRY/talent-platform-api:latest
3. Force new ECS deployment:
   aws ecs update-service --cluster talent-staging --service talent-api --force-new-deployment

Afternoon session (3 hours): Run migrations and verify staging.

Run Prisma migrations against the staging RDS:
DATABASE_URL="postgresql://..." npx prisma migrate deploy

Navigate to the ALB DNS name and verify:

- /api/v1/health returns 200 with all services connected
- POST /api/v1/auth/register creates an account
- Check CloudWatch logs for any errors

Set up DNS for staging:

- Create a Route 53 A record: api-staging.yourdomain.com → ALB
- Create a CNAME: app-staging.yourdomain.com → Vercel preview deployment

Deploy the frontend to Vercel:
cd apps/web
npx vercel --prod
Set NEXT_PUBLIC_API_URL to https://api-staging.yourdomain.com/api/v1

End of day deliverable: Staging environment live and accessible at api-staging.yourdomain.com. Full application flow works on staging.

---

# WEEK 6: POLISH, ADVANCED FEATURES, AND LAUNCH

---

## DAY 36: LinkedIn OAuth

Morning session (3 hours): LinkedIn OAuth backend.

Install LinkedIn strategy:
npm install passport-linkedin-oauth2
npm install -D @types/passport-linkedin-oauth2

Create apps/api/src/modules/auth/strategies/linkedin.strategy.ts:

Similar to Google strategy. LinkedIn OAuth 2.0 scopes: r_liteprofile, r_emailaddress.

The LinkedIn strategy validates and creates/links accounts the same way as Google. Store linkedin_id on the user record.

Endpoints:
GET /api/v1/auth/linkedin → redirects to LinkedIn
GET /api/v1/auth/linkedin/callback → handles callback, redirects to frontend

Register the LinkedIn developer app at linkedin.com/developers. Set the callback URL.

Afternoon session (3 hours): Candidate enrichment with LinkedIn.

For logged-in users (recruiter viewing a candidate), add a "Enrich from LinkedIn" button on the candidate profile. This is a P1 feature — implement the UI but the actual LinkedIn scraping is legally complex so just fetch the public profile URL the candidate provided and parse what's publicly visible.

The enrichment flow:

1. Candidate has linkedin_url on their profile
2. Recruiter clicks "Enrich"
3. API calls GET /candidates/:id/enrich
4. The service fetches the LinkedIn URL using the recruiter's LinkedIn access token (if they have one connected)
5. Extracts public profile data
6. Updates candidate record with additional details

For now, implement the button and show "LinkedIn enrichment coming soon" if the recruiter doesn't have LinkedIn connected. Show the connection prompt.

End of day deliverable: LinkedIn OAuth login works. LinkedIn profile page shows the connection option.

---

## DAY 37: Email Template Management

Morning session (3 hours): Template editor backend.

The email template system allows company admins to customize the platform's email templates.

Platform default templates (null company_id) are compiled at startup. Company-specific templates (with company_id) override the defaults for that company.

Create the template management API:
GET /api/v1/settings/email-templates - List all templates for the company
GET /api/v1/settings/email-templates/:type - Get specific template (with fallback to default)
PATCH /api/v1/settings/email-templates/:type - Update or create company override
DELETE /api/v1/settings/email-templates/:type - Reset to default

The template type is the NotificationType enum value. Each template has: subject, html_body, available_variables list.

When sending an email, always check for company override first, then fall back to the platform default.

Afternoon session (3 hours): Template editor frontend.

Create apps/web/app/(app)/settings/templates/page.tsx:

A list of all email template types with their last modified date and a preview button.

Clicking a template opens the template editor which has:

- Subject line input
- HTML body text editor (use a code editor for now: install @uiw/react-codemirror)
- Variables panel on the right showing all available template variables (e.g., {{candidate_name}}, {{job_title}})
- Preview button that sends a test email to the current user
- Reset to Default button

The preview endpoint POST /api/v1/settings/email-templates/:type/preview sends a test email using dummy data.

End of day deliverable: Company admins can customize email templates. Changes are stored per company and applied when sending emails.

---

## DAY 38: Pipeline Analytics Enhancement and Candidate Search

Morning session (3 hours): Advanced candidate search.

Implement full-text search on candidates. PostgreSQL has built-in full-text search that avoids needing Elasticsearch for this scale.

Add a tsvector column to the candidates table:

Migration:
ALTER TABLE candidates ADD COLUMN search_vector tsvector;
CREATE INDEX candidates_search_idx ON candidates USING GIN(search_vector);
UPDATE candidates SET search_vector = to_tsvector('english', first_name || ' ' || last_name || ' ' || coalesce(email, ''));

Create a trigger to keep search_vector updated:
CREATE TRIGGER candidates_search_update BEFORE INSERT OR UPDATE ON candidates
FOR EACH ROW EXECUTE FUNCTION tsvector_update_trigger(search_vector, 'pg_catalog.english', first_name, last_name, email);

Update the candidates repository to use full-text search:
WHERE search_vector @@ plainto_tsquery('english', :searchTerm)
ORDER BY ts_rank(search_vector, plainto_tsquery('english', :searchTerm)) DESC

Update the candidates list page to use the search results.

Afternoon session (3 hours): Advanced filtering and bulk operations.

Implement the bulk operations endpoint fully:

POST /api/v1/applications/bulk with body:

- application_ids: array of IDs
- action: 'move_stage' | 'reject' | 'add_tag' | 'export'
- parameters: { stage_id?: string, rejection_reason?: string, tag?: string }

For large bulk operations (>50 applications), process asynchronously and return a job_id. The client polls GET /api/v1/bulk-operations/:jobId for status.

Create the BulkActionsToolbar component on the Kanban board:

- Appears when one or more cards are selected (checkbox appears on hover)
- Shows count of selected candidates
- Action buttons: Move Stage (opens stage selector), Reject (opens rejection modal), Export Selected

The stage selector dropdown shows all stages for the current job.

End of day deliverable: Full-text candidate search works. Bulk operations work for up to 100 candidates.

---

## DAY 39: Mobile Responsiveness and Accessibility

Morning session (3 hours): Responsive layout.

Audit every page for mobile responsiveness. Open Chrome DevTools and switch to mobile viewport (375px).

Issues to fix:

- Sidebar: convert to a bottom tab bar on mobile. Use a useMediaQuery hook to detect screen size.
- Kanban board: on mobile, switch from horizontal scroll to a vertical list with a stage selector dropdown at the top. Disable drag-and-drop on mobile, replace with a "Move to Stage" button on each card.
- Data tables: hide less important columns on mobile. Show a "View Details" link instead.
- Job creation form: ensure all inputs are mobile-friendly (larger touch targets, proper input types).

Create apps/web/hooks/use-media-query.ts:
export function useMediaQuery(query: string): boolean {
const [matches, setMatches] = React.useState(false);
React.useEffect(() => {
const media = window.matchMedia(query);
setMatches(media.matches);
const listener = () => setMatches(media.matches);
media.addEventListener('change', listener);
return () => media.removeEventListener('change', listener);
}, [query]);
return matches;
}

Afternoon session (3 hours): Accessibility audit.

Run the axe browser extension on every main page and fix all "Critical" and "Serious" issues.

Common fixes needed:

- Add aria-label to all icon buttons (the notification bell, the close modal button, the collapse sidebar button)
- Ensure all form inputs have associated labels (not just placeholder text)
- Add role="status" and aria-live="polite" to toast notifications so screen readers announce them
- Ensure focus is trapped inside modals (shadcn Dialog handles this but verify)
- Add aria-describedby to the AI score ring pointing to a hidden text description
- Ensure color is not the only means of conveying information (score is green/yellow/red — add text "High" "Medium" "Low" as well)

Add keyboard navigation for the Kanban board:

- Arrow keys select cards
- Enter opens the card detail
- Tab moves between columns

End of day deliverable: Application is fully usable on mobile. Passes axe accessibility audit with no Critical issues.

---

## DAY 40: Error States and Loading States

Morning session (3 hours): Loading skeletons.

Create loading skeleton components for every major UI element:

KanbanColumnSkeleton: shows 3 grey animated cards per column
ApplicationTableSkeleton: shows 10 rows of grey bars
CandidateProfileSkeleton: shows the profile layout with grey placeholder blocks
AnalyticsChartSkeleton: shows a grey rectangle where the chart will be

Use these skeletons in every Suspense boundary and loading state:

In the jobs pipeline page:
if (isLoading) return <KanbanBoardSkeleton />;

Use the Tailwind animate-pulse class on all skeleton elements.

Afternoon session (3 hours): Error boundaries and empty states.

Create a React Error Boundary class component that catches JavaScript errors in its child tree. Wrap each major section:

class ChartErrorBoundary extends React.Component {
state = { hasError: false };
static getDerivedStateFromError() { return { hasError: true }; }
render() {
if (this.state.hasError) {
return <div className="text-center p-8 text-muted-foreground">Chart unavailable. Try refreshing.</div>;
}
return this.props.children;
}
}

Create empty state components for every list:

function EmptyJobsList() {
return (
<div className="flex flex-col items-center justify-center py-16 text-center">
<BriefcaseIcon className="w-12 h-12 text-muted-foreground mb-4" />
<h3 className="text-lg font-medium">No jobs yet</h3>
<p className="text-muted-foreground mb-4">Create your first job posting to start hiring.</p>
<Button onClick={() => router.push('/jobs/new')}>Create a Job</Button>
</div>
);
}

Create empty states for: no jobs, no candidates, no applications, no interviews, no notifications.

End of day deliverable: Every page handles loading, error, and empty states gracefully. No blank white screens anywhere.

---

## DAY 41: Performance Optimization

Morning session (3 hours): API performance.

Run EXPLAIN ANALYZE on the five most frequent queries and add missing indexes.

The most critical query to optimize is the Kanban pipeline query. It joins pipeline_stages with applications, groups by stage, and counts. Add a composite index if not already present:

CREATE INDEX idx_applications_company_stage_status
ON applications(company_id, current_stage_id, status)
WHERE status = 'ACTIVE';

Add Redis caching to the most frequently read endpoints:

Company configuration (plan, limits) - Cache for 5 minutes with key company:config:{companyId}
Job list for a company - Cache for 30 seconds with key jobs:list:{companyId}:{statusFilter}
Pipeline stage list for a job - Cache for 60 seconds with key pipeline:stages:{jobId}

Create a CacheService wrapper around ioredis:
async get<T>(key: string): Promise<T | null>
async set(key: string, value: any, ttlSeconds: number): Promise<void>
async del(key: string): Promise<void>

Call cache.del on mutations to invalidate.

Afternoon session (3 hours): Frontend performance.

Add React.memo to KanbanCard to prevent re-renders when other cards move:
export const KanbanCard = React.memo(function KanbanCard({ application, ...props }) { ... });

Add useMemo to expensive computations:
const sortedStages = useMemo(() => stages.sort((a, b) => a.order_index - b.order_index), [stages]);

Use dynamic imports for heavy components:
const OfferLetterPreview = dynamic(() => import('@/components/features/offers/offer-letter-preview'), { loading: () => <Skeleton /> });

Virtualize the candidate list when it exceeds 50 items:
npm install @tanstack/react-virtual

Measure performance with Chrome DevTools Lighthouse:

- Run audit on the Kanban page
- Target: LCP under 2.5 seconds, FCP under 1.5 seconds
- Fix any issues found

End of day deliverable: API response times under 100ms for cached endpoints. Kanban board loads in under 2 seconds. Lighthouse score above 85.

---

## DAY 42: E2E Tests and Load Testing

Morning session (3 hours): Playwright E2E tests.

Install Playwright:
cd apps/web
npm install -D @playwright/test
npx playwright install chromium

Create apps/web/tests/e2e/auth.spec.ts:

test('can register a company and log in', async ({ page }) => {
await page.goto('/register');
await page.fill('[name="first_name"]', 'Test');
await page.fill('[name="last_name"]', 'User');
await page.fill('[name="company_name"]', 'Test Company');
await page.fill('[name="email"]', `test${Date.now()}@example.com`);
await page.fill('[name="password"]', 'TestPass1!');
await page.click('[type="submit"]');
await expect(page).toHaveURL('/dashboard');
await expect(page.locator('h1')).toContainText('Dashboard');
});

Create tests for:

- Job creation flow
- Application submission as candidate
- Moving candidate through stages
- Scheduling an interview
- Analytics page loads with data

Afternoon session (3 hours): Load testing.

Install k6:
brew install k6 (Mac) or download from k6.io

Create infrastructure/tests/load-test.js:

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
stages: [
{ duration: '30s', target: 10 },
{ duration: '1m', target: 50 },
{ duration: '30s', target: 0 },
],
thresholds: {
http_req_duration: ['p(95)<300'],
http_req_failed: ['rate<0.01'],
},
};

const BASE_URL = \_\_ENV.API_URL || 'http://localhost:3001/api/v1';
let authToken;

export function setup() {
const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({ email: 'load@test.com', password: 'TestPass1!' }), { headers: { 'Content-Type': 'application/json' } });
authToken = JSON.parse(loginRes.body).data.access_token;
}

export default function() {
const res = http.get(`${BASE_URL}/jobs`, { headers: { Authorization: `Bearer ${authToken}` } });
check(res, { 'status is 200': r => r.status === 200 });
sleep(1);
}

Run against staging: k6 run --env API_URL=https://api-staging.yourdomain.com/api/v1 infrastructure/tests/load-test.js

End of day deliverable: E2E test suite passing. Load test results show p95 under 300ms with 50 concurrent users.

---

## DAY 43: Production Infrastructure and Deployment

Morning session (3 hours): Production AWS setup.

Create a production Terraform workspace:
terraform workspace new production
terraform apply -var="environment=production" -var="instance_type=t3.large"

Production-specific settings:

- RDS: db.t3.large with Multi-AZ enabled, deletion protection enabled
- ECS: min 2 tasks for API, max 10 tasks (auto-scaling by CPU)
- CloudFront: distribution for S3 files, caching enabled

Set up AWS Secrets Manager with all production secrets:
aws secretsmanager create-secret --name "talent-platform/production/api" --secret-string file://secrets.json

Create the production deployment GitHub Action in .github/workflows/deploy-production.yml.

Afternoon session (3 hours): DNS, SSL, and final deployment.

In Route 53:

- Create A record: api.yourdomain.com → ALB
- Create A record: app.yourdomain.com → Vercel (use Vercel's custom domain configuration)

Request ACM certificate:
aws acm request-certificate --domain-name "\*.yourdomain.com" --validation-method DNS

Verify the certificate by adding the CNAME record to Route 53.

Update ALB HTTPS listener to use the ACM certificate.

Deploy to production:

1. Push a git tag: git tag v1.0.0 && git push origin v1.0.0
2. GitHub Actions triggers the production deployment workflow
3. Wait for ECS deployment to complete
4. Run smoke tests against production

Configure Vercel for the frontend:

- Set custom domain app.yourdomain.com
- Set NEXT_PUBLIC_API_URL to https://api.yourdomain.com/api/v1
- Deploy production branch

End of day deliverable: Application live at app.yourdomain.com and api.yourdomain.com. SSL valid. All smoke tests passing.

---

## DAY 44: Monitoring, Error Tracking, and Alerts

Morning session (3 hours): Sentry setup.

Install Sentry in the API:
npm install @sentry/nestjs @sentry/profiling-node

Initialize Sentry at the very beginning of main.ts before any other imports:
Sentry.init({
dsn: process.env.SENTRY_DSN,
environment: process.env.NODE_ENV,
tracesSampleRate: 0.1, // 10% of requests
beforeSend(event) {
// Scrub PII
if (event.extra?.body?.password) delete event.extra.body.password;
if (event.extra?.body?.resume_text) event.extra.body.resume_text = '[REDACTED]';
return event;
},
});

Add Sentry to failed BullMQ jobs:
processor.on('failed', (job, err) => {
Sentry.captureException(err, { extra: { jobData: job.data, jobId: job.id } });
});

Install Sentry in the Next.js frontend:
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs

Afternoon session (3 hours): CloudWatch dashboards and alerts.

Create a CloudWatch dashboard showing:

- API request count and latency
- ECS task CPU and memory
- RDS connections and CPU
- Redis memory usage
- BullMQ queue depth (log this as a custom metric from the worker)

Create a custom metric for queue depth. In the worker, emit a CloudWatch metric every 60 seconds:
const queueDepth = await queue.count();
await cloudwatch.putMetricData({
Namespace: 'TalentPlatform/Worker',
MetricData: [{ MetricName: 'QueueDepth', Value: queueDepth, Unit: 'Count' }],
}).promise();

Create CloudWatch alarms for the critical conditions listed in Phase 15.

Set up Slack alerts: create an SNS topic, subscribe a Lambda that posts to your Slack webhook.

End of day deliverable: Sentry tracking errors in production. CloudWatch dashboards visible. Alerts configured. Test an alert by temporarily breaking the health check.

---

## DAY 45: Beta Customer Onboarding Preparation

Morning session (3 hours): Onboarding flow.

Create the onboarding experience for new companies. After registration, instead of going directly to the dashboard, new users see a 3-step onboarding wizard.

Step 1: "Complete Your Profile" - Upload company logo, set timezone, set industry.
Step 2: "Create Your First Job" - A simplified job creation form (just title, location, type). Skip AI for now.
Step 3: "Invite Your Team" - Optional step to invite up to 3 team members.

Track onboarding completion in the company record: onboarding_completed (boolean).

Skip the onboarding if already completed.

Create the onboarding API:
POST /api/v1/companies/onboarding - Saves each step and marks completion

Afternoon session (3 hours): Demo data and documentation.

Create a seed file for demo companies that beta users can see:

npx prisma db seed with demo data that includes:

- 1 demo company with 5 published jobs
- 30 demo candidates across the pipeline stages
- Mix of scored and unscored applications
- 5 past interviews with scorecards
- 2 sent offers

Create a simple README for beta users explaining:

- How to invite team members
- How to post a job
- How to read the AI score
- How to schedule an interview
- How to generate an offer letter

Create a CHANGELOG.md starting from v1.0.0.

End of day deliverable: Onboarding wizard works. Demo data gives beta users something to explore immediately.

---

## DAY 46: Webhook System

Morning session (3 hours): Webhook backend.

Create apps/api/src/modules/webhooks/ (this is a P1 feature for GROWTH plan users).

WebhookService:

deliverWebhook(companyId, event, payload):

1. Load all active webhooks for the company that subscribe to this event
2. For each webhook, enqueue a webhook delivery job with retry logic
3. The delivery job: POST to the webhook URL with HMAC-SHA256 signature in header

The signature:
const signature = crypto.createHmac('sha256', webhook.secret)
.update(JSON.stringify(payload))
.digest('hex');
headers['X-Webhook-Signature'] = `sha256=${signature}`;

Retry: 5 attempts with exponential backoff. If all fail, increment webhook.failure_count. If failure_count exceeds 10 over 24 hours, deactivate the webhook and notify the company admin.

Connect domain events to webhook delivery. After emitting internal events, also call webhookService.deliver for the relevant events: application.created, application.moved, application.hired, interview.scheduled, offer.sent, offer.accepted.

Create webhook management API:
GET /api/v1/settings/webhooks
POST /api/v1/settings/webhooks - Create webhook (URL, events, generate secret)
PATCH /api/v1/settings/webhooks/:id - Update
DELETE /api/v1/settings/webhooks/:id
POST /api/v1/settings/webhooks/:id/ping - Test delivery

Afternoon session (3 hours): Webhook settings UI.

Create apps/web/app/(app)/settings/integrations/page.tsx:

The integrations page has sections:

- Connected Calendar (Google Calendar status per user)
- Webhooks (list of configured webhooks, add new)
- Slack Integration (coming soon placeholder)

The webhook list shows URL, subscribed events, status (active/inactive/failing), and last delivery time.

The "Add Webhook" dialog has: URL input, event checkboxes (all webhook-deliverable events listed), auto-generated secret (shown once, stored hashed).

A "Test" button sends a ping event to the URL and shows the response status.

End of day deliverable: Webhook system functional. GROWTH plan companies can configure webhooks and receive events.

---

## DAY 47: Settings and Admin Pages

Morning session (3 hours): Company settings.

Create apps/web/app/(app)/settings/page.tsx:

Company Settings sections:

- General: company name, logo upload, website, industry, size
- Career Page: toggle career page on/off, customize color, preview the page
- Pipeline: manage default pipeline stages (template applied to new jobs)
- Notifications: per-event notification preferences for the current user
- Danger Zone: company_admin only - export all data, request account deletion

The career page preview shows a simplified version of the public job listing page using the company's branding color.

Afternoon session (3 hours): Super Admin panel.

Create a protected /admin route accessible only to SUPER_ADMIN role:

apps/web/app/(admin)/layout.tsx - Separate layout for admin panel
apps/web/app/(admin)/dashboard/page.tsx - Platform overview

Admin dashboard shows:

- Total companies
- Companies by plan (pie chart)
- MRR calculation (companies × plan price)
- New signups this week
- AI credits consumed today (platform-wide)
- Dead letter queue job count (link to queue health page)

The admin panel reads from a separate analytics API that aggregates across all tenants. This API is only accessible with SUPER_ADMIN role.

End of day deliverable: Complete settings pages. Super admin can see platform health.

---

## DAY 48: Final Security Audit

Morning session (3 hours): Penetration testing.

Install OWASP ZAP:
Download from zaproxy.org.

Run ZAP against the staging API in active scan mode:

1. Set the target to https://api-staging.yourdomain.com
2. Add authentication context (JWT token)
3. Run the active scan

Fix all Critical and High findings. Common findings and fixes:

- Missing security headers: already handled with Helmet
- SQL injection: Prisma parameterized queries protect this
- XSS in rich text: verify DOMPurify is applied
- CSRF: not applicable for JWT auth, but verify
- Information disclosure in error messages: ensure production error messages don't leak stack traces

Manually test:

- Try accessing another company's job with a valid JWT from a different company
- Try setting Content-Type to text/html and submitting a form to check for XSS
- Try uploading a file with .php extension

Afternoon session (3 hours): Dependency audit and secrets check.

Run npm audit --audit-level=high and fix all high and critical vulnerabilities.

Install and run Snyk:
npm install -g snyk
snyk auth
snyk test

Install and run truffleHog to check for secrets in git history:
pip install trufflehog
trufflehog git file://. --since-commit HEAD~50

Verify all environment variable references are correct in production. Run the smoke tests one more time against production.

End of day deliverable: Zero Critical security findings. All dependency vulnerabilities at high level fixed. No secrets in git history.

---

## DAY 49: Documentation and User Guide

Morning session (3 hours): Technical documentation.

Create a TECHNICAL_DOCS.md at the root covering:

- System architecture overview (reference the text diagram from Phase 2)
- How to set up local development
- Environment variables reference with descriptions
- Database migration process
- How to add a new AI feature (prompt, processor, queue, event)
- How to add a new notification type
- How to deploy

Create a CONTRIBUTING.md covering:

- Branching strategy
- PR process
- Code review checklist
- Testing requirements (must write tests, minimum coverage)

Document all API endpoints in a Postman collection. Export as JSON and commit to /docs/postman-collection.json.

Afternoon session (3 hours): User guide for beta customers.

Create a simple user guide as a series of Markdown files in /docs/user-guide/:

01-getting-started.md: Account setup, inviting team, first job post
02-ai-features.md: Understanding AI scores, how to read the breakdown, when to override
03-pipeline-management.md: Kanban board, stage management, bulk operations
04-interviews.md: Scheduling, question kits, scorecards
05-offers.md: Creating offers, offer letter generation, tracking responses
06-analytics.md: Understanding the dashboard, reading conversion rates
07-billing.md: Plan comparison, upgrading, managing invoices

End of day deliverable: Technical documentation complete. User guide ready to share with beta customers.

---

## DAY 50: Trial Expiry, Quotas, and System Jobs

Morning session (3 hours): System scheduled jobs.

Implement all system jobs using @nestjs/schedule:

Trial expiry job (runs daily at 6 AM UTC):

- Find companies where trial_ends_at < now and subscription_status = TRIALING and no stripe_subscription_id
- Send trial expiry warning email 3 days before
- On the day of expiry, downgrade plan to FREE

AI quota reset job (runs first of every month at 00:00 UTC):

- Set ai_scores_used_this_month = 0 for all companies
- Reset ai_scores_reset_at = now

Offer expiry job (runs daily at 8 AM UTC):

- Find offers where expiry_date < today and status = SENT
- Set status = EXPIRED
- Send notification to recruiter

Refresh token cleanup job (runs weekly):

- DELETE FROM refresh_tokens WHERE expires_at < now OR revoked = true AND revoked_at < now - 7 days

Analytics aggregation job (runs daily at 2 AM UTC) — already implemented.

Afternoon session (3 hours): Quota enforcement and alerts.

When a company hits 90% of their AI quota, add a banner to the frontend:
"You've used 90% of your monthly AI scores. Upgrade to continue using AI scoring without interruption."

Fetch this from the GET /api/v1/companies/me/usage endpoint which already returns ai_scores_used and max_ai_scores_per_month.

At 100%:

- New applications still get parsed (resume parsing has no quota)
- Scoring jobs are held in the queue with a delayed=true flag
- The recruiter sees "AI Scoring Paused — Quota Reached" on the candidate card
- A system notification is sent to COMPANY_ADMIN

When the quota resets (first of month) or the company upgrades, unhold the queued scoring jobs.

End of day deliverable: All system jobs running on schedule. Quota enforcement working. Trial expiry flow tested.

---

## DAY 51: Onboarding Email Sequence

Morning session (3 hours): Automated email sequence.

Create a 5-email onboarding drip campaign triggered on company registration:

Day 0 (immediately): Welcome email with getting started checklist
Day 1: "Your AI is ready — here's how to post your first job"
Day 3: "Tips for getting the best AI scores"
Day 7: "You're halfway through your trial — here's what you're missing"
Day 13: "Your trial ends tomorrow"

Implement this using BullMQ's delay feature:

When a company registers, enqueue all 5 emails with different delays:
await this.emailQueue.add('onboarding-day-0', payload, { delay: 0 });
await this.emailQueue.add('onboarding-day-1', payload, { delay: 24 _ 60 _ 60 _ 1000 });
await this.emailQueue.add('onboarding-day-3', payload, { delay: 3 _ 24 _ 60 _ 60 \* 1000 });

Create Handlebars templates for each email. The emails are text-forward with one clear CTA button each.

Afternoon session (3 hours): Transactional email polish.

Review every email template and ensure:

- Mobile-friendly HTML using table-based layouts (Outlook compatibility)
- Company branding color used in the header
- Clear unsubscribe link in the footer (link to notification preferences)
- All links use UTM parameters for analytics tracking

Test every email template in Mailhog by triggering the relevant action.

Create an "email preferences" page at /settings/notifications where users can unsubscribe from non-critical emails (they cannot unsubscribe from password reset or offer emails).

End of day deliverable: Complete onboarding email sequence. All transactional emails tested and mobile-friendly.

---

## DAY 52: Performance Testing and Optimization Round 2

Morning session (3 hours): Database query optimization.

Use the PostgreSQL slow query log to identify slow queries:

In RDS, set log_min_duration_statement = 100 (log queries over 100ms).

Download slow query logs from CloudWatch and analyze. Run EXPLAIN ANALYZE on each slow query.

Common optimizations needed at this stage:

- The application list query with multiple joins: add partial index on status
- The stage history query for calculating time-in-stage: add index on (application_id, moved_at DESC)
- The analytics query joining applications to candidates: ensure candidate_id is indexed on applications

Implement query result caching for the analytics page. The analytics queries are expensive and acceptable to be 5 minutes stale:
Cache key: analytics:{companyId}:{metricType}:{dateRange}
TTL: 5 minutes

Afternoon session (3 hours): AI cost tracking.

Implement detailed AI cost tracking. Every AI operation stores token counts in MongoDB. Create a usage tracking endpoint:

GET /api/v1/billing/usage returns:

- AI scores used this month
- Total tokens consumed (input + output)
- Estimated cost breakdown
- Per-feature breakdown (resume parsing, scoring, bias detection, question generation)

This data comes from aggregating the tokens_used field across all MongoDB AI documents for the company.

Show this in the billing settings page alongside the AI score quota.

This also enables internal cost tracking to verify your margin calculations are accurate.

End of day deliverable: Database queries optimized. AI cost tracking implemented. Response times confirmed under 200ms p95.

---

## DAY 53: Feature Flags and A/B Testing Infrastructure

Morning session (3 hours): Feature flag system.

Create a simple feature flag system without a third-party dependency:

Create a feature_flags table:
id, name (unique), enabled_for_all (boolean), enabled_company_ids (array), enabled_plan_types (array), rollout_percentage (integer 0-100), created_at, updated_at.

Create a FeatureFlagsService:

async isEnabled(flagName: string, companyId: string, plan: PlanType): Promise<boolean> {
const flag = await this.findByName(flagName);
if (!flag) return false;
if (flag.enabled_for_all) return true;
if (flag.enabled_company_ids?.includes(companyId)) return true;
if (flag.enabled_plan_types?.includes(plan)) return true;
if (flag.rollout_percentage > 0) {
// Deterministic hash-based rollout
const hash = parseInt(createHash('md5').update(companyId + flagName).digest('hex').slice(0, 8), 16);
return (hash % 100) < flag.rollout_percentage;
}
return false;
}

Use this for new AI features: when you update your scoring prompt, release it first to 10% of companies via a flag.

Afternoon session (3 hours): Admin flag management.

Create an admin interface at /admin/feature-flags:

- List all flags
- Toggle enabled_for_all
- Add/remove specific company IDs
- Set rollout percentage with a slider

Create the GET /api/v1/feature-flags/enabled endpoint that returns all flags enabled for the current company. The frontend uses this to conditionally show features.

Create a useFeatureFlag(flagName) hook in the frontend.

End of day deliverable: Feature flag system operational. Can roll out a new AI prompt version to 10% of companies.

---

## DAY 54: Calendar and Scheduling Polish

Morning session (3 hours): Calendly integration alternative.

For companies that don't use Google Calendar, implement a simple availability-based scheduling system.

Interviewers can set their weekly availability in settings/availability:

- Select available hours for each day of the week
- Block specific dates

When a recruiter schedules an interview and selects an interviewer, the time picker greys out unavailable slots.

Store availability in a new table:
interviewer_availability: user_id, day_of_week (0-6), start_time, end_time
interviewer_blocked_dates: user_id, blocked_date

The scheduling API checks availability when creating an interview:
GET /api/v1/users/:id/availability?date=2024-01-15 returns available slots.

Afternoon session (3 hours): Interview reminder system.

Create an interview reminder job that runs hourly:

- Find interviews scheduled in the next 24 hours
- Send reminder emails if not already sent
- Send reminder again 1 hour before
- Track sent_reminders on the interview record

Create a meeting link generator for video interviews. When the location_type is VIDEO and no meeting_link is provided:

- Generate a Whereby meeting room via their API (simple, no auth required for basic rooms)
  OR
- Generate a Google Meet link if the recruiter has Google Calendar connected

Add Whereby API integration:
npm install node-fetch
POST https://api.whereby.dev/v1/meetings with the API key.

End of day deliverable: Interviewers can set availability. Reminders sent automatically before interviews.

---

## DAY 55: Data Export and Reporting

Morning session (3 hours): Advanced export features.

Implement a comprehensive export system:

POST /api/v1/reports/generate with body:

- type: 'pipeline_report' | 'candidate_export' | 'team_performance' | 'audit_log'
- filters: { job_id?, date_from, date_to, include_fields[] }
- format: 'csv' | 'json'

Reports are generated asynchronously. The endpoint returns a report_id.
GET /api/v1/reports/:id - Returns status (pending/ready) and download URL when ready.

The pipeline report CSV includes:
Candidate Name, Email, Job Title, Source, Applied Date, Current Stage, AI Score, Days in Pipeline, Interviews Completed, Scorecard Summary, Offer Status, Rejection Reason.

Implement the report generation in a BullMQ queue (reports queue) to handle large datasets without timing out the HTTP request.

Afternoon session (3 hours): PDF report generation.

Create a hiring summary PDF report for company admins.

The PDF includes (generated with Puppeteer):

- Company logo and report date range
- Executive summary: total applicants, hires, average score, time to hire
- Pipeline funnel visualization (HTML + CSS chart, rendered to PDF)
- Source quality table
- Top 10 hired candidates with scores

The PDF is uploaded to S3 and a signed download URL is returned.

Add a "Download Report" button to the analytics dashboard that triggers this report generation.

End of day deliverable: Comprehensive CSV and PDF export working. Large reports generated asynchronously.

---

## DAY 56: Final End-to-End Testing and Bug Fixes

Morning session (3 hours): Complete regression test.

Run through every feature in the application manually, testing the full user journey for each role:

Company Admin journey:

1. Register company
2. Verify email
3. Update company settings, upload logo
4. Invite a Recruiter and a Hiring Manager
5. View billing page, initiate trial
6. View audit logs
7. Export all data

Recruiter journey:

1. Create job with AI description
2. Check bias report, dismiss warnings, publish
3. Navigate to public job URL, submit a test application
4. Watch AI score appear in real-time
5. Move candidate through all stages
6. Schedule interview, assign Hiring Manager
7. Create offer, generate PDF, send to candidate portal
8. View analytics

Hiring Manager journey:

1. Receive interview notification
2. Submit scorecard
3. View aggregated scorecards

Candidate journey:

1. Receive application confirmation email
2. Check status in portal
3. Receive offer email
4. Accept offer

Document every bug found and fix them before continuing.

Afternoon session (3 hours): Fix all bugs found.

Common bugs at this stage:

- Email links using localhost in production (fix: use the API_URL config variable consistently)
- Socket.io events not received after page refresh (fix: ensure socket reconnects and fetches pending state)
- AI score showing wrong value after manual override (fix: invalidate the TanStack Query cache correctly)
- Stripe webhook failing because body is parsed (fix: ensure raw body middleware is applied correctly)
- Timezone issues in date pickers (fix: always store UTC, convert in the UI based on company.timezone)

End of day deliverable: Zero known bugs in the critical paths. Application is feature-complete and stable.

---

## DAY 57: Staging Validation and Production Preparation

Morning session (3 hours): Staging environment validation.

Deploy the latest code to staging:
git tag v1.0.0-rc1
git push origin v1.0.0-rc1

Trigger the staging deployment workflow. Run the full E2E test suite against staging:
npx playwright test --project=chromium

Verify all external integrations work on staging:

- Stripe: complete a test checkout, verify webhook received, verify plan updated
- SendGrid: register and verify email received at a real email address
- Google OAuth: complete OAuth flow with a real Google account
- Google Calendar: connect calendar, create interview, verify calendar event created
- OpenAI: submit application, verify resume parsed and scored

Check CloudWatch logs for any errors during the E2E run. Fix anything found.

Afternoon session (3 hours): Production deployment checklist.

Go through the complete production launch checklist from Phase 18 and verify every item is checked:

Infrastructure checks:

- [ ] RDS Multi-AZ enabled in production
- [ ] Automated RDS backups enabled, 7-day retention
- [ ] S3 versioning enabled
- [ ] CloudFront distribution active
- [ ] ACM certificate valid, not expiring within 90 days
- [ ] Route 53 A records pointing to correct ALB
- [ ] ECS auto-scaling configured (min 2, max 10)
- [ ] Secrets Manager has all production secrets

Security checks:

- [ ] Security headers A+ on securityheaders.com
- [ ] SSL A on ssllabs.com
- [ ] No Critical findings in OWASP ZAP
- [ ] No high vulnerabilities in npm audit

Business checks:

- [ ] Stripe live mode active
- [ ] Privacy policy page live
- [ ] Terms of service page live
- [ ] Support email monitored

End of day deliverable: Staging fully validated. Production deployment checklist 100% complete.

---

## DAY 58: Production Launch

Morning session (3 hours): Production deployment.

Create and push the production release tag:
git tag v1.0.0
git push origin v1.0.0

The GitHub Actions workflow triggers automatically. Monitor the workflow in real-time.

After the workflow completes, verify production manually:
curl https://api.yourdomain.com/api/v1/health

Should return all services as connected.

Navigate to https://app.yourdomain.com:

- Load the login page (check that it loads in under 2 seconds)
- Register a new account
- Verify you receive the welcome email
- Create a job, submit an application, watch the AI score appear

Check:

- CloudWatch logs for errors
- Sentry for any exceptions
- PagerDuty shows no alerts

Afternoon session (3 hours): Beta customer onboarding.

Onboard your first 3 beta customers:

For each beta customer:

1. Register their company manually if needed
2. Connect with them on a screen share
3. Walk them through the onboarding wizard
4. Help them create their first job
5. Show them how to submit a test application to see AI scoring
6. Gather feedback: what's confusing, what's missing, what's excellent

Create a Notion page to track all feedback with priority labels.

Configure a #beta-feedback Slack channel. Ask beta customers to report bugs directly there with screenshots.

End of day deliverable: Production live. First 3 beta customers onboarded. Monitoring shows green.

---

## DAY 59-60: Buffer Days for Bug Fixes and Customer Feedback

These two days are reserved. Do not schedule new features.

Day 59: Address all critical bugs reported by beta customers. A critical bug is anything that blocks a beta customer from completing their core workflow (applying for a job, viewing the Kanban board, scheduling an interview).

Day 60: Address medium priority bugs and implement quick wins from beta feedback. A quick win is a feature that takes less than 2 hours to implement and directly improves a beta customer's experience.

Common beta feedback that tends to come in:

- "I want to filter candidates by AI score range on the Kanban" - 2 hours to implement, add a filter bar above the Kanban board
- "I want to see the candidate's name on the AI score email notification" - 30 minutes, template update
- "The date picker for interview scheduling is confusing on mobile" - 2 hours to fix

End of day 60 deliverable: All critical bugs fixed. Beta customers can use the platform without workarounds.

---

## DAY 61-63: First Round of V1 Feature Work Based on Feedback

Day 61: Implement the top 3 feedback items from beta testing that are buildable within a day each.

Day 62: Performance improvements and UX polish items identified by beta customers.

Day 63: Second round of fixes and prepare for onboarding more beta customers. Aim for 10 beta companies by end of day 63.

---

## DAY 64-70: Additional Beta Customers and Iteration

This week is entirely driven by customer feedback, not the original plan.

Day 64: Weekly analytics review. What are beta customers actually using vs not using? Use Posthog funnels.

Day 65: Implement any critical missing features discovered from beta usage data.

Day 66: Technical debt day. Clean up any code shortcuts taken during the sprint, improve test coverage for new code.

Day 67: Prepare sales materials. Create a 5-minute demo video walking through the core workflow. This is needed for the next wave of customer acquisition.

Day 68: Outreach to 20 target companies. Send personalized emails referencing something specific about their hiring (their job listings, their Glassdoor reviews). Offer a free 1-month trial.

Day 69-70: Onboard new beta customers. Repeat the screen-share onboarding process. Collect feedback.

---

## DAY 71-77: Revenue Focus

Day 71: Convert first beta customers to paying. Have direct conversations. Offer first month 50% off as early adopter pricing. The goal is your first dollar of revenue.

Day 72: Implement any blocker features preventing conversion. Common ones: "we need Slack notifications," "we need a Zapier integration," "we need two-factor auth."

Day 73: Implement Slack notifications (simple webhook to the company's Slack workspace, configured in settings/integrations).

Day 74: Two-factor authentication. Use speakeasy for TOTP:
npm install speakeasy qrcode
Create the MFA enrollment flow (scan QR code, verify code) and MFA verification on login.

Day 75: Build and send the first customer newsletter to all trial and paying customers. Show platform statistics, highlight new features, share hiring tips.

Day 76: Interview a churned trial customer. Find one company that tried the platform and didn't convert. Ask why. The answer will change your roadmap.

Day 77: Update the product roadmap based on all feedback gathered so far. Write down what you're building next and why.

---

## DAY 78-84: Scale Preparation and Growth

Day 78: Implement missing V1 features that customers keep requesting. Common top requests at this stage: bulk email to candidates, custom offer letter templates, more analytics filters.

Day 79: SEO setup for the marketing site. Create a simple marketing page at yourdomain.com (Next.js static pages). Add meta tags, OpenGraph, JSON-LD schema for the software product.

Day 80: Set up Google Analytics 4 and Posthog on the marketing site to track visitor to trial conversion.

Day 81: Write and publish a technical blog post about building the multi-tenant AI architecture. This drives developer interest and SEO.

Day 82: Implement the referral system. Users who refer a company that subscribes get one month free. Simple implementation: referral_code field on companies, referral_from on new companies, webhook to send Stripe credit on conversion.

Day 83: Performance audit round 3. By now you have real traffic. Look at real CloudWatch metrics and RDS slow query logs with production data patterns.

Day 84: Review every metric:

- ARR: what is it, what's the trend
- Churn: which companies canceled and why
- NPS: send a one-question NPS survey to all active users
- Feature usage: which features are used by >80% of companies, which by <20%
- AI costs: are you profitable per customer at current volume
- System reliability: what's the uptime, what were the incidents

Write a retrospective document covering what you built, what worked, what you'd do differently, and what the next 90 days look like.

---

# SUMMARY OF DAY-BY-DAY TARGETS

Week 1 (Days 1-7): Project foundation, database schema, authentication, tenant isolation
Week 2 (Days 8-14): Jobs module, BullMQ setup, applications module, WebSocket foundation
Week 3 (Days 15-21): Kanban board, resume parsing AI, candidate scoring AI, notifications
Week 4 (Days 22-28): Interviews, offers, Stripe billing, analytics backend
Week 5 (Days 29-35): Security hardening, tests, Docker, CI/CD, staging deployment
Week 6 (Days 36-42): LinkedIn OAuth, email templates, search, mobile/a11y, performance, E2E tests
Week 7 (Days 43-49): Production deployment, monitoring, onboarding, documentation
Week 8 (Days 50-56): System jobs, feature flags, calendar polish, exports, full regression
Week 9 (Days 57-60): Production launch, beta customers, bug fixes
Week 10-12 (Days 61-84): Iteration on feedback, revenue focus, scale preparation
