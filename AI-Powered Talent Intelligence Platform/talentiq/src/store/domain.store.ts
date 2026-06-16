// ─── Domain Store — Demo Mode ─────────────────────────────────────
// Seeded with 500 candidates, 100 jobs, 300 interviews, 100 offers.
// Uses sessionStorage to avoid localStorage quota issues with large datasets.

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { MOCK_INTERVIEWS } from '@/mock-data/interviews'
import { MOCK_OFFERS } from '@/mock-data/offers'
import { MOCK_MESSAGES } from '@/mock-data/messages'
import { DEMO_USERS } from '@/mock-data/users'

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
  interviews: Interview[]
  messages: Message[]
  offers: Offer[]
  users: User[]

  // Actions
  addUser: (user: User) => void

  addInterview: (interview: Interview) => void
  updateInterview: (id: string, updates: Partial<Interview>) => void

  addMessage: (message: Message) => void

  addOffer: (offer: Offer) => void
  updateOffer: (id: string, updates: Partial<Offer>) => void

  updateSettings: (updates: Partial<Settings>) => void

  resetStore: () => void
  loadDemoData: () => void
  clearData: () => void
}

// ── Initial Data ─────────────────────────────────────────────────────

const INITIAL_SETTINGS: Settings = {
  companyName: 'Acme Corp',
  companySlug: 'acme',
  portalThemeColor: '#0ea5e9',
}

const INITIAL_INTERVIEWS: Interview[] = []
const INITIAL_OFFERS: Offer[] = []
const INITIAL_MESSAGES: Message[] = []
const INITIAL_USERS: User[] = []

// ── Store ───────────────────────────────────────────────────────────

export const useDomainStore = create<DomainState>()(
  persist(
    (set) => ({
      settings: INITIAL_SETTINGS,
      interviews: INITIAL_INTERVIEWS,
      messages: INITIAL_MESSAGES,
      offers: INITIAL_OFFERS,
      users: INITIAL_USERS,

      updateSettings: (updates) =>
        set((state) => ({ settings: { ...state.settings, ...updates } })),

      addUser: (user) => set((state) => ({ users: [user, ...state.users] })),

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
          interviews: INITIAL_INTERVIEWS,
          messages: INITIAL_MESSAGES,
          offers: INITIAL_OFFERS,
          settings: INITIAL_SETTINGS,
        }),
        
      loadDemoData: () =>
        set({
          interviews: MOCK_INTERVIEWS as Interview[],
          offers: MOCK_OFFERS as Offer[],
          messages: MOCK_MESSAGES as Message[],
          users: DEMO_USERS.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            avatar: u.avatar
          })),
        }),
        
      clearData: () =>
        set({
          interviews: [],
          offers: [],
          messages: [],
          users: [],
        }),
    }),
    {
      name: 'talentiq-domain-demo-v2',
      // Use localStorage to share settings across tabs (specifically for job share links)
      storage: createJSONStorage(() => localStorage),
      // Don't persist the full dataset — re-seed on every session from imports
      partialize: (state) => ({
        settings: state.settings,
      }),
      // Merge: always start fresh from mock data, never from stale session storage
      merge: (_persisted, current) => current,
    },
  ),
)
