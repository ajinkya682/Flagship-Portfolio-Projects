'use client'

import Image from 'next/image'
import { Layers, Sparkles, Filter } from 'lucide-react'
import FeatureCard from './FeatureCard'
import AnimatedGrid from './AnimatedGrid'
import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from '@/lib/gsap'

export default function FeaturesShowcase() {
  const screenshotRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!screenshotRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(screenshotRef.current, { clipPath: 'inset(0% 0% 0% 0% round 12px)' })
      return
    }

    gsap.fromTo(screenshotRef.current,
      { clipPath: 'inset(40% 40% 40% 40% round 12px)' },
      {
        clipPath: 'inset(0% 0% 0% 0% round 12px)',
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: screenshotRef.current,
          start: 'top 85%',
          end: 'top 30%',
          scrub: true
        }
      }
    )
  }, { scope: screenshotRef })

  return (
    <section className="bg-white py-24">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 lg:px-8 xl:px-12">
        
        {/* Header */}
        <div className="max-w-[700px] mx-auto text-center">
          <span className="overline text-[11px] font-bold text-neutral-500 tracking-widest uppercase">
            RECRUITER WORKFLOW
          </span>
          <h2 className="font-display text-[32px] md:text-[40px] font-bold text-neutral-900 mt-3 leading-tight tracking-tight">
            Your entire pipeline, one view.
          </h2>
          <p className="font-body text-[18px] md:text-[20px] text-neutral-600 mt-4 leading-relaxed">
            Move faster with a kanban board that updates in real-time. Drag, drop, score, and hire without ever leaving the page.
          </p>
        </div>

        {/* Product Screenshot */}
        <div className="mt-12 max-w-[1100px] mx-auto">
          <div ref={screenshotRef} className="rounded-xl shadow-2xl border border-neutral-200 overflow-hidden bg-white will-change-[clip-path]">
            {/* Browser Chrome */}
            <div className="h-9 bg-neutral-100 flex items-center px-4 gap-1.5 border-b border-neutral-200">
              <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              <div className="flex-grow h-5 bg-neutral-200 rounded-full ml-3 opacity-50 max-w-[400px]" />
            </div>
            {/* Image Container */}
            <div className="relative w-full aspect-[16/10] md:aspect-[16/9] bg-neutral-50">
              <Image
                src="/images/hero-product.png"
                alt="TalentIQ Pipeline Kanban Board"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1200px) 100vw, 1100px"
              />
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <AnimatedGrid animation="rise" columns={3} gap={32} className="mt-10">
          <FeatureCard
            icon={Layers}
            title="Visual pipeline management"
            description="Drag candidates between stages. Everyone sees it happen live."
          />
          <FeatureCard
            icon={Sparkles}
            title="AI scoring on every application"
            description="Ranked and explained the moment they apply."
          />
          <FeatureCard
            icon={Filter}
            title="Smart filtering"
            description="Sort by score, source, or stage. Bulk actions included."
          />
        </AnimatedGrid>

      </div>
    </section>
  )
}
