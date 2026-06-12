import SectionWrapper from '@/components/marketing/SectionWrapper'
import FinalCTASection from '@/components/marketing/FinalCTASection'
import { BookOpen, FileText, Video, ArrowRight } from 'lucide-react'

export default function ResourcesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-neutral-900 pt-32 pb-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="max-w-[800px] mx-auto px-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white font-semibold text-sm mb-6 backdrop-blur-sm border border-white/20">
            <BookOpen className="w-4 h-4" />
            <span>Resources Hub</span>
          </div>
          <h1 className="font-display text-[48px] md:text-[72px] font-extrabold text-white tracking-tight leading-[1.05] mb-6">
            Your unfair advantage in <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">talent acquisition.</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Master the art of modern recruiting. Access our exclusive library of AI playbooks, deep-dive webinars, and proven sourcing templates.
          </p>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-24 bg-white relative -mt-8 rounded-t-[32px] z-20">
        <div className="max-w-[1200px] mx-auto px-5">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-2 mb-12">
            <button className="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm font-semibold transition-transform hover:scale-105">All Resources</button>
            <button className="px-4 py-2 rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 text-sm font-semibold transition-all">Playbooks</button>
            <button className="px-4 py-2 rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 text-sm font-semibold transition-all">Webinars</button>
            <button className="px-4 py-2 rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 text-sm font-semibold transition-all">Case Studies</button>
            <button className="px-4 py-2 rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 text-sm font-semibold transition-all">Product News</button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Featured Article */}
            <div className="group cursor-pointer">
              <div className="aspect-[16/9] rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-50 mb-6 overflow-hidden relative">
                <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-sm mb-4">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-blue-600 mb-3">
                <span>Playbook</span>
                <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
                <span className="text-neutral-500">10 min read</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3 group-hover:text-blue-600 transition-colors">The 2026 Guide to AI-Assisted Sourcing</h3>
              <p className="text-neutral-600 mb-4 line-clamp-2">Discover how the fastest-growing startups are using AI to find and engage candidates that traditional sourcing methods miss.</p>
              <div className="inline-flex items-center gap-1.5 font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">
                Read guide <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
            
            <div className="flex flex-col gap-8">
              {/* Secondary Resource 1 */}
              <div className="flex gap-6 group cursor-pointer">
                <div className="w-1/3 shrink-0 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-50 aspect-[4/3] flex items-center justify-center relative overflow-hidden">
                   <Video className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="text-sm font-semibold text-emerald-600 mb-2">Webinar</div>
                  <h4 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-emerald-600 transition-colors">Fixing your leaky candidate pipeline</h4>
                  <p className="text-neutral-600 text-sm mb-3 line-clamp-2">A masterclass on identifying drop-off points and improving candidate experience.</p>
                </div>
              </div>
              
              {/* Secondary Resource 2 */}
              <div className="flex gap-6 group cursor-pointer">
                <div className="w-1/3 shrink-0 rounded-xl bg-gradient-to-br from-purple-100 to-pink-50 aspect-[4/3] flex items-center justify-center relative overflow-hidden">
                   <FileText className="w-8 h-8 text-purple-600" />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="text-sm font-semibold text-purple-600 mb-2">Case Study</div>
                  <h4 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-purple-600 transition-colors">How Acme Corp reduced time-to-hire by 40%</h4>
                  <p className="text-neutral-600 text-sm mb-3 line-clamp-2">An inside look at the operational changes that transformed Acme's recruiting engine.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Subscribe */}
          <div className="mt-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 border border-blue-100/50 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>
             <div className="relative z-10 max-w-2xl">
               <h3 className="font-display text-2xl md:text-3xl font-bold text-neutral-900 mb-3">Get hiring insights delivered weekly</h3>
               <p className="text-neutral-600 mb-6 text-lg">Join 10,000+ recruiters and founders who receive our latest playbooks and research.</p>
               <form className="flex flex-col sm:flex-row gap-3">
                 <input type="email" placeholder="Work email address" className="flex-1 h-12 px-5 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                 <button type="button" className="h-12 px-8 inline-flex items-center justify-center font-body text-[15px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)] transition-all shrink-0">
                   Subscribe
                 </button>
               </form>
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
