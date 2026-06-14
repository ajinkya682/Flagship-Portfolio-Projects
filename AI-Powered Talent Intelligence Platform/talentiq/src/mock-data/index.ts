// ─── Mock Data Index — central export point ───────────────────────

export { MOCK_COMPANIES, DEFAULT_COMPANY } from './companies'
export type { MockCompany } from './companies'

export { DEMO_USERS, DEFAULT_USER, findDemoUser } from './users'
export type { DemoUser } from './users'

export { MOCK_JOBS } from './jobs'
export type { MockJob } from './jobs'

export { MOCK_CANDIDATES } from './candidates'
export type { MockCandidate } from './candidates'

export { MOCK_INTERVIEWS } from './interviews'
export type { MockInterview } from './interviews'

export { MOCK_OFFERS } from './offers'
export type { MockOffer } from './offers'

export { MOCK_MESSAGES } from './messages'
export type { MockMessage } from './messages'

export {
  HIRING_FUNNEL,
  SOURCE_QUALITY,
  TIME_TO_HIRE_TREND,
  TEAM_PERFORMANCE,
  OFFER_METRICS,
  DIVERSITY_METRICS,
  SCORE_DISTRIBUTION,
  APPLICATION_TREND,
} from './analytics'
export type {
  HiringFunnelStage,
  SourceQuality,
  TimeToHireTrend,
  TeamPerformance,
  OfferMetrics,
  DiversityMetric,
} from './analytics'
