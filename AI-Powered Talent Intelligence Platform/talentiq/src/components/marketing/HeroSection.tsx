import Link from 'next/link'
import { Sparkles, CreditCard, ShieldCheck, Zap, ArrowRight } from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import HeroMeshBackground from './HeroMeshBackground'
import HeroAvatarCluster from './HeroAvatarCluster'
import HeroFloatingBadge from './HeroFloatingBadge'
import HeroProductMockup from './HeroProductMockup'
import HeroInlineCTA from './HeroInlineCTA'
import { GradientText } from '@/components/shared/GradientText'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-neutral-50 min-h-[680px] pt-12 md:pt-16 lg:pt-24 pb-20">
      <HeroMeshBackground />
      
      <PageContainer className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-8">
          {/* LEFT COLUMN */}
          <div className="flex flex-col">
            {/* Item 1 - AI Badge Pill */}
            <div 
              className="inline-flex items-center gap-1.5 h-7 bg-accent-100 border border-accent-200 rounded-full px-3 w-fit animate-fade-slide-up opacity-0 [animation-fill-mode:forwards]"
              style={{ animationDelay: '0ms' }}
            >
              <Sparkles className="w-3 h-3 text-accent-600" />
              <span className="font-body text-[12px] font-semibold text-accent-700">
                AI-Powered Talent Intelligence
              </span>
            </div>

            {/* Item 2 - Headline */}
            <h1 
              className="mt-6 font-display text-[36px] lg:text-[56px] font-extrabold tracking-tight leading-[44px] lg:leading-[64px] text-[#040D1A] animate-fade-slide-up opacity-0 [animation-fill-mode:forwards]"
              style={{ animationDelay: '80ms' }}
            >
              <span className="block">Hire the Best.</span>
              <span className="flex items-center flex-wrap gap-x-3 gap-y-2 mt-2">
                <span>Before Your</span>
                <GradientText>Competition</GradientText>
                <HeroInlineCTA className="hidden lg:inline-flex mt-1" />
              </span>
            </h1>

            {/* Item 3 - Subheading */}
            <p 
              className="mt-5 font-body text-[17px] lg:text-[20px] font-normal text-neutral-600 max-w-[520px] animate-fade-slide-up opacity-0 [animation-fill-mode:forwards]"
              style={{ animationDelay: '220ms' }}
            >
              Stop losing great candidates to outdated filters. TalentIQ scores every applicant with explainable AI so your team makes faster, fairer decisions.
            </p>

            {/* Item 4 - Avatar Cluster */}
            <div 
              className="mt-6 animate-fade-slide-up opacity-0 [animation-fill-mode:forwards]"
              style={{ animationDelay: '280ms' }}
            >
              <HeroAvatarCluster />
            </div>

            {/* Item 5 - Trust Signals */}
            <div 
              className="mt-6 flex flex-row flex-wrap gap-6 animate-fade-slide-up opacity-0 [animation-fill-mode:forwards]"
              style={{ animationDelay: '340ms' }}
            >
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-neutral-400" />
                <span className="font-body text-[12px] text-neutral-500">No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                <span className="font-body text-[12px] text-neutral-500">SOC 2 Type II</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-neutral-400" />
                <span className="font-body text-[12px] text-neutral-500">Setup in 30 minutes</span>
              </div>
            </div>

            {/* Item 6 - Mobile CTA only */}
            <div className="mt-8 lg:hidden animate-fade-slide-up opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: '400ms' }}>
              <Link
                href="/register"
                className="flex items-center justify-center gap-2 h-[52px] w-full bg-primary-500 hover:bg-primary-600 text-white font-body text-[16px] font-semibold rounded-lg shadow-md transition-colors"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div 
            className="relative pt-4 lg:pt-0 animate-fade-slide-up opacity-0 [animation-fill-mode:forwards]"
            style={{ animationDelay: '100ms' }}
          >
            <HeroProductMockup />
            <HeroFloatingBadge />
          </div>
        </div>
      </PageContainer>
    </section>
  )
}
