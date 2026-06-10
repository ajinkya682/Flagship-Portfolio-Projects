import * as React from "react"
import { StatCard } from "./StatCard"

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[20px]">
      <div className="h-full">
        <StatCard 
          title="Open Roles"
          value={12}
          delta={24}
          deltaPeriod="vs last month"
          iconType="briefcase"
          colorTheme="primary"
          sparklineData={[4, 5, 8, 7, 10, 12]}
        />
      </div>
      
      <div className="h-full">
        <StatCard 
          title="Applications"
          value={342}
          delta={12}
          deltaPeriod="vs last week"
          iconType="userPlus"
          colorTheme="accent"
          sparklineData={[120, 140, 180, 150, 260, 342]}
        />
      </div>

      <div className="h-full">
        <StatCard 
          title="Avg AI Score"
          value={84}
          valueSuffix="/100"
          delta={5}
          deltaPeriod="vs last month"
          iconType="sparkles"
          colorTheme="primary"
        />
      </div>

      <div className="h-full">
        <StatCard 
          title="Offers Pending"
          value={4}
          delta={-1}
          deltaPeriod="vs last week"
          iconType="fileText"
          colorTheme="warning"
          subText="2 expiring in 48h"
        />
      </div>
    </div>
  )
}
