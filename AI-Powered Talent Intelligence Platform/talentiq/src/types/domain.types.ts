// ── Company ─────────────────────────────────────────────────────

export interface Company {
  id: string
  name: string
  logo: string | undefined
  industry: string
  size: string
  timezone: string
  currency: string
  careerPageUrl: string
  subdomain: string
}

// ── User ────────────────────────────────────────────────────────

export interface User {
  id: string
  name: string
  email: string
  avatar: string | undefined
  role: 'admin' | 'recruiter' | 'hiring-manager' | 'viewer'
  company: Company
  plan: 'starter' | 'growth' | 'enterprise'
  createdAt: string
  lastActiveAt: string
}

// ── Scoring weights ──────────────────────────────────────────────

export interface ScoringWeights {
  skills: number
  experience: number
  education: number
}

// ── Job ─────────────────────────────────────────────────────────

export interface Job {
  id: string
  title: string
  department: string
  location: string
  employmentType: string
  remoteType: string
  salaryMin: number | undefined
  salaryMax: number | undefined
  currency: string
  description: string
  requirements: string[]
  skills: string[]
  niceToHaveSkills: string[]
  status: 'draft' | 'active' | 'paused' | 'closed'
  applicantCount: number
  publishedAt: string | undefined
  closedAt: string | undefined
  createdAt: string
  scoringWeights: ScoringWeights
}

// ── Candidate ───────────────────────────────────────────────────

export interface Candidate {
  id: string
  name: string
  email: string
  phone: string | undefined
  linkedinUrl: string | undefined
  resumeUrl: string | undefined
  avatar: string | undefined
  extractedSkills: string[]
  extractedCompanies: string[]
  extractedEducation: string[]
}

// ── Application ─────────────────────────────────────────────────

export interface Application {
  id: string
  jobId: string
  job: Job
  candidate: Candidate
  stage: string
  aiScore: number | undefined
  appliedAt: string
  source: string
  recruiterNotes: string[]
  tags: string[]
  assignedTo: User | undefined
  daysInStage: number
}

// ── AI Score ─────────────────────────────────────────────────────

export interface AIScore {
  applicationId: string
  score: number
  skillsMatch: number
  experienceMatch: number
  educationMatch: number
  keywordsMatch: number
  strengths: string[]
  gaps: string[]
  reasons: Array<{ text: string; positive: boolean }>
  scoredAt: string
}

// ── Scorecard ────────────────────────────────────────────────────

export interface ScorecardCriterion {
  name: string
  rating: 1 | 2 | 3 | 4 | 5
  comment: string
}

export interface Scorecard {
  id: string
  interviewId: string
  interviewer: User
  overallRating: 'strong-yes' | 'yes' | 'no' | 'strong-no'
  criteria: ScorecardCriterion[]
  notes: string
  submittedAt: string
}

// ── Interview ────────────────────────────────────────────────────

export interface Interview {
  id: string
  applicationId: string
  candidate: Candidate
  job: Job
  scheduledAt: string
  duration: number
  locationType: 'video' | 'phone' | 'onsite'
  meetingLink: string | undefined
  interviewers: User[]
  status: 'scheduled' | 'completed' | 'cancelled'
  scorecards: Scorecard[]
}

// ── Offer ────────────────────────────────────────────────────────

export interface Offer {
  id: string
  applicationId: string
  candidate: Candidate
  job: Job
  salary: number
  currency: string
  startDate: string
  expirationDate: string
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'expired'
  letterContent: string
  sentAt: string | undefined
}

// ── Notification ─────────────────────────────────────────────────

export interface Notification {
  id: string
  userId: string
  type: 'application' | 'stage-move' | 'ai-score' | 'interview' | 'note' | 'offer'
  message: string
  read: boolean
  createdAt: string
  link: string | undefined
}

// ── Stage ────────────────────────────────────────────────────────

export interface Stage {
  name: string
  color: string
}

// ── Pipeline move ────────────────────────────────────────────────

export interface PipelineMove {
  applicationId: string
  fromStage: string
  toStage: string
  movedBy: User
  movedAt: string
}
