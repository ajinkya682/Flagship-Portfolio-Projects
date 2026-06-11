'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from '@/lib/gsap'
import { ScrollTrigger } from '@/lib/gsap'
import { ChevronLeft, ChevronRight, Quote, Box, LayoutGrid, Sparkles, Zap } from 'lucide-react'
import { useLenis } from '@studio-freight/react-lenis'

const integrations = [
  { name: 'Slack', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/slack.svg' },
  { name: 'Google', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/google.svg' },
  { name: 'Teams', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/microsoftteams.svg' },
  { name: 'Greenhouse', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/greenhouse.svg' },
  { name: 'LinkedIn', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/linkedin.svg' },
  { name: 'Indeed', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/indeed.svg' },
  { name: 'Calendly', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/calendly.svg' },
  { name: 'Zoom', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/zoom.svg' },
  { name: 'DocuSign', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/docusign.svg' },
  { name: 'Workday', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/workday.svg' },
  { name: 'Zapier', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/zapier.svg' },
  { name: 'BambooHR', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/bamboohr.svg' }
]

export default function HorizontalBentoScroll() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const lenis = useLenis()

  const cardWidth = 480
  const gap = 32

  useGSAP(() => {
    if (!containerRef.current || !trackRef.current) return
    const isDesktop = window.innerWidth >= 1024
    if (!isDesktop || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Mobile or reduced motion: just stack them vertically
      return
    }

    const cards = gsap.utils.toArray('.bento-card') as HTMLElement[]
    const trackWidth = (cardWidth * cards.length) + (gap * (cards.length - 1))
    const scrollDistance = trackWidth - window.innerWidth + 120 // 120px padding

    // Main horizontal scroll animation
    const scrollTween = gsap.to(trackRef.current, {
      x: -scrollDistance,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => `+${scrollDistance}`,
        onUpdate: (self) => {
          // Update active index based on progress
          const progress = self.progress
          const index = Math.min(
            cards.length - 1, 
            Math.floor(progress * cards.length * 1.1)
          )
          setActiveIndex(index)
        }
      }
    })

    // Individual card entrances as they scroll into view
    cards.forEach((card, i) => {
      // First card doesn't need to fade in, it's already there
      if (i === 0) return 

      gsap.fromTo(card,
        { scale: 0.92, opacity: 0.2 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            containerAnimation: scrollTween,
            start: 'left 80%',
            end: 'left 40%',
            scrub: true,
          }
        }
      )
    })

    // Card 1: Score Ring
    gsap.fromTo('.bento-score-fill',
      { strokeDashoffset: 201 },
      {
        strokeDashoffset: 18, // ~91%
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cards[0],
          containerAnimation: scrollTween,
          start: 'left 70%',
        }
      }
    )

    // Card 3: Typewriter Quote
    gsap.to('.bento-quote', {
      text: "TalentIQ completely changed how we hire. The AI scoring is spot on, and we've reduced our time-to-hire by 50%.",
      duration: 2,
      ease: 'none',
      scrollTrigger: {
        trigger: cards[2],
        containerAnimation: scrollTween,
        start: 'left 75%',
      }
    })

    // Card 4: Miniature Kanban looping
    const kanbanTl = gsap.timeline({ repeat: -1 })
    kanbanTl.to('.mini-card', { x: 120, y: 20, duration: 1, ease: 'power2.inOut', delay: 1 })
            .to('.mini-card', { x: 240, y: -10, duration: 1, ease: 'power2.inOut', delay: 1 })
            .to('.mini-card', { opacity: 0, duration: 0.3 })
            .set('.mini-card', { x: 0, y: 0 })
            .to('.mini-card', { opacity: 1, duration: 0.3, delay: 0.5 })

    // Card 5: Integrations rotation
    gsap.to('.integrations-circle', {
      rotation: 360,
      duration: 30,
      ease: 'none',
      repeat: -1
    })

  }, { scope: containerRef })

  const scrollToCard = (index: number) => {
    if (!lenis || !containerRef.current) return
    const isDesktop = window.innerWidth >= 1024
    if (!isDesktop) return

    const scrollTriggerStart = containerRef.current.offsetTop
    const cards = 5
    const scrollDistance = (cardWidth * cards) + (gap * (cards - 1)) - window.innerWidth + 120
    
    // Calculate the target scroll position linearly
    const targetScroll = scrollTriggerStart + (index / (cards - 1)) * scrollDistance
    
    lenis.scrollTo(targetScroll, { duration: 1 })
  }

  return (
    <section ref={containerRef} className="relative bg-neutral-950 text-white overflow-hidden lg:h-screen lg:flex lg:flex-col lg:justify-center py-20 lg:py-0">
      
      {/* Title & Nav (Sticky on desktop) */}
      <div className="px-6 md:px-12 mb-12 lg:mb-0 lg:absolute lg:top-24 lg:left-0 lg:right-0 z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 max-w-[1600px] mx-auto w-full">
        <div>
          <h2 className="font-display text-[32px] md:text-[48px] font-bold tracking-tight">
            Built for modern <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">hiring.</span>
          </h2>
          <p className="font-body text-[18px] text-neutral-400 mt-2 max-w-xl">
            Everything you need to source, evaluate, and hire top talent in one unified platform.
          </p>
        </div>
        
        {/* Navigation Controls */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2 mr-4">
            {[0, 1, 2, 3, 4].map(idx => (
              <button 
                key={idx}
                onClick={() => scrollToCard(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === idx ? 'bg-primary-500 w-6' : 'bg-neutral-700 hover:bg-neutral-500'}`}
                aria-label={`Go to card ${idx + 1}`}
              />
            ))}
          </div>
          <button 
            onClick={() => scrollToCard(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-400 hover:bg-neutral-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scrollToCard(Math.min(4, activeIndex + 1))}
            disabled={activeIndex === 4}
            className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-400 hover:bg-neutral-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Track */}
      <div className="px-6 md:px-12 lg:px-[10vw]">
        <div 
          ref={trackRef} 
          className="flex flex-col lg:flex-row gap-8 lg:gap-[32px] lg:w-max items-center"
        >
          {/* Card 1: AI Scoring */}
          <div className="bento-card w-full lg:w-[480px] h-[400px] bg-obsidian rounded-3xl border border-neutral-800 p-8 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <Sparkles className="w-6 h-6 text-primary-400 mb-4" />
              <h3 className="font-display text-[24px] font-semibold text-white">Every candidate scored in seconds.</h3>
            </div>
            <div className="relative z-10 self-center mt-auto">
              {/* Fake Score Ring */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
                  <circle cx="36" cy="36" r="32" fill="none" stroke="#1f2937" strokeWidth="6" />
                  <circle 
                    className="bento-score-fill"
                    cx="36" cy="36" r="32" fill="none" stroke="#3b82f6" strokeWidth="6"
                    strokeDasharray="201" strokeDashoffset="201" strokeLinecap="round"
                  />
                </svg>
                <span className="absolute font-display text-[32px] font-bold text-white">91</span>
              </div>
            </div>
          </div>

          {/* Card 2: Speed Stat */}
          <div className="bento-card w-full lg:w-[480px] h-[400px] bg-midnight rounded-3xl border border-neutral-800 p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/20 rounded-full blur-[80px]" />
            <div className="relative z-10">
              <Zap className="w-6 h-6 text-accent-400 mb-4" />
              <h3 className="font-display text-[24px] font-semibold text-white">Hire 2x faster.</h3>
            </div>
            <div className="relative z-10 mt-auto">
              <div className="flex items-baseline">
                <span className="font-display text-[80px] font-bold text-white tracking-tighter">-50</span>
                <span className="font-display text-[40px] font-bold text-accent-400">%</span>
              </div>
              <p className="font-body text-neutral-400">Average reduction in time-to-hire across all engineering roles.</p>
            </div>
          </div>

          {/* Card 3: Social Proof */}
          <div className="bento-card w-full lg:w-[480px] h-[400px] bg-neutral-900 rounded-3xl border border-neutral-800 p-8 flex flex-col justify-center relative">
            <Quote className="absolute top-8 right-8 w-12 h-12 text-neutral-800" />
            <p className="bento-quote font-display text-[24px] leading-relaxed text-white min-h-[120px]">
              {/* TextPlugin will type here */}
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-neutral-800" />
              <div>
                <p className="font-body text-[15px] font-semibold text-white">Sarah Jenkins</p>
                <p className="font-body text-[13px] text-neutral-400">VP of Talent, TechFlow</p>
              </div>
            </div>
          </div>

          {/* Card 4: Pipeline */}
          <div className="bento-card w-full lg:w-[480px] h-[400px] bg-deep-navy rounded-3xl border border-neutral-800 p-8 flex flex-col relative overflow-hidden">
            <div className="relative z-10 mb-8">
              <LayoutGrid className="w-6 h-6 text-blue-400 mb-4" />
              <h3 className="font-display text-[24px] font-semibold text-white">Visual Pipeline.</h3>
            </div>
            {/* Miniature Kanban */}
            <div className="relative flex-grow flex gap-4 w-[600px] opacity-80">
              {[1, 2, 3].map(col => (
                <div key={col} className="w-28 h-full bg-black/20 rounded-lg p-2 border border-white/5">
                  <div className="w-1/2 h-2 bg-white/10 rounded mb-4" />
                  {col === 1 && (
                    <>
                      <div className="mini-card w-full h-12 bg-white/10 rounded border border-white/10 mb-2 relative z-20" />
                      <div className="w-full h-12 bg-white/5 rounded mb-2" />
                    </>
                  )}
                  {col === 2 && (
                    <div className="w-full h-12 bg-white/5 rounded mb-2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card 5: Integrations */}
          <div className="bento-card w-full lg:w-[480px] h-[400px] bg-neutral-900 rounded-3xl border border-neutral-800 p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <h3 className="absolute top-8 left-8 font-display text-[24px] font-semibold text-white">
              Plays nicely with others.
            </h3>
            
            <div className="relative w-64 h-64 mt-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-neutral-800 integrations-circle flex items-center justify-center">
                {integrations.map((int, i) => {
                  const angle = (i / integrations.length) * Math.PI * 2
                  const radius = 100
                  const x = Math.cos(angle) * radius
                  const y = Math.sin(angle) * radius
                  return (
                    <div 
                      key={int.name}
                      className="absolute w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center p-2.5"
                      style={{ transform: `translate(${x}px, ${y}px) rotate(${-angle}rad)` }}
                    >
                      <img src={int.icon} alt={int.name} className="w-full h-full opacity-60" style={{ filter: 'invert(1) brightness(1.5)' }} />
                    </div>
                  )
                })}
              </div>
              <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center shadow-[0_0_32px_rgba(37,99,235,0.5)] z-10">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
