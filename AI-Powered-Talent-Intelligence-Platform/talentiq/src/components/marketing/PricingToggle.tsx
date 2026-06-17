interface PricingToggleProps {
  billingPeriod: 'monthly' | 'annual'
  onToggle: (period: 'monthly' | 'annual') => void
}

export default function PricingToggle({ billingPeriod, onToggle }: PricingToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-full w-fit mx-auto mt-8">
      <button
        onClick={() => onToggle('monthly')}
        className={`px-5 py-2 rounded-full font-body text-[14px] font-semibold transition-all duration-150 ${
          billingPeriod === 'monthly'
            ? 'bg-white text-neutral-900 shadow-xs'
            : 'bg-transparent text-neutral-500 hover:text-neutral-700'
        }`}
      >
        Monthly
      </button>
      <button
        onClick={() => onToggle('annual')}
        className={`px-5 py-2 rounded-full font-body text-[14px] font-semibold transition-all duration-150 flex items-center ${
          billingPeriod === 'annual'
            ? 'bg-white text-neutral-900 shadow-xs'
            : 'bg-transparent text-neutral-500 hover:text-neutral-700'
        }`}
      >
        Annual
        <span className="ml-1.5 bg-[#10B981] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
          Save 20%
        </span>
      </button>
    </div>
  )
}
