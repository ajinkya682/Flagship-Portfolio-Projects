import { CheckCircle } from 'lucide-react'

interface PlanCardProps {
  name: string
  price: string
  renewalDate: string
  features: string[]
  isCurrent?: boolean
}

export default function PlanCard({ name, price, renewalDate, features, isCurrent }: PlanCardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border p-[24px] flex flex-col font-body ${isCurrent ? 'border-primary-500 ring-1 ring-primary-500/20 relative' : 'border-[#E5E7EB]'}`}>
      {isCurrent && (
        <span className="absolute -top-[10px] right-[24px] bg-primary-500 text-white px-[12px] py-[4px] rounded-full text-[11px] font-bold uppercase tracking-wider">
          Current Plan
        </span>
      )}
      
      <h4 className="text-[18px] font-bold text-neutral-900">{name}</h4>
      <div className="flex items-end gap-[4px] mt-[12px] mb-[4px]">
        <h2 className="text-[32px] font-display font-bold text-neutral-900 leading-none">{price}</h2>
        <span className="text-[14px] text-neutral-500 mb-[4px]">/month</span>
      </div>
      <p className="text-[13px] text-neutral-500 mb-[24px]">Renews on {renewalDate}</p>

      <ul className="flex flex-col gap-[12px]">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-[12px]">
            <CheckCircle size={18} className="text-accent-500 shrink-0 mt-[2px]" />
            <span className="text-[14px] text-neutral-700">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
