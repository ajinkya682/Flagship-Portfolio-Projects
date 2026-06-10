import * as React from "react"
import { HeroFloatingBadge } from "./HeroFloatingBadge"
import { cn } from "@/lib/utils"

export function HeroProductMockup({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-2xl transition-transform duration-500 xl:rotate-[1.5deg] lg:rotate-[1.5deg]">
        {/* Browser Chrome */}
        <div className="flex h-[36px] items-center gap-2 border-b border-neutral-200 bg-neutral-100 px-4">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
            <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
            <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
          </div>
          <div className="mx-auto h-5 w-64 rounded-md bg-white/60 shadow-sm" />
        </div>
        
        {/* Mockup Image */}
        <div className="relative aspect-[16/10] w-full bg-neutral-50 flex items-center justify-center border-b border-neutral-100">
          <img 
            src="/images/hero-product.png" 
            alt="TalentIQ Kanban Board Interface" 
            className="h-full w-full object-cover"
            onError={(e) => {
              // Fallback placeholder if image is missing
              (e.target as HTMLImageElement).src = "https://placehold.co/1200x800/f8fafc/94a3b8?text=Product+Interface+Mockup"
            }}
          />
        </div>
      </div>
      
      {/* Floating Badge */}
      <HeroFloatingBadge />
    </div>
  )
}
