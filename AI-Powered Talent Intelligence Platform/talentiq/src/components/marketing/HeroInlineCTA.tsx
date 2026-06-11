import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeroInlineCTAProps {
  href?: string
  className?: string
}

export default function HeroInlineCTA({ href = '/register', className }: HeroInlineCTAProps) {
  return (
    <Link
      href={href}
      className={cn(
        'hero-inline-cta hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500/92 border border-white/25 rounded-full text-white font-body text-[15px] font-semibold shadow-glass hover:scale-[1.04] hover:shadow-accent hover:bg-primary-500 active:scale-[0.98] transition-all duration-120 ease-out',
        className
      )}
    >
      Start Free Trial
      <ArrowUpRight className="w-3.5 h-3.5 text-white" />
    </Link>
  )
}
