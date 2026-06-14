// ─── Mock Analytics Data ─────────────────────────────────────────────

export interface HiringFunnelStage {
  stage: string
  count: number
  dropoffPct: number
  avgDays: number
}

export interface SourceQuality {
  source: string
  applicants: number
  hired: number
  hireRate: number
  avgScore: number
  color: string
}

export interface TimeToHireTrend {
  month: string
  avgDays: number
  benchmark: number
}

export interface TeamPerformance {
  name: string
  avatar: string
  interviews: number
  avgRating: number
  avgTimeToAction: string
  hires: number
}

export interface DiversityMetric {
  category: string
  breakdown: { label: string; pct: number; color: string }[]
}

export interface OfferMetrics {
  totalOffers: number
  acceptanceRate: number
  avgTimeToAccept: number
  avgSalary: number
  trend: { month: string; offered: number; accepted: number }[]
}

// ── Hiring Funnel ──────────────────────────────────────────────────
export const HIRING_FUNNEL: HiringFunnelStage[] = [
  { stage: 'Applied',    count: 500, dropoffPct: 0,   avgDays: 0.5  },
  { stage: 'Screening',  count: 287, dropoffPct: 42,  avgDays: 2.3  },
  { stage: 'Interview',  count: 164, dropoffPct: 43,  avgDays: 5.1  },
  { stage: 'Assessment', count: 89,  dropoffPct: 46,  avgDays: 3.4  },
  { stage: 'Offer',      count: 52,  dropoffPct: 42,  avgDays: 1.8  },
  { stage: 'Hired',      count: 38,  dropoffPct: 27,  avgDays: 4.2  },
]

// ── Source Quality ─────────────────────────────────────────────────
export const SOURCE_QUALITY: SourceQuality[] = [
  { source: 'LinkedIn',        applicants: 198, hired: 16, hireRate: 8.1,  avgScore: 78, color: '#0077B5' },
  { source: 'Referral',        applicants: 87,  hired: 12, hireRate: 13.8, avgScore: 86, color: '#10B981' },
  { source: 'Indeed',          applicants: 112, hired: 6,  hireRate: 5.4,  avgScore: 71, color: '#6366F1' },
  { source: 'Company Website', applicants: 53,  hired: 2,  hireRate: 3.8,  avgScore: 74, color: '#F59E0B' },
  { source: 'AngelList',       applicants: 31,  hired: 1,  hireRate: 3.2,  avgScore: 79, color: '#EC4899' },
  { source: 'GitHub',          applicants: 19,  hired: 1,  hireRate: 5.3,  avgScore: 83, color: '#374151' },
]

// ── Time to Hire Trend ─────────────────────────────────────────────
export const TIME_TO_HIRE_TREND: TimeToHireTrend[] = [
  { month: 'Jan', avgDays: 34, benchmark: 42 },
  { month: 'Feb', avgDays: 31, benchmark: 42 },
  { month: 'Mar', avgDays: 29, benchmark: 41 },
  { month: 'Apr', avgDays: 27, benchmark: 41 },
  { month: 'May', avgDays: 24, benchmark: 40 },
  { month: 'Jun', avgDays: 22, benchmark: 40 },
  { month: 'Jul', avgDays: 21, benchmark: 39 },
  { month: 'Aug', avgDays: 19, benchmark: 39 },
  { month: 'Sep', avgDays: 18, benchmark: 38 },
  { month: 'Oct', avgDays: 17, benchmark: 38 },
  { month: 'Nov', avgDays: 18, benchmark: 37 },
  { month: 'Dec', avgDays: 18, benchmark: 37 },
]

// ── Team Performance ───────────────────────────────────────────────
export const TEAM_PERFORMANCE: TeamPerformance[] = [
  { name: 'Sarah Mitchell', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', interviews: 48, avgRating: 4.7, avgTimeToAction: '1.2d', hires: 14 },
  { name: 'Alex Chen',      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',   interviews: 62, avgRating: 4.9, avgTimeToAction: '0.8d', hires: 18 },
  { name: 'Jordan Lee',     avatar: 'https://randomuser.me/api/portraits/men/55.jpg',   interviews: 35, avgRating: 4.3, avgTimeToAction: '2.1d', hires: 8  },
  { name: 'Priya Sharma',   avatar: 'https://randomuser.me/api/portraits/women/21.jpg', interviews: 19, avgRating: 4.5, avgTimeToAction: '1.8d', hires: 5  },
  { name: 'Mike Torres',    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',   interviews: 41, avgRating: 4.6, avgTimeToAction: '1.5d', hires: 10 },
  { name: 'Nadia Okonkwo',  avatar: 'https://randomuser.me/api/portraits/women/37.jpg', interviews: 27, avgRating: 4.8, avgTimeToAction: '0.9d', hires: 7  },
]

// ── Offer Metrics ─────────────────────────────────────────────────
export const OFFER_METRICS: OfferMetrics = {
  totalOffers: 52,
  acceptanceRate: 73,
  avgTimeToAccept: 3.2,
  avgSalary: 162000,
  trend: [
    { month: 'Jul', offered: 6, accepted: 4 },
    { month: 'Aug', offered: 8, accepted: 6 },
    { month: 'Sep', offered: 7, accepted: 5 },
    { month: 'Oct', offered: 9, accepted: 7 },
    { month: 'Nov', offered: 11, accepted: 8 },
    { month: 'Dec', offered: 11, accepted: 8 },
  ]
}

// ── Diversity Metrics ─────────────────────────────────────────────
export const DIVERSITY_METRICS: DiversityMetric[] = [
  {
    category: 'Gender',
    breakdown: [
      { label: 'Male', pct: 54, color: '#3B82F6' },
      { label: 'Female', pct: 41, color: '#EC4899' },
      { label: 'Non-binary', pct: 5, color: '#8B5CF6' },
    ],
  },
  {
    category: 'Ethnicity',
    breakdown: [
      { label: 'White', pct: 38, color: '#94A3B8' },
      { label: 'Asian', pct: 28, color: '#3B82F6' },
      { label: 'Hispanic/Latino', pct: 16, color: '#F59E0B' },
      { label: 'Black/African American', pct: 12, color: '#10B981' },
      { label: 'Other', pct: 6, color: '#6366F1' },
    ],
  },
]

// ── AI Score Distribution ─────────────────────────────────────────
export const SCORE_DISTRIBUTION = [
  { range: '90-100', count: 48, label: 'Excellent' },
  { range: '80-89',  count: 112, label: 'Strong' },
  { range: '70-79',  count: 143, label: 'Good' },
  { range: '60-69',  count: 127, label: 'Average' },
  { range: '50-59',  count: 70,  label: 'Below Average' },
]

// ── Application Volume Trend ──────────────────────────────────────
export const APPLICATION_TREND = [
  { week: 'W1', applications: 42, aiScored: 42 },
  { week: 'W2', applications: 38, aiScored: 38 },
  { week: 'W3', applications: 56, aiScored: 56 },
  { week: 'W4', applications: 49, aiScored: 49 },
  { week: 'W5', applications: 73, aiScored: 73 },
  { week: 'W6', applications: 61, aiScored: 61 },
  { week: 'W7', applications: 89, aiScored: 89 },
  { week: 'W8', applications: 92, aiScored: 92 },
]
