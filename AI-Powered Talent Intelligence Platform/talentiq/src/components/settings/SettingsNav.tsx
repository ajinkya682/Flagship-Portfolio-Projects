'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, Users, GitMerge, Mail, Puzzle, CreditCard, Shield, Code2 } from 'lucide-react'

const SETTINGS_LINKS = [
  { href: '/settings', label: 'General', icon: Building2 },
  { href: '/settings/users', label: 'Team Members', icon: Users },
  { href: '/settings/pipeline', label: 'Pipeline Stages', icon: GitMerge },
  { href: '/settings/templates', label: 'Email Templates', icon: Mail },
  { href: '/settings/integrations', label: 'Integrations', icon: Puzzle },
  { href: '/settings/billing', label: 'Billing', icon: CreditCard },
  { href: '/settings/security', label: 'Security', icon: Shield },
  { href: '/settings/api', label: 'API Access', icon: Code2 },
]

export default function SettingsNav() {
  const pathname = usePathname()

  return (
    <div className="w-[200px] shrink-0 flex flex-col font-body">
      <h3 className="text-[13px] uppercase font-semibold text-neutral-500 tracking-wider mb-[16px] px-[12px]">Settings</h3>
      <nav className="flex flex-col gap-[4px]">
        {SETTINGS_LINKS.map(link => {
          const isActive = pathname === link.href
          
          return (
            <Link 
              key={link.href}
              href={link.href}
              className={`relative flex items-center gap-[10px] px-[12px] py-[8px] rounded-r-md text-[14px] font-medium transition-colors ${
                isActive 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary-500 rounded-r-full" />
              )}
              <link.icon size={16} />
              {link.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
