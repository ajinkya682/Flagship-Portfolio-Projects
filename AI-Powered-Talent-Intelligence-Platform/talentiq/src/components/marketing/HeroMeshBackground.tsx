'use client'

import { useMediaQuery } from '@/hooks/useMediaQuery'

export default function HeroMeshBackground() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div
        className="absolute inset-0 animate-mesh-float"
        style={{
          animationDelay: '0s',
          animationPlayState: prefersReducedMotion ? 'paused' : 'running',
          background: 'radial-gradient(ellipse 30% 60% at 15% 40%, rgba(59, 130, 246, 0.15), transparent)',
        }}
      />
      <div
        className="absolute inset-0 animate-mesh-float"
        style={{
          animationDelay: '6s',
          animationPlayState: prefersReducedMotion ? 'paused' : 'running',
          background: 'radial-gradient(ellipse 40% 50% at 85% 15%, rgba(16, 185, 129, 0.12), transparent)',
        }}
      />
      <div
        className="absolute inset-0 animate-mesh-float"
        style={{
          animationDelay: '12s',
          animationPlayState: prefersReducedMotion ? 'paused' : 'running',
          background: 'radial-gradient(ellipse 35% 40% at 55% 85%, rgba(96, 165, 250, 0.08), transparent)',
        }}
      />
    </div>
  )
}
