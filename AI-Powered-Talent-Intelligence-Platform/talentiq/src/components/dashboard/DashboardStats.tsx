'use client'

import StatCard from './StatCard'
import { Briefcase, Users, Sparkles, FileText } from 'lucide-react'

export function DashboardStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-[12px] md:gap-[20px]">
      <StatCard
        icon={Briefcase}
        iconBg="#EFF6FF"
        iconColor="#3B82F6"
        gradientFrom="#EFF6FF"
        gradientTo="#DBEAFE"
        value={12}
        label="Open Roles"
        delta="+3"
        deltaPositive={true}
        period="vs last month"
      />
      
      <StatCard
        icon={Users}
        iconBg="#F0FDF4"
        iconColor="#10B981"
        gradientFrom="#F0FDF4"
        gradientTo="#DCFCE7"
        value={342}
        label="Applications"
        delta="+12%"
        deltaPositive={true}
        period="vs last week"
        sparklineData={[120, 140, 180, 150, 260, 342]}
      />

      <StatCard
        icon={Sparkles}
        iconBg="#F5F3FF"
        iconColor="#8B5CF6"
        gradientFrom="#F5F3FF"
        gradientTo="#EDE9FE"
        value="84/100"
        label="Avg AI Score"
        delta="+5"
        deltaPositive={true}
        period="vs last month"
      />

      <StatCard
        icon={FileText}
        iconBg="#FFFBEB"
        iconColor="#F59E0B"
        gradientFrom="#FFFBEB"
        gradientTo="#FEF3C7"
        value={4}
        label="Offers Pending"
        delta="2 expiring in 48h"
        deltaPositive={false}
      />
    </div>
  )
}
