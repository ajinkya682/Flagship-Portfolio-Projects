'use client'

import { useState } from 'react'
import { X, Copy, CheckCircle2, Linkedin, Twitter, Mail, Code } from 'lucide-react'
import { Job } from '@/store/domain.store'

interface ShareJobModalProps {
  job: Job
  companySlug: string
  onClose: () => void
}

export default function ShareJobModal({ job, companySlug, onClose }: ShareJobModalProps) {
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedEmbed, setCopiedEmbed] = useState(false)
  
  const publicUrl = `https://talentiq.co/careers/${companySlug}/${job.slug || job.id}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handleCopyEmbed = () => {
    const embedCode = `<iframe src="${publicUrl}?embed=true" width="100%" height="600" frameborder="0"></iframe>`
    navigator.clipboard.writeText(embedCode)
    setCopiedEmbed(true)
    setTimeout(() => setCopiedEmbed(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-[24px] bg-neutral-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] shadow-xl w-full max-w-[500px] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-[24px] py-[20px] border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <h3 className="font-display text-[18px] font-bold text-neutral-900">Share Job Post</h3>
          <button onClick={onClose} className="p-[6px] text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-[24px] flex flex-col gap-[24px]">
          
          {/* Link Copy */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-body text-[13px] font-semibold text-neutral-700">Public Link</label>
            <div className="flex items-center gap-[8px]">
              <div className="flex-1 h-[44px] px-[16px] bg-neutral-50 border border-neutral-200 rounded-[12px] flex items-center overflow-hidden">
                <span className="font-mono text-[13px] text-neutral-500 truncate">{publicUrl}</span>
              </div>
              <button 
                onClick={handleCopyLink}
                className="h-[44px] px-[20px] bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-[14px] rounded-[12px] transition-colors flex items-center gap-[6px] shrink-0"
              >
                {copiedLink ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
                {copiedLink ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Social Share */}
          <div className="flex flex-col gap-[12px]">
            <label className="font-body text-[13px] font-semibold text-neutral-700">Share via Social Media</label>
            <div className="flex items-center gap-[12px]">
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`} target="_blank" rel="noopener noreferrer" className="flex-1 h-[44px] bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] rounded-[12px] flex items-center justify-center transition-colors">
                <Linkedin size={20} />
              </a>
              <a href={`https://twitter.com/intent/tweet?text=We%20are%20hiring%20a%20${encodeURIComponent(job.title)}!&url=${encodeURIComponent(publicUrl)}`} target="_blank" rel="noopener noreferrer" className="flex-1 h-[44px] bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-[12px] flex items-center justify-center transition-colors">
                <Twitter size={20} />
              </a>
              <a href={`mailto:?subject=${encodeURIComponent(`We are hiring: ${job.title}`)}&body=${encodeURIComponent(`Check out this job opening: ${publicUrl}`)}`} className="flex-1 h-[44px] bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-[12px] flex items-center justify-center transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div className="h-[1px] bg-neutral-100 w-full my-[4px]" />

          {/* Embed Option */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-body text-[13px] font-semibold text-neutral-700">Embed on your website</label>
            <p className="font-body text-[13px] text-neutral-500 mb-[4px]">Copy the iframe code to embed this job description and application form on any webpage.</p>
            <div className="flex items-center gap-[8px]">
              <button 
                onClick={handleCopyEmbed}
                className="w-full h-[44px] bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-semibold text-[14px] rounded-[12px] transition-colors flex items-center justify-center gap-[6px]"
              >
                {copiedEmbed ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Code size={16} className="text-neutral-500" />}
                {copiedEmbed ? 'Embed Code Copied' : 'Copy Embed Code'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
