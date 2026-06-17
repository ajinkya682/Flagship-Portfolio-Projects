import TestimonialsSection from '@/components/marketing/TestimonialsSection'
import StatsStrip from '@/components/marketing/StatsStrip'
import SectionWrapper from '@/components/marketing/SectionWrapper'
import FinalCTASection from '@/components/marketing/FinalCTASection'
import { Heart } from 'lucide-react'

export default function CustomersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-white pt-32 pb-16 text-center relative overflow-hidden border-b border-neutral-100">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-amber-500 opacity-20 blur-[100px]"></div>
        <div className="max-w-[800px] mx-auto px-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 font-semibold text-sm mb-6 border border-amber-100">
            <Heart className="w-4 h-4 fill-amber-500" />
            <span>Wall of Love</span>
          </div>
          <h1 className="font-display text-[48px] md:text-[72px] font-extrabold text-neutral-900 tracking-tight leading-[1.05] mb-6">
            Loved by the world's most <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">innovative teams.</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            From hyper-growth startups to Fortune 500 enterprises, see how industry leaders are transforming their recruitment pipelines with TalentIQ.
          </p>
        </div>
      </section>

      <div className="relative z-20 bg-white">
        <TestimonialsSection />
      </div>
      
      <SectionWrapper>
        <StatsStrip />
      </SectionWrapper>

      <SectionWrapper>
        <FinalCTASection />
      </SectionWrapper>
    </div>
  )
}
