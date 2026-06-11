import PricingSection from '@/components/marketing/PricingSection'
import FAQSection from '@/components/marketing/FAQSection'
import FinalCTASection from '@/components/marketing/FinalCTASection'

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-[#F9FAFB] pt-20 pb-10 text-center">
        <div className="max-w-[800px] mx-auto px-5">
          <h1 className="font-display text-[40px] md:text-[56px] font-extrabold text-neutral-900 tracking-tight leading-tight">
            Simple transparent pricing.
          </h1>
          <p className="font-body text-[18px] md:text-[20px] text-neutral-600 mt-4 leading-relaxed">
            No hidden fees, no complex tiers. Just straightforward pricing for teams that want to hire better.
          </p>
        </div>
      </section>
      
      <PricingSection />
      <FAQSection />
      <FinalCTASection />
    </div>
  )
}
