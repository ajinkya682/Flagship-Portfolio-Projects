import Link from 'next/link'
import { CheckCircle, ArrowRight } from 'lucide-react'
import AIScoreDemo from './AIScoreDemo'

export default function AIExplainerSection() {
  return (
    <section className="bg-[#ECFDF5] py-24 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.08),_transparent_70%)] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-5 md:px-10 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left Column */}
          <div className="flex flex-col z-10 relative">
            <span className="overline text-[11px] font-bold text-accent-600 tracking-widest uppercase">
              EXPLAINABLE AI
            </span>
            <h2 className="font-display text-[28px] font-bold text-neutral-900 mt-3 leading-tight">
              A score that shows its work.
            </h2>
            <p className="font-body text-[17px] text-neutral-700 mt-4 max-w-[460px] leading-relaxed">
              No black boxes. TalentIQ reads between the lines of every resume, comparing skills, experience, and context against your specific role requirements.
            </p>
            
            <div className="mt-7 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-accent-500 mt-0.5 shrink-0" />
                <span className="font-body text-[15px] text-neutral-800 leading-snug">
                  Evaluates 40+ data points per candidate
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-accent-500 mt-0.5 shrink-0" />
                <span className="font-body text-[15px] text-neutral-800 leading-snug">
                  Highlights missing skills instantly
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-accent-500 mt-0.5 shrink-0" />
                <span className="font-body text-[15px] text-neutral-800 leading-snug">
                  Flags potential bias in your job descriptions
                </span>
              </div>
            </div>

            <Link
              href="/features"
              className="mt-8 flex items-center justify-center gap-2 h-12 px-6 w-fit bg-primary-500 hover:bg-primary-600 text-white font-body text-[15px] font-semibold rounded-lg shadow-sm transition-colors"
            >
              See how scoring works
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right Column */}
          <div className="relative z-10">
            <AIScoreDemo />
          </div>

        </div>
      </div>
    </section>
  )
}
