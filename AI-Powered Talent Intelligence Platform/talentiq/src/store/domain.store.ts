import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  hiringTeam?: { name: string, role: string, avatar: string }[]
  postedAt: string
  slug?: string
  applicationFormConfig?: {
    requireResume?: boolean
    requireLinkedin?: boolean
    requirePortfolio?: boolean
    customQuestions?: string[]
  }
}

export interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  role: string // specific job applying for
  jobId: string
  stage: string
  source: string
  location?: string
  yearsExp?: number
  linkedinUrl?: string
  resumeUrl?: string
  extractedSkills?: string[]
  extractedCompanies?: string[]
  extractedEducation?: string[]
  scoreBreakdown?: { skills: number, experience: number, education: number, keywords: number }
  strengths?: string[]
  gaps?: string[]
  tags?: string[]
  assignedTo?: string
  aiScore: number
  daysInStage: number
  appliedAt: string
  notes: { id: string, author: string, text: string, createdAt: string, avatar: string }[]
  timeline: { event: string, date: string, type: 'applied' | 'ai' | 'stage' | 'interview' }[]
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
  status: 'scheduled' | 'completed' | 'cancelled'
  scorecardStatus: 'pending' | 'submitted'
  rating?: string
  joinLink?: string
}

export interface Message {
  id: string
  senderId: string // 'me' or candidateId
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
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined'
  sentDate: string
  expiryDate: string
}

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

const INITIAL_SETTINGS: Settings = {
  companyName: 'Acme Corp',
  companySlug: 'acme',
  portalThemeColor: '#0ea5e9'
}

// Initial mock data to seed the store so it's not empty for demo purposes
const INITIAL_JOBS: Job[] = [
  { id: 'job_1', title: 'Senior Software Engineer', slug: 'senior-software-engineer', department: 'Engineering', location: 'San Francisco, CA', type: 'Full-time', remote: 'Hybrid', status: 'published', salaryMin: 150000, salaryMax: 190000, description: '...', postedAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 'job_2', title: 'Product Manager', slug: 'product-manager', department: 'Product', location: 'New York, NY', type: 'Full-time', remote: 'Onsite', status: 'published', salaryMin: 140000, salaryMax: 170000, description: '...', postedAt: new Date(Date.now() - 86400000 * 5).toISOString() },
]

const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'c_1', name: 'Jennifer Park', email: 'jen@example.com', phone: '555-0101', avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    role: 'Senior Software Engineer', jobId: 'job_1', stage: 'Screening', source: 'LinkedIn', aiScore: 92, daysInStage: 2, appliedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    notes: [], timeline: [{ event: 'Applied via LinkedIn', date: '4d ago', type: 'applied' }], portalToken: 'DEMO123', hasPortalAccess: true
  },
  {
    id: 'c_2', name: 'David Chen', email: 'david@example.com', phone: '555-0102', avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    role: 'Product Manager', jobId: 'job_2', stage: 'Interview', source: 'Referral', aiScore: 88, daysInStage: 4, appliedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    notes: [], timeline: [{ event: 'Referred by Alex', date: '6d ago', type: 'applied' }]
  },
  {
    id: 'c_3', name: 'Emily Watson', email: 'emily@example.com', phone: '555-0103', avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    role: 'UX Designer', jobId: 'job_1', stage: 'Hired', source: 'Direct', aiScore: 91, daysInStage: 1, appliedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    notes: [], timeline: []
  }
]

const INITIAL_MESSAGES: Message[] = [
  { id: 'm1', candidateId: 'c_1', senderId: 'c_1', text: 'Hi Sarah, thanks for reaching out. I am definitely interested in the Senior Software Engineer role.', time: 'Monday 9:00 AM' },
  { id: 'm2', candidateId: 'c_1', senderId: 'me', text: 'That is great to hear, Jennifer! I reviewed your profile and your background at Stripe aligns perfectly with what we are looking for.', time: 'Monday 9:15 AM' },
]

const INITIAL_OFFERS: Offer[] = [
  { id: 'off_1', candidateId: 'c_3', jobId: 'job_1', role: 'UX Designer', amount: '$155,000', equity: '0.1%', status: 'accepted', sentDate: 'Oct 10, 2023', expiryDate: 'Oct 17, 2023' }
]

const INITIAL_INTERVIEWS: Interview[] = [
  {
    id: 'int_1', candidateId: 'c_1', jobId: 'job_1', type: 'Video', duration: '45m',
    date: 'Today', time: '10:00 AM', interviewer: 'Alex Manager', status: 'scheduled', scorecardStatus: 'pending', joinLink: '#'
  },
  {
    id: 'int_2', candidateId: 'c_2', jobId: 'job_2', type: 'Phone', duration: '30m',
    date: 'Tomorrow', time: '1:30 PM', interviewer: 'Sarah Recruiter', status: 'scheduled', scorecardStatus: 'pending'
  },
  {
    id: 'int_3', candidateId: 'c_3', jobId: 'job_1', type: 'Video', duration: '60m',
    date: 'Yesterday', time: '2:00 PM', interviewer: 'Alex Manager', status: 'completed', scorecardStatus: 'submitted', rating: 'Strong Yes'
  }
]

export const useDomainStore = create<DomainState>()(
  persist(
    (set) => ({
      settings: INITIAL_SETTINGS,
      jobs: INITIAL_JOBS,
      candidates: INITIAL_CANDIDATES,
      interviews: INITIAL_INTERVIEWS,
      messages: INITIAL_MESSAGES,
      offers: INITIAL_OFFERS,

      updateSettings: (updates) => set((state) => ({ settings: { ...state.settings, ...updates } })),

      addJob: (job) => set((state) => ({ jobs: [...state.jobs, job] })),
      updateJob: (id, updates) => set((state) => ({
        jobs: state.jobs.map(j => j.id === id ? { ...j, ...updates } : j)
      })),

      addCandidate: (candidate) => set((state) => ({ candidates: [...state.candidates, candidate] })),
      updateCandidate: (id, updates) => set((state) => ({
        candidates: state.candidates.map(c => c.id === id ? { ...c, ...updates } : c)
      })),
      moveCandidateStage: (candidateId, newStage) => set((state) => ({
        candidates: state.candidates.map(c => 
          c.id === candidateId ? { 
            ...c, 
            stage: newStage, 
            daysInStage: 0,
            timeline: [...c.timeline, { event: `Moved to ${newStage}`, date: 'Just now', type: 'stage' }]
          } : c
        )
      })),
      addCandidateNote: (candidateId, note) => set((state) => ({
        candidates: state.candidates.map(c => 
          c.id === candidateId ? { ...c, notes: [...c.notes, note] } : c
        )
      })),

      addInterview: (interview) => set((state) => ({ interviews: [...state.interviews, interview] })),
      updateInterview: (id, updates) => set((state) => ({
        interviews: state.interviews.map(i => i.id === id ? { ...i, ...updates } : i)
      })),

      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),

      addOffer: (offer) => set((state) => ({ offers: [...state.offers, offer] })),
      updateOffer: (id, updates) => set((state) => ({
        offers: state.offers.map(o => o.id === id ? { ...o, ...updates } : o)
      })),

      resetStore: () => set({
        jobs: [], candidates: [], interviews: [], messages: [], offers: [], settings: INITIAL_SETTINGS
      })
    }),
    {
      name: 'talentiq-domain-storage',
    }
  )
)
