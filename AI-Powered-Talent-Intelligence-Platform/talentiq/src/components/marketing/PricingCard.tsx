import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

interface PricingCardProps {
  name: string
  price: number
  description: string
  features: string[]
  ctaText: string
  ctaHref: string
  featured?: boolean
  billingPeriod: 'monthly' | 'annual'
}

export default function PricingCard({
  name,
  price,
  description,
  features,
  ctaText,
  ctaHref,
  featured = false,
  billingPeriod,
}: PricingCardProps) {
  const displayPrice = billingPeriod === 'annual' ? Math.floor(price * 0.8) : price

  return (
    <div 
      className={`rounded-xl p-8 md:p-9 flex flex-col h-full ${
        featured 
          ? 'bg-[#0A2540] shadow-xl relative z-10 scale-100 lg:scale-[1.04]' 
          : 'bg-white border border-neutral-200 shadow-sm'
      }`}
    >
      {featured && (
        <div className="absolute -top-3 right-5 bg-[#10B981] text-white text-[10px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
          Most Popular
        </div>
      )}

      <div className={`overline text-[11px] uppercase font-bold tracking-widest ${featured ? 'text-white/50' : 'text-neutral-500'}`}>
        {name}
      </div>

      <div className="mt-4 flex items-baseline gap-1">
        <span className={`font-display text-[36px] font-extrabold leading-none ${featured ? 'text-white' : 'text-neutral-900'}`}>
          ${displayPrice}
        </span>
        <span className={`font-body text-[15px] ${featured ? 'text-white/60' : 'text-neutral-500'}`}>
          /month
        </span>
      </div>

      <p className={`font-body text-[14px] mt-3 ${featured ? 'text-white/70' : 'text-neutral-600'}`}>
        {description}
      </p>

      <div className={`w-full h-[1px] my-6 ${featured ? 'bg-white/10' : 'bg-neutral-100'}`} />

      <div className="flex flex-col gap-3 flex-grow">
        {features.map((feature, i) => (
          <div key={i} className="flex items-start gap-3">
            <CheckCircle className={`w-3.5 h-3.5 shrink-0 mt-[3px] ${featured ? 'text-accent-400' : 'text-accent-500'}`} />
            <span className={`font-body text-[14px] leading-snug ${featured ? 'text-white/85' : 'text-neutral-700'}`}>
              {feature}
            </span>
          </div>
        ))}
      </div>

      <Link
        href={ctaHref}
        className={`mt-8 w-full h-12 rounded-lg flex items-center justify-center font-body text-[15px] font-semibold transition-colors ${
          featured
            ? 'bg-white text-primary-500 hover:bg-neutral-50 shadow-sm'
            : 'bg-primary-500 text-white hover:bg-primary-600 shadow-sm'
        }`}
      >
        {ctaText}
      </Link>
    </div>
  )
}
