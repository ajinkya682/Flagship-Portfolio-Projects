'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Fragment } from 'react'

const routeMap: Record<string, string> = {
  dashboard: 'Dashboard',
  jobs: 'Jobs',
  candidates: 'Candidates',
  pipeline: 'Pipeline',
  interviews: 'Interviews',
  offers: 'Offers',
  messages: 'Messages',
  analytics: 'Analytics',
  insights: 'AI Insights',
  settings: 'Settings',
  new: 'Create New'
}

export default function Breadcrumb() {
  const pathname = usePathname()
  
  if (!pathname || pathname === '/') return null

  // Remove trailing slashes, filter out empty strings and app route group
  const segments = pathname.split('/').filter(s => s && s !== '(app)')

  return (
    <div className="flex items-center gap-[8px]">
      {segments.length > 1 && (
        <Link 
          href={`/${segments.slice(0, -1).join('/')}`}
          className="flex items-center justify-center w-[24px] h-[24px] rounded-md hover:bg-neutral-100 text-neutral-500 transition-colors mr-[4px]"
        >
          <ArrowLeft size={16} />
        </Link>
      )}

      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1
        // Look up readable name, fallback to capitalized segment if not found
        const readableName = routeMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
        
        return (
          <Fragment key={index}>
            {index > 0 && (
              <span className="text-neutral-300 text-[14px]">/</span>
            )}
            
            {!isLast ? (
              <Link 
                href={`/${segments.slice(0, index + 1).join('/')}`}
                className="text-[13px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                {readableName}
              </Link>
            ) : (
              <span className="text-[17px] font-semibold text-neutral-900 font-display mt-[2px]">
                {readableName}
              </span>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}
