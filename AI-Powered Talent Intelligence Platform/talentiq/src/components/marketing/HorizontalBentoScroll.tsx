"use client";

import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "@/lib/gsap";
import { Star, LayoutGrid, Sparkles, Zap, CheckCircle2 } from "lucide-react";
import { useLenis } from "@studio-freight/react-lenis";

const integrations = [
  { name: "Slack", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/slack.svg" },
  { name: "Google", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/google.svg" },
  { name: "Teams", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/microsoftteams.svg" },
  { name: "Greenhouse", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/greenhouse.svg" },
  { name: "LinkedIn", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/linkedin.svg" },
  { name: "Indeed", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/indeed.svg" },
  { name: "Calendly", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/calendly.svg" },
  { name: "Zoom", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/zoom.svg" },
  { name: "DocuSign", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/docusign.svg" },
  { name: "Workday", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/workday.svg" },
  { name: "Zapier", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/zapier.svg" },
  { name: "BambooHR", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/bamboohr.svg" },
];

export default function HorizontalBentoScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const lenis = useLenis();

  const cardWidth = 480;
  const gap = 32;

  useGSAP(
    () => {
      if (!containerRef.current || !trackRef.current) return;
      const isDesktop = window.innerWidth >= 1024;
      if (
        !isDesktop ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      const cards = gsap.utils.toArray(".bento-card") as HTMLElement[];
      if (cards.length === 0) return;

      const trackWidth = cardWidth * cards.length + gap * (cards.length - 1);
      
      // Calculate precise scroll distance to center the last card on the screen.
      const initialLeft = trackRef.current.getBoundingClientRect().left;
      const lastCardCenter = initialLeft + trackWidth - (cardWidth / 2);
      const screenCenter = window.innerWidth / 2;
      const horizontalScrollDistance = lastCardCenter - screenCenter;

      // We'll add extra scroll distance for the scale/fade out effect, reduced slightly for less dead space
      const totalScrollDistance = horizontalScrollDistance + window.innerHeight * 0.5;

      // Create the horizontal tween separately so it can be used for containerAnimation
      const scrollTween = gsap.to(trackRef.current, {
        x: -horizontalScrollDistance,
        ease: "none",
        duration: 1, // relative duration in the timeline
      });

      // Create a master timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          start: "center center",
          end: () => `+=${totalScrollDistance}`, // Pin until both horizontal and scale animations are done
          onUpdate: (self) => {
            // Only update active dot during the horizontal phase
            const horizontalRatio = horizontalScrollDistance / totalScrollDistance;
            const progress = Math.min(1, self.progress / horizontalRatio);
            const index = Math.min(
              cards.length - 1,
              Math.floor(progress * cards.length * 1.1),
            );
            setActiveIndex(index);
          },
        },
      });

      // 1. Horizontal scroll phase
      tl.add(scrollTween);

      // 2. Scale up and fade out the last card
      const lastCard = cards[cards.length - 1];
      tl.to(lastCard, {
        scale: 4,
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut"
      });
      
      // Fade out the other cards
      tl.to(cards.slice(0, -1), {
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut"
      }, "<");

      // Fade out the title and navigation so the screen cleans up
      tl.to(".bento-title-nav", {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: "power2.inOut"
      }, "<");

      // Expand and intensify the ambient background glow to fill the void
      tl.to(".bento-ambient-glow", {
        scale: 1.5,
        opacity: 0.8,
        duration: 0.5,
        ease: "power2.inOut"
      }, "<");

      // Individual card entrances as they scroll into view
      cards.forEach((card, i) => {
        if (i === 0) return;

        gsap.fromTo(
          card,
          { scale: 0.9, opacity: 0, z: -100, rotationY: 10 },
          {
            scale: 1,
            opacity: 1,
            z: 0,
            rotationY: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: scrollTween,
              start: "left 90%",
              end: "left 40%",
              scrub: 1,
            },
          },
        );
      });

      // Card 1: Score Ring and Counter
      const scoreObj = { val: 0 };
      gsap.to(scoreObj, {
        val: 94,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cards[0],
          containerAnimation: scrollTween,
          start: "left 70%",
        },
        onUpdate: () => {
          const el = document.querySelector(".bento-score-text");
          if (el) el.innerHTML = Math.round(scoreObj.val).toString();
        },
      });

      gsap.fromTo(
        ".bento-score-fill",
        { strokeDashoffset: 201 },
        {
          strokeDashoffset: 12, // ~94%
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cards[0],
            containerAnimation: scrollTween,
            start: "left 70%",
          },
        },
      );

      // Card 3: Typewriter Quote
      gsap.to(".bento-quote", {
        text: "TalentIQ completely changed how we hire. The AI scoring is spot on, and we've reduced our time-to-hire by 50%.",
        duration: 2,
        ease: "none",
        scrollTrigger: {
          trigger: cards[2],
          containerAnimation: scrollTween,
          start: "left 75%",
        },
      });

      // Card 5: Integrations rotation
      gsap.to(".integrations-circle", {
        rotation: 360,
        duration: 40,
        ease: "none",
        repeat: -1,
      });
      gsap.to(".integrations-circle-reverse", {
        rotation: -360,
        duration: 50,
        ease: "none",
        repeat: -1,
      });
    },
    { scope: containerRef },
  );

  const scrollToCard = (index: number) => {
    if (!lenis || !containerRef.current || !trackRef.current) return;
    const isDesktop = window.innerWidth >= 1024;
    if (!isDesktop) return;

    const cards = 5;
    const trackWidth = cardWidth * cards + gap * (cards - 1);
    const initialLeft = trackRef.current.getBoundingClientRect().left;
    const scrollDistance = initialLeft + trackWidth;

    const scrollTriggerStart = containerRef.current.offsetTop;
    const targetScroll =
      scrollTriggerStart + (index / (cards - 1)) * scrollDistance;

    lenis.scrollTo(targetScroll, { duration: 1 });
  };

  const cardBaseClass =
    "bento-card w-full lg:w-[480px] h-[400px] rounded-[32px] border border-black/5 bg-white/80 backdrop-blur-xl p-8 flex flex-col relative overflow-hidden group shadow-[0_20px_60px_-15px_rgba(124,58,237,0.1)] hover:shadow-[0_25px_65px_-15px_rgba(124,58,237,0.2)] hover:scale-[1.02] transition-all duration-500 ease-out flex-shrink-0";

  return (
    <div className="block w-full">
      {/* Outer block wrapper prevents flexbox from collapsing the GSAP pin-spacer */}
      <section
        ref={containerRef}
        className="relative bg-[#F8F9FC] text-slate-900 overflow-hidden py-24 lg:py-32 w-full"
      >
        {/* Background ambient light (swirly light-purple/blue blur) */}
        <div className="bento-ambient-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] pointer-events-none opacity-40">
          <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vh] bg-violet-300/40 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vh] bg-blue-300/40 rounded-full blur-[100px]" />
        </div>

        {/* Title & Nav */}
        <div className="bento-title-nav max-w-[1200px] mx-auto px-5 md:px-10 lg:px-8 xl:px-12 mb-12 lg:mb-16 z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 w-full pointer-events-none">
          <div className="pointer-events-auto">
            <h2 className="font-display text-[32px] md:text-[48px] font-bold tracking-tight text-slate-900">
              Built for modern{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500">
                hiring.
              </span>
            </h2>
            <p className="font-body text-[18px] text-slate-500 mt-2 max-w-xl font-medium">
              Everything you need to source, evaluate, and hire top talent in one
              unified platform.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="hidden lg:flex items-center gap-4 pointer-events-auto">
            <div className="flex items-center gap-3 mr-4">
              {[0, 1, 2, 3, 4].map((idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToCard(idx)}
                  className={`h-2 rounded-full transition-all duration-500 ease-out ${
                    activeIndex === idx
                      ? "bg-violet-500 w-8"
                      : "bg-slate-300 w-2 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to card ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Horizontal Track */}
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 lg:px-8 xl:px-12 w-full">
          <div
            ref={trackRef}
            className="flex flex-col lg:flex-row gap-8 lg:gap-[32px] lg:w-max items-center [perspective:1200px]"
          >
            {/* Card 1: AI Scoring */}
            <div className={`${cardBaseClass}`}>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="font-display text-[28px] leading-tight font-semibold text-slate-900">
                  Every candidate scored in seconds.
                </h3>
              </div>
              <div className="relative z-10 self-center mt-auto mb-4">
                {/* Fake Score Ring (Emerald on white) */}
                <div className="relative w-40 h-40 flex items-center justify-center bg-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                  <svg className="absolute w-[85%] h-[85%] -rotate-90" viewBox="0 0 72 72">
                    <circle
                      cx="36"
                      cy="36"
                      r="32"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="6"
                    />
                    <circle
                      className="bento-score-fill"
                      cx="36"
                      cy="36"
                      r="32"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="6"
                      strokeDasharray="201"
                      strokeDashoffset="201"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="font-display text-[42px] font-bold text-slate-900 bento-score-text leading-none tracking-tight">
                      0
                    </span>
                  </div>
                  {/* Match Pill */}
                  <div className="absolute -bottom-3 bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm whitespace-nowrap">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Strong Match
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Speed Stat */}
            <div className={`${cardBaseClass}`}>
              {/* Light dot-grid background */}
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-violet-500" />
                </div>
                <h3 className="font-display text-[28px] font-semibold text-slate-900">
                  Hire 2x faster.
                </h3>
              </div>
              <div className="relative z-10 mt-auto bg-white/60 p-6 rounded-2xl backdrop-blur-sm border border-slate-100 shadow-sm">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-[88px] leading-none font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500 tracking-tighter drop-shadow-sm">
                    -50
                  </span>
                  <span className="font-display text-[40px] font-bold text-violet-500">
                    %
                  </span>
                </div>
                <p className="font-body text-slate-500 mt-2 text-[15px] font-medium leading-relaxed">
                  Average reduction in time-to-hire across all engineering roles.
                </p>
              </div>
            </div>

            {/* Card 3: Social Proof */}
            <div className={`${cardBaseClass} justify-center`}>
              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Star Rating */}
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                
                <p className="bento-quote font-display text-[22px] leading-relaxed text-slate-700 min-h-[140px] font-medium px-4">
                  {/* TextPlugin will type here */}
                </p>
                
                <div className="mt-6 flex flex-col items-center">
                  {/* Avatar Stack style */}
                  <div className="w-14 h-14 rounded-full p-1 bg-white shadow-md border border-slate-100 mb-3">
                    <div className="w-full h-full rounded-full bg-slate-200 overflow-hidden">
                      <img
                        src="https://i.pravatar.cc/150?img=47"
                        alt="Sarah Jenkins"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-body text-[15px] font-bold text-slate-900">
                      Sarah Jenkins
                    </p>
                    <p className="font-body text-[13px] text-slate-500 font-medium">
                      VP of Talent, TechFlow
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Pipeline (Mini Kanban) */}
            <div className={`${cardBaseClass} p-6`}>
              <div className="relative z-10 mb-6 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <LayoutGrid className="w-5 h-5 text-blue-500" />
                  </div>
                  <h3 className="font-display text-[24px] font-semibold text-slate-900">
                    Visual Pipeline.
                  </h3>
                </div>
              </div>
              {/* Miniature Kanban Columns */}
              <div className="relative flex-grow flex gap-3 w-[600px]">
                {["Applied", "Screening", "Interview", "Offer"].map((col, idx) => (
                  <div
                    key={col}
                    className="w-36 h-full bg-slate-50/80 rounded-xl p-2.5 border border-slate-200/60 shadow-sm"
                  >
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">
                      {col}
                    </div>
                    
                    {idx === 1 && (
                      <>
                        {/* Detailed Mini Card */}
                        <div className="w-full bg-white rounded-lg p-2.5 shadow-sm border border-slate-100 mb-2 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden shrink-0">
                              <img src={`https://i.pravatar.cc/150?img=${idx + 10}`} className="w-full h-full object-cover" />
                            </div>
                            <div className="w-full">
                              <div className="h-2 w-3/4 bg-slate-200 rounded-full mb-1" />
                              <div className="h-1.5 w-1/2 bg-slate-100 rounded-full" />
                            </div>
                          </div>
                          <div className="flex items-center gap-1 mt-2 bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded text-[9px] font-bold w-max">
                             <Sparkles className="w-2.5 h-2.5" /> 94 Score
                          </div>
                        </div>
                        
                        {/* Simple Mini Card */}
                        <div className="w-full h-12 bg-white rounded-lg border border-slate-100 mb-2 shadow-sm opacity-60" />
                      </>
                    )}
                    {idx !== 1 && (
                      <div className="w-full h-12 bg-white/60 rounded-lg border border-slate-100/60 mb-2 shadow-sm" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Card 5: Integrations */}
            <div className={`${cardBaseClass} items-center justify-center`}>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.08)_0%,transparent_70%)]" />
              <h3 className="absolute top-8 left-8 font-display text-[28px] font-semibold text-slate-900 z-20">
                Plays nicely with others.
              </h3>

              <div className="relative w-72 h-72 mt-8 flex items-center justify-center">
                {/* Pulse rings */}
                <div className="absolute inset-0 bg-violet-500/5 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-4 bg-blue-500/5 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />

                {/* Inner Orbit */}
                <div className="absolute inset-8 rounded-full border border-slate-200/80 integrations-circle-reverse flex items-center justify-center">
                  {integrations.slice(0, 4).map((int, i) => {
                    const angle = (i / 4) * Math.PI * 2;
                    const radius = 96;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    return (
                      <div
                        key={int.name}
                        className="absolute w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center p-2.5 shadow-sm"
                        style={{
                          transform: `translate(${x}px, ${y}px) rotate(${-angle}rad)`,
                        }}
                      >
                        <img src={int.icon} alt={int.name} className="w-full h-full opacity-60" />
                      </div>
                    );
                  })}
                </div>
                
                {/* Outer Orbit */}
                <div className="absolute -inset-4 rounded-full border border-slate-200/50 integrations-circle flex items-center justify-center">
                  {integrations.slice(4, 12).map((int, i) => {
                    const angle = (i / 8) * Math.PI * 2;
                    const radius = 144;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    return (
                      <div
                        key={int.name}
                        className="absolute w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center p-3 shadow-sm"
                        style={{
                          transform: `translate(${x}px, ${y}px) rotate(${-angle}rad)`,
                        }}
                      >
                        <img src={int.icon} alt={int.name} className="w-full h-full opacity-50" />
                      </div>
                    );
                  })}
                </div>

                {/* Center Element */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-[0_8px_30px_rgba(139,92,246,0.3)] z-10 border border-white">
                  <Sparkles className="w-8 h-8 text-white drop-shadow-md" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
