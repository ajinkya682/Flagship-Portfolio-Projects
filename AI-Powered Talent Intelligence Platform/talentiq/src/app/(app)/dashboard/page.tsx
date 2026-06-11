"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WelcomeGreeting } from "@/components/dashboard/WelcomeGreeting"
import { DashboardStats } from "@/components/dashboard/DashboardStats"
import { KanbanOverview } from "@/components/dashboard/KanbanOverview"
import { ActivityFeed } from "@/components/dashboard/ActivityFeed"
import { AIInsightsPanel } from "@/components/dashboard/AIInsightsPanel"
import { ApplicationTable } from "@/components/dashboard/ApplicationTable"

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px] p-[20px_16px] md:p-[28px_32px]">
      
      {/* 1. PAGE HEADER ROW */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-[16px] mb-[32px]">
        <WelcomeGreeting name="Sarah" />
        <Button variant="primary" iconLeft={<Plus size={16} className="hidden md:block" />} className="w-full md:w-auto">
          Create Job
        </Button>
      </div>

      {/* 12-COLUMN GRID SYSTEM */}
      <div className="grid grid-cols-12 gap-[20px]">
        
        {/* 2. STATS ROW */}
        <div className="col-span-12">
          <DashboardStats />
        </div>

        {/* 3. KANBAN OVERVIEW + ACTIVITY FEED */}
        <div className="col-span-12 lg:col-span-8">
          <KanbanOverview />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <ActivityFeed />
        </div>

        {/* 4. AI INSIGHTS PANEL */}
        <div className="col-span-12 mt-4">
          <AIInsightsPanel />
        </div>

        {/* 5. RECENT APPLICATIONS TABLE */}
        <div className="col-span-12 mt-4">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-display text-[18px] font-semibold text-neutral-900">
              Recent Applications
            </h4>
            <button className="font-body text-[13px] font-medium text-neutral-500 hover:text-neutral-900">
              View All
            </button>
          </div>
          <ApplicationTable />
        </div>

      </div>
    </div>
  )
}
