"use client"

import * as React from "react"
import { X, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScoreDetailCard } from "./ScoreDetailCard"
import { type Candidate } from "./KanbanCard"
import { cn } from "@/lib/utils"

interface ApplicationSidePanelProps {
  candidate: Candidate | null
  isOpen: boolean
  onClose: () => void
}

export function ApplicationSidePanel({ candidate, isOpen, onClose }: ApplicationSidePanelProps) {
  if (!candidate && !isOpen) return null

  // Prevent scroll on body when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-neutral-900/20 backdrop-blur-sm transition-opacity duration-200",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={cn(
          "fixed bottom-0 right-0 top-0 z-50 flex w-[480px] flex-col bg-white shadow-xl transition-transform duration-200 ease-out",
          isOpen ? "translate-x-0" : "translate-x-[100%]"
        )}
      >
        {candidate && (
          <>
            {/* Header */}
            <div className="flex shrink-0 flex-col border-b border-neutral-200 p-[24px]">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <h3 className="font-display text-[20px] font-bold text-neutral-900">
                    {candidate.name}
                  </h3>
                  <a href="#" className="mt-[4px] inline-flex items-center font-body text-[13px] font-medium text-primary-500 hover:underline">
                    Open Full Profile <ExternalLink size={12} className="ml-1" />
                  </a>
                </div>
                <button 
                  onClick={onClose}
                  className="flex h-[32px] w-[32px] items-center justify-center rounded-sm text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content Body with Tabs */}
            <div className="flex-1 overflow-y-auto bg-neutral-50 p-[24px] custom-scrollbar">
              <Tabs defaultValue="ai-score" className="w-full">
                <TabsList className="flex h-[40px] w-full justify-start rounded-none border-b border-neutral-200 bg-transparent p-0 mb-[24px]">
                  {["Overview", "Resume", "AI Score", "Interviews", "Notes"].map(tab => {
                    const value = tab.toLowerCase().replace(" ", "-")
                    return (
                      <TabsTrigger 
                        key={value}
                        value={value}
                        className="relative h-[40px] rounded-none border-b-2 border-transparent bg-transparent px-[16px] pb-[10px] pt-[10px] font-body text-[14px] font-medium text-neutral-500 hover:text-neutral-900 data-[state=active]:border-primary-500 data-[state=active]:text-primary-700 data-[state=active]:shadow-none focus-visible:ring-0"
                      >
                        {tab}
                      </TabsTrigger>
                    )
                  })}
                </TabsList>

                <TabsContent value="ai-score" className="mt-0 outline-none">
                  <ScoreDetailCard 
                    score={candidate.score}
                    matchLabel="Strong Match"
                    subscores={[
                      { label: "Technical Skills", percent: 92 },
                      { label: "Experience Match", percent: 85 },
                      { label: "Culture Fit", percent: 88 },
                      { label: "Communication", percent: 95 },
                    ]}
                    strengths={[
                      "Extensive experience with modern React stack",
                      "Strong system design background from previous role"
                    ]}
                    gaps={[
                      "Less experience with GraphQL than requested",
                      "No direct management experience"
                    ]}
                  />
                </TabsContent>

                {/* Placeholders for other tabs */}
                <TabsContent value="overview">
                  <p className="text-[14px] text-neutral-500">Overview content goes here.</p>
                </TabsContent>
                <TabsContent value="resume">
                  <p className="text-[14px] text-neutral-500">Resume viewer goes here.</p>
                </TabsContent>
                <TabsContent value="interviews">
                  <p className="text-[14px] text-neutral-500">Interview history goes here.</p>
                </TabsContent>
                <TabsContent value="notes">
                  <p className="text-[14px] text-neutral-500">Recruiter notes go here.</p>
                </TabsContent>
              </Tabs>
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-neutral-200 bg-white p-[24px]">
              
              <div className="flex items-center justify-between mb-[16px]">
                <div className="w-[180px]">
                  <Select defaultValue="interview">
                    <SelectTrigger className="h-[32px] text-[13px]">
                      <SelectValue placeholder="Move Stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="screening">Screening</SelectItem>
                      <SelectItem value="phone">Phone Screen</SelectItem>
                      <SelectItem value="interview">Interview</SelectItem>
                      <SelectItem value="assessment">Assessment</SelectItem>
                      <SelectItem value="offer">Offer</SelectItem>
                      <SelectItem value="hired">Hired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="h-[32px] px-4 text-[13px]">Move</Button>
              </div>

              <div className="flex flex-col gap-[8px]">
                <Button className="w-full">Schedule Interview</Button>
                <Button variant="ghost" className="w-full text-[#EF4444] hover:bg-red-50 hover:text-[#DC2626]">
                  Reject Candidate
                </Button>
              </div>

            </div>
          </>
        )}
      </div>
    </>
  )
}
