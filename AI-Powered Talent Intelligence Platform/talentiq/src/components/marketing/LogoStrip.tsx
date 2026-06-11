'use client'

import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

export default function LogoStrip() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  
  const companies = [
    'Momentum Labs', 'Prism Health', 'Orbit Finance', 'Cascade AI', 
    'Nova Robotics', 'Apex Ventures', 'Vertex Systems', 'Luminary Co.'
  ]

  return (
    <section className="bg-[#F9FAFB] py-10 border-y border-neutral-100 overflow-hidden">
      <div className="text-center mb-6">
        <span className="overline text-[11px] uppercase font-semibold text-neutral-400 tracking-widest">
          TRUSTED BY FAST-GROWING TEAMS
        </span>
      </div>

      {!isMobile ? (
        <div className="max-w-[1200px] mx-auto px-10">
          <div className="flex flex-row justify-center flex-wrap gap-12">
            {companies.map((company, i) => (
              <div 
                key={i} 
                className="font-display text-[14px] font-semibold text-neutral-400 opacity-40 grayscale hover:grayscale-0 hover:opacity-80 transition-all duration-200 cursor-default"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden w-full" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
          <div className="flex w-max animate-marquee">
            <div className="flex gap-16 px-8">
              {companies.map((company, i) => (
                <div key={`m1-${i}`} className="font-display text-[14px] font-semibold text-neutral-400 opacity-40">
                  {company}
                </div>
              ))}
            </div>
            <div className="flex gap-16 px-8">
              {companies.map((company, i) => (
                <div key={`m2-${i}`} className="font-display text-[14px] font-semibold text-neutral-400 opacity-40">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
