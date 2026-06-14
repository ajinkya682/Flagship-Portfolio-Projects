// ─── Domain Store — Demo Mode ─────────────────────────────────────
// Seeded with 500 candidates, 100 jobs, 300 interviews, 100 offers.
// Uses sessionStorage to avoid localStorage quota issues with large datasets.

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { MOCK_JOBS } from '@/mock-data/jobs'
import { MOCK_CANDIDATES } from '@/mock-data/candidates'
import { MOCK_INTERVIEWS } from '@/mock-data/interviews'
import { MOCK_OFFERS } from '@/mock-data/offers'
import { MOCK_MESSAGES } from '@/mock-data/messages'

// ── Type definitions ───────────────────────────────────────────────

export interface User {
  id: string
  name: string
  email: string
  role: string
  avatar: string
}

export interface Company {
  id: string
  name: string
  plan: string
}

export interface Settings {
  companyName: string
  companySlug: string
  portalThemeColor: string
}

export interface Job {
  id: string
  title: string
  department: string
  location: string
  type: string
  remote: string
  status: 'published' | 'draft' | 'closed'
  salaryMin: number
  salaryMax: number
  description: string
  requirements?: string[]
  skills?: string[]
  hiringTeam?: { name: string; role: string; avatar: string }[]
  postedAt: string
  slug?: string
  applicationFormConfig?: {
    requireFullName?: boolean
    requireMobileNumber?: boolean
    requireDate?: boolean
    requireLinkedin?: boolean
    requireGithub?: boolean
    requirePortfolio?: boolean
    requireResume?: boolean
    requirePassportPhoto?: boolean
    requireSignature?: boolean
    customQuestions?: string[]
  }
}

export interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  role: string
  jobId: string
  stage: string
  source: string
  location?: string
  yearsExp?: number
  linkedinUrl?: string
  githubUrl?: string
  portfolioUrl?: string
  resumeUrl?: string
  passportPhotoUrl?: string
  signature?: string
  availableStartDate?: string
  extractedSkills?: string[]
  extractedCompanies?: string[]
  extractedEducation?: string[]
  scoreBreakdown?: { skills: number; experience: number; education: number; keywords: number }
  strengths?: string[]
  gaps?: string[]
  tags?: string[]
  assignedTo?: string
  aiScore: number
  daysInStage: number
  appliedAt: string
  notes: { id: string; author: string; text: string; createdAt: string; avatar: string }[]
  timeline: { event: string; date: string; type: 'applied' | 'ai' | 'stage' | 'interview' }[]
  portalToken?: string
  hasPortalAccess?: boolean
}

export interface Interview {
  id: string
  candidateId: string
  jobId: string
  type: 'Video' | 'Phone' | 'Onsite'
  duration: string
  date: string
  time: string
  interviewer: string
  interviewerAvatar?: string
  status: 'scheduled' | 'completed' | 'cancelled'
  scorecardStatus: 'pending' | 'submitted'
  rating?: string
  joinLink?: string
  notes?: string
}

export interface Message {
  id: string
  senderId: string
  candidateId: string
  text: string
  time: string
}

export interface Offer {
  id: string
  candidateId: string
  jobId: string
  role: string
  amount: string
  equity: string
  bonus?: string
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired'
  sentDate: string
  expiryDate: string
  startDate?: string
}

// ── Store Interface ─────────────────────────────────────────────────

interface DomainState {
  settings: Settings
  jobs: Job[]
  candidates: Candidate[]
  interviews: Interview[]
  messages: Message[]
  offers: Offer[]

  // Actions
  addJob: (job: Job) => void
  updateJob: (id: string, updates: Partial<Job>) => void

  addCandidate: (candidate: Candidate) => void
  updateCandidate: (id: string, updates: Partial<Candidate>) => void
  moveCandidateStage: (candidateId: string, newStage: string) => void
  addCandidateNote: (candidateId: string, note: any) => void

  addInterview: (interview: Interview) => void
  updateInterview: (id: string, updates: Partial<Interview>) => void

  addMessage: (message: Message) => void

  addOffer: (offer: Offer) => void
  updateOffer: (id: string, updates: Partial<Offer>) => void

  updateSettings: (updates: Partial<Settings>) => void

  resetStore: () => void
}

// ── Initial Data ─────────────────────────────────────────────────────

const INITIAL_SETTINGS: Settings = {
  companyName: 'Acme Corp',
  companySlug: 'acme',
  portalThemeColor: '#0ea5e9',
}

// Map mock-data to store types (they are compatible by design)
const INITIAL_JOBS: Job[] = MOCK_JOBS as Job[]
const INITIAL_CANDIDATES: Candidate[] = MOCK_CANDIDATES as Candidate[]
const INITIAL_INTERVIEWS: Interview[] = MOCK_INTERVIEWS as Interview[]
const INITIAL_OFFERS: Offer[] = MOCK_OFFERS as Offer[]
const INITIAL_MESSAGES: Message[] = MOCK_MESSAGES as Message[]

// ── Store ───────────────────────────────────────────────────────────

export const useDomainStore = create<DomainState>()(
  persist(
    (set) => ({
      settings: INITIAL_SETTINGS,
      jobs: INITIAL_JOBS,
      candidates: INITIAL_CANDIDATES,
      interviews: INITIAL_INTERVIEWS,
      messages: INITIAL_MESSAGES,
      offers: INITIAL_OFFERS,

      updateSettings: (updates) =>
        set((state) => ({ settings: { ...state.settings, ...updates } })),

      addJob: (job) => set((state) => ({ jobs: [job, ...state.jobs] })),
      updateJob: (id, updates) =>
        set((state) => ({
          jobs: state.jobs.map((j) => (j.id === id ? { ...j, ...updates } : j)),
        })),

      addCandidate: (candidate) =>
        set((state) => ({ candidates: [candidate, ...state.candidates] })),
      updateCandidate: (id, updates) =>
        set((state) => ({
          candidates: state.candidates.map((c) =>
            c.id === id ? { ...c, ...updates } : c,
          ),
        })),
      moveCandidateStage: (candidateId, newStage) =>
        set((state) => ({
          candidates: state.candidates.map((c) =>
            c.id === candidateId
              ? {
                  ...c,
                  stage: newStage,
                  daysInStage: 0,
                  timeline: [
                    ...c.timeline,
                    { event: `Moved to ${newStage}`, date: 'Just now', type: 'stage' as const },
                  ],
                }
              : c,
          ),
        })),
      addCandidateNote: (candidateId, note) =>
        set((state) => ({
          candidates: state.candidates.map((c) =>
            c.id === candidateId ? { ...c, notes: [...c.notes, note] } : c,
          ),
        })),

      addInterview: (interview) =>
        set((state) => ({ interviews: [interview, ...state.interviews] })),
      updateInterview: (id, updates) =>
        set((state) => ({
          interviews: state.interviews.map((i) =>
            i.id === id ? { ...i, ...updates } : i,
          ),
        })),

      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),

      addOffer: (offer) =>
        set((state) => ({ offers: [offer, ...state.offers] })),
      updateOffer: (id, updates) =>
        set((state) => ({
          offers: state.offers.map((o) =>
            o.id === id ? { ...o, ...updates } : o,
          ),
        })),

      resetStore: () =>
        set({
          jobs: INITIAL_JOBS,
          candidates: INITIAL_CANDIDATES,
          interviews: INITIAL_INTERVIEWS,
          messages: INITIAL_MESSAGES,
          offers: INITIAL_OFFERS,
          settings: INITIAL_SETTINGS,
        }),
    }),
    {
      name: 'talentiq-domain-demo-v2',
      // Use sessionStorage to avoid localStorage quota issues with large datasets
      storage: createJSONStorage(() => sessionStorage),
      // Don't persist the full dataset — re-seed on every session from imports
      // Only persist user mutations (notes, stage moves, etc.)
      partialize: (state) => ({
        settings: state.settings,
        // Persist only changes to first 50 candidates (featured profiles)
        // Full data is re-seeded from mock-data imports each session
      }),
      // Merge: always start fresh from mock data, never from stale session storage
      merge: (_persisted, current) => current,
    },
  ),
)
