'use client'

import React, { useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from '@/lib/gsap'
import Link from 'next/link'
import { Check } from 'lucide-react'
import MagneticButton from '../shared/MagneticButton'

interface PremiumPricingCardProps {
  plan: {
    id: string
    name: string
    description: string
    priceMonthly: number
    priceAnnual: number
    features: string[]
    isPopular?: boolean
    ctaText: string
  }
  isAnnual: boolean
}

export default function PremiumPricingCard({ plan, isAnnual }: PremiumPricingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const priceRef = useRef<HTMLSpanElement>(null)

  const price = isAnnual ? plan.priceAnnual : plan.priceMonthly

  // Animate price change
  useGSAP(() => {
    if (!priceRef.current) return
    const currentPrice = parseInt(priceRef.current.innerText.replace('$', '') || '0')
    const targetPrice = price

    if (currentPrice !== targetPrice && currentPrice !== 0) {
      const counter = { val: currentPrice }
      gsap.to(counter, {
        val: targetPrice,
        duration: 0.6,
        ease: 'power3.out',
        onUpdate: () => {
          if (priceRef.current) {
            priceRef.current.innerText = `$${Math.round(counter.val)}`
          }
        }
      })
    } else {
      priceRef.current.innerText = `$${targetPrice}`
    }
  }, { dependencies: [isAnnual], scope: cardRef })

  // 3D Tilt & Ambient Animation
  useGSAP(() => {
    if (!cardRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const card = cardRef.current

    // Ambient animation for the popular card
    let ambientTween: gsap.core.Tween | null = null
    if (plan.isPopular) {
      ambientTween = gsap.to(card, {
        rotateX: 2,
        rotateY: -2,
        duration: 4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const mouseX = e.clientX - centerX
      const mouseY = e.clientY - centerY

      // Max tilt 8 degrees
      const rotateX = (mouseY / (rect.height / 2)) * -8
      const rotateY = (mouseX / (rect.width / 2)) * 8

      // Update spotlight position
      const spotX = e.clientX - rect.left
      const spotY = e.clientY - rect.top
      card.style.setProperty('--spotlight-x', `\${spotX}px`)
      card.style.setProperty('--spotlight-y', `\${spotY}px`)
      card.style.setProperty('--spotlight-opacity', '1')

      if (ambientTween) ambientTween.pause()

      gsap.to(card, {
        rotateX,
        rotateY,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: 1000,
      })
    }

    const handleMouseLeave = () => {
      card.style.setProperty('--spotlight-opacity', '0')
      
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
        onComplete: () => {
          if (ambientTween) ambientTween.play()
        }
      })
    }

    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseleave', handleMouseLeave)
      if (ambientTween) ambientTween.kill()
    }
  }, { scope: cardRef })

  return (
    <div style={{ perspective: '1000px' }} className="h-full">
      <div 
        ref={cardRef}
        className={`relative flex flex-col h-full rounded-2xl border p-8 transition-shadow duration-300 transform-gpu preserve-3d \${
          plan.isPopular 
            ? 'bg-obsidian border-neutral-800 shadow-2xl text-white' 
            : 'bg-white border-neutral-200 shadow-lg text-neutral-900 hover:shadow-xl'
        }`}
      >
        {/* Spotlight overlay using pseudo-element technique but implemented as a div for React inline style variables */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none rounded-2xl mix-blend-overlay transition-opacity duration-300"
          style={{
            opacity: 'var(--spotlight-opacity, 0)',
            background: `radial-gradient(600px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), \${plan.isPopular ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.4)'}, transparent 40%)`
          }}
        />

        {plan.isPopular && (
          <div className="absolute -top-4 left-0 right-0 mx-auto w-fit overflow-hidden rounded-full">
            <div className="relative bg-gradient-to-r from-primary-500 to-accent-500 text-white font-body text-[13px] font-bold px-4 py-1.5 shadow-md">
              <span className="relative z-10">Most Popular</span>
              {/* Shimmer animation */}
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
          </div>
        )}

        <div className="relative z-10 flex-grow">
          <h3 className={`font-display text-[24px] font-bold \${plan.isPopular ? 'text-white' : 'text-neutral-900'}`}>
            {plan.name}
          </h3>
          <p className={`mt-2 font-body text-[15px] \${plan.isPopular ? 'text-neutral-400' : 'text-neutral-500'}`}>
            {plan.description}
          </p>

          <div className="mt-6 mb-8">
            <div className="flex items-end gap-1">
              <span ref={priceRef} className={`font-display text-[48px] font-extrabold leading-none tracking-tight \${plan.isPopular ? 'text-white' : 'text-neutral-900'}`}>
                ${price}
              </span>
              <span className={`font-body text-[15px] font-medium mb-1 \${plan.isPopular ? 'text-neutral-400' : 'text-neutral-500'}`}>
                /month
              </span>
            </div>
            <div className="h-5 mt-1">
              {isAnnual && <p className={`font-body text-[13px] \${plan.isPopular ? 'text-accent-400' : 'text-accent-600'}`}>Billed annually</p>}
            </div>
          </div>

          <div className="space-y-4">
            {plan.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-full p-0.5 \${plan.isPopular ? 'bg-primary-500/20 text-primary-400' : 'bg-primary-50 text-primary-600'}`}>
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                </div>
                <span className={`font-body text-[15px] \${plan.isPopular ? 'text-neutral-200' : 'text-neutral-700'}`}>
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 relative z-10">
          <MagneticButton strength={0.2}>
            <Link
              href="/register"
              className={`flex items-center justify-center w-full h-12 rounded-lg font-body text-[15px] font-semibold transition-colors \${
                plan.isPopular
                  ? 'bg-white text-obsidian hover:bg-neutral-100'
                  : 'bg-neutral-900 text-white hover:bg-neutral-800'
              }`}
            >
              {plan.ctaText}
            </Link>
          </MagneticButton>
        </div>
      </div>
    </div>
  )
}
