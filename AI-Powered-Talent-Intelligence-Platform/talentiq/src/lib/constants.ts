import type { Stage } from '@/types/domain.types'

export const STAGES: Stage[] = [
  { name: 'Applied', color: '#94A3B8' },
  { name: 'Screening', color: '#2563EB' },
  { name: 'Interview', color: '#F59E0B' },
  { name: 'Assessment', color: '#8B5CF6' },
  { name: 'Offer', color: '#10B981' },
  { name: 'Hired', color: '#059669' },
]

export const PLAN_LIMITS = {
  starter: {
    jobs: 3,
    seats: 2,
    aiScores: 100,
    features: ['AI scoring', 'Kanban pipeline', 'Basic analytics'],
  },
  growth: {
    jobs: 25,
    seats: 10,
    aiScores: 2000,
    features: [
      'AI scoring',
      'Kanban pipeline',
      'Advanced analytics',
      'Calendar scheduling',
      'Offer management',
      'Custom stages',
    ],
  },
  enterprise: {
    jobs: -1, // unlimited
    seats: -1,
    aiScores: -1,
    features: [
      'AI scoring',
      'Kanban pipeline',
      'Advanced analytics',
      'Calendar scheduling',
      'Offer management',
      'Custom stages',
      'SSO',
      'API access',
      'Dedicated support',
      'Custom integrations',
    ],
  },
} as const

export const SOURCE_OPTIONS: string[] = [
  'LinkedIn',
  'Indeed',
  'Referral',
  'Company Website',
  'AngelList',
  'Greenhouse Import',
  'Manual',
]

export const INDUSTRY_OPTIONS: string[] = [
  'Technology',
  'Healthcare',
  'Finance & Banking',
  'Education',
  'Retail & E-commerce',
  'Manufacturing',
  'Media & Entertainment',
  'Real Estate',
  'Transportation & Logistics',
  'Energy & Utilities',
  'Government & Public Sector',
  'Non-profit',
  'Consulting & Professional Services',
  'Legal',
  'Food & Beverage',
  'Aerospace & Defense',
  'Biotechnology',
]

export const COMPANY_SIZE_OPTIONS = [
  { value: '1-10', label: '1–10 employees' },
  { value: '11-50', label: '11–50 employees' },
  { value: '51-200', label: '51–200 employees' },
  { value: '201-500', label: '201–500 employees' },
  { value: '501-1000', label: '501–1,000 employees' },
  { value: '1001-5000', label: '1,001–5,000 employees' },
  { value: '5001-10000', label: '5,001–10,000 employees' },
  { value: '10000+', label: '10,000+ employees' },
]

export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'internship', label: 'Internship' },
]

export const REMOTE_TYPE_OPTIONS = [
  { value: 'on-site', label: 'On-site' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
]

export const EDUCATION_OPTIONS = [
  { value: 'none', label: 'No requirement' },
  { value: 'high-school', label: 'High school' },
  { value: 'associate', label: 'Associate degree' },
  { value: 'bachelor', label: "Bachelor's degree" },
  { value: 'master', label: "Master's degree" },
  { value: 'phd', label: 'PhD' },
]

export const SENIORITY_OPTIONS = [
  { value: 'internship', label: 'Internship' },
  { value: 'entry', label: 'Entry level' },
  { value: 'mid', label: 'Mid level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
  { value: 'manager', label: 'Manager' },
  { value: 'director', label: 'Director' },
  { value: 'vp', label: 'VP' },
  { value: 'executive', label: 'Executive' },
]
