"use client";

import Image from "next/image";
import { Layers, Sparkles, Filter, LayoutDashboard } from "lucide-react";
import FeatureCard from "./FeatureCard";
import AnimatedGrid from "./AnimatedGrid";
import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "@/lib/gsap";

export default function FeaturesShowcase() {
  const screenshotRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!screenshotRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(screenshotRef.current, {
          clipPath: "inset(0% 0% 0% 0% round 24px)",
        });
        return;
      }

      gsap.fromTo(
        screenshotRef.current,
        { clipPath: "inset(30% 30% 30% 30% round 24px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 24px)",
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: screenshotRef.current,
            start: "top 85%",
            end: "top 30%",
            scrub: 1, // Adding a slight scrub delay makes the scroll feel buttery smooth
          },
        },
      );
    },
    { scope: screenshotRef },
  );

  return (
    <section className="bg-white py-24 md:py-32 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        {/* Header Section */}
        <div className="max-w-[700px] mx-auto text-center flex flex-col items-center">
          {/* Premium Badge Pill */}
          <div className="inline-flex items-center gap-2 h-8 bg-blue-50 border border-blue-200/60 rounded-full px-3.5 shadow-sm mb-6">
            <LayoutDashboard className="w-3.5 h-3.5 text-[#3B58F6]" />
            <span className="font-body text-[12px] font-bold text-[#3B58F6] tracking-wider uppercase">
              Recruiter Workflow
            </span>
          </div>

          <h2 className="font-display text-[36px] md:text-[48px] font-extrabold text-[#0A101D] mt-2 leading-[1.1] tracking-tight">
            Your entire pipeline, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B58F6] to-[#8B5CF6]">
              one view.
            </span>
          </h2>

          <p className="font-body text-[18px] md:text-[20px] text-neutral-600 mt-6 leading-relaxed max-w-[600px]">
            Move faster with a kanban board that updates in real-time. Drag,
            drop, score, and hire without ever leaving the page.
          </p>
        </div>

        {/* Product Screenshot Container */}
        <div className="mt-16 max-w-[1100px] mx-auto relative z-10">
          {/* Ambient Backlight Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3B58F6]/20 via-purple-500/10 to-[#10B981]/20 blur-[100px] transform scale-[0.9] -z-10" />

          {/* Masked Image Element */}
          <div
            ref={screenshotRef}
            className="rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-neutral-200/80 bg-white overflow-hidden will-change-[clip-path]"
          >
            {/* Premium Browser Chrome */}
            <div className="h-12 bg-[#F8F9FB] flex items-center px-4 justify-between border-b border-neutral-200/80">
              {/* macOS Dots */}
              <div className="flex gap-1.5 w-16">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 shadow-sm" />
              </div>

              {/* Mock Address Bar */}
              <div className="flex-grow max-w-[280px] h-6 bg-white rounded-md border border-neutral-200 shadow-inner flex items-center justify-center">
                <div className="w-24 h-1.5 bg-neutral-200 rounded-full" />
              </div>

              {/* Spacer for flex balance */}
              <div className="w-16" />
            </div>

            {/* Image Container */}
            <div className="relative w-full aspect-[16/10] md:aspect-[16/9] bg-neutral-50 p-1 md:p-2">
              <Image
                src="/images/hero-product.png"
                alt="TalentIQ Pipeline Kanban Board"
                fill
                className="object-cover object-top rounded-b-[18px]"
                sizes="(max-width: 1200px) 100vw, 1100px"
              />
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <AnimatedGrid animation="rise" columns={3} gap={32} className="mt-16">
          <FeatureCard
            icon={Layers}
            title="Visual pipeline management"
            description="Drag candidates between stages. Everyone sees it happen live."
          />
          <FeatureCard
            icon={Sparkles}
            title="AI scoring on every application"
            description="Ranked and explained the moment they apply."
          />
          <FeatureCard
            icon={Filter}
            title="Smart filtering"
            description="Sort by score, source, or stage. Bulk actions included."
          />
        </AnimatedGrid>
      </div>
    </section>
  );
}
