import TestimonialsSection from '@/components/marketing/TestimonialsSection'
import StatsStrip from '@/components/marketing/StatsStrip'
import SectionWrapper from '@/components/marketing/SectionWrapper'
import FinalCTASection from '@/components/marketing/FinalCTASection'

export default function CustomersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-white pt-20 pb-10 text-center">
        <div className="max-w-[800px] mx-auto px-5">
          <h1 className="font-display text-[40px] md:text-[56px] font-extrabold text-neutral-900 tracking-tight leading-tight">
            Trusted by 500+ teams.
          </h1>
        </div>
      </section>

      <TestimonialsSection />
      
      <SectionWrapper>
        <StatsStrip />
      </SectionWrapper>

      <SectionWrapper>
        <FinalCTASection />
      </SectionWrapper>
    </div>
  )
}
