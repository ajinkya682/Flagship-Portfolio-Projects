'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import TestimonialCard from './TestimonialCard'
import ParticleField from './ParticleField'

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  
  const testimonials = [
    {
      quote: "We reduced time-to-hire from 45 days to 17 days. The AI scoring alone paid for itself in the first hire.",
      authorName: "Marcus Rodriguez",
      authorTitle: "Head of Talent at Cascade AI",
      authorAvatar: "https://randomuser.me/api/portraits/men/46.jpg",
      metric: "Cut time-to-hire by 62%"
    },
    {
      quote: "TalentIQ caught bias in our job descriptions we had been running for years. That alone changed how we hire.",
      authorName: "Jennifer Park",
      authorTitle: "Chief People Officer at Orbit Finance",
      authorAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
      metric: "Reduced bias flags by 84%"
    },
    {
      quote: "Our hiring managers actually trust the data now. Before it was always gut feel. Now we move faster and with more confidence.",
      authorName: "David Chen",
      authorTitle: "VP Engineering at Prism Health",
      authorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      metric: "3x faster decision making"
    }
  ]

  const totalCards = testimonials.length

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? totalCards - 1 : prev - 1))
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev === totalCards - 1 ? 0 : prev + 1))
  }

  return (
    <section className="bg-[#0A2540] py-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ParticleField />
      </div>
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-8 xl:px-12 relative z-10">
        
        {/* Header */}
        <div className="max-w-[600px] mx-auto text-center">
          <span className="overline text-[11px] font-bold text-accent-300 tracking-widest uppercase">
            CUSTOMER STORIES
          </span>
          <h2 className="font-display text-[32px] md:text-[40px] font-bold text-white mt-3 leading-tight tracking-tight">
            Teams that ship faster with TalentIQ.
          </h2>
        </div>

        {/* Grid (Desktop) / Single Card (Mobile) */}
        <div className="mt-12 max-w-[1100px] mx-auto">
          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>
          
          {/* Mobile/Tablet Single View */}
          <div className="block lg:hidden">
            <TestimonialCard {...testimonials[activeIndex]} />
          </div>
        </div>

        {/* Mobile Carousel Controls */}
        <div className="lg:hidden mt-8 flex justify-center items-center gap-4">
          <button 
            onClick={handlePrev}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors text-white"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-colors ${i === activeIndex ? 'bg-accent-500' : 'bg-neutral-500'}`}
              />
            ))}
          </div>

          <button 
            onClick={handleNext}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors text-white"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  )
}
