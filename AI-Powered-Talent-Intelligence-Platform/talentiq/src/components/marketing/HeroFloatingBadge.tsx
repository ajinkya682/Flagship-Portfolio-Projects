"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ScoreRing } from "@/components/score/ScoreRing";

export default function HeroFloatingBadge() {
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );

  return (
    <div
      className="hidden md:flex absolute right-[-24px] bottom-[-24px] z-30 bg-white shadow-[0_15px_40px_-10px_rgba(0,0,0,0.15)] rounded-2xl pl-5 pr-7 py-4 border border-neutral-100 items-center gap-4 animate-float"
      style={{
        animationPlayState: prefersReducedMotion ? "paused" : "running",
      }}
    >
      <ScoreRing score={91} size="md" />
      <div className="flex flex-col">
        <span className="font-body text-[16px] font-bold text-[#00C076] leading-tight">
          AI Score: 91/100
        </span>
        <span className="font-body text-[14px] text-neutral-500 mt-0.5 font-medium">
          Strong Match
        </span>
      </div>
    </div>
  );
}
