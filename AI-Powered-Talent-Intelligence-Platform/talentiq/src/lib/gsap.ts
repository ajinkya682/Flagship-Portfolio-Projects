import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'

// Note: SplitText is a Club GSAP premium plugin.
// Character-by-character splits will be done manually or via fallback.

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, TextPlugin)

  gsap.defaults({
    ease: 'power2.out',
    duration: 0.6,
  })

  ScrollTrigger.defaults({
    markers: false,
    toggleActions: 'play none none reverse',
  })
}

export { ScrollTrigger, TextPlugin }
export default gsap
