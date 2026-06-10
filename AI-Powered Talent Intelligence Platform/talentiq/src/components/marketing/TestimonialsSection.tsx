"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ScrollEntry } from "@/components/shared/ScrollEntry"
import { TestimonialCard } from "./TestimonialCard"
import { IconButton } from "@/components/ui/button"

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "TalentIQ helped us cut our time-to-hire in half while actually improving the quality of our engineering hires.",
      authorName: "Sarah Jenkins",
      authorTitle: "VP of Talent",
      authorCompany: "TechFlow",
      authorAvatarUrl: "https://i.pravatar.cc/150?u=a1",
      metricCallout: "50% faster time-to-hire"
    },
    {
      quote: "The explainable AI scores mean my hiring managers actually trust the pre-screening. It's a game changer.",
      authorName: "Marcus Thorne",
      authorTitle: "Head of Recruitment",
      authorCompany: "Nova Systems",
      authorAvatarUrl: "https://i.pravatar.cc/150?u=a2",
      metricCallout: "91% AI accuracy"
    },
    {
      quote: "Finally, a platform that doesn't just parse keywords, but actually understands the context of a candidate's experience.",
      authorName: "Elena Rodriguez",
      authorTitle: "Director of HR",
      authorCompany: "GlobalHire",
      authorAvatarUrl: "https://i.pravatar.cc/150?u=a3",
      metricCallout: "$2M+ saved in mis-hires"
    }
  ]

  return (
    <ScrollEntry animation="fade-up">
      <section className="w-full bg-primary-900 py-[96px]">
        <div className="mx-auto max-w-[1100px] px-5 md:px-10 lg:px-[80px]">
          
          <div className="mx-auto max-w-[600px] text-center">
            <span className="font-body text-[12px] font-bold uppercase tracking-wider text-accent-300">
              CUSTOMER STORIES
            </span>
            <h2 className="mt-4 font-display text-[32px] md:text-[40px] font-bold leading-tight text-white tracking-tight">
              Teams that ship faster with TalentIQ.
            </h2>
          </div>

          <div className="mt-[48px] grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>

          {/* Carousel controls */}
          <div className="mt-[32px] flex items-center justify-center gap-6">
            <IconButton 
              icon={<ChevronLeft />} 
              dark 
              aria-label="Previous testimonial" 
            />
            <div className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-accent-500" />
              <div className="h-2 w-2 rounded-full bg-neutral-500" />
              <div className="h-2 w-2 rounded-full bg-neutral-500" />
            </div>
            <IconButton 
              icon={<ChevronRight />} 
              dark 
              aria-label="Next testimonial" 
            />
          </div>

        </div>
      </section>
    </ScrollEntry>
  )
}
