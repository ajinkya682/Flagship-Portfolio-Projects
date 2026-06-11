import Image from 'next/image'
import { Layers, Sparkles, Filter } from 'lucide-react'
import FeatureCard from './FeatureCard'

export default function FeaturesShowcase() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 lg:px-20">
        
        {/* Header */}
        <div className="max-w-[700px] mx-auto text-center">
          <span className="overline text-[11px] font-bold text-neutral-500 tracking-widest uppercase">
            RECRUITER WORKFLOW
          </span>
          <h2 className="font-display text-[32px] md:text-[40px] font-bold text-neutral-900 mt-3 leading-tight tracking-tight">
            Your entire pipeline, one view.
          </h2>
          <p className="font-body text-[18px] md:text-[20px] text-neutral-600 mt-4 leading-relaxed">
            Move faster with a kanban board that updates in real-time. Drag, drop, score, and hire without ever leaving the page.
          </p>
        </div>

        {/* Product Screenshot */}
        <div className="mt-12 max-w-[1100px] mx-auto">
          <div className="rounded-xl shadow-xl border border-neutral-200 overflow-hidden bg-neutral-100">
            <Image
              src="/images/hero-product.png"
              alt="TalentIQ Pipeline Kanban Board"
              width={1100}
              height={700}
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          <FeatureCard
            icon={Layers}
            title="Visual pipeline management"
            description="Drag candidates between stages. Everyone sees it happen live."
          />
          <FeatureCard
            icon={Sparkles}
            title="AI scoring on every application"
            description="Ranked and explained the moment they apply."
          />
          <FeatureCard
            icon={Filter}
            title="Smart filtering"
            description="Sort by score, source, or stage. Bulk actions included."
          />
        </div>

      </div>
    </section>
  )
}
