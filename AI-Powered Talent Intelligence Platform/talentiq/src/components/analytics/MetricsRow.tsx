'use client'

import StatCard from '@/components/dashboard/StatCard'
import { Users, Clock, ThumbsUp, Filter } from 'lucide-react'

export default function MetricsRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
      <StatCard
        icon={Users}
        iconBg="#EFF6FF"
        iconColor="#3B82F6"
        value={1248}
        label="Total Applications"
        delta="+14%"
        deltaPositive={true}
        period="vs last month"
      />
      <StatCard
        icon={Clock}
        iconBg="#F0FDF4"
        iconColor="#10B981"
        value="24.5"
        label="Avg Time to Hire (Days)"
        delta="-2.1"
        deltaPositive={true}
        period="vs last month"
      />
      <StatCard
        icon={ThumbsUp}
        iconBg="#F5F3FF"
        iconColor="#8B5CF6"
        value="82%"
        label="Offer Acceptance Rate"
        delta="+4%"
        deltaPositive={true}
        period="vs last month"
      />
      <StatCard
        icon={Filter}
        iconBg="#FFFBEB"
        iconColor="#F59E0B"
        value="12.4%"
        label="Pipeline Conversion"
        delta="-1.2%"
        deltaPositive={false}
        period="vs last month"
      />
    </div>
  )
}
