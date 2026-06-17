'use client'

import React, { useEffect } from 'react'
import { ReactLenis } from '@studio-freight/react-lenis'
import { initLenis } from '@/lib/lenis'

interface SmoothScrollProviderProps {
  children: React.ReactNode
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    // Initialize standalone Lenis instance (handles GSAP ticker connection)
    initLenis()
  }, [])

  return (
    <ReactLenis root options={{ 
      lerp: 0.1, 
      duration: 1.2, 
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      infinite: false,
      smoothWheel: true,
    }}>
      {children}
    </ReactLenis>
  )
}
