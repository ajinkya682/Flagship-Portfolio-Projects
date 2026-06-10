import * as React from "react"
import { ScrollEntry } from "@/components/shared/ScrollEntry"

const logos = [
  "Acme Corp", "TechFlow", "GlobalHire", "Nova Systems",
  "BluePeak", "Vertex AI", "CloudScale", "NextGen Tech"
]

export function LogoStrip() {
  return (
    <ScrollEntry animation="fade-up">
      <section className="w-full border-y border-neutral-200 bg-neutral-50 py-10">
        <div className="mx-auto max-w-[1200px] px-5 md:px-10 lg:px-[80px]">
          <h3 className="mb-6 text-center font-body text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Trusted by fast-growing teams
          </h3>
          
          <div className="relative overflow-hidden">
            {/* Desktop: Flex wrap center */}
            <div className="hidden md:flex flex-wrap items-center justify-center gap-12">
              {logos.map((logo, i) => (
                <div 
                  key={i}
                  className="flex h-8 max-w-[120px] items-center justify-center text-xl font-bold text-neutral-400 opacity-40 grayscale transition-all duration-200 hover:opacity-80 hover:grayscale-0"
                >
                  {/* Placeholder for actual logos */}
                  {logo}
                </div>
              ))}
            </div>

            {/* Mobile: Marquee */}
            <div className="flex md:hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div className="flex min-w-full shrink-0 animate-marquee items-center gap-12 py-2 pr-12">
                {[...logos, ...logos].map((logo, i) => (
                  <div 
                    key={i}
                    className="flex h-8 max-w-[120px] items-center justify-center text-lg font-bold text-neutral-400 opacity-40 grayscale"
                  >
                    {logo}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </ScrollEntry>
  )
}
