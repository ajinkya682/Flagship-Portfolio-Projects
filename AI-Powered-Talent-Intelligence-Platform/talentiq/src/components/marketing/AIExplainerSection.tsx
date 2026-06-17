import Link from 'next/link'
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'
import AIScoreDemo from './AIScoreDemo'

export default function AIExplainerSection() {
  return (
    <section className="bg-[#FAFAFA] py-24 md:py-32 relative overflow-hidden">
      
      {/* Premium Ambient Background Glows */}
      <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#10B981]/15 via-[#3B58F6]/5 to-transparent blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#3B58F6]/10 via-transparent to-transparent blur-[100px] pointer-events-none z-0" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 lg:gap-20 items-center">
          
          {/* Left Column: Copy & Value Props */}
          <div className="flex flex-col z-10">
            
            {/* Premium Badge Pill */}
            <div className="inline-flex items-center gap-2 h-8 bg-[#E8F8F0] border border-[#A7F3D0]/60 rounded-full px-3.5 w-fit shadow-sm mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="font-body text-[12px] font-bold text-[#059669] tracking-wider uppercase">
                Explainable AI
              </span>
            </div>

            {/* Elevated Headline */}
            <h2 className="font-display text-[40px] lg:text-[52px] font-extrabold text-[#0A101D] leading-[1.1] tracking-tight">
              A score that <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#3B58F6]">
                shows its work.
              </span>
            </h2>
            
            {/* Refined Subheading */}
            <p className="font-body text-[18px] lg:text-[20px] text-neutral-600 mt-6 max-w-[480px] leading-relaxed">
              No black boxes. TalentIQ reads between the lines of every resume, comparing skills, experience, and context against your specific role requirements.
            </p>
            
            {/* Interactive Feature List */}
            <div className="mt-8 flex flex-col gap-1">
              {[
                "Evaluates 40+ data points per candidate",
                "Highlights missing skills instantly",
                "Flags potential bias in your job descriptions"
              ].map((text, i) => (
                <div 
                  key={i}
                  className="group flex items-start gap-4 p-3 -ml-3 rounded-xl hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 border border-transparent hover:border-neutral-100"
                >
                  <div className="mt-0.5 w-6 h-6 rounded-full bg-[#E8F8F0] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  </div>
                  <span className="font-body text-[16px] text-neutral-800 font-medium leading-snug pt-0.5">
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* Brand CTA Button */}
            <div className="mt-10">
              <Link
                href="/features"
                className="group inline-flex items-center px-7 h-[48px] bg-[#3B58F6] hover:bg-[#2e45c7] text-white font-body text-[15px] font-semibold rounded-full shadow-[0_4px_14px_rgba(59,88,246,0.3)] hover:shadow-[0_6px_20px_rgba(59,88,246,0.4)] hover:-translate-y-0.5 transition-all duration-300 w-fit"
              >
                See how scoring works
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Mockup */}
          <div className="relative z-10 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px]">
              {/* Optional: Add a subtle backing glow strictly behind the image */}
              <div className="absolute inset-0 bg-[#10B981]/10 rounded-[2rem] blur-2xl transform -rotate-3 scale-105 pointer-events-none" />
              <AIScoreDemo />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}