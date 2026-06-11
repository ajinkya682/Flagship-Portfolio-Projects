import { Mail, Phone, Linkedin } from 'lucide-react'
import { StageBadge } from '@/components/shared/StageBadge'
import { SourceBadge } from '@/components/shared/SourceBadge'
import { Application } from '@/types/domain.types'
import { formatDate } from '@/lib/utils'

interface ApplicationHeaderProps {
  application: Application
}

export default function ApplicationHeader({ application }: ApplicationHeaderProps) {
  const { candidate } = application

  return (
    <div className="flex flex-col gap-[12px] bg-white rounded-t-xl p-[24px] border-b border-[#E5E7EB]">
      <div className="flex justify-between items-start">
        <h1 className="font-display text-[28px] font-bold text-neutral-900 tracking-tight">
          {candidate.name}
        </h1>
        
        <div className="flex gap-[12px]">
          {candidate.email && (
            <a href={`mailto:${candidate.email}`} className="text-neutral-500 hover:text-primary-500 transition-colors">
              <Mail size={18} />
            </a>
          )}
          {candidate.phone && (
            <a href={`tel:${candidate.phone}`} className="text-neutral-500 hover:text-primary-500 transition-colors">
              <Phone size={18} />
            </a>
          )}
          {candidate.linkedinUrl && (
            <a href={candidate.linkedinUrl} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-[#0A66C2] transition-colors">
              <Linkedin size={18} />
            </a>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-[16px]">
        <StageBadge stage={application.stage as any} />
        <SourceBadge source={application.source as any} />
        <span className="font-body text-[13px] text-neutral-500">
          Applied {formatDate(application.appliedAt)}
        </span>
      </div>
    </div>
  )
}
