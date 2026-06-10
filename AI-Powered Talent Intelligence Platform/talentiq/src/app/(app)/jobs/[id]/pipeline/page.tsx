"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FilterBar } from "@/components/kanban/FilterBar"
import { KanbanBoard } from "@/components/kanban/KanbanBoard"

export default function PipelinePage() {
  return (
    <div className="flex flex-col h-[calc(100vh-60px)] w-full bg-neutral-100 overflow-hidden">
      
      {/* HEADER AREA */}
      <div className="flex shrink-0 items-center justify-between bg-white px-[32px] py-[24px] border-b border-neutral-200">
        
        {/* Left */}
        <div className="flex items-center gap-[12px]">
          <Link href="/jobs" className="flex items-center font-body text-[13px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
            <ArrowLeft size={14} className="mr-1" /> Jobs
          </Link>
          <span className="text-neutral-300">/</span>
          <h1 className="font-display text-[20px] font-bold text-neutral-900">
            Senior React Engineer
          </h1>
          <div className="flex h-[24px] items-center rounded-full bg-[#ECFCCB] px-[10px] font-body text-[11px] font-bold text-[#4D7C0F]">
            Published
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-[12px]">
          <span className="mr-2 font-body text-[13px] text-neutral-500">
            24 Total Applicants
          </span>
          <Button variant="secondary" className="h-[32px] px-4 text-[13px]">
            Edit Job
          </Button>
          <Button variant="ghost" className="h-[32px] px-4 text-[13px]">
            Analytics
          </Button>
          <Button variant="ghost" className="h-[32px] px-4 text-[13px] text-[#EF4444] hover:bg-red-50 hover:text-[#DC2626]">
            Close Role
          </Button>
        </div>
      </div>

      {/* FILTER ROW */}
      <FilterBar />

      {/* BOARD AREA */}
      <div className="flex-1 overflow-hidden">
        <KanbanBoard />
      </div>

    </div>
  )
}
