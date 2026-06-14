# TalentIQ — Frontend-Only Demo Conversion

## Executive Summary

After a deep audit of the entire codebase, here is the verdict: **the app is already ~70% demo-ready**. The architecture is largely frontend-first using Zustand stores for state. However, several critical blockers exist that must be resolved before the app can run cleanly as a demo:

1. **API routes call Prisma/PostgreSQL** — they will crash at import time without a database
2. **`useNotifications` hook calls a real backend API** and a real Pusher WebSocket — causes errors
3. **`useAuth` hook calls a real backend API** for login/register — login is broken
4. **Login form** actually submits to the backend — guests cannot enter the app
5. **Mock data is too thin** — only 3 candidates, 2 jobs, 3 interviews, 1 offer
6. **No role-switching UI** — no way to demo different user personas
7. **`alert()` used in application detail** for "Reject" — breaks demo professionalism
8. **Pusher client-side** tries to connect to a WebSocket (fails gracefully but noisy)

---

## ⚠️ User Review Required

> [!IMPORTANT]
> **Login Strategy**: The plan replaces the real login with a **demo login wall** — clicking "Sign In" with any credentials instantly logs in. Optionally, pre-filled demo accounts are shown on the login page (Recruiter, Admin, Hiring Manager, Candidate). This requires no real backend.

> [!IMPORTANT]
> **API Routes**: The Next.js API routes (`/api/applications`, `/api/jobs`, etc.) use Prisma and will cause build warnings. The plan stubs them out to return mock data, but they are **never called** by the frontend since all data comes from the Zustand store. We can either leave them as-is (they never run client-side) or stub them to avoid build errors.

> [!WARNING]
> **Data Expansion Scale**: The task calls for 500 candidates, 100 jobs, 300 interviews. This will be generated programmatically in the mock data file and seeded into the Zustand store on first load. The store currently uses `localStorage` persistence — we need to ensure the large dataset doesn't bloat localStorage. The plan handles this via `sessionStorage` for the large dataset.

---

## Open Questions

> [!NOTE]
> Should the "Reject" button on the Application Detail page show a **confirmation modal** or move the candidate to a "Rejected" stage in the pipeline? Currently it calls `alert()`.

> [!NOTE]
> Should clicking "Export CSV" on any page trigger a **real CSV download** of the mock data, or just show a success toast?

---

## Phase 1: Codebase Audit Results

### Backend Dependency Map

| File | Backend Dependency | Risk | Status |
|---|---|---|---|
| `src/lib/prisma.ts` | Prisma + PostgreSQL client | **HIGH** | Never called from client — safe |
| `src/lib/jwt.ts` | `jsonwebtoken` (Node.js-only) | **HIGH** | Only used in API routes |
| `src/lib/pusher.ts` | Pusher server SDK | **HIGH** | Only used in API routes |
| `src/lib/socket.ts` | Pusher JS client | **MEDIUM** | Called by `useNotifications` |
| `src/lib/email.ts` | Resend email service | **LOW** | Never called from client |
| `src/lib/api.ts` | Axios to real backend URL | **HIGH** | Called by `useAuth`, `useApplications`, `useJobs`, `useNotifications` |
| `src/lib/auth.ts` | JWT token in localStorage | **MEDIUM** | Used by auth store — needs mock bypass |
| `src/hooks/useAuth.ts` | Calls `api.post('/auth/login')` | **HIGH** | Breaks login |
| `src/hooks/useNotifications.ts` | Calls `api.get('/notifications')` + Pusher socket | **HIGH** | Causes network errors on load |
| `src/hooks/useSocket.ts` | Calls `getSocket()` from `lib/socket.ts` | **MEDIUM** | Pusher connect attempt |
| `src/app/api/applications/route.ts` | Prisma queries | **HIGH** | Dead code for demo |
| `src/app/api/jobs/route.ts` | Prisma queries | **HIGH** | Dead code for demo |
| `src/app/api/auth/login/route.ts` | Prisma + bcrypt + JWT | **HIGH** | Dead code for demo |
| `src/app/(app)/applications/[id]/page.tsx` | `alert()` for reject | **LOW** | Breaks demo UX |
| `src/store/domain.store.ts` | Only 3 candidates, 2 jobs | **MEDIUM** | Needs data expansion |

---

## Phase 2: URL Inventory

| URL | Page Name | Status | Data Source | Mock Needed |
|---|---|---|---|---|
| `/` | Landing/Marketing | Active | Static | No |
| `/login` | Login | Active | Real API | **YES — bypass auth** |
| `/register` | Register | Active | Real API | **YES — bypass auth** |
| `/forgot-password` | Forgot Password | Active | Real API | **YES — show toast** |
| `/reset-password` | Reset Password | Active | Real API | **YES — show toast** |
| `/invite` | Accept Invite | Active | Real API | **YES — auto-accept** |
| `/onboarding` | Onboarding | Active | Real API | **YES — skip flow** |
| `/dashboard` | Recruiter Dashboard | Active | Zustand Store | Expand data |
| `/jobs` | Jobs List | Active | Zustand Store | Expand data |
| `/jobs/new` | Create Job | Active | Zustand Store | Already mocked |
| `/jobs/[id]` | Job Detail | Active | Zustand Store | Expand data |
| `/applications` | Candidates Table | Active | Zustand Store | Expand data |
| `/applications/[id]` | Candidate Detail | Active | Zustand Store | Fix `alert()` |
| `/pipeline` | Kanban Board | Active | Zustand Store | Expand data |
| `/interviews` | Interviews | Active | Zustand Store | Expand data |
| `/interviews/[id]` | Interview Detail | Active | Zustand Store | Expand data |
| `/offers` | Offers | Active | Zustand Store | Expand data |
| `/offers/[id]` | Offer Detail | Active | Zustand Store | Expand data |
| `/messages` | Messaging | Active | Zustand Store | Expand data |
| `/insights` | AI Insights | Active | Static mock | Already done |
| `/analytics` | Analytics | Active | Zustand Store | Expand data |
| `/settings` | Settings | Active | Zustand Store | Already done |
| `/settings/billing` | Billing | Active | Static mock | Already done |
| `/settings/users` | Team Members | Active | Static mock | Already done |
| `/settings/integrations` | Integrations | Active | Static mock | Already done |
| `/settings/security` | Security | Active | Static mock | Stub needed |
| `/settings/templates` | Email Templates | Active | Static mock | Stub needed |
| `/settings/pipeline` | Pipeline Config | Active | Static mock | Stub needed |
| `/settings/api` | API Keys | Active | Static mock | Stub needed |
| `/meet/[id]` | Video Meeting | Active | Static | Already basic |
| `/careers` | Public Career Page | Active | Zustand Store | Expand data |
| `/portal` | Candidate Portal | Active | Zustand Store | Expand data |

---

## Phase 3: Feature Inventory

### Authentication System
- **Components**: LoginPage, RegisterPage, ForgotPasswordPage, AuthLayout
- **Current Source**: Real API (`/api/auth/login`, `/api/auth/register`)
- **Demo Strategy**: Bypass — any credentials log in as demo user; show role picker on login page
- **Status**: ⚠️ **Needs Mocking**

### Candidate Management
- **Components**: ApplicationsPage, ApplicationDetailPage, CandidateCard
- **Current Source**: Zustand `domain.store.ts`
- **Demo Strategy**: Expand from 3 → 500 realistic candidates with full AI scores
- **Status**: ⚠️ **Needs Data Expansion**

### Jobs Management
- **Components**: JobsPage, JobCard, NewJobPage, JobDetailPage
- **Current Source**: Zustand `domain.store.ts`
- **Demo Strategy**: Expand from 2 → 100 jobs across all departments
- **Status**: ⚠️ **Needs Data Expansion**

### Pipeline / Kanban Board
- **Components**: PipelinePage, DroppableColumn, DraggableCandidate
- **Current Source**: Zustand `domain.store.ts`
- **Demo Strategy**: Already functional drag-and-drop. Needs populated data.
- **Status**: ✅ **Functional — needs data**

### Interview Scheduling
- **Components**: InterviewsPage, InterviewCard
- **Current Source**: Zustand `domain.store.ts`
- **Demo Strategy**: Expand from 3 → 300 interviews with varied statuses
- **Status**: ⚠️ **Needs Data Expansion**

### Offer Management
- **Components**: OffersPage, OfferDetailPage
- **Current Source**: Zustand `domain.store.ts`
- **Demo Strategy**: Expand from 1 → 100 offers with varied statuses
- **Status**: ⚠️ **Needs Data Expansion**

### Messaging / Inbox
- **Components**: MessagesPage
- **Current Source**: Zustand `domain.store.ts` (messages array)
- **Demo Strategy**: Pre-seed realistic multi-turn conversations per candidate
- **Status**: ⚠️ **Needs Data Expansion**

### Analytics
- **Components**: AnalyticsPage
- **Current Source**: Computed from Zustand store + static mock team data
- **Demo Strategy**: Richer data will make charts more meaningful. Add sparkline chart.
- **Status**: ⚠️ **Needs Data Expansion**

### AI Insights
- **Components**: InsightsPage
- **Current Source**: Static mock data
- **Demo Strategy**: Already done. Add 4 more insight cards.
- **Status**: ✅ **Functional**

### Settings
- **Components**: SettingsPage (General, Team, Billing, Integrations, Security)
- **Current Source**: Zustand store + static mocks
- **Demo Strategy**: Already functional. Add stubs for Security, Templates, Pipeline Config, API tabs.
- **Status**: ⚠️ **Needs Stub Pages**

### Notifications
- **Components**: AppHeader notification dropdown
- **Current Source**: `useNotifications` calling real API + Pusher
- **Demo Strategy**: Replace with static mock notifications array (already partially done in AppHeader)
- **Status**: ⚠️ **Fix Hook**

### Role Switching (NEW)
- **Components**: RoleSwitcher (to be created)
- **Current Source**: N/A
- **Demo Strategy**: Floating button in app to switch between Admin, Recruiter, Hiring Manager, Candidate
- **Status**: 🆕 **New Feature**

---

## Phase 4: Backend Removal Checklist

### ✅ Authentication — Mock Login
- Replace `useAuth.login()` to immediately set a demo user in store
- Pre-fill login form with demo credentials
- Show role picker: Super Admin, Company Admin, Recruiter, Hiring Manager
- Remove JWT token management (still keep in store but don't validate)

### ✅ Database — Remove Prisma Calls
- API routes (`/api/*`) are never called client-side; leave them but add a disclaimer comment
- The app uses Zustand, not API routes — no changes needed to pages
- Add a `DEMO_MODE = true` env flag to disable API routes optionally

### ✅ Notifications — Remove Pusher/Socket
- Replace `useNotifications` with a simple hook that returns mock notifications
- Remove Pusher subscription logic
- Simulate "new notification" with a 30-second `setInterval` that adds a mock notification

### ✅ Email — Replace with Toast
- Email service (`lib/email.ts`) is never called client-side
- No changes needed — just show success toast where email sends would be triggered

### ✅ File Uploads — Preloaded Assets
- File upload UI stays (settings page upload area)
- No `uploadthing` calls exist in the frontend pages
- Click "Upload Resume" → show success toast + mock URL

### ✅ WebSockets — Simulated Updates
- Remove Pusher connection in `lib/socket.ts`
- Replace with a mock event emitter using `setInterval` for "live" updates simulation

---

## Phase 5: Mock Data Architecture

### New File: `src/mock-data/index.ts`
Master data generator. Creates all demo entities deterministically.

### Datasets to Generate

| Entity | Count | Key Fields |
|---|---|---|
| Companies | 25 | name, industry, size, plan |
| Demo Users | 5 | Admin, Recruiter, HM, Viewer, Candidate |
| Jobs | 100 | title, dept, location, salary, status, skills |
| Candidates | 500 | name, email, avatar, aiScore, skills, stage |
| Interviews | 300 | candidateId, jobId, type, date, status |
| Offers | 100 | candidateId, role, salary, status |
| Messages | 200 | multi-turn conversations |
| Analytics | Computed | hiring funnel, time-to-hire, source quality |

---

## Proposed Changes

### Step 1 — Core Mock Data Layer (NEW FILES)

#### [NEW] `src/mock-data/companies.ts`
25 mock companies with realistic names, industries, and sizes.

#### [NEW] `src/mock-data/users.ts`
5 demo user accounts: Super Admin, Company Admin, Recruiter, Hiring Manager, Candidate.
Includes avatars from `randomuser.me`.

#### [NEW] `src/mock-data/jobs.ts`
100 jobs across Engineering, Product, Design, Data, Sales, Marketing, Operations.
Each with full description, skills, salary range, status.

#### [NEW] `src/mock-data/candidates.ts`
500 candidates with AI scores, extracted skills, stage, source, notes, timeline.
Uses a deterministic generator so data is consistent on every load.

#### [NEW] `src/mock-data/interviews.ts`
300 interviews linked to candidates and jobs with varied types, dates, status.

#### [NEW] `src/mock-data/offers.ts`
100 offers with varied salary packages, equity, and acceptance status.

#### [NEW] `src/mock-data/messages.ts`
Pre-seeded multi-turn conversations between recruiters and candidates.

#### [NEW] `src/mock-data/analytics.ts`
Static analytics datasets: hiring funnel, time-to-hire trends, source quality, team performance.

---

### Step 2 — Auth System Bypass

#### [MODIFY] `src/hooks/useAuth.ts`
Replace real API calls with mock login:
- `login()` → immediately sets a demo user from `users.ts` based on email match (or defaults to Recruiter)
- `register()` → auto-registers as demo Recruiter
- `logout()` → clears store and redirects to `/login`

#### [MODIFY] `src/app/(auth)/login/page.tsx`
- Add "Demo Accounts" section with one-click login buttons
- Pre-fill email/password fields on click
- Show roles: Sarah (Recruiter), Alex (Admin), Jordan (Hiring Manager)

#### [MODIFY] `src/store/auth.store.ts`
- Add `demoRole` field for role switcher
- Add `switchRole()` action

---

### Step 3 — Notifications Fix

#### [MODIFY] `src/hooks/useNotifications.ts`
Replace API + Pusher with local mock:
- Return hardcoded notifications array from `mock-data`
- Use `setInterval` to simulate new notifications every 45s

#### [MODIFY] `src/lib/socket.ts`
Replace Pusher with a no-op event emitter:
- `getSocket()` → returns a mock object with `.subscribe()`, `.bind()`, `.unbind()` no-ops
- `subscribeToEvent()` → registers callback in a local event map
- Dispatch mock events via `setInterval`

---

### Step 4 — Domain Store Expansion

#### [MODIFY] `src/store/domain.store.ts`
- Replace tiny initial data arrays with imports from `src/mock-data/`
- Seed: 100 jobs, 500 candidates, 300 interviews, 100 offers, 200 messages
- Use `sessionStorage` instead of `localStorage` for the large dataset (to avoid quota issues)
- Keep all existing CRUD actions (`addJob`, `updateCandidate`, etc.)

---

### Step 5 — Application Detail Fix

#### [MODIFY] `src/app/(app)/applications/[id]/page.tsx`
- Replace `alert('Reject...')` with a proper confirmation modal
- Show a reject dialog with reason selector
- Move candidate to "Rejected" pseudo-stage or show toast

---

### Step 6 — Role Switcher UI (NEW)

#### [NEW] `src/components/shared/DemoRoleSwitcher.tsx`
Floating pill button in bottom-right of app:
- Shows current role
- Opens a popover with role options
- Switching role updates `auth.store` and re-renders header/nav permissions

#### [MODIFY] `src/components/layout/AppShell.tsx`
- Add `<DemoRoleSwitcher />` component

---

### Step 7 — Settings Stubs

#### [MODIFY] `src/app/(app)/settings/page.tsx`
Add stub tab content for:
- **Security**: 2FA toggle (mock), session management table (mock)
- **Templates**: Email template editor (static mockup)
- **Pipeline Config**: Stage editor (drag-and-drop, connected to store)
- **API Keys**: Generated mock API keys with copy button

---

### Step 8 — Missing Settings Sub-Pages Check

#### [NEW] `src/app/(app)/settings/security/page.tsx`
Static security settings page if it exists as separate route.

#### [NEW] `src/app/(app)/settings/templates/page.tsx`
Static email templates page.

---

### Step 9 — API Routes Stubbed (Optional Safety Net)

#### [MODIFY] `src/app/api/applications/route.ts`
Add early return in demo mode:
```ts
if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
  return NextResponse.json({ data: [], meta: { total: 0 } })
}
```
This prevents Prisma import errors at runtime.

#### Similar changes to: `api/jobs/route.ts`, `api/auth/*/route.ts`, `api/interviews/route.ts`, `api/users/route.ts`, `api/analytics/route.ts`, `api/webhooks/route.ts`

---

### Step 10 — Environment File Update

#### [MODIFY] `.env`
Add:
```
NEXT_PUBLIC_DEMO_MODE=true
```

---

### Step 11 — UX Polish

#### [MODIFY] `src/app/(app)/applications/[id]/page.tsx`
- Professional reject modal instead of `alert()`
- "Schedule Interview" button that opens modal + saves to store

#### [MODIFY] `src/app/(app)/offers/[id]/page.tsx`
- Offer detail view with all fields
- Accept/Decline buttons that update offer status in store

#### [MODIFY] `src/app/(app)/jobs/[id]/page.tsx`
- Job detail with applicant count, pipeline stats from store

---

## Verification Plan

### Automated Tests
```bash
cd talentiq && npm run dev
# Visit all routes, verify no console errors
```

### Manual Verification Checklist

| Test | Expected |
|---|---|
| Visit `/login` | See demo login page with role buttons |
| Click "Sign in as Recruiter" | Instantly logs in, redirected to `/dashboard` |
| Dashboard | Shows 100 jobs, 500 candidates, charts populated |
| `/applications` | Shows 500 candidates, filters work |
| `/applications/c_1` | Full candidate profile, AI score, notes work |
| `/pipeline` | Kanban with 500 candidates spread across stages |
| `/interviews` | 300 interviews in Today / Upcoming / Past sections |
| `/offers` | 100 offers with varied statuses |
| `/messages` | Realistic conversations per candidate |
| `/analytics` | Meaningful charts with real data volume |
| `/settings` | All tabs render without crashes |
| Role switch → Admin | Navigation/permissions update |
| Role switch → HM | Restricted view |
| Drag candidate | Moves to new stage, persists |
| Add note | Saved to store, persists in session |
| Move to next stage | Progress bar updates |
| `/insights` | 8+ AI insight cards |
| `/meet/int_1` | Meeting room page renders |
| No 404s | All nav links work |
| No console errors | Clean browser console |
| No empty tables | All pages show realistic data |

---

## Implementation Roadmap

### 🔵 Phase A: Mock Data Foundation (Est: 2-3 hours)
1. Create `src/mock-data/` directory with all 8 generator files
2. Generate 500 candidates, 100 jobs, 300 interviews, 100 offers deterministically

### 🔵 Phase B: Auth Bypass (Est: 30 min)
3. Modify `useAuth.ts` — mock login
4. Modify `login/page.tsx` — add demo account buttons
5. Modify `auth.store.ts` — add role switching

### 🔵 Phase C: Store Expansion (Est: 30 min)
6. Update `domain.store.ts` to seed from mock-data
7. Switch to sessionStorage to avoid localStorage quota issues

### 🔵 Phase D: Backend Isolation (Est: 30 min)
8. Fix `useNotifications.ts` — remove real API call + Pusher
9. Fix `lib/socket.ts` — no-op mock implementation
10. Stub API routes with DEMO_MODE check

### 🔵 Phase E: UX Polish (Est: 1 hour)
11. Replace `alert()` with reject modal in application detail
12. Add Role Switcher floating UI component
13. Add stubs for missing Settings tabs
14. Fix any broken dynamic routes

### 🔵 Phase F: Final Verification (Est: 30 min)
15. Run dev server, click through every route
16. Verify no console errors, no 404s, no empty states
17. Capture screenshots for walkthrough

**Total Estimated Effort: ~5 hours of focused execution**
