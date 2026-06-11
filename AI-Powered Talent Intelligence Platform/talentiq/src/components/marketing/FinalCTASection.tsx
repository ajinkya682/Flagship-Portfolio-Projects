'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from '@/lib/gsap'

export default function FinalCTASection() {
  const ctaRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!ctaRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.to(ctaRef.current, {
      backgroundPosition: '200% center',
      duration: 10,
      ease: 'none',
      repeat: -1,
      yoyo: true
    })
  }, { scope: ctaRef })

  return (
    <section className="my-16 mx-auto max-w-[900px] px-5 md:px-20">
      <div 
        ref={ctaRef}
        className="rounded-[24px] p-12 md:p-20 text-center relative overflow-hidden shadow-xl"
        style={{
          background: 'linear-gradient(270deg, #2563EB, #10B981, #2563EB, #8B5CF6)',
          backgroundSize: '400% 400%',
        }}
      >
        
        {/* Decorative circle */}
        <div className="absolute -bottom-[60px] -right-[60px] w-[300px] h-[300px] rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <h2 className="font-display text-[32px] md:text-[40px] font-extrabold text-white leading-tight tracking-tight">
            Ready to transform your hiring?
          </h2>
          
          <p className="font-body text-[18px] md:text-[20px] text-white/85 mt-4 max-w-[500px] mx-auto leading-relaxed">
            Join 500+ companies making faster, fairer hiring decisions.
          </p>

          <Link
            href="/register"
            className="mt-8 bg-white text-primary-500 hover:bg-neutral-50 h-14 px-8 inline-flex items-center justify-center gap-2 rounded-xl font-body text-[16px] font-bold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 ease-out"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>

          <div className="mt-6 flex justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="font-body text-[12px] text-white/70">No credit card</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-body text-[12px] text-white/70">Cancel anytime</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-body text-[12px] text-white/70">Setup in 30 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
