export interface FunnelStage {
  stage: string
  count: number
  conversionRate: number
  avgDays: number
}

export interface TimeToHireDataPoint {
  week: string
  current: number
  previous: number
}

export interface SourceData {
  source: string
  volume: number
  conversionRate: number
  quality: 'high' | 'medium' | 'low'
}

export interface TeamMemberMetrics {
  id: string
  name: string
  avatar: string
  reviewed: number
  avgResponseHours: number
  interviews: number
  offers: number
  hireRate: number
}

export interface JobMetrics {
  id: string
  title: string
  applications: number
  avgScore: number
  conversionRate: number
  daysOpen: number
  status: string
}

export interface AnalyticsData {
  funnel: FunnelStage[]
  timeToHire: TimeToHireDataPoint[]
  sources: SourceData[]
  teamMetrics: TeamMemberMetrics[]
  jobMetrics: JobMetrics[]
  keyMetrics: {
    totalApplications: number
    avgTimeToHire: number
    offerAcceptanceRate: number
    pipelineConversionRate: number
  }
}
