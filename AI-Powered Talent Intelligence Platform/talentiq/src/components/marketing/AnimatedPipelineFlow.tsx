'use client'

import React, { useRef, useEffect, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from '@/lib/gsap'
import { ScrollTrigger } from '@/lib/gsap'
import { FileSearch, Users, Sparkles, CalendarCheck, Award } from 'lucide-react'

const steps = [
  { id: 1, title: 'Applied', icon: FileSearch, color: 'text-neutral-500', bg: 'bg-white' },
  { id: 2, title: 'Screening', icon: Users, color: 'text-primary-500', bg: 'bg-primary-50' },
  { id: 3, title: 'AI Scoring', icon: Sparkles, color: 'text-accent-600', bg: 'bg-accent-100', isAI: true },
  { id: 4, title: 'Interview', icon: CalendarCheck, color: 'text-primary-500', bg: 'bg-primary-50' },
  { id: 5, title: 'Hired', icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-50' },
]

export default function AnimatedPipelineFlow() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const mobilePathRef = useRef<SVGPathElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useGSAP(() => {
    if (!containerRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Just show everything immediately
      gsap.set('.pipeline-node', { scale: 1, opacity: 1 })
      gsap.set('.pipeline-icon', { opacity: 1 })
      gsap.set(pathRef.current, { strokeDashoffset: 0 })
      gsap.set(mobilePathRef.current, { strokeDashoffset: 0 })
      return
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%',
      }
    })

    const path = isMobile ? mobilePathRef.current : pathRef.current
    if (path) {
      const length = path.getTotalLength()
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
      
      // Animate line drawing
      tl.to(path, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: 'power2.inOut',
      })
    }

    // Nodes pop in sequentially, slightly staggered along with the line
    tl.fromTo('.pipeline-node', 
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.3, // 5 nodes * 0.3 = 1.5s (matches line duration)
        ease: 'elastic.out(1, 0.5)',
      },
      '-=1.5' // start at the same time as the line
    )

    tl.fromTo('.pipeline-icon',
      { opacity: 0, filter: 'drop-shadow(0 0 0 rgba(0,0,0,0))' },
      {
        opacity: 1,
        filter: 'drop-shadow(0 4px 12px rgba(37,99,235,0.4))',
        duration: 0.4,
        stagger: 0.3,
        ease: 'power2.out',
      },
      '-=1.3'
    )

    // AI Node persistent pulse
    gsap.to('.ai-node-glow', {
      filter: 'drop-shadow(0 8px 24px rgba(16,185,129,0.6))',
      scale: 1.05,
      duration: 1.5,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    })

    // Dot particles traveling along path (Approximation without motionPath plugin)
    // We create a few dots and animate their offset along the SVG
    // For simplicity without MotionPathPlugin, we animate stroke-dashoffset of a dashed overlay path
    if (path) {
      const dotPath = path.cloneNode() as SVGPathElement
      dotPath.setAttribute('stroke', '#10B981')
      dotPath.setAttribute('stroke-width', '4')
      dotPath.setAttribute('stroke-dasharray', '0 100')
      dotPath.setAttribute('stroke-linecap', 'round')
      dotPath.classList.add('particle-path')
      path.parentNode?.appendChild(dotPath)

      const length = path.getTotalLength()
      gsap.fromTo(dotPath,
        { strokeDashoffset: length },
        {
          strokeDashoffset: -length,
          duration: 3,
          ease: 'none',
          repeat: -1,
        }
      )
    }

  }, { scope: containerRef, dependencies: [isMobile] })

  return (
    <div ref={containerRef} className="relative w-full max-w-5xl mx-auto py-12 md:py-24">
      {/* Desktop Arc SVG */}
      <div className="hidden md:block absolute top-1/2 left-0 w-full -translate-y-1/2 h-32 pointer-events-none z-0">
        <svg width="100%" height="100%" viewBox="0 0 1000 120" preserveAspectRatio="none">
          <path
            ref={pathRef}
            d="M 50 80 Q 250 80, 500 40 T 950 80"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Mobile Vertical SVG */}
      <div className="md:hidden absolute top-0 left-12 h-full w-4 pointer-events-none z-0">
        <svg width="100%" height="100%" viewBox="0 0 10 1000" preserveAspectRatio="none">
          <path
            ref={mobilePathRef}
            d="M 5 20 L 5 980"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Nodes */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center h-full gap-12 md:gap-0 px-8 md:px-12">
        {steps.map((step, index) => {
          const Icon = step.icon
          // AI step is elevated on desktop (done via negative margin or transform)
          const isAI = step.isAI
          
          return (
            <div 
              key={step.id} 
              className={`flex flex-row md:flex-col items-center gap-6 md:gap-4 pipeline-node ${isAI ? 'md:-translate-y-6' : ''}`}
            >
              <div className={`relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white shadow-xl ${step.bg} ${isAI ? 'ai-node-glow z-20' : 'z-10'}`}>
                <Icon className={`w-8 h-8 ${step.color} pipeline-icon`} />
                {isAI && (
                  <div className="absolute -inset-2 rounded-full border border-accent-300 animate-[spin_4s_linear_infinite] opacity-50" />
                )}
              </div>
              <div className="flex flex-col md:items-center text-left md:text-center">
                <span className="font-body text-[13px] font-bold text-neutral-400 uppercase tracking-wider">
                  Step {step.id}
                </span>
                <span className={`font-display text-[18px] md:text-[20px] font-semibold mt-1 ${isAI ? 'text-accent-600' : 'text-neutral-900'}`}>
                  {step.title}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
