import SectionWrapper from '@/components/marketing/SectionWrapper'
import FinalCTASection from '@/components/marketing/FinalCTASection'
import { TrendingUp, Users, BarChart3, Workflow } from 'lucide-react'

export default function ScalingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-white pt-32 pb-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-emerald-500 opacity-20 blur-[100px]"></div>
        <div className="max-w-[800px] mx-auto px-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold text-sm mb-6 border border-emerald-100">
            <TrendingUp className="w-4 h-4" />
            <span>For Scaling Teams</span>
          </div>
          <h1 className="font-display text-[48px] md:text-[64px] font-extrabold text-neutral-900 tracking-tight leading-[1.1] mb-6">
            Hire faster as you <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">hyper-grow</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            When you need to hire 50 people yesterday, manual processes break down. TalentIQ scales your recruiting operations with AI-driven pipelines and collaborative hiring tools.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/register" className="h-12 px-8 inline-flex items-center justify-center gap-2 font-body text-[15px] font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-full shadow-[0_4px_14px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)] transition-all">
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
            <h2 className="font-display text-[32px] md:text-[40px] font-bold text-neutral-900 mb-4">Built for high-velocity teams</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">Standardize your process and accelerate your time-to-hire without compromising on quality.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 border border-emerald-100">
                <Workflow className="w-7 h-7 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Automated Pipelines</h3>
              <p className="text-neutral-600 leading-relaxed">Set up rules that automatically advance, reject, or communicate with candidates based on their stage and score.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mb-6 border border-teal-100">
                <Users className="w-7 h-7 text-teal-500" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Collaborative Hiring</h3>
              <p className="text-neutral-600 leading-relaxed">Bring your entire team into the process with scorecards, internal notes, and unified candidate views.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center mb-6 border border-cyan-100">
                <BarChart3 className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Advanced Analytics</h3>
              <p className="text-neutral-600 leading-relaxed">Identify bottlenecks in your funnel and track your team's performance with beautiful, real-time dashboards.</p>
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
