import PersonasSection from '@/components/marketing/PersonasSection'
import SectionWrapper from '@/components/marketing/SectionWrapper'
import FinalCTASection from '@/components/marketing/FinalCTASection'

export default function SolutionsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-white pt-20 pb-10 text-center">
        <div className="max-w-[800px] mx-auto px-5">
          <h1 className="font-display text-[40px] md:text-[56px] font-extrabold text-neutral-900 tracking-tight leading-tight">
            Built for every hiring role.
          </h1>
        </div>
      </section>

      <SectionWrapper>
        <PersonasSection />
      </SectionWrapper>

      <SectionWrapper>
        <FinalCTASection />
      </SectionWrapper>
    </div>
  )
}
