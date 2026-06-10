"use client"

import * as React from "react"
import { Layers, Sparkles, Filter } from "lucide-react"
import { ScrollEntry } from "@/components/shared/ScrollEntry"

export function FeaturesShowcase() {
  return (
    <ScrollEntry animation="fade-up">
      <section className="w-full bg-white py-[96px]">
        <div className="mx-auto max-w-[1200px] px-5 md:px-10 lg:px-[80px]">
          
          {/* Header */}
          <div className="mx-auto max-w-[700px] text-center">
            <span className="font-body text-[12px] font-bold uppercase tracking-wider text-neutral-500">
              RECRUITER WORKFLOW
            </span>
            <h2 className="mt-4 font-display text-[32px] md:text-[40px] font-bold leading-tight text-neutral-900 tracking-tight">
              Your entire pipeline, one view.
            </h2>
            <p className="mt-4 font-body text-[20px] text-neutral-600 leading-[32px]">
              Manage candidates from application to offer without ever leaving the board.
            </p>
          </div>

          {/* Product Screenshot */}
          <div className="mt-12 w-full max-w-[1100px] mx-auto overflow-hidden rounded-[var(--radius-xl)] border border-neutral-200 bg-neutral-50 shadow-xl">
            <div className="aspect-[16/9] w-full relative">
              <img 
                src="/images/pipeline-board.png" 
                alt="TalentIQ Kanban Board Pipeline" 
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/1100x618/f8fafc/94a3b8?text=Pipeline+Board+Screenshot"
                }}
              />
            </div>
          </div>

          {/* Feature Tiles */}
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3 max-w-[1100px] mx-auto">
            {/* Tile 1 */}
            <div className="flex flex-col">
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-primary-50">
                <Layers size={20} className="text-primary-500" />
              </div>
              <h3 className="mt-3 font-body text-[16px] font-semibold text-neutral-900">
                Visual pipeline management
              </h3>
              <p className="mt-1.5 font-body text-[14px] text-neutral-600 leading-relaxed">
                Drag candidates between stages. Everyone sees it happen live.
              </p>
            </div>

            {/* Tile 2 */}
            <div className="flex flex-col">
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-accent-50">
                <Sparkles size={20} className="text-accent-500" />
              </div>
              <h3 className="mt-3 font-body text-[16px] font-semibold text-neutral-900">
                AI scoring on every application
              </h3>
              <p className="mt-1.5 font-body text-[14px] text-neutral-600 leading-relaxed">
                Ranked and explained the moment they apply.
              </p>
            </div>

            {/* Tile 3 */}
            <div className="flex flex-col">
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-primary-50">
                <Filter size={20} className="text-primary-500" />
              </div>
              <h3 className="mt-3 font-body text-[16px] font-semibold text-neutral-900">
                Smart filtering
              </h3>
              <p className="mt-1.5 font-body text-[14px] text-neutral-600 leading-relaxed">
                Sort by score, source, or stage. Bulk actions included.
              </p>
            </div>
          </div>

        </div>
      </section>
    </ScrollEntry>
  )
}
