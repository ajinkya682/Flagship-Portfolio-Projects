'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from '@/lib/gsap'
import AnimatedPipelineFlow from './AnimatedPipelineFlow'
import ThreeParticleBackground from './ThreeParticleBackground'

export default function PipelineExplainerSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current || !stickyRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Heading entrance animation when section enters viewport
    gsap.fromTo('.pipeline-heading-word', 
      { y: 40, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        stagger: 0.05, 
        duration: 0.8, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        }
      }
    )

    gsap.fromTo('.pipeline-fade-in', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, scrollTrigger: { trigger: containerRef.current, start: 'top 80%' } }
    )

    // Stat cards count-up at the end of the scroll (95-100%)
    // We trigger this when the user reaches the very bottom of the sticky container
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'bottom 100%', // Fires right at the end of the 300vh scroll
        toggleActions: 'play none none reverse'
      }
    })

    // Count up for 2-8s
    tl.fromTo('.stat-seconds', 
      { textContent: 0 }, 
      { textContent: 8, duration: 1.5, snap: { textContent: 1 }, ease: 'power2.out' }
    )

    // Count up for 99.2%
    tl.fromTo('.stat-percent', 
      { textContent: 0 }, 
      { textContent: 99.2, duration: 1.5, snap: { textContent: 0.1 }, ease: 'power2.out' },
      '<'
    )

  }, { scope: containerRef })

  const headingText = "From resume to ranked candidate in 90 seconds."
  const headingWords = headingText.split(" ")

  return (
    <section ref={containerRef} className="relative bg-[#0A2540] h-[350vh]">
      {/* Sticky Viewport Container */}
      <div ref={stickyRef} className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-center">
        
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <ThreeParticleBackground />
        </div>

        {/* Content Layer */}
        <div className="max-w-[1200px] mx-auto w-full px-5 md:px-10 lg:px-8 xl:px-12 relative z-10 pt-20">
          
          {/* Header */}
          <div className="max-w-[800px] mx-auto text-center pipeline-fade-in">
            <span className="overline text-[11px] font-bold text-accent-300 tracking-widest uppercase inline-block relative">
              HOW THE AI WORKS
              <div className="absolute -bottom-1 left-0 h-px bg-accent-400 w-full scale-x-0 origin-left animate-[scaleX_1s_ease-out_forwards_0.5s]" />
            </span>
            <h2 className="font-display text-[32px] md:text-[40px] font-bold text-white mt-4 leading-tight tracking-tight flex flex-wrap justify-center gap-[0.25em]">
              {headingWords.map((word, i) => (
                <span key={i} className="pipeline-heading-word block">{word}</span>
              ))}
            </h2>
            <p className="font-body text-[17px] text-white/70 mt-4 max-w-[520px] mx-auto leading-relaxed pipeline-fade-in">
              TalentIQ automates the busywork. Our AI pipeline ingests resumes, parses unstructured data, and delivers an objective score instantly.
            </p>
          </div>

          {/* Diagram */}
          <div className="mt-16 h-[200px] md:h-[240px]">
            {/* We pass the massive scroll container ref down so AnimatedPipelineFlow knows the exact scroll bounds */}
            <AnimatedPipelineFlow scrollContainerRef={containerRef} />
          </div>

          {/* Stat Callouts (Glassmorphism) */}
          <div className="mt-16 flex flex-col md:flex-row justify-center gap-6 pipeline-fade-in">
            <div className="relative overflow-hidden bg-white/5 border border-white/10 rounded-xl px-8 py-6 flex items-center gap-4 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-blue-500 opacity-70" />
              <div className="flex items-baseline gap-1">
                <span className="font-display text-[32px] font-bold text-white leading-none stat-seconds">2</span>
                <span className="font-display text-[20px] font-bold text-white/80">-</span>
                <span className="font-display text-[32px] font-bold text-white leading-none stat-seconds">8</span>
                <span className="font-display text-[20px] font-bold text-accent-400 leading-none">s</span>
              </div>
              <span className="font-body text-[14px] text-white/70 leading-snug max-w-[100px] border-l border-white/10 pl-4">
                per resume processing
              </span>
            </div>
            
            <div className="relative overflow-hidden bg-white/5 border border-white/10 rounded-xl px-8 py-6 flex items-center gap-4 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-emerald-500 opacity-70" />
              <div className="flex items-baseline gap-1">
                <span className="font-display text-[32px] font-bold text-white leading-none stat-percent">99.2</span>
                <span className="font-display text-[24px] font-bold text-accent-400 leading-none">%</span>
              </div>
              <span className="font-body text-[14px] text-white/70 leading-snug max-w-[100px] border-l border-white/10 pl-4">
                parse accuracy across formats
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
