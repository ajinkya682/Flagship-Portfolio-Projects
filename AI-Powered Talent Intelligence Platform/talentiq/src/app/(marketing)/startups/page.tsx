import SectionWrapper from '@/components/marketing/SectionWrapper'
import FinalCTASection from '@/components/marketing/FinalCTASection'
import { Building2, Rocket, Zap, Shield } from 'lucide-react'

export default function StartupsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-white pt-32 pb-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>
        <div className="max-w-[800px] mx-auto px-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 font-semibold text-sm mb-6 border border-blue-100">
            <Building2 className="w-4 h-4" />
            <span>For Startups</span>
          </div>
          <h1 className="font-display text-[48px] md:text-[64px] font-extrabold text-neutral-900 tracking-tight leading-[1.1] mb-6">
            Build your foundational <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">dream team</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Move fast and break things, but don't break your hiring process. TalentIQ gives early-stage startups the enterprise-grade tools to hire top 1% talent quickly and affordably.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/register" className="h-12 px-8 inline-flex items-center justify-center gap-2 font-body text-[15px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)] transition-all">
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
            <h2 className="font-display text-[32px] md:text-[40px] font-bold text-neutral-900 mb-4">Why startups choose TalentIQ</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">Everything you need to scale your founding team from seed to Series A, without the overhead.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 border border-blue-100">
                <Rocket className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Move at Startup Speed</h3>
              <p className="text-neutral-600 leading-relaxed">Automate sourcing and scheduling so you can focus on building your product, not managing spreadsheets.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 border border-indigo-100">
                <Zap className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">AI-Powered Sourcing</h3>
              <p className="text-neutral-600 leading-relaxed">Find hidden gems that larger companies miss. Our AI matches you with candidates who fit your unique culture.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center mb-6 border border-violet-100">
                <Shield className="w-7 h-7 text-violet-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Quality Guaranteed</h3>
              <p className="text-neutral-600 leading-relaxed">Assessments tailored for early-stage hires ensure you bring on missionaries, not just mercenaries.</p>
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
