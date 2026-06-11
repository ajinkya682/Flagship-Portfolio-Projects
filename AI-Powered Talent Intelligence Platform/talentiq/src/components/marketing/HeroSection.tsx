import Link from "next/link";
import {
  Sparkles,
  CreditCard,
  ShieldCheck,
  Zap,
  ArrowRight,
  Star,
} from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import HeroAvatarCluster from "./HeroAvatarCluster";
import HeroFloatingBadge from "./HeroFloatingBadge";
import HeroProductMockup from "./HeroProductMockup";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#FAFAFA] min-h-[800px] flex items-center pt-20 pb-24">
      {/* 1. The Vibrant Glowing Wave Background */}
      <div className="absolute bottom-0 right-0 w-full h-[60%] pointer-events-none z-0 overflow-hidden">
        {/* Soft underlying ambient glows */}
        <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[120%] bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#1E60F2]/15 via-[#6334FA]/10 to-transparent blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[60%] h-[80%] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#00C076]/10 via-[#00DFD8]/10 to-transparent blur-[80px]" />

        {/* Sharp SVG light streaks to mimic the sweeping wave lines */}
        <svg
          className="absolute bottom-0 right-0 w-[120%] h-full opacity-70 transform translate-x-[10%]"
          viewBox="0 0 1200 600"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M-200,600 C 300,500 600,200 1300,50"
            stroke="url(#wave-grad-1)"
            strokeWidth="6"
            filter="blur(3px)"
          />
          <path
            d="M-100,650 C 400,550 700,250 1400,100"
            stroke="url(#wave-grad-2)"
            strokeWidth="3"
            filter="blur(1px)"
          />
          <path
            d="M0,700 C 500,600 800,300 1500,150"
            stroke="url(#wave-grad-3)"
            strokeWidth="1.5"
            opacity="0.8"
          />
          <defs>
            <linearGradient id="wave-grad-1" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#1E60F2" stopOpacity="0" />
              <stop offset="50%" stopColor="#6334FA" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#8F34FA" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="wave-grad-2" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#00DFD8" stopOpacity="0" />
              <stop offset="60%" stopColor="#FFB8FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6334FA" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="wave-grad-3" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 2. Decorative Stars */}
      <div className="absolute top-[12%] right-[28%] w-6 h-6 text-[#CBD5E1] opacity-70 pointer-events-none z-0">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
        </svg>
      </div>
      <div className="absolute top-[8%] right-[12%] w-10 h-10 text-white drop-shadow-sm pointer-events-none z-0">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
        </svg>
      </div>

      <PageContainer className="relative z-10 w-full">
        {/* Adjusted to 48/52 split for precise typography wrapping */}
        <div className="grid grid-cols-1 lg:grid-cols-[48%_52%] gap-12 lg:gap-16 items-center">
          {/* LEFT COLUMN */}
          <div className="flex flex-col hero-left-col pt-4">
            {/* AI Badge Pill */}
            <div className="hero-badge inline-flex items-center gap-2 h-[34px] bg-[#E8F8F0] border border-[#A7F3D0]/60 rounded-full px-3.5 w-fit shadow-sm">
              <Sparkles className="w-4 h-4 text-[#00C076]" />
              <span className="font-body text-[13px] font-semibold text-[#00A859]">
                AI-Powered Talent Intelligence
              </span>
            </div>

            {/* Headline with exact Gradient match */}
            <h1 className="mt-8 font-display text-[56px] lg:text-[72px] font-extrabold tracking-tight leading-[1.05] text-[#0A101D]">
              <span className="block">Hire the Best.</span>
              <span className="block">Before Your</span>
              <span className="block pb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#1E60F2] via-[#6334FA] to-[#8F34FA]">
                Competition.
              </span>
            </h1>

            {/* Subheading */}
            <p className="hero-subheading mt-6 font-body text-[18px] lg:text-[20px] font-normal text-neutral-600 max-w-[500px] leading-relaxed">
              Stop losing excellent candidates to outdated filters. TalentIQ
              scores every applicant with explainable AI so your team makes
              faster, fairer decisions.
            </p>

            {/* Dark Green CTA Button */}
            <div className="mt-10">
              <Link
                href="/register"
                className="group inline-flex items-center pl-7 pr-2 py-2 bg-[#00C076] hover:bg-[#00A868] text-white rounded-full text-[17px] font-semibold transition-all duration-300 shadow-[0_8px_20px_-8px_rgba(0,192,118,0.5)] hover:-translate-y-0.5"
              >
                <span className="mr-4">Start Free Trial</span>
                <div className="w-[38px] h-[38px] flex items-center justify-center bg-white rounded-full transition-transform duration-300 group-hover:translate-x-0.5 shadow-sm">
                  <ArrowRight
                    className="w-5 h-5 text-[#00C076]"
                    strokeWidth={2.5}
                  />
                </div>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-14 flex flex-col gap-10">
              <div className="flex items-center gap-4">
                <HeroAvatarCluster />
                <div className="flex flex-col">
                  <span className="font-body text-[15px] font-bold text-neutral-900 leading-tight">
                    +2K recruiters
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex items-center gap-0.5 text-[#FACC15]">
                      <Star className="w-[18px] h-[18px] fill-current" />
                      <Star className="w-[18px] h-[18px] fill-current" />
                      <Star className="w-[18px] h-[18px] fill-current" />
                      <Star className="w-[18px] h-[18px] fill-current" />
                      <Star className="w-[18px] h-[18px] fill-current" />
                    </div>
                    <span className="font-body text-[14px] font-medium text-neutral-600 ml-1">
                      4.9/5
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Icon Row */}
              <div className="flex flex-row flex-wrap gap-x-8 gap-y-4">
                <div className="flex items-center gap-2.5">
                  <CreditCard
                    className="w-[20px] h-[20px] text-[#6334FA]"
                    strokeWidth={2}
                  />
                  <span className="font-body text-[15px] text-neutral-500 font-medium">
                    No credit card required
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck
                    className="w-[20px] h-[20px] text-[#6334FA]"
                    strokeWidth={2}
                  />
                  <span className="font-body text-[15px] text-neutral-500 font-medium">
                    SOC 2 Type II
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Zap
                    className="w-[20px] h-[20px] text-[#6334FA]"
                    strokeWidth={2}
                  />
                  <span className="font-body text-[15px] text-neutral-500 font-medium">
                    Setup in 30 minutes
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Image Mockup */}
          <div className="hero-right-col relative pt-10 lg:pt-0 w-full flex justify-end">
            <div className="relative w-full max-w-[720px]">
              <HeroProductMockup />
              <HeroFloatingBadge />
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
