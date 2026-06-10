"use client"

import * as React from "react"
import { Download, Users, Clock, CheckCircle2, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { ChartCard } from "@/components/analytics/ChartCard"
import { PipelineFunnelChart } from "@/components/analytics/PipelineFunnelChart"
import { TimeToHireChart } from "@/components/analytics/TimeToHireChart"
import { SourceQualityChart } from "@/components/analytics/SourceQualityChart"
import { SourceVolumeDonut } from "@/components/analytics/SourceVolumeDonut"
import { TeamPerformanceTable } from "@/components/analytics/TeamPerformanceTable"
import { JobPerformanceTable } from "@/components/analytics/JobPerformanceTable"

function StatCard({ title, value, icon, trend, positive }: { title: string, value: string, icon: React.ReactNode, trend: string, positive: boolean }) {
  return (
    <div className="flex flex-col rounded-[var(--radius-lg)] border border-neutral-200 bg-white p-[24px] shadow-sm">
      <div className="flex items-center justify-between mb-[16px]">
        <span className="font-body text-[14px] font-medium text-neutral-500">{title}</span>
        <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-primary-50 text-primary-600">
          {icon}
        </div>
      </div>
      <span className="font-display text-[28px] font-bold text-neutral-900">{value}</span>
      <div className="mt-[8px] flex items-center gap-[4px] font-body text-[12px]">
        <span className={positive ? "text-[#10B981] font-semibold" : "text-[#EF4444] font-semibold"}>
          {trend}
        </span>
        <span className="text-neutral-400">vs last period</span>
      </div>
    </div>
  )
}

function CompactTable() {
  const data = [
    { stage: "Applied", count: 1245, days: "-", conv: "100%" },
    { stage: "Screening", count: 850, days: "3.2", conv: "68%" },
    { stage: "Interview", count: 320, days: "5.5", conv: "37%" },
    { stage: "Assessment", count: 145, days: "4.1", conv: "45%" },
    { stage: "Offer", count: 42, days: "2.0", conv: "28%" },
  ]
  return (
    <div className="flex flex-col rounded-[var(--radius-lg)] border border-neutral-200 bg-white shadow-sm overflow-hidden h-full">
      <table className="w-full text-left font-body">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            <th className="py-[12px] px-[16px] text-[12px] font-medium text-neutral-500">Stage</th>
            <th className="py-[12px] px-[16px] text-[12px] font-medium text-neutral-500">Count</th>
            <th className="py-[12px] px-[16px] text-[12px] font-medium text-neutral-500">Avg Days</th>
            <th className="py-[12px] px-[16px] text-[12px] font-medium text-neutral-500">Conv %</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
              <td className="py-[12px] px-[16px] text-[13px] font-medium text-neutral-900">{row.stage}</td>
              <td className="py-[12px] px-[16px] text-[13px] text-neutral-600">{row.count}</td>
              <td className="py-[12px] px-[16px] text-[13px] text-neutral-600">{row.days}</td>
              <td className="py-[12px] px-[16px] text-[13px] font-semibold text-neutral-900">{row.conv}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col p-[32px] w-full max-w-[1600px] mx-auto animate-fade-in">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-[32px]">
        <h1 className="font-display text-[28px] font-bold text-neutral-900">Analytics</h1>
        <div className="flex items-center gap-[12px]">
          <DateRangePicker />
          <Button variant="ghost" className="h-[36px] bg-white text-neutral-600 border border-neutral-200">
            Export CSV <Download size={14} className="ml-2" />
          </Button>
        </div>
      </div>

      {/* SEC 1: KEY METRICS */}
      <div className="grid grid-cols-12 gap-[24px] mb-[24px]">
        <div className="col-span-3">
          <StatCard title="Total Applications" value="1,245" icon={<Users size={16} />} trend="+12.5%" positive={true} />
        </div>
        <div className="col-span-3">
          <StatCard title="Time to Hire" value="18 Days" icon={<Clock size={16} />} trend="-2.4 days" positive={true} />
        </div>
        <div className="col-span-3">
          <StatCard title="Offer Acceptance" value="82%" icon={<CheckCircle2 size={16} />} trend="-4.1%" positive={false} />
        </div>
        <div className="col-span-3">
          <StatCard title="Pipeline Conversion" value="3.4%" icon={<TrendingUp size={16} />} trend="+0.8%" positive={true} />
        </div>
      </div>

      {/* SEC 2: PIPELINE FUNNEL */}
      <div className="grid grid-cols-12 gap-[24px] mb-[24px]">
        <div className="col-span-8">
          <ChartCard title="Conversion Funnel" period="Last 30 Days">
            <PipelineFunnelChart />
          </ChartCard>
        </div>
        <div className="col-span-4">
          <CompactTable />
        </div>
      </div>

      {/* SEC 3: TIME TO HIRE TREND */}
      <div className="grid grid-cols-12 gap-[24px] mb-[24px]">
        <div className="col-span-12">
          <ChartCard title="Time to Hire Trend" period="Quarter over Quarter">
            <TimeToHireChart />
          </ChartCard>
        </div>
      </div>

      {/* SEC 4: SOURCE QUALITY */}
      <div className="grid grid-cols-12 gap-[24px] mb-[24px]">
        <div className="col-span-6">
          <ChartCard title="Conversion by Source" period="Last 30 Days">
            <SourceQualityChart />
          </ChartCard>
        </div>
        <div className="col-span-6">
          <ChartCard title="Application Volume by Source" period="Last 30 Days">
            <SourceVolumeDonut />
          </ChartCard>
        </div>
      </div>

      {/* SEC 5: TEAM PERFORMANCE */}
      <div className="grid grid-cols-12 gap-[24px] mb-[24px]">
        <div className="col-span-12">
          <ChartCard title="Recruiter Performance" period="Last 30 Days">
            <TeamPerformanceTable />
          </ChartCard>
        </div>
      </div>

      {/* SEC 6: JOB PERFORMANCE */}
      <div className="grid grid-cols-12 gap-[24px] mb-[32px]">
        <div className="col-span-12">
          <ChartCard title="Job Performance" period="Active Jobs Only">
            <JobPerformanceTable />
          </ChartCard>
        </div>
      </div>

    </div>
  )
}
