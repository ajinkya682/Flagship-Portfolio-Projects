'use client'

import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import ChartCard from '@/components/analytics/ChartCard'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'

import PipelineFunnelChart from '@/components/analytics/PipelineFunnelChart'
import SourceVolumeDonut from '@/components/analytics/SourceVolumeDonut'

const MOCK_VOLUME_DATA = [
  { date: 'Oct 1', value: 12 },
  { date: 'Oct 2', value: 18 },
  { date: 'Oct 3', value: 25 },
  { date: 'Oct 4', value: 22 },
  { date: 'Oct 5', value: 30 },
  { date: 'Oct 6', value: 45 },
  { date: 'Oct 7', value: 38 },
]

const MOCK_SCORE_DATA = [
  { range: '0-50', count: 5 },
  { range: '51-60', count: 12 },
  { range: '61-70', count: 25 },
  { range: '71-80', count: 45 },
  { range: '81-90', count: 32 },
  { range: '91-100', count: 8 },
]

const MOCK_FUNNEL_DATA = [
  { stage: 'Applied', value: 127, conversion: 100 },
  { stage: 'Screening', value: 45, conversion: 35 },
  { stage: 'Interview', value: 18, conversion: 40 },
  { stage: 'Offer', value: 4, conversion: 22 },
  { stage: 'Hired', value: 1, conversion: 25 },
]

const MOCK_SOURCE_DATA = [
  { name: 'LinkedIn', value: 65 },
  { name: 'Indeed', value: 35 },
  { name: 'Referral', value: 20 },
  { name: 'Direct', value: 7 },
]

export default function JobAnalyticsPage() {
  const params = useParams()

  return (
    <div className="flex flex-col h-full bg-neutral-50/50">
      
      <div className="flex items-center gap-[12px] mb-[24px]">
        <Link href={`/jobs/${params?.id}`} className="text-neutral-500 hover:text-neutral-900 transition-colors p-[4px] rounded-md hover:bg-neutral-100">
          <ArrowLeft size={18} />
        </Link>
        <span className="font-body text-[14px] text-neutral-500">Back to Job Details</span>
      </div>

      <div className="flex flex-col gap-[8px] mb-[32px]">
        <h1 className="font-display text-[28px] font-bold text-neutral-900 tracking-tight">Job Analytics</h1>
        <p className="font-body text-[14px] text-neutral-500">Track performance metrics for this specific job posting.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px] mb-[24px]">
        <ChartCard title="Application Volume" period="Last 7 Days">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_VOLUME_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #F3F4F6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#111827', fontSize: '14px', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Score Distribution" period="All Time">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_SCORE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip 
                  cursor={{ fill: '#F9FAFB' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #F3F4F6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                  {MOCK_SCORE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.range === '81-90' || entry.range === '91-100' ? '#10B981' : entry.range === '71-80' ? '#F59E0B' : '#3B82F6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
        <ChartCard title="Pipeline Funnel" period="All Time">
          <PipelineFunnelChart data={MOCK_FUNNEL_DATA} />
        </ChartCard>

        <ChartCard title="Source Breakdown" period="All Time">
          <SourceVolumeDonut data={MOCK_SOURCE_DATA} />
        </ChartCard>
      </div>

    </div>
  )
}
