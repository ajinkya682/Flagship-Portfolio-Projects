'use client'

import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from '@/lib/gsap'
import { ScrollTrigger } from '@/lib/gsap'

type AnimationType = 'words' | 'lines' | 'cards' | 'stagger' | 'mask' | 'float' | 'none'

interface ScrollRevealProps {
  children: React.ReactNode
  animation?: AnimationType
  start?: string
  scrub?: boolean
  pin?: boolean
  className?: string
}

export default function ScrollReveal({
  children,
  animation = 'none',
  start = 'top 85%',
  scrub = false,
  pin = false,
  className = '',
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current || animation === 'none') return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      // Just a simple fade in if they prefer reduced motion
      gsap.fromTo(containerRef.current, { opacity: 0 }, {
        opacity: 1,
        duration: 0.6,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 90%',
        }
      })
      return
    }

    const trigger = containerRef.current
    const scrollTriggerConfig = {
      trigger,
      start,
      scrub,
      pin,
    }

    // Prepare elements based on type
    let target: any = containerRef.current
    let fromVars: gsap.TweenVars = {}
    let toVars: gsap.TweenVars = { scrollTrigger: scrollTriggerConfig }

    switch (animation) {
      case 'words':
        // For words, we assume children are simple text blocks or we query p, h2, h3
        // Manual split words for p, h2, h3
        const textElements = containerRef.current.querySelectorAll('p, h2, h3')
        const allWords: HTMLElement[] = []
        
        textElements.forEach((el) => {
          const words = el.textContent?.split(' ') || []
          el.innerHTML = ''
          words.forEach(word => {
            const span = document.createElement('span')
            span.style.display = 'inline-block'
            span.style.overflow = 'hidden'
            span.style.verticalAlign = 'top'
            
            const inner = document.createElement('span')
            inner.style.display = 'inline-block'
            inner.textContent = word + '\u00A0'
            inner.className = 'word-inner-anim'
            
            span.appendChild(inner)
            el.appendChild(span)
            allWords.push(inner)
          })
        })

        if (allWords.length > 0) {
          gsap.fromTo(allWords, 
            { y: 60, opacity: 0 }, 
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.03,
              ease: 'power3.out',
              scrollTrigger: scrollTriggerConfig
            }
          )
        }
        break

      case 'lines':
        // Lines animation: animate an underlying border or pseudo element.
        // We'll wrap elements and animate a bottom border width.
        const linesTarget = containerRef.current.children
        gsap.fromTo(linesTarget,
          { '--line-width': '0%' },
          {
            '--line-width': '100%',
            duration: 0.8,
            stagger: 0.1,
            scrollTrigger: scrollTriggerConfig,
            onUpdate: function(this: gsap.core.Tween) {
              // Custom property update logic if needed, but normally handled via CSS class and GSAP CSSPlugin
            }
          }
        )
        // Simplified fallback for lines:
        gsap.fromTo(linesTarget, { opacity: 0, x: -20 }, { opacity: 1, x: 0, stagger: 0.1, scrollTrigger: scrollTriggerConfig })
        break

      case 'cards':
        const cards = Array.from(containerRef.current.children)
        gsap.fromTo(cards,
          { y: 40, opacity: 0, rotation: 2 },
          {
            y: 0,
            opacity: 1,
            rotation: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: scrollTriggerConfig
          }
        )
        break

      case 'stagger':
        const children = Array.from(containerRef.current.children)
        gsap.fromTo(children,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: scrollTriggerConfig
          }
        )
        break

      case 'mask':
        gsap.fromTo(containerRef.current,
          { clipPath: 'inset(0 0 100% 0)' },
          {
            clipPath: 'inset(0 0 0% 0)',
            duration: 1,
            ease: 'power3.inOut',
            scrollTrigger: scrollTriggerConfig
          }
        )
        break

      case 'float':
        gsap.fromTo(containerRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: scrollTriggerConfig,
            onComplete: () => {
              gsap.to(containerRef.current, {
                y: -6,
                duration: 3,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1
              })
            }
          }
        )
        break
    }
  }, { scope: containerRef, dependencies: [animation, start, scrub, pin] })

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}
