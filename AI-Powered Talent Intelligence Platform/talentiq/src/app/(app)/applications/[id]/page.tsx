"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Mail, Phone, Linkedin } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIAssessmentTab } from "@/components/applications/AIAssessmentTab"
import { ResumeTab } from "@/components/applications/ResumeTab"
import { InterviewsTab } from "@/components/applications/InterviewsTab"
import { ScorecardsTab } from "@/components/applications/ScorecardsTab"
import { NotesTab } from "@/components/applications/NotesTab"
import { ActivityTab } from "@/components/applications/ActivityTab"
import { ActionSidebar } from "@/components/applications/ActionSidebar"
import { Button } from "@/components/ui/button"
import confetti from "canvas-confetti"

export default function ApplicationDetailPage() {
  const tabs = [
    "Profile", 
    "AI Assessment", 
    "Resume", 
    "Interviews", 
    "Scorecards", 
    "Offer", 
    "Notes", 
    "Activity"
  ]

  const [offerAccepted, setOfferAccepted] = React.useState(false)

  const handleAcceptOffer = () => {
    setOfferAccepted(true)
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#10B981', '#34D399', '#A7F3D0']
    })
  }

  return (
    <div className="flex w-full justify-center bg-neutral-100 min-h-[calc(100vh-60px)] custom-scrollbar overflow-y-auto">
      <div className="flex w-full max-w-[1400px] flex-col p-[32px]">
        
        {/* Top Breadcrumb */}
        <div className="flex items-center gap-[12px] mb-[16px]">
          <Link href="/jobs/123/pipeline" className="flex items-center font-body text-[13px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
            <ArrowLeft size={14} className="mr-1" /> Back to Pipeline
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="font-body text-[13px] font-medium text-neutral-900">
            Senior React Engineer
          </span>
        </div>

        <div className="grid grid-cols-12 gap-[32px] w-full">
          
          {/* MAIN CONTENT (8 cols) */}
          <div className="col-span-12 lg:col-span-8 flex flex-col">
            
            {/* Header */}
            <div className="flex flex-col">
              <h1 className="font-display text-[28px] font-bold text-neutral-900">
                David Kim
              </h1>
              
              {/* Badges */}
              <div className="mt-[8px] flex flex-wrap items-center gap-[8px]">
                <span className="flex items-center rounded-full bg-warning-100 px-[10px] py-[2px] font-body text-[11px] font-bold uppercase tracking-wider text-warning-700">
                  Interview Stage
                </span>
                <span className="flex items-center rounded-full bg-neutral-200 px-[10px] py-[2px] font-body text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                  Applied Oct 10
                </span>
                <span className="flex items-center rounded-full bg-blue-100 px-[10px] py-[2px] font-body text-[11px] font-bold uppercase tracking-wider text-blue-700">
                  Website
                </span>
              </div>

              {/* Contact Row */}
              <div className="mt-[16px] flex flex-wrap items-center gap-[16px]">
                <a href="mailto:david.kim@example.com" className="flex items-center gap-[6px] font-body text-[14px] text-neutral-600 hover:text-primary-600 transition-colors">
                  <Mail size={16} /> david.kim@example.com
                </a>
                <span className="flex items-center gap-[6px] font-body text-[14px] text-neutral-600">
                  <Phone size={16} /> +1 (555) 123-4567
                </span>
                <a href="#" className="flex items-center gap-[6px] font-body text-[14px] text-neutral-600 hover:text-[#0A66C2] transition-colors">
                  <Linkedin size={16} /> linkedin.com/in/davidkim
                </a>
              </div>
            </div>

            {/* Tabs Integration */}
            <div className="mt-[24px]">
              <Tabs defaultValue="ai-assessment" className="w-full">
                
                {/* Scrollable Tab List for smaller screens */}
                <div className="w-full overflow-x-auto custom-scrollbar-thin border-b border-neutral-200">
                  <TabsList className="flex h-auto w-max justify-start rounded-none bg-transparent p-0">
                    {tabs.map(tab => {
                      const value = tab.toLowerCase().replace(" ", "-")
                      return (
                        <TabsTrigger 
                          key={value}
                          value={value}
                          className="relative h-[48px] rounded-none border-b-[2px] border-transparent bg-transparent px-[20px] font-body text-[14px] font-medium text-neutral-500 hover:text-neutral-700 transition-colors duration-120 data-[state=active]:border-primary-500 data-[state=active]:text-primary-700 data-[state=active]:shadow-none focus-visible:ring-0"
                        >
                          {tab}
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>
                </div>

                <div className="mt-[32px]">
                  <TabsContent value="profile" className="m-0 outline-none">
                    <p className="text-neutral-500">Profile summary component would render here.</p>
                  </TabsContent>
                  
                  <TabsContent value="ai-assessment" className="m-0 outline-none">
                    <AIAssessmentTab />
                  </TabsContent>

                  <TabsContent value="resume" className="m-0 outline-none">
                    <ResumeTab />
                  </TabsContent>

                  <TabsContent value="interviews" className="m-0 outline-none">
                    <InterviewsTab />
                  </TabsContent>

                  <TabsContent value="scorecards" className="m-0 outline-none">
                    <ScorecardsTab />
                  </TabsContent>

                  <TabsContent value="offer" className="m-0 outline-none">
                    <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-neutral-200 bg-white p-[40px] text-center shadow-sm">
                      <h4 className="font-display text-[18px] font-semibold text-neutral-900 mb-2">Offer Status</h4>
                      {offerAccepted ? (
                        <div className="flex flex-col items-center animate-fade-slide-up">
                          <div className="h-12 w-12 rounded-full bg-accent-100 flex items-center justify-center mb-4">
                            <span className="text-accent-600 font-bold text-xl">✓</span>
                          </div>
                          <p className="font-body text-[15px] font-medium text-accent-600 mb-1">Offer Accepted!</p>
                          <p className="font-body text-[14px] text-neutral-500">The candidate has accepted the offer.</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <p className="font-body text-[14px] text-neutral-600 mb-6 max-w-[300px]">
                            The offer has been sent to the candidate. Wait for their response or manually mark as accepted.
                          </p>
                          <Button onClick={handleAcceptOffer} variant="primary" className="h-[40px] px-6">
                            Mark as Accepted
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="notes" className="m-0 outline-none">
                    <NotesTab />
                  </TabsContent>

                  <TabsContent value="activity" className="m-0 outline-none">
                    <ActivityTab />
                  </TabsContent>
                </div>

              </Tabs>
            </div>

          </div>

          {/* ACTION SIDEBAR (4 cols) */}
          <div className="col-span-12 lg:col-span-4 relative mt-8 lg:mt-0">
            <ActionSidebar />
          </div>

        </div>
      </div>
    </div>
  )
}
