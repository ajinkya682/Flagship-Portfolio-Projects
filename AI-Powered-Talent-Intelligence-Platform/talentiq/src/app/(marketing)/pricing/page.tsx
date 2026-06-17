import PricingSection from '@/components/marketing/PricingSection'
import FAQSection from '@/components/marketing/FAQSection'
import FinalCTASection from '@/components/marketing/FinalCTASection'
import { Tag } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-white pt-32 pb-16 text-center relative overflow-hidden border-b border-neutral-100">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>
        <div className="max-w-[800px] mx-auto px-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 font-semibold text-sm mb-6 border border-blue-100">
            <Tag className="w-4 h-4" />
            <span>Pricing Plans</span>
          </div>
          <h1 className="font-display text-[48px] md:text-[72px] font-extrabold text-neutral-900 tracking-tight leading-[1.05] mb-6">
            Invest in your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">growth engine.</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            World-class talent intelligence at a fraction of the cost of traditional agencies. Transparent plans that scale from your first hire to your 500th.
          </p>
        </div>
      </section>
      
      <div className="relative z-20 bg-[#F9FAFB]">
        <PricingSection />
      </div>
      
      <FAQSection />
      
      <div className="mt-12">
        <FinalCTASection />
      </div>
    </div>
  )
}
