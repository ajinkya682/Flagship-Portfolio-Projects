interface OfferStatusBadgeProps {
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'expired'
}

export default function OfferStatusBadge({ status }: OfferStatusBadgeProps) {
  const getColors = () => {
    switch (status) {
      case 'draft': return 'bg-neutral-100 text-neutral-600'
      case 'sent': return 'bg-primary-100 text-primary-700'
      case 'accepted': return 'bg-accent-100 text-accent-700'
      case 'declined': return 'bg-red-100 text-red-700'
      case 'expired': return 'bg-neutral-200 text-neutral-600'
      default: return 'bg-neutral-100 text-neutral-600'
    }
  }

  return (
    <span className={`px-[12px] py-[4px] rounded-full text-[10px] font-bold uppercase tracking-wider ${getColors()}`}>
      {status}
    </span>
  )
}
