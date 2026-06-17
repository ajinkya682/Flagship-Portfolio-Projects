'use client'

import React, { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from '@/lib/gsap'
import { ScrollTrigger } from '@/lib/gsap'

interface PremiumStatCounterProps {
  value: number
  prefix?: string
  suffix?: string
  label: string
  sublabel?: string
  color?: string
  decimals?: number
  className?: string
}

export default function PremiumStatCounter({
  value,
  prefix = '',
  suffix = '',
  label,
  sublabel,
  color = 'text-primary-600',
  decimals = 0,
  className = '',
}: PremiumStatCounterProps) {
  const numberRef = useRef<HTMLSpanElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  const formatNumber = (num: number) => {
    return (
      prefix +
      num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }) +
      suffix
    )
  }

  useGSAP(() => {
    if (!numberRef.current || !containerRef.current) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (numberRef.current) numberRef.current.textContent = formatNumber(value)
      return
    }

    const counter = { val: 0 }
    
    // We combine a slot-machine random number generation for the first part of the animation
    // with a tween to the final value.

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 85%',
      onEnter: () => {
        if (!hasAnimated) {
          setHasAnimated(true)
          
          const tl = gsap.timeline()
          
          // Step 1: Scramble phase (slot machine effect)
          // Rapidly update with random numbers of the same length
          let scrambleTicks = 0
          const maxTicks = 10
          
          tl.to(counter, {
            duration: 0.3, // 300ms scramble
            onUpdate: () => {
              scrambleTicks++
              // Random number between 0 and value * 1.5
              const randomNum = Math.random() * (value * 1.5)
              if (numberRef.current) {
                numberRef.current.textContent = formatNumber(randomNum)
              }
            }
          })
          
          // Step 2: Settle to the actual value
          tl.to(counter, {
            val: value,
            duration: 1.2,
            ease: 'power3.out',
            onUpdate: () => {
              if (numberRef.current) {
                numberRef.current.textContent = formatNumber(counter.val)
              }
            }
          })
        }
      }
    })
  }, { scope: containerRef, dependencies: [value, prefix, suffix, decimals, hasAnimated] })

  return (
    <div ref={containerRef} className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-baseline gap-1">
        <span 
          ref={numberRef} 
          className={`font-display text-[48px] lg:text-[64px] font-bold leading-none tracking-tight ${color}`}
        >
          {formatNumber(0)}
        </span>
      </div>
      <div>
        <h3 className="font-body text-[16px] lg:text-[18px] font-semibold text-neutral-900">
          {label}
        </h3>
        {sublabel && (
          <p className="font-body text-[14px] text-neutral-500 mt-1">
            {sublabel}
          </p>
        )}
      </div>
    </div>
  )
}
