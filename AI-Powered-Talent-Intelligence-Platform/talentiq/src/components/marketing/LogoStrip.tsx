"use client";

import { cn } from "@/lib/utils";

export default function LogoStrip() {
  const baseCompanies = [
    "Momentum Labs",
    "Prism Health",
    "Orbit Finance",
    "Cascade AI",
    "Nova Robotics",
    "Apex Ventures",
    "Vertex Systems",
    "Luminary Co.",
    "Quantum Dynamics",
    "Echo Systems"
  ];

  // To ensure the marquee works on ultra-wide screens, 
  // we repeat the base companies enough times so that 
  // exactly half of the track is guaranteed to be wider than any screen.
  const halfTrack = [...baseCompanies, ...baseCompanies, ...baseCompanies, ...baseCompanies];

  return (
    <section className="bg-[#F9FAFB] py-12 border-y border-neutral-100 overflow-hidden">
      <div className="text-center mb-10 flex items-center justify-center gap-4 px-6">
        <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-neutral-200"></div>
        <span className="font-display text-[12px] uppercase font-semibold text-neutral-500 tracking-[0.2em]">
          Trusted by fast-growing teams
        </span>
        <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-neutral-200"></div>
      </div>

      <div
        className="relative overflow-hidden w-full flex items-center"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        }}
      >
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {/* We render two identical halves. The animation translates from 0 to -50% */}
          {[1, 2].map((halfIndex) => (
            <div key={halfIndex} className="flex gap-16 px-8 items-center">
              {halfTrack.map((company, i) => (
                <div
                  key={`${halfIndex}-${i}`}
                  className="font-display text-[15px] font-semibold text-neutral-400 opacity-40 grayscale hover:grayscale-0 hover:opacity-80 transition-all duration-300 cursor-default whitespace-nowrap"
                >
                  {company}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
