import Link from 'next/link'
import IntegrationGrid from './IntegrationGrid'

export default function IntegrationsSection() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-8 xl:px-12">
        
        {/* Header */}
        <div className="max-w-[600px] mx-auto text-center">
          <span className="overline text-[11px] font-bold text-neutral-500 tracking-widest uppercase">
            WORKS WITH YOUR STACK
          </span>
          <h2 className="font-display text-[32px] md:text-[40px] font-bold text-neutral-900 mt-3 leading-tight tracking-tight">
            Connects to every tool you already use.
          </h2>
        </div>

        {/* Grid */}
        <div className="mt-10">
          <IntegrationGrid />
        </div>

        {/* View All Button */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/integrations"
            className="inline-flex items-center justify-center px-6 h-10 rounded-lg bg-neutral-50 hover:bg-neutral-100 text-[14px] font-semibold text-neutral-700 transition-colors"
          >
            View all 40+ integrations
          </Link>
        </div>

      </div>
    </section>
  )
}
