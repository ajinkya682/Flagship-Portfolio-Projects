# TalentIQ — Complete Backend Implementation Plan

# Every file, every line, every command explained

---

## HOW TO READ THIS DOCUMENT

This guide is written in strict execution order. Do NOT skip steps. Every section tells you:

- WHAT file to create or change
- WHERE to put it
- WHY it exists
- THE EXACT CODE to write inside it
- WHAT COMMAND to run after

---

# PART 0 — ENVIRONMENT SETUP (Before writing any code)

## 0.1 — Install Required Tools on Your Machine

You need these installed globally before anything else:

Node.js version 20 or higher. Check with: node --version
PostgreSQL client (psql). You do NOT need Postgres locally if you use Neon or Supabase.
Git. Check with: git --version

## 0.2 — Choose Your PostgreSQL Database Provider

You have three options. Pick ONE:

OPTION A — Neon (Recommended for beginners, free tier, serverless Postgres)
Go to neon.tech, create an account, create a new project called "talentiq"
Copy the connection string. It looks like:
postgresql://username:password@ep-something.us-east-1.aws.neon.tech/talentiq?sslmode=require

OPTION B — Supabase (Free tier, includes built-in Auth if you change your mind later)
Go to supabase.com, create a project
Go to Settings > Database > Connection string > URI
Copy it. It looks like: postgresql://postgres:password@db.xxxx.supabase.co:5432/postgres

OPTION C — Local Docker (Best for offline development)
Create a file called docker-compose.yml in your project root with this content:

version: '3.8'
services:
postgres:
image: postgres:16
environment:
POSTGRES_USER: talentiq
POSTGRES_PASSWORD: talentiq_secret
POSTGRES_DB: talentiq_db
ports: - "5432:5432"
volumes: - postgres_data:/var/lib/postgresql/data
volumes:
postgres_data:

Then run: docker-compose up -d
Your connection string will be: postgresql://talentiq:talentiq_secret@localhost:5432/talentiq_db

## 0.3 — Set Up Your .env File

In the ROOT of your project (same level as package.json), create a file called .env

Paste this entire block and fill in YOUR values:

DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@YOUR_HOST/YOUR_DB?sslmode=require"

JWT_ACCESS_SECRET="generate-a-64-char-random-string-here-use-openssl-rand-hex-32"
JWT_REFRESH_SECRET="generate-a-different-64-char-random-string-here"

ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"

RESEND_API_KEY="re_your_resend_api_key_from_resend_com"
EMAIL_FROM="noreply@yourdomain.com"

NEXT_PUBLIC_APP_URL="http://localhost:3000"

UPLOADTHING_SECRET="sk_live_your_uploadthing_secret"
UPLOADTHING_APP_ID="your_uploadthing_app_id"

NODE_ENV="development"

HOW TO GENERATE SECURE SECRETS:
Open your terminal and run this command twice (use first output for ACCESS_SECRET, second for REFRESH_SECRET):
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

## 0.4 — Install All Required npm Packages

Run this single command in your project terminal:

npm install bcryptjs jsonwebtoken @prisma/client prisma resend zod @tanstack/react-query uploadthing @uploadthing/next

npm install --save-dev @types/bcryptjs @types/jsonwebtoken

WHAT EACH PACKAGE DOES:
bcryptjs — hashes passwords so you never store plain text passwords
jsonwebtoken — creates and verifies JWT tokens (your login tokens)
@prisma/client and prisma — your database ORM (talks to PostgreSQL)
resend — sends emails (welcome email, password reset, etc.)
zod — validates request bodies (makes sure the right data is sent to your API)
@tanstack/react-query — on the frontend, replaces Zustand for server data
uploadthing — handles file uploads (resumes, avatars)

---

# PART 1 — DATABASE SETUP (Step 1 of the Implementation Order)

## 1.1 — Initialize Prisma

Run this in your terminal:
npx prisma init

This creates two things:

- prisma/schema.prisma (your database schema file)
- Updates .env with a DATABASE_URL placeholder (you already filled this in)

## 1.2 — Write Your Complete Prisma Schema

Open prisma/schema.prisma and REPLACE everything in it with this:

---

generator client {
provider = "prisma-client-js"
}

datasource db {
provider = "postgresql"
url = env("DATABASE_URL")
}

enum UserRole {
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

enum ApplicationStatus {
applied
screening
interview
offer
hired
rejected
withdrawn
}

enum OfferStatus {
draft
sent
accepted
declined
expired
}

enum InterviewType {
phone_screen
technical
behavioral
panel
final
}

model Company {
id String @id @default(cuid())
name String
slug String @unique
logo String?
website String?
industry String?
size String?
description String?
stripeCustomerId String? @unique
subscriptionPlan String @default("free")
subscriptionStatus String @default("active")
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

users User[]
jobs Job[]
auditLogs AuditLog[]

@@index([slug])
@@index([stripeCustomerId])
}

model User {
id String @id @default(cuid())
email String @unique
password String?
firstName String
lastName String
avatar String?
role UserRole @default(recruiter)
isActive Boolean @default(true)
isEmailVerified Boolean @default(false)
companyId String?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

company Company? @relation(fields: [companyId], references: [id])
refreshTokens RefreshToken[]
createdJobs Job[] @relation("JobCreator")
applications Application[] @relation("CandidateApplications")
assignedInterviews Interview[] @relation("InterviewerAssignment")
auditLogs AuditLog[]
notifications Notification[]

@@index([email])
@@index([companyId])
}

model RefreshToken {
id String @id @default(cuid())
token String @unique
userId String
expiresAt DateTime
createdAt DateTime @default(now())
isRevoked Boolean @default(false)

user User @relation(fields: [userId], references: [id], onDelete: Cascade)

@@index([token])
@@index([userId])
}

model Job {
id String @id @default(cuid())
title String
department String?
location String?
locationType String @default("onsite")
employmentType String @default("full_time")
salaryMin Int?
salaryMax Int?
currency String @default("USD")
description String
requirements String?
benefits String?
status JobStatus @default(draft)
companyId String
createdById String
closingDate DateTime?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

company Company @relation(fields: [companyId], references: [id])
createdBy User @relation("JobCreator", fields: [createdById], references: [id])
pipelineStages PipelineStage[]
applications Application[]

@@index([companyId])
@@index([status])
}

model PipelineStage {
id String @id @default(cuid())
name String
order Int
color String @default("#6366f1")
jobId String
createdAt DateTime @default(now())

job Job @relation(fields: [jobId], references: [id], onDelete: Cascade)
applications Application[]

@@index([jobId])
}

model Application {
id String @id @default(cuid())
candidateId String
jobId String
stageId String?
status ApplicationStatus @default(applied)
resumeUrl String?
coverLetter String?
notes String?
rating Int?
appliedAt DateTime @default(now())
updatedAt DateTime @updatedAt

candidate User @relation("CandidateApplications", fields: [candidateId], references: [id])
job Job @relation(fields: [jobId], references: [id])
stage PipelineStage? @relation(fields: [stageId], references: [id])
interviews Interview[]
offer Offer?

@@unique([candidateId, jobId])
@@index([jobId])
@@index([candidateId])
@@index([stageId])
}

model Interview {
id String @id @default(cuid())
applicationId String
interviewerId String
type InterviewType @default(phone_screen)
scheduledAt DateTime
durationMins Int @default(60)
location String?
meetingLink String?
notes String?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

application Application @relation(fields: [applicationId], references: [id], onDelete: Cascade)
interviewer User @relation("InterviewerAssignment", fields: [interviewerId], references: [id])
scorecards InterviewScorecard[]

@@index([applicationId])
@@index([interviewerId])
}

model InterviewScorecard {
id String @id @default(cuid())
interviewId String
rating Int
feedback String?
recommendation String?
submittedAt DateTime @default(now())

interview Interview @relation(fields: [interviewId], references: [id], onDelete: Cascade)

@@index([interviewId])
}

model Offer {
id String @id @default(cuid())
applicationId String @unique
salaryAmount Int
currency String @default("USD")
startDate DateTime?
expiresAt DateTime?
status OfferStatus @default(draft)
equityPercent Float?
bonusAmount Int?
notes String?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

application Application @relation(fields: [applicationId], references: [id])

@@index([applicationId])
}

model Notification {
id String @id @default(cuid())
userId String
title String
body String
type String
isRead Boolean @default(false)
link String?
createdAt DateTime @default(now())

user User @relation(fields: [userId], references: [id], onDelete: Cascade)

@@index([userId])
@@index([isRead])
}

model AuditLog {
id String @id @default(cuid())
userId String?
companyId String?
action String
resource String
resourceId String?
metadata Json?
ipAddress String?
createdAt DateTime @default(now())

user User? @relation(fields: [userId], references: [id])
company Company? @relation(fields: [companyId], references: [id])

@@index([companyId])
@@index([userId])
@@index([resource])
}

---

## 1.3 — Push Schema to Database

Run these commands in order:

npx prisma generate
(This generates the TypeScript types for your database models. Run this EVERY TIME you change schema.prisma)

npx prisma db push
(This creates all the tables in your PostgreSQL database. Use this during development)

IMPORTANT: In production, use "npx prisma migrate deploy" instead of db push.

## 1.4 — Create the Prisma Client Singleton

Create this file: src/core/database/prisma.ts

WHY: If you create a new PrismaClient() in every file, you will exhaust your database connections within seconds. This singleton pattern ensures only ONE connection is shared across the entire app.

---

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
prisma: PrismaClient | undefined
}

export const prisma =
globalForPrisma.prisma ??
new PrismaClient({
log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

## if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

HOW TO USE IT EVERYWHERE:
import { prisma } from '@/core/database/prisma'
const users = await prisma.user.findMany()

---

# PART 2 — CORE AUTHENTICATION LOGIC (Step 2)

## 2.1 — Password Hashing (src/core/auth/passwords.ts)

Create this file: src/core/auth/passwords.ts

WHY: You NEVER store a plain text password. bcryptjs turns "mypassword123" into a random-looking string like "$2a$10$xyz..." that cannot be reversed. When a user logs in, you hash their input and compare the two hashes.

---

import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

export async function hashPassword(plainText: string): Promise<string> {
return bcrypt.hash(plainText, SALT_ROUNDS)
}

export async function verifyPassword(plainText: string, hashed: string): Promise<boolean> {
return bcrypt.compare(plainText, hashed)
}

---

EXAMPLE OF HOW THIS WORKS:
User registers with password "hello123"
hashPassword("hello123") returns "$2a$10$abcdefgh..."
You save "$2a$10$abcdefgh..." to the database
User logs in with "hello123"
verifyPassword("hello123", "$2a$10$abcdefgh...") returns true
Even if your database is stolen, attackers cannot reverse the hash

## 2.2 — JWT Token Logic (src/core/auth/jwt.ts)

Create this file: src/core/auth/jwt.ts

WHY: After login, you give the user a "token" — like a signed ticket. Every API call they make, they send this ticket. Your server checks the signature to confirm it's real without hitting the database every time.

Access Token (15 minutes): Short-lived. Used for every API request. Stored in memory or localStorage.
Refresh Token (7 days): Long-lived. Used ONLY to get a new access token. Stored in an HttpOnly cookie (JavaScript cannot read it — protects against XSS attacks).

---

import jwt from 'jsonwebtoken'

export interface JWTPayload {
userId: string
email: string
role: string
companyId: string | null
}

export function signAccessToken(payload: JWTPayload): string {
return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
expiresIn: '15m',
})
}

export function signRefreshToken(payload: Pick<JWTPayload, 'userId'>): string {
return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
expiresIn: '7d',
})
}

export function verifyAccessToken(token: string): JWTPayload {
return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JWTPayload
}

export function verifyRefreshToken(token: string): Pick<JWTPayload, 'userId'> {
return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as Pick<JWTPayload, 'userId'>
}

---

## 2.3 — API Response Helpers (src/lib/api-response.ts)

Create this file: src/lib/api-response.ts

WHY: Instead of writing NextResponse.json({ error: "..." }, { status: 400 }) everywhere, you use these helper functions. This keeps ALL your API responses consistent in format.

---

import { NextResponse } from 'next/server'

export function successResponse(data: unknown, status = 200) {
return NextResponse.json({ success: true, data }, { status })
}

export function errorResponse(message: string, status = 400, details?: unknown) {
return NextResponse.json({ success: false, error: message, details }, { status })
}

export function unauthorizedResponse(message = 'Unauthorized') {
return errorResponse(message, 401)
}

export function forbiddenResponse(message = 'Forbidden') {
return errorResponse(message, 403)
}

export function notFoundResponse(message = 'Not found') {
return errorResponse(message, 404)
}

---

## 2.4 — Request Validation Helper (src/lib/validate-request.ts)

Create this file: src/lib/validate-request.ts

WHY: Every API route needs to validate its input. This helper extracts the body from a request and validates it against a Zod schema in ONE line. If validation fails, it throws a clear error.

---

import { NextRequest } from 'next/server'
import { ZodSchema, ZodError } from 'zod'

export async function validateRequest<T>(req: NextRequest, schema: ZodSchema<T>): Promise<T> {
const body = await req.json()
return schema.parse(body)
}

export function formatZodError(error: ZodError): string {
return error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
}

---

## 2.5 — Auth Middleware Helper (src/lib/auth-middleware.ts)

Create this file: src/lib/auth-middleware.ts

WHY: Every protected API route needs to check: "Is this user logged in? Do they have permission?" Instead of repeating this check in every route handler, you call requireAuth() at the top of any protected route.

---

import { NextRequest } from 'next/server'
import { verifyAccessToken, JWTPayload } from '@/core/auth/jwt'
import { unauthorizedResponse } from '@/lib/api-response'

export async function requireAuth(req: NextRequest): Promise<JWTPayload | Response> {
const authHeader = req.headers.get('authorization')

if (!authHeader || !authHeader.startsWith('Bearer ')) {
return unauthorizedResponse('No token provided')
}

const token = authHeader.split(' ')[1]

try {
const payload = verifyAccessToken(token)
return payload
} catch {
return unauthorizedResponse('Invalid or expired token')
}
}

export function requireRole(payload: JWTPayload, allowedRoles: string[]): boolean {
return allowedRoles.includes(payload.role)
}

---

---

# PART 3 — NEXT.JS MIDDLEWARE FOR ROUTE PROTECTION (Step 2, continued)

## 3.1 — Create src/middleware.ts

This file goes in the ROOT of your src/ folder (not inside app/).

WHY: This middleware runs BEFORE any page renders. If a user without a token tries to access /dashboard, the middleware redirects them to /login instantly — before Next.js even tries to render the page. This is the only real protection for your routes.

---

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAccessToken } from '@/core/auth/jwt'

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password']
const AUTH_API_ROUTES = ['/api/auth/login', '/api/auth/register', '/api/auth/refresh']

export function middleware(request: NextRequest) {
const { pathname } = request.nextUrl

// Allow public routes and auth API routes through without a token
const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route))
const isAuthApiRoute = AUTH_API_ROUTES.some(route => pathname.startsWith(route))

if (isPublicRoute || isAuthApiRoute) {
return NextResponse.next()
}

// For API routes: check Authorization header
if (pathname.startsWith('/api/')) {
const authHeader = request.headers.get('authorization')
if (!authHeader) {
return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

    try {
      const token = authHeader.split(' ')[1]
      verifyAccessToken(token)
      return NextResponse.next()
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

}

// For page routes: check cookie or redirect to login
const accessToken = request.cookies.get('access_token')?.value
if (!accessToken) {
return NextResponse.redirect(new URL('/login', request.url))
}

try {
verifyAccessToken(accessToken)
return NextResponse.next()
} catch {
return NextResponse.redirect(new URL('/login', request.url))
}
}

export const config = {
matcher: [
'/((?!_next/static|_next/image|favicon.ico|public/).*)',
],
}

---

---

# PART 4 — AUTHENTICATION API ENDPOINTS (Step 3)

## 4.1 — Register Endpoint

Create this file: src/app/api/auth/register/route.ts

WHAT IT DOES: Receives { email, password, firstName, lastName, companyName }, creates a Company and a User inside a single database transaction (meaning if creating the Company succeeds but creating the User fails, BOTH are rolled back — the database stays clean).

---

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/core/database/prisma'
import { hashPassword } from '@/core/auth/passwords'
import { signAccessToken, signRefreshToken } from '@/core/auth/jwt'
import { successResponse, errorResponse } from '@/lib/api-response'
import { validateRequest, formatZodError } from '@/lib/validate-request'
import { ZodError } from 'zod'
import { cookies } from 'next/headers'

const registerSchema = z.object({
email: z.string().email('Invalid email address'),
password: z.string().min(8, 'Password must be at least 8 characters'),
firstName: z.string().min(1, 'First name is required'),
lastName: z.string().min(1, 'Last name is required'),
companyName: z.string().min(2, 'Company name must be at least 2 characters'),
})

function generateSlug(name: string): string {
return name
.toLowerCase()
.replace(/[^a-z0-9]/g, '-')
.replace(/-+/g, '-')
.trim() + '-' + Date.now()
}

export async function POST(req: NextRequest) {
try {
const body = await validateRequest(req, registerSchema)

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    })
    if (existingUser) {
      return errorResponse('Email already registered', 409)
    }

    const hashedPassword = await hashPassword(body.password)
    const companySlug = generateSlug(body.companyName)

    // Create Company and User in a single atomic transaction
    const { user, company } = await prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: body.companyName,
          slug: companySlug,
        },
      })

      const user = await tx.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          firstName: body.firstName,
          lastName: body.lastName,
          role: 'company_admin',
          companyId: company.id,
        },
      })

      return { user, company }
    })

    // Create tokens
    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    })
    const refreshToken = signRefreshToken({ userId: user.id })

    // Store refresh token in database
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now
    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt },
    })

    // Set refresh token as HttpOnly cookie
    const cookieStore = await cookies()
    cookieStore.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      path: '/',
    })

    return successResponse({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        companyId: user.companyId,
      },
      company: { id: company.id, name: company.name, slug: company.slug },
    }, 201)

} catch (error) {
if (error instanceof ZodError) {
return errorResponse(formatZodError(error), 422)
}
console.error('[REGISTER ERROR]', error)
return errorResponse('Internal server error', 500)
}
}

---

## 4.2 — Login Endpoint

Create this file: src/app/api/auth/login/route.ts

WHAT IT DOES: Receives { email, password }, verifies credentials, and returns an access token. The access token goes to the frontend. The refresh token goes into an HttpOnly cookie.

---

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { ZodError } from 'zod'
import { cookies } from 'next/headers'
import { prisma } from '@/core/database/prisma'
import { verifyPassword } from '@/core/auth/passwords'
import { signAccessToken, signRefreshToken } from '@/core/auth/jwt'
import { successResponse, errorResponse } from '@/lib/api-response'
import { validateRequest, formatZodError } from '@/lib/validate-request'

const loginSchema = z.object({
email: z.string().email(),
password: z.string().min(1, 'Password is required'),
})

export async function POST(req: NextRequest) {
try {
const body = await validateRequest(req, loginSchema)

    // Find user including their password hash
    const user = await prisma.user.findUnique({
      where: { email: body.email },
      include: { company: { select: { id: true, name: true, slug: true } } },
    })

    // Use the same error message for wrong email AND wrong password
    // This prevents attackers from knowing if an email exists in your system
    if (!user || !user.password) {
      return errorResponse('Invalid email or password', 401)
    }

    const isPasswordValid = await verifyPassword(body.password, user.password)
    if (!isPasswordValid) {
      return errorResponse('Invalid email or password', 401)
    }

    if (!user.isActive) {
      return errorResponse('Account is deactivated. Contact support.', 403)
    }

    // Generate tokens
    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    })
    const refreshToken = signRefreshToken({ userId: user.id })

    // Save refresh token to database
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)
    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt },
    })

    // Set HttpOnly cookie
    const cookieStore = await cookies()
    cookieStore.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return successResponse({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        companyId: user.companyId,
        company: user.company,
      },
    })

} catch (error) {
if (error instanceof ZodError) {
return errorResponse(formatZodError(error), 422)
}
console.error('[LOGIN ERROR]', error)
return errorResponse('Internal server error', 500)
}
}

---

## 4.3 — Token Refresh Endpoint

Create this file: src/app/api/auth/refresh/route.ts

WHAT IT DOES: The frontend calls this automatically when the access token expires (after 15 minutes). It reads the HttpOnly cookie, validates it against the database, and issues a new access token. This keeps the user logged in without them ever re-entering their password.

---

import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/core/database/prisma'
import { verifyRefreshToken, signAccessToken } from '@/core/auth/jwt'
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response'

export async function POST(req: NextRequest) {
try {
const cookieStore = await cookies()
const refreshToken = cookieStore.get('refresh_token')?.value

    if (!refreshToken) {
      return unauthorizedResponse('No refresh token')
    }

    // Verify the token signature
    let payload: { userId: string }
    try {
      payload = verifyRefreshToken(refreshToken)
    } catch {
      return unauthorizedResponse('Invalid refresh token')
    }

    // Check the token exists in the database and is not revoked
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    })

    if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
      return unauthorizedResponse('Refresh token expired or revoked')
    }

    const user = storedToken.user

    // Issue a new access token
    const newAccessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    })

    return successResponse({ accessToken: newAccessToken })

} catch (error) {
console.error('[REFRESH ERROR]', error)
return errorResponse('Internal server error', 500)
}
}

---

## 4.4 — Logout Endpoint

Create this file: src/app/api/auth/logout/route.ts

WHAT IT DOES: Revokes the refresh token in the database and clears the cookie. After this, even if someone copied the old token, it cannot be used.

---

import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/core/database/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function POST(req: NextRequest) {
try {
const cookieStore = await cookies()
const refreshToken = cookieStore.get('refresh_token')?.value

    if (refreshToken) {
      // Revoke the token in the database
      await prisma.refreshToken.updateMany({
        where: { token: refreshToken },
        data: { isRevoked: true },
      })
    }

    // Clear the cookie regardless
    cookieStore.set('refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    })

    return successResponse({ message: 'Logged out successfully' })

} catch (error) {
console.error('[LOGOUT ERROR]', error)
return errorResponse('Internal server error', 500)
}
}

---

## 4.5 — Get Current User Endpoint

Create this file: src/app/api/auth/me/route.ts

WHAT IT DOES: Returns the currently logged-in user's data. Called on app load to restore the session.

---

import { NextRequest } from 'next/server'
import { prisma } from '@/core/database/prisma'
import { requireAuth } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { JWTPayload } from '@/core/auth/jwt'

export async function GET(req: NextRequest) {
try {
const auth = await requireAuth(req)
if (auth instanceof Response) return auth

    const payload = auth as JWTPayload

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        companyId: true,
        isEmailVerified: true,
        company: {
          select: { id: true, name: true, slug: true, logo: true, subscriptionPlan: true },
        },
      },
    })

    if (!user) return errorResponse('User not found', 404)

    return successResponse({ user })

} catch (error) {
console.error('[ME ERROR]', error)
return errorResponse('Internal server error', 500)
}
}

---

---

# PART 5 — EMAIL SYSTEM (Step of Phase 6)

## 5.1 — Initialize Resend Client (src/core/emails/resend.ts)

Create this file: src/core/emails/resend.ts

Go to resend.com, create an account, create an API key, put it in your .env as RESEND_API_KEY

---

import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
throw new Error('RESEND_API_KEY is not set in environment variables')
}

## export const resend = new Resend(process.env.RESEND_API_KEY)

## 5.2 — Welcome Email Function (src/core/emails/templates/welcome.ts)

Create this file: src/core/emails/templates/welcome.ts

---

import { resend } from '../resend'

interface WelcomeEmailParams {
to: string
firstName: string
companyName: string
}

export async function sendWelcomeEmail({ to, firstName, companyName }: WelcomeEmailParams) {
await resend.emails.send({
from: process.env.EMAIL_FROM!,
to,
subject: `Welcome to TalentIQ, ${firstName}!`,
html: `       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6366f1;">Welcome to TalentIQ!</h1>
        <p>Hi ${firstName},</p>
        <p>Your company workspace for <strong>${companyName}</strong> is ready.</p>
        <p>Start by posting your first job listing to attract top candidates.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
           style="background: #6366f1; color: white; padding: 12px 24px; 
                  border-radius: 6px; text-decoration: none; display: inline-block; margin-top: 16px;">
          Go to Dashboard
        </a>
        <p style="margin-top: 32px; color: #666;">The TalentIQ Team</p>
      </div>
    `,
})
}

---

## 5.3 — Password Reset Email (src/core/emails/templates/reset-password.ts)

Create this file: src/core/emails/templates/reset-password.ts

---

import { resend } from '../resend'

interface ResetPasswordEmailParams {
to: string
firstName: string
resetToken: string
}

export async function sendPasswordResetEmail({ to, firstName, resetToken }: ResetPasswordEmailParams) {
const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`

await resend.emails.send({
from: process.env.EMAIL_FROM!,
to,
subject: 'Reset your TalentIQ password',
html: `       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6366f1;">Reset Your Password</h1>
        <p>Hi ${firstName},</p>
        <p>You requested a password reset. Click the button below. This link expires in 1 hour.</p>
        <a href="${resetUrl}" 
           style="background: #6366f1; color: white; padding: 12px 24px; 
                  border-radius: 6px; text-decoration: none; display: inline-block; margin-top: 16px;">
          Reset Password
        </a>
        <p style="margin-top: 16px; color: #666;">If you didn't request this, ignore this email.</p>
      </div>
    `,
})
}

---

---

# PART 6 — CORE DOMAIN APIs (Step 5)

## 6.1 — Jobs API

Create this file: src/app/api/jobs/route.ts

WHAT IT DOES: GET returns all jobs for the logged-in user's company. POST creates a new job. Notice EVERY query includes companyId — this is the tenant isolation rule.

---

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { ZodError } from 'zod'
import { prisma } from '@/core/database/prisma'
import { requireAuth } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { validateRequest, formatZodError } from '@/lib/validate-request'
import { JWTPayload } from '@/core/auth/jwt'

const createJobSchema = z.object({
title: z.string().min(1, 'Title is required'),
department: z.string().optional(),
location: z.string().optional(),
locationType: z.enum(['onsite', 'remote', 'hybrid']).default('onsite'),
employmentType: z.enum(['full_time', 'part_time', 'contract', 'internship']).default('full_time'),
salaryMin: z.number().int().positive().optional(),
salaryMax: z.number().int().positive().optional(),
currency: z.string().default('USD'),
description: z.string().min(10, 'Description must be at least 10 characters'),
requirements: z.string().optional(),
benefits: z.string().optional(),
closingDate: z.string().datetime().optional(),
})

const DEFAULT_STAGES = [
{ name: 'Applied', order: 1, color: '#94a3b8' },
{ name: 'Screening', order: 2, color: '#60a5fa' },
{ name: 'Interview', order: 3, color: '#a78bfa' },
{ name: 'Offer', order: 4, color: '#34d399' },
]

export async function GET(req: NextRequest) {
try {
const auth = await requireAuth(req)
if (auth instanceof Response) return auth
const payload = auth as JWTPayload

    if (!payload.companyId) return errorResponse('No company associated', 400)

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = { companyId: payload.companyId }
    if (status) where.status = status

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          createdBy: { select: { id: true, firstName: true, lastName: true } },
          pipelineStages: { orderBy: { order: 'asc' } },
          _count: { select: { applications: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.job.count({ where }),
    ])

    return successResponse({ jobs, pagination: { total, page, limit, pages: Math.ceil(total / limit) } })

} catch (error) {
console.error('[JOBS GET ERROR]', error)
return errorResponse('Internal server error', 500)
}
}

export async function POST(req: NextRequest) {
try {
const auth = await requireAuth(req)
if (auth instanceof Response) return auth
const payload = auth as JWTPayload

    if (!payload.companyId) return errorResponse('No company associated', 400)

    const body = await validateRequest(req, createJobSchema)

    const job = await prisma.$transaction(async (tx) => {
      const job = await tx.job.create({
        data: {
          ...body,
          companyId: payload.companyId!,
          createdById: payload.userId,
          closingDate: body.closingDate ? new Date(body.closingDate) : undefined,
        },
      })

      // Auto-create default pipeline stages for this job
      await tx.pipelineStage.createMany({
        data: DEFAULT_STAGES.map(stage => ({ ...stage, jobId: job.id })),
      })

      return job
    })

    const fullJob = await prisma.job.findUnique({
      where: { id: job.id },
      include: { pipelineStages: { orderBy: { order: 'asc' } } },
    })

    return successResponse(fullJob, 201)

} catch (error) {
if (error instanceof ZodError) return errorResponse(formatZodError(error), 422)
console.error('[JOBS POST ERROR]', error)
return errorResponse('Internal server error', 500)
}
}

---

## 6.2 — Single Job API (GET, PUT, DELETE by ID)

Create this file: src/app/api/jobs/[id]/route.ts

---

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { ZodError } from 'zod'
import { prisma } from '@/core/database/prisma'
import { requireAuth } from '@/lib/auth-middleware'
import { successResponse, errorResponse, notFoundResponse, forbiddenResponse } from '@/lib/api-response'
import { JWTPayload } from '@/core/auth/jwt'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
try {
const auth = await requireAuth(req)
if (auth instanceof Response) return auth
const payload = auth as JWTPayload

    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: {
        pipelineStages: { orderBy: { order: 'asc' } },
        applications: {
          include: {
            candidate: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
            stage: true,
          },
        },
        createdBy: { select: { id: true, firstName: true, lastName: true } },
      },
    })

    if (!job) return notFoundResponse('Job not found')
    if (job.companyId !== payload.companyId) return forbiddenResponse()

    return successResponse(job)

} catch (error) {
return errorResponse('Internal server error', 500)
}
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
try {
const auth = await requireAuth(req)
if (auth instanceof Response) return auth
const payload = auth as JWTPayload

    const job = await prisma.job.findUnique({ where: { id: params.id } })
    if (!job) return notFoundResponse('Job not found')
    if (job.companyId !== payload.companyId) return forbiddenResponse()

    const body = await req.json()

    const updatedJob = await prisma.job.update({
      where: { id: params.id },
      data: { ...body, updatedAt: new Date() },
    })

    return successResponse(updatedJob)

} catch (error) {
return errorResponse('Internal server error', 500)
}
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
try {
const auth = await requireAuth(req)
if (auth instanceof Response) return auth
const payload = auth as JWTPayload

    const job = await prisma.job.findUnique({ where: { id: params.id } })
    if (!job) return notFoundResponse('Job not found')
    if (job.companyId !== payload.companyId) return forbiddenResponse()

    // Only company_admin can delete jobs
    if (payload.role !== 'company_admin') return forbiddenResponse('Only admins can delete jobs')

    await prisma.job.delete({ where: { id: params.id } })

    return successResponse({ message: 'Job deleted successfully' })

} catch (error) {
return errorResponse('Internal server error', 500)
}
}

---

## 6.3 — Applications (Candidates Pipeline) API

Create this file: src/app/api/applications/route.ts

---

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { ZodError } from 'zod'
import { prisma } from '@/core/database/prisma'
import { requireAuth } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { validateRequest, formatZodError } from '@/lib/validate-request'
import { JWTPayload } from '@/core/auth/jwt'

const createApplicationSchema = z.object({
candidateId: z.string().cuid(),
jobId: z.string().cuid(),
stageId: z.string().cuid().optional(),
resumeUrl: z.string().url().optional(),
coverLetter: z.string().optional(),
})

export async function GET(req: NextRequest) {
try {
const auth = await requireAuth(req)
if (auth instanceof Response) return auth
const payload = auth as JWTPayload

    const { searchParams } = new URL(req.url)
    const jobId = searchParams.get('jobId')
    const stageId = searchParams.get('stageId')
    const status = searchParams.get('status')

    const where: Record<string, unknown> = {
      job: { companyId: payload.companyId },
    }
    if (jobId) where.jobId = jobId
    if (stageId) where.stageId = stageId
    if (status) where.status = status

    const applications = await prisma.application.findMany({
      where,
      include: {
        candidate: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
        job: { select: { id: true, title: true } },
        stage: true,
        interviews: { orderBy: { scheduledAt: 'asc' } },
        offer: true,
      },
      orderBy: { appliedAt: 'desc' },
    })

    return successResponse(applications)

} catch (error) {
console.error('[APPLICATIONS GET ERROR]', error)
return errorResponse('Internal server error', 500)
}
}

export async function POST(req: NextRequest) {
try {
const auth = await requireAuth(req)
if (auth instanceof Response) return auth
const payload = auth as JWTPayload

    const body = await validateRequest(req, createApplicationSchema)

    // Verify job belongs to user's company
    const job = await prisma.job.findFirst({
      where: { id: body.jobId, companyId: payload.companyId! },
    })
    if (!job) return errorResponse('Job not found', 404)

    // Check for duplicate application
    const existing = await prisma.application.findUnique({
      where: { candidateId_jobId: { candidateId: body.candidateId, jobId: body.jobId } },
    })
    if (existing) return errorResponse('Candidate already applied to this job', 409)

    const application = await prisma.application.create({
      data: body,
      include: {
        candidate: { select: { id: true, firstName: true, lastName: true, email: true } },
        job: { select: { id: true, title: true } },
        stage: true,
      },
    })

    return successResponse(application, 201)

} catch (error) {
if (error instanceof ZodError) return errorResponse(formatZodError(error), 422)
console.error('[APPLICATIONS POST ERROR]', error)
return errorResponse('Internal server error', 500)
}
}

---

## 6.4 — Move Candidate Stage API

Create this file: src/app/api/applications/[id]/move/route.ts

WHAT IT DOES: This is the "drag and drop" endpoint. When a recruiter moves a candidate card from "Screening" to "Interview" on the kanban board, this endpoint is called.

---

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/core/database/prisma'
import { requireAuth } from '@/lib/auth-middleware'
import { successResponse, errorResponse, notFoundResponse, forbiddenResponse } from '@/lib/api-response'
import { JWTPayload } from '@/core/auth/jwt'

const moveSchema = z.object({
stageId: z.string().cuid(),
})

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
try {
const auth = await requireAuth(req)
if (auth instanceof Response) return auth
const payload = auth as JWTPayload

    const { stageId } = moveSchema.parse(await req.json())

    // Verify the application belongs to this company
    const application = await prisma.application.findFirst({
      where: { id: params.id, job: { companyId: payload.companyId! } },
    })
    if (!application) return notFoundResponse('Application not found')

    const updated = await prisma.application.update({
      where: { id: params.id },
      data: { stageId, updatedAt: new Date() },
      include: { stage: true, candidate: { select: { id: true, firstName: true, lastName: true } } },
    })

    return successResponse(updated)

} catch (error) {
return errorResponse('Internal server error', 500)
}
}

---

---

# PART 7 — REMOVING MOCK DATA (The Cleanup Phase)

## 7.1 — The Order to Remove Mock Data

DO NOT delete mock data before the corresponding API is working. Follow this exact order:

STEP A: Build and TEST the API endpoint (use a tool like Postman or Insomnia)
STEP B: Update the frontend hook/store to call the real API
STEP C: Verify the UI works with real data
STEP D: Delete the mock data file

## 7.2 — How to Replace Zustand Stores with React Query

First, add React Query provider to your layout.

Modify src/app/layout.tsx (add the QueryClientProvider wrapper):

---

'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

function Providers({ children }: { children: React.ReactNode }) {
const [queryClient] = useState(() => new QueryClient({
defaultOptions: {
queries: {
staleTime: 60 \* 1000, // 1 minute before refetching
retry: 1,
},
},
}))
return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

---

Then in your root layout's return, wrap children with <Providers>:
<Providers>{children}</Providers>

## 7.3 — Create Your API Client (src/lib/api-client.ts)

Create this file: src/lib/api-client.ts

WHY: Instead of writing fetch('/api/jobs', { headers: {...} }) in every hook, you have one function that automatically adds the Authorization header and handles token refresh.

---

let accessToken: string | null = null

export function setAccessToken(token: string) {
accessToken = token
}

export function clearAccessToken() {
accessToken = null
}

async function refreshAccessToken(): Promise<string | null> {
try {
const res = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })
if (!res.ok) return null
const data = await res.json()
accessToken = data.data.accessToken
return accessToken
} catch {
return null
}
}

export async function apiClient<T>(url: string, options: RequestInit = {}): Promise<T> {
const headers: Record<string, string> = {
'Content-Type': 'application/json',
...(options.headers as Record<string, string>),
}

if (accessToken) {
headers['Authorization'] = `Bearer ${accessToken}`
}

let response = await fetch(url, { ...options, headers })

// If 401, try to refresh the token once
if (response.status === 401 && accessToken) {
const newToken = await refreshAccessToken()
if (newToken) {
headers['Authorization'] = `Bearer ${newToken}`
response = await fetch(url, { ...options, headers })
}
}

const data = await response.json()

if (!response.ok) {
throw new Error(data.error || 'API request failed')
}

return data.data
}

---

## 7.4 — Create React Query Hooks to Replace Zustand

Create this file: src/hooks/use-jobs.ts

---

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

// Fetch all jobs for the company
export function useJobs(status?: string) {
return useQuery({
queryKey: ['jobs', status],
queryFn: () => apiClient(`/api/jobs${status ? `?status=${status}` : ''}`),
})
}

// Fetch a single job
export function useJob(id: string) {
return useQuery({
queryKey: ['jobs', id],
queryFn: () => apiClient(`/api/jobs/${id}`),
enabled: !!id,
})
}

// Create a job
export function useCreateJob() {
const queryClient = useQueryClient()
return useMutation({
mutationFn: (data: Record<string, unknown>) =>
apiClient('/api/jobs', { method: 'POST', body: JSON.stringify(data) }),
onSuccess: () => {
queryClient.invalidateQueries({ queryKey: ['jobs'] })
},
})
}

// Update a job
export function useUpdateJob(id: string) {
const queryClient = useQueryClient()
return useMutation({
mutationFn: (data: Record<string, unknown>) =>
apiClient(`/api/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
onSuccess: () => {
queryClient.invalidateQueries({ queryKey: ['jobs'] })
},
})
}

// Delete a job
export function useDeleteJob() {
const queryClient = useQueryClient()
return useMutation({
mutationFn: (id: string) => apiClient(`/api/jobs/${id}`, { method: 'DELETE' }),
onSuccess: () => {
queryClient.invalidateQueries({ queryKey: ['jobs'] })
},
})
}

---

Create this file: src/hooks/use-applications.ts

---

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export function useApplications(jobId?: string, stageId?: string) {
const params = new URLSearchParams()
if (jobId) params.set('jobId', jobId)
if (stageId) params.set('stageId', stageId)

return useQuery({
queryKey: ['applications', jobId, stageId],
queryFn: () => apiClient(`/api/applications?${params.toString()}`),
})
}

// Move a candidate to a different pipeline stage
export function useMoveApplication() {
const queryClient = useQueryClient()
return useMutation({
mutationFn: ({ id, stageId }: { id: string; stageId: string }) =>
apiClient(`/api/applications/${id}/move`, {
method: 'PATCH',
body: JSON.stringify({ stageId }),
}),
onSuccess: () => {
queryClient.invalidateQueries({ queryKey: ['applications'] })
},
})
}

---

## 7.5 — Replacing Auth Store

Create this file: src/hooks/use-auth.ts (REPLACES the old mock useAuth)

---

import { useState, useEffect, useCallback } from 'react'
import { apiClient, setAccessToken, clearAccessToken } from '@/lib/api-client'
import { useRouter } from 'next/navigation'

interface User {
id: string
email: string
firstName: string
lastName: string
role: string
companyId: string | null
company: { id: string; name: string; slug: string } | null
}

export function useAuth() {
const [user, setUser] = useState<User | null>(null)
const [isLoading, setIsLoading] = useState(true)
const router = useRouter()

const fetchCurrentUser = useCallback(async () => {
try {
const data = await apiClient<{ user: User }>('/api/auth/me')
setUser(data.user)
} catch {
setUser(null)
} finally {
setIsLoading(false)
}
}, [])

useEffect(() => {
fetchCurrentUser()
}, [fetchCurrentUser])

const login = async (email: string, password: string) => {
const data = await apiClient<{ accessToken: string; user: User }>('/api/auth/login', {
method: 'POST',
body: JSON.stringify({ email, password }),
})
setAccessToken(data.accessToken)
setUser(data.user)
return data
}

const register = async (payload: {
email: string; password: string
firstName: string; lastName: string; companyName: string
}) => {
const data = await apiClient<{ accessToken: string; user: User }>('/api/auth/register', {
method: 'POST',
body: JSON.stringify(payload),
})
setAccessToken(data.accessToken)
setUser(data.user)
return data
}

const logout = async () => {
await apiClient('/api/auth/logout', { method: 'POST' })
clearAccessToken()
setUser(null)
router.push('/login')
}

return { user, isLoading, login, register, logout, isAuthenticated: !!user }
}

---

## 7.6 — Update Your Login Page to Use Real Auth

In src/app/(auth)/login/page.tsx, find the form submit handler and replace the mock login logic:

BEFORE (what it probably looks like now):
const handleSubmit = () => {
setCurrentUser(mockUsers.find(u => u.email === email))
router.push('/dashboard')
}

## AFTER:

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'

export default function LoginPage() {
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState('')
const [isLoading, setIsLoading] = useState(false)
const { login } = useAuth()
const router = useRouter()

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault()
setError('')
setIsLoading(true)

    try {
      await login(email, password)
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }

}

// Keep your existing JSX — just replace the form's onSubmit and button's disabled state
// Add: <p className="text-red-500">{error}</p> to show errors
}

---

## 7.7 — How to Update a Dashboard Page (Migration Example)

In src/app/(portal)/dashboard/page.tsx:

BEFORE: const jobs = useJobsStore(state => state.jobs)
AFTER: const { data: jobs, isLoading, error } = useJobs()

BEFORE: const candidates = useCandidatesStore(state => state.candidates)
AFTER: const { data: applications } = useApplications()

Add loading states:
if (isLoading) return <div>Loading...</div>
if (error) return <div>Error loading data</div>

---

# PART 8 — DELETING MOCK DATA FILES

Only delete after you have confirmed the real API works for that domain.

## Delete in this order:

1. Delete src/mock-data/users.ts — After useAuth hook is connected
2. Delete src/mock-data/jobs.ts — After useJobs hooks are connected
3. Delete src/mock-data/candidates.ts — After useApplications hooks are connected
4. Delete src/mock-data/interviews.ts — After interviews API is done
5. Delete src/mock-data/offers.ts — After offers API is done
6. Delete src/mock-data/analytics.ts — After analytics API is done
7. Delete src/mock-data/messages.ts — After notifications API is done

## Delete Zustand stores in this order (after their React Query equivalents work):

1. Delete auth sections from auth.store.ts (keep only non-auth UI state)
2. Delete src/store/jobs.store.ts
3. Delete src/store/candidates.store.ts (or whatever it's called)
4. Delete src/store/domain.store.ts (piece by piece, not all at once)

## Delete DemoRoleSwitcher:

1. Find all imports of DemoRoleSwitcher component
2. Remove the import and the JSX tag from each file
3. Delete src/components/shared/DemoRoleSwitcher.tsx

---

# PART 9 — FILE UPLOADS WITH UPLOADTHING

## 9.1 — Setup UploadThing API Route

Create this file: src/app/api/uploadthing/route.ts

Go to uploadthing.com, create an account and app, copy UPLOADTHING_SECRET and UPLOADTHING_APP_ID to your .env

---

import { createNextRouteHandler } from "uploadthing/next"
import { createUploadthing, type FileRouter } from "uploadthing/next"
import { verifyAccessToken } from "@/core/auth/jwt"

const f = createUploadthing()

const ourFileRouter = {
resumeUploader: f({ pdf: { maxFileSize: "4MB" } })
.middleware(async ({ req }) => {
const authHeader = req.headers.get("authorization")
if (!authHeader) throw new Error("Unauthorized")

      const token = authHeader.split(" ")[1]
      const user = verifyAccessToken(token)
      return { userId: user.userId }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url }
    }),

avatarUploader: f({ image: { maxFileSize: "2MB" } })
.middleware(async ({ req }) => {
const authHeader = req.headers.get("authorization")
if (!authHeader) throw new Error("Unauthorized")
const token = authHeader.split(" ")[1]
const user = verifyAccessToken(token)
return { userId: user.userId }
})
.onUploadComplete(async ({ metadata, file }) => {
return { url: file.url }
}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

## export const { GET, POST } = createNextRouteHandler({ router: ourFileRouter })

---

# PART 10 — PRODUCTION SECURITY CHECKLIST

Go through this before launching:

## Passwords

[ ] bcryptjs with salt rounds = 10 (done in passwords.ts above)
[ ] NEVER log passwords anywhere in console.log statements
[ ] Minimum password length enforced in Zod schema (8+ chars)

## JWT Tokens

[ ] JWT secrets are at least 64 characters long
[ ] Access tokens expire in 15 minutes
[ ] Refresh tokens expire in 7 days
[ ] Refresh tokens are stored in database (revocable)
[ ] Refresh tokens are in HttpOnly cookies (not accessible to JavaScript)

## Database

[ ] EVERY query includes companyId from the JWT payload (never from the request body)
[ ] Never trust companyId sent by the client — always use the one from the verified JWT
[ ] Use Prisma $transaction for any operations that create multiple related records

## API Security

[ ] Every protected route calls requireAuth() and checks the result
[ ] Role checks before sensitive operations (delete, billing, user management)
[ ] Zod validation on every POST/PUT/PATCH request body
[ ] Never return password hash in any API response (use select: { password: false } or omit it)

## Environment

[ ] .env is in .gitignore — NEVER commit secrets to Git
[ ] Production uses different secrets from development
[ ] NODE_ENV=production disables Prisma query logging

## Rate Limiting (Add this before launch)

For the login route, add rate limiting. Install: npm install @upstash/ratelimit @upstash/redis
Then in your login route, add at the top:

---

import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
redis: Redis.fromEnv(),
limiter: Ratelimit.slidingWindow(5, "15 m"), // 5 attempts per 15 minutes
})

// Inside your POST handler, before any DB queries:
const ip = req.headers.get("x-forwarded-for") ?? "anonymous"
const { success } = await ratelimit.limit(ip)
if (!success) return errorResponse("Too many login attempts. Try again in 15 minutes.", 429)

---

---

# PART 11 — TESTING YOUR APIs

## How to Test Without a Frontend (Using curl or Postman)

Install Postman from postman.com for a visual interface. Or use these curl commands in your terminal:

TEST REGISTER:
curl -X POST http://localhost:3000/api/auth/register \
 -H "Content-Type: application/json" \
 -d '{"email":"admin@company.com","password":"password123","firstName":"John","lastName":"Doe","companyName":"Acme Corp"}'

You should receive a 201 response with accessToken and user data.

TEST LOGIN:
curl -X POST http://localhost:3000/api/auth/login \
 -H "Content-Type: application/json" \
 -d '{"email":"admin@company.com","password":"password123"}'

Copy the accessToken from the response.

TEST PROTECTED ROUTE (replace YOUR_TOKEN):
curl http://localhost:3000/api/auth/me \
 -H "Authorization: Bearer YOUR_TOKEN_HERE"

You should get your user data back.

TEST CREATE JOB:
curl -X POST http://localhost:3000/api/jobs \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer YOUR_TOKEN_HERE" \
 -d '{"title":"Senior Developer","description":"We are looking for a great developer","locationType":"remote","employmentType":"full_time"}'

VIEW DATABASE:
Run: npx prisma studio
This opens a visual browser at http://localhost:5555 where you can see all your database records.

---

# QUICK REFERENCE: File Creation Order

Create files in this exact order to avoid import errors:

1. prisma/schema.prisma (database schema)
2. src/core/database/prisma.ts (database client)
3. src/core/auth/passwords.ts (password hashing)
4. src/core/auth/jwt.ts (token logic)
5. src/lib/api-response.ts (response helpers)
6. src/lib/validate-request.ts (validation helper)
7. src/lib/auth-middleware.ts (auth check helper)
8. src/middleware.ts (route protection)
9. src/app/api/auth/register/route.ts (register endpoint)
10. src/app/api/auth/login/route.ts (login endpoint)
11. src/app/api/auth/refresh/route.ts (token refresh)
12. src/app/api/auth/logout/route.ts (logout)
13. src/app/api/auth/me/route.ts (get current user)
14. src/core/emails/resend.ts (email client)
15. src/core/emails/templates/welcome.ts (welcome email)
16. src/core/emails/templates/reset-password.ts (reset email)
17. src/app/api/jobs/route.ts (jobs CRUD)
18. src/app/api/jobs/[id]/route.ts (single job)
19. src/app/api/applications/route.ts (applications)
20. src/app/api/applications/[id]/move/route.ts (move stage)
21. src/app/api/uploadthing/route.ts (file uploads)
22. src/lib/api-client.ts (frontend API client)
23. src/hooks/use-auth.ts (auth hook)
24. src/hooks/use-jobs.ts (jobs hooks)
25. src/hooks/use-applications.ts (applications hooks)
26. Update src/app/layout.tsx (add QueryClientProvider)
27. Update login/register pages (connect to real API)
28. Update dashboard pages (replace mock data)
29. Delete src/mock-data/ files one by one (cleanup)
30. Delete old Zustand stores (cleanup)
