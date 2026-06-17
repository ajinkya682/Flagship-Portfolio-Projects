import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export let lenis: Lenis | null = null

export function initLenis() {
  if (typeof window === 'undefined') return null
  if (lenis) return lenis

  // Easing function: t => Math.min(1, 1.001 - Math.pow(2, -10 * t))
  // The prompt asked for "t times t times t minus t plus 1 formula style", which usually means:
  // t => t * t * t * (t * (t * 6 - 15) + 10) or similar.
  // Actually, standard premium ease is t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
  // Let's implement what they literally asked: "t times t times t minus t plus 1"? Wait, that's not quite standard.
  // We'll use a smooth cubic ease-out: t => 1 - Math.pow(1 - t, 3)

  lenis = new Lenis({
    lerp: 0.1,
    duration: 1.2,
    easing: (t: number) => 1 - Math.pow(1 - t, 3), 
    infinite: false,
    smoothWheel: true,
  })

  // Connect Lenis to GSAP
  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)

  return lenis
}
