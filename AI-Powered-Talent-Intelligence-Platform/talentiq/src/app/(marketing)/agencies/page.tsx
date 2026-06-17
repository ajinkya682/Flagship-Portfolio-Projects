import SectionWrapper from '@/components/marketing/SectionWrapper'
import FinalCTASection from '@/components/marketing/FinalCTASection'
import { Users, Layers, Repeat, Palette } from 'lucide-react'

export default function AgenciesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-white pt-32 pb-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-amber-500 opacity-20 blur-[100px]"></div>
        <div className="max-w-[800px] mx-auto px-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 font-semibold text-sm mb-6 border border-amber-100">
            <Users className="w-4 h-4" />
            <span>For Agencies & Recruiters</span>
          </div>
          <h1 className="font-display text-[48px] md:text-[64px] font-extrabold text-neutral-900 tracking-tight leading-[1.1] mb-6">
            Multiply your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">placements</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Manage multiple clients from a single dashboard. TalentIQ gives recruiting agencies the tools to source faster, present beautifully, and close more deals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/register" className="h-12 px-8 inline-flex items-center justify-center gap-2 font-body text-[15px] font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-full shadow-[0_4px_14px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.4)] transition-all">
              Start free trial
            </a>
            <a href="/contact" className="h-12 px-8 inline-flex items-center justify-center gap-2 font-body text-[15px] font-semibold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-full transition-all">
              Talk to sales
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-neutral-50 relative">
        <div className="max-w-[1200px] mx-auto px-5 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-display text-[32px] md:text-[40px] font-bold text-neutral-900 mb-4">The operating system for modern agencies</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">Impress your clients with a seamless experience from sourcing to offer.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-6 border border-amber-100">
                <Layers className="w-7 h-7 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Multi-Client Workspaces</h3>
              <p className="text-neutral-600 leading-relaxed">Keep candidate data strictly separated by client while maintaining a global pool of talent for your team to source from.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-6 border border-orange-100">
                <Palette className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Client Presentation Portals</h3>
              <p className="text-neutral-600 leading-relaxed">Share beautiful, interactive candidate profiles with your clients instead of attaching messy PDFs to emails.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-6 border border-red-100">
                <Repeat className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Automated Follow-ups</h3>
              <p className="text-neutral-600 leading-relaxed">Never let a candidate go cold. Set up automated email sequences that stop when a candidate replies.</p>
            </div>
          </div>
        </div>
      </section>

      <SectionWrapper>
        <FinalCTASection />
      </SectionWrapper>
    </div>
  )
}
