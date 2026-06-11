import dynamic from 'next/dynamic'
import AnalyticsHeader from '@/components/analytics/AnalyticsHeader'
import MetricsRow from '@/components/analytics/MetricsRow'
import ChartCard from '@/components/analytics/ChartCard'
import TeamPerformanceTable from '@/components/analytics/TeamPerformanceTable'
import JobPerformanceTable from '@/components/analytics/JobPerformanceTable'

const PipelineFunnelChart = dynamic(() => import('@/components/analytics/PipelineFunnelChart'), { ssr: false })
const TimeToHireChart = dynamic(() => import('@/components/analytics/TimeToHireChart'), { ssr: false })
const SourceVolumeDonut = dynamic(() => import('@/components/analytics/SourceVolumeDonut'), { ssr: false })
const SourceQualityChart = dynamic(() => import('@/components/analytics/SourceQualityChart'), { ssr: false })

// Mock Data
const funnelData = [
  { stage: 'Screening', value: 347, conversion: 100 },
  { stage: 'Phone Screen', value: 189, conversion: 54 },
  { stage: 'Interview', value: 92, conversion: 48 },
  { stage: 'Assessment', value: 44, conversion: 47 },
  { stage: 'Offer', value: 18, conversion: 40 },
  { stage: 'Hired', value: 12, conversion: 66 },
]

const timeToHireData = [
  { week: 'W1', current: 32, previous: 40 },
  { week: 'W2', current: 30, previous: 38 },
  { week: 'W3', current: 28, previous: 35 },
  { week: 'W4', current: 29, previous: 36 },
  { week: 'W5', current: 25, previous: 34 },
  { week: 'W6', current: 26, previous: 33 },
  { week: 'W7', current: 24, previous: 32 },
  { week: 'W8', current: 22, previous: 30 },
  { week: 'W9', current: 23, previous: 29 },
  { week: 'W10', current: 20, previous: 28 },
  { week: 'W11', current: 19, previous: 26 },
  { week: 'W12', current: 18, previous: 25 },
]

const sourceVolumeData = [
  { name: 'LinkedIn', value: 42 },
  { name: 'Indeed', value: 28 },
  { name: 'Referral', value: 15 },
  { name: 'Direct', value: 10 },
  { name: 'Other', value: 5 },
]

const sourceQualityData = [
  { source: 'Referral', quality: 78 },
  { source: 'Direct', quality: 52 },
  { source: 'LinkedIn', quality: 45 },
  { source: 'Other', quality: 31 },
  { source: 'Indeed', quality: 28 },
]

const teamData = [
  { id: '1', name: 'Sarah Recruiter', reviewed: 450, avgResponseHours: 12, interviews: 85, offers: 15, hireRate: 68 },
  { id: '2', name: 'Alex Manager', reviewed: 320, avgResponseHours: 24, interviews: 45, offers: 12, hireRate: 75 },
  { id: '3', name: 'Jordan Lee', reviewed: 510, avgResponseHours: 8, interviews: 110, offers: 22, hireRate: 65 },
]

const jobData = [
  { id: '1', title: 'Senior Software Engineer', applications: 245, avgScore: 82, convRate: 4.5, daysOpen: 45, status: 'active' as const },
  { id: '2', title: 'Product Manager', applications: 180, avgScore: 78, convRate: 3.2, daysOpen: 30, status: 'active' as const },
  { id: '3', title: 'UX Designer', applications: 320, avgScore: 85, convRate: 2.8, daysOpen: 60, status: 'paused' as const },
  { id: '4', title: 'Data Scientist', applications: 150, avgScore: 88, convRate: 6.0, daysOpen: 15, status: 'closed' as const },
]

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col w-full max-w-[1400px] mx-auto">
      <AnalyticsHeader />
      
      <div className="flex flex-col gap-[24px]">
        <MetricsRow />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
          <ChartCard title="Pipeline Funnel" period="Last 30 Days">
            <PipelineFunnelChart data={funnelData} />
          </ChartCard>
          
          <ChartCard title="Time to Hire Trend" period="Last 12 Weeks">
            <TimeToHireChart data={timeToHireData} />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
          <ChartCard title="Source Volume" period="Last 30 Days">
            <SourceVolumeDonut data={sourceVolumeData} />
          </ChartCard>
          
          <ChartCard title="Source Quality (Conversion Rate)" period="Last 30 Days">
            <SourceQualityChart data={sourceQualityData} />
          </ChartCard>
        </div>

        <ChartCard title="Team Performance">
          <TeamPerformanceTable data={teamData} />
        </ChartCard>

        <ChartCard title="Job Performance">
          <JobPerformanceTable data={jobData} />
        </ChartCard>
      </div>
    </div>
  )
}
