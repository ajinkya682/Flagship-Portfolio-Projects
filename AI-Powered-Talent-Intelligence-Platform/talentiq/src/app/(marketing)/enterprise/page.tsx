import SectionWrapper from '@/components/marketing/SectionWrapper'
import FinalCTASection from '@/components/marketing/FinalCTASection'
import { Briefcase, ShieldCheck, Lock, SlidersHorizontal } from 'lucide-react'

export default function EnterprisePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-white pt-32 pb-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-purple-500 opacity-20 blur-[100px]"></div>
        <div className="max-w-[800px] mx-auto px-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 text-purple-600 font-semibold text-sm mb-6 border border-purple-100">
            <Briefcase className="w-4 h-4" />
            <span>For Enterprise</span>
          </div>
          <h1 className="font-display text-[48px] md:text-[64px] font-extrabold text-neutral-900 tracking-tight leading-[1.1] mb-6">
            Advanced security, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-fuchsia-600">ultimate control</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            TalentIQ Enterprise provides the robust security, compliance, and customization capabilities required by large organizations and global teams.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/contact" className="h-12 px-8 inline-flex items-center justify-center gap-2 font-body text-[15px] font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-full shadow-[0_4px_14px_rgba(147,51,234,0.3)] hover:shadow-[0_6px_20px_rgba(147,51,234,0.4)] transition-all">
              Contact sales
            </a>
            <a href="/resources" className="h-12 px-8 inline-flex items-center justify-center gap-2 font-body text-[15px] font-semibold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-full transition-all">
              Read security whitepaper
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-neutral-50 relative">
        <div className="max-w-[1200px] mx-auto px-5 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-display text-[32px] md:text-[40px] font-bold text-neutral-900 mb-4">Enterprise-grade capabilities</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">Configure TalentIQ to match your organization's exact security policies and operational workflows.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-6 border border-purple-100">
                <ShieldCheck className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Compliance Ready</h3>
              <p className="text-neutral-600 leading-relaxed">SOC2 Type II, GDPR, CCPA, and ISO 27001 compliant. We protect your data with the highest industry standards.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-fuchsia-50 flex items-center justify-center mb-6 border border-fuchsia-100">
                <Lock className="w-7 h-7 text-fuchsia-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">SSO & Provisioning</h3>
              <p className="text-neutral-600 leading-relaxed">Integrate with Okta, Azure AD, or any SAML 2.0 provider. Automate user provisioning with SCIM.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center mb-6 border border-pink-100">
                <SlidersHorizontal className="w-7 h-7 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Advanced Permissions</h3>
              <p className="text-neutral-600 leading-relaxed">Granular role-based access control (RBAC) ensures users only see the candidates and data they need to see.</p>
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
