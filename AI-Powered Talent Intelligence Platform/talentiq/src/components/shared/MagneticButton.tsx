'use client'

import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'

interface MagneticButtonProps {
  children: React.ReactElement
  strength?: number
}

export default function MagneticButton({ children, strength = 0.3 }: MagneticButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return // Respect reduced motion
    }

    const element = containerRef.current
    if (!element) return

    // We assume the child is a single element that we want to move
    const child = element.firstElementChild as HTMLElement
    if (!child) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const distanceX = e.clientX - centerX
      const distanceY = e.clientY - centerY
      
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
      const diagonal = Math.sqrt(rect.width * rect.width + rect.height * rect.height)
      const activationRadius = diagonal * 1.5

      if (distance < activationRadius) {
        gsap.to(child, {
          x: distanceX * strength,
          y: distanceY * strength,
          duration: 0.6,
          ease: 'power2.out'
        })
      } else {
        // If cursor moves too fast outside the element bounds before mouseleave triggers
        gsap.to(child, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.3)'
        })
      }
    }

    const handleMouseLeave = () => {
      gsap.to(child, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.3)'
      })
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [strength])

  return (
    <div ref={containerRef} className="inline-block relative">
      {children}
    </div>
  )
}
