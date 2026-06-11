'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from '@/lib/gsap'

interface ScrambleTextProps {
  text: string
  trigger?: boolean
  chars?: string
  className?: string
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'

export default function ScrambleText({
  text,
  trigger,
  chars = DEFAULT_CHARS,
  className = '',
}: ScrambleTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null)
  const [displayText, setDisplayText] = useState(text)
  const hasAnimated = useRef(false)

  const scramble = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return // Respect reduced motion
    }

    const length = text.length
    let iteration = 0
    const maxIterations = 8
    
    // Each character position resolves left to right with stagger
    // Actually the requested algorithm:
    // for each character, cycle 8 times at 30ms. Resolve left to right with 30ms stagger.
    // Meaning index i starts resolving at i * 30ms.
    
    const interval = setInterval(() => {
      setDisplayText((current) => {
        return text.split('').map((char, index) => {
          if (char === ' ') return ' '
          
          // If this character's time hasn't come yet to resolve, scramble it
          // Iteration progresses every 30ms.
          // Character at index `index` should stop scrambling when iteration >= index + maxIterations
          if (iteration >= index + maxIterations) {
            return text[index]
          }
          
          // Otherwise pick a random character
          return chars[Math.floor(Math.random() * chars.length)]
        }).join('')
      })
      
      iteration++
      
      if (iteration >= length + maxIterations) {
        clearInterval(interval)
        setDisplayText(text) // ensure final state
      }
    }, 30)
  }

  useGSAP(() => {
    if (!containerRef.current) return

    // Animate on scroll trigger if no explicit trigger provided
    if (trigger === undefined) {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 90%',
        onEnter: () => {
          if (!hasAnimated.current) {
            hasAnimated.current = true
            scramble()
          }
        }
      })
    }
  }, { scope: containerRef, dependencies: [trigger] })

  // Explicit trigger change
  useEffect(() => {
    if (trigger) {
      scramble()
    }
  }, [trigger])

  return (
    <span ref={containerRef} className={className}>
      {displayText}
    </span>
  )
}
