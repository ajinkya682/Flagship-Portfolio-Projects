'use client'

import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from '@/lib/gsap'
import { ScrollTrigger } from '@/lib/gsap'

export default function HeroTextReveal({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return

    const tl = gsap.timeline({ paused: false })

    // 1. AI badge pill
    tl.from('.hero-badge', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power3.out'
    })

    // 2. Headline manual split animation
    // The words are manually split and wrapped in .word-mask > .word-inner in HeroSection
    tl.from('.hero-headline-line1 .word-inner', {
      y: '100%',
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.05
    }, '-=0.2')

    tl.from('.hero-headline-line2 .word-inner', {
      y: '100%',
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.04
    }, '+=0.1')

    // Competition gradient fade-in (handled by scramble text later, but we can animate its container)
    tl.from('.hero-competition', {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '<+=0.1') // starts shortly after line 2 begins

    // 3. Subheading mask-reveal
    tl.from('.hero-subheading', {
      clipPath: 'inset(0 100% 0 0)',
      duration: 0.7,
      ease: 'power2.out'
    }, '-=0.4')

    // 4. Avatar cluster & Trust signals
    tl.from(['.hero-avatars', '.hero-trust'], {
      y: 16,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.15
    }, '-=0.3')

    // 5. CTA Pill (Bounce in)
    tl.from('.hero-cta', {
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    }, '-=0.5')

    // 6. Right column mockup
    tl.from('.hero-mockup', {
      x: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '<') // Simultaneous with the main reveal sequence

    // 7. Parallax
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        animation: gsap.to('.hero-left-col', { y: -100, ease: 'none' })
      })

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        animation: gsap.to('.hero-right-col', { y: -50, ease: 'none' })
      })
    })

    return () => mm.revert()
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="hero-reveal-container h-full w-full relative z-10">
      {children}
    </div>
  )
}
