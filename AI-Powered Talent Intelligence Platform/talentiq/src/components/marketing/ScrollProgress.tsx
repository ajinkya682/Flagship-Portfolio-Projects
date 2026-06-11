'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from '@/lib/gsap'
import { ScrollTrigger } from '@/lib/gsap'
import { useLenis } from '@studio-freight/react-lenis'
import MagneticButton from '../shared/MagneticButton'
import { ArrowUp } from 'lucide-react'

export default function ScrollProgress() {
  const progressBarRef = useRef<HTMLDivElement>(null)
  const [showTopButton, setShowTopButton] = useState(false)
  const lenis = useLenis()

  useGSAP(() => {
    if (!progressBarRef.current) return

    gsap.to(progressBarRef.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.1,
      }
    })
  }, { scope: progressBarRef })

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowTopButton(true)
      } else {
        setShowTopButton(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 3) })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      <div 
        ref={progressBarRef}
        className="fixed top-0 left-0 right-0 h-[2px] z-[200] origin-left scale-x-0"
        style={{
          background: 'linear-gradient(to right, #2563EB, #10B981)'
        }}
      />
      
      <div 
        className={`fixed bottom-8 right-8 z-[150] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          showTopButton ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-8 scale-90 pointer-events-none'
        }`}
      >
        <MagneticButton strength={0.4}>
          <button 
            onClick={scrollToTop}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-neutral-200 shadow-lg text-neutral-600 hover:text-primary-600 hover:border-primary-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </MagneticButton>
      </div>
    </>
  )
}
