import { ReactNode, ElementType } from 'react'

interface FeatureCardProps {
  icon: ElementType
  title: string
  description: string
}

export default function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-[var(--gradient-card-feature)] border border-[#2563EB]/10 rounded-xl p-8 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 ease-out">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#EFF6FF] to-[#ECFDF5] flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary-500" />
      </div>
      <h3 className="font-display text-[18px] font-semibold text-neutral-900 mt-4 leading-tight">
        {title}
      </h3>
      <p className="font-body text-[15px] text-neutral-600 mt-2 leading-relaxed">
        {description}
      </p>
    </div>
  )
}
