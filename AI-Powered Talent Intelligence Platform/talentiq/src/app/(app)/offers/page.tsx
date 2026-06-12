'use client'

import { useState } from 'react'
import {
  FileText, Search, Filter, Plus, MoreHorizontal,
  CheckCircle2, Clock, XCircle, Eye, Download, Send
} from 'lucide-react'
import Link from 'next/link'
import { useDomainStore } from '@/store/domain.store'

const STATUS_STYLES: Record<string, { bg: string; text: string; icon: React.ElementType; border: string }> = {
  accepted: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2 },
  declined: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: XCircle },
  viewed: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Eye },
  sent: { bg: 'bg-neutral-100', text: 'text-neutral-700', border: 'border-neutral-200', icon: Send },
  draft: { bg: 'bg-neutral-50', text: 'text-neutral-500', border: 'border-neutral-200', icon: FileText },
}

export default function OffersPage() {
  const { offers, candidates } = useDomainStore()
  const [search, setSearch] = useState('')

  const activeOffers = offers.filter(o => o.status === 'sent' || o.status === 'viewed')
  const acceptedOffers = offers.filter(o => o.status === 'accepted')

  return (
    <div className="flex flex-col h-full -mx-[16px] md:-mx-[32px] -mt-[16px] md:-mt-[32px] bg-neutral-50/50 min-h-[calc(100vh-60px)]">
      
      {/* Header */}
      <div className="px-[16px] md:px-[32px] py-[24px] bg-white border-b border-neutral-100 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-[16px] mb-[20px]">
          <div>
            <div className="flex items-center gap-[10px] mb-[4px]">
              <div className="w-[32px] h-[32px] rounded-[8px] bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                <FileText size={16} className="text-white" />
              </div>
              <h1 className="font-display text-[26px] font-bold text-neutral-900 tracking-tight">Offers</h1>
            </div>
            <p className="font-body text-[13px] text-neutral-500">Manage offer letters and track acceptance rates.</p>
          </div>
          <div className="flex items-center gap-[12px]">
            <button className="h-[38px] px-[14px] bg-white border border-neutral-200 text-neutral-700 font-body text-[13px] font-semibold rounded-[8px] hover:bg-neutral-50 transition-colors shadow-sm flex items-center gap-[6px]">
              <Download size={14} /> Export
            </button>
            <button className="h-[38px] px-[14px] bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-body text-[13px] font-semibold rounded-[8px] shadow-sm transition-all flex items-center gap-[6px]">
              <Plus size={14} /> Create Offer
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px]">
          {[
            { label: 'Active Offers', value: activeOffers.length.toString(), color: 'text-blue-600' },
            { label: 'Acceptance Rate', value: offers.length > 0 ? `${Math.round((acceptedOffers.length / offers.length) * 100)}%` : '0%', color: 'text-emerald-600' },
            { label: 'Avg Time to Accept', value: '3.2 days', color: 'text-neutral-700' },
            { label: 'Offers Sent (MTD)', value: offers.length.toString(), color: 'text-neutral-700' },
          ].map(stat => (
            <div key={stat.label} className="bg-neutral-50 rounded-[10px] p-[16px] border border-neutral-100">
              <p className="font-body text-[12px] font-semibold text-neutral-500 mb-[4px]">{stat.label}</p>
              <p className={`font-display text-[24px] font-bold ${stat.color} leading-none`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-[16px] md:p-[32px]">
        <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm overflow-hidden">
          
          {/* Table Toolbar */}
          <div className="px-[20px] py-[16px] border-b border-neutral-50 flex flex-wrap items-center justify-between gap-[16px]">
            <div className="relative">
              <Search size={14} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search candidates or roles..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-[280px] h-[36px] pl-[34px] pr-[12px] bg-neutral-50 border border-neutral-200 rounded-[8px] text-[13px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-primary-400 focus:bg-white transition-all"
              />
            </div>
            <div className="flex items-center gap-[8px]">
              <button className="h-[36px] px-[12px] bg-white border border-neutral-200 text-neutral-600 font-body text-[12px] font-semibold rounded-[8px] hover:bg-neutral-50 transition-colors flex items-center gap-[6px]">
                <Filter size={14} /> Status: All
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50/50 border-b border-neutral-100">
                  <th className="text-left px-[24px] py-[12px] font-body text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Candidate</th>
                  <th className="text-left px-[24px] py-[12px] font-body text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Role & Package</th>
                  <th className="text-left px-[24px] py-[12px] font-body text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-[24px] py-[12px] font-body text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Timeline</th>
                  <th className="px-[24px] py-[12px] w-[60px]" />
                </tr>
              </thead>
              <tbody>
                {offers.map(offer => {
                  const candidate = candidates.find(c => c.id === offer.candidateId)
                  if (!candidate) return null
                  const style = STATUS_STYLES[offer.status] || STATUS_STYLES.draft
                  const StatusIcon = style.icon
                  
                  return (
                    <tr key={offer.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/60 transition-colors group">
                      <td className="px-[24px] py-[16px]">
                        <div className="flex items-center gap-[12px]">
                          <img src={candidate.avatar} alt={candidate.name} className="w-[40px] h-[40px] rounded-[10px] object-cover bg-neutral-100" />
                          <div>
                            <Link href={`/applications/${candidate.id}`} className="font-body text-[14px] font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors">
                              {candidate.name}
                            </Link>
                            <p className="font-body text-[12px] text-neutral-500 mt-[2px]">{candidate.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-[24px] py-[16px]">
                        <p className="font-body text-[13px] font-semibold text-neutral-900">{offer.role}</p>
                        <p className="font-body text-[12px] text-neutral-500 mt-[2px]">{offer.amount} • {offer.equity} eq</p>
                      </td>
                      <td className="px-[24px] py-[16px]">
                        <span className={`inline-flex items-center gap-[4px] px-[10px] py-[4px] rounded-full text-[11px] font-bold uppercase tracking-wide border ${style.bg} ${style.text} ${style.border}`}>
                          <StatusIcon size={12} />
                          {offer.status}
                        </span>
                      </td>
                      <td className="px-[24px] py-[16px]">
                        <div className="flex items-center gap-[6px] font-body text-[12px] text-neutral-600 mb-[4px]">
                          <Send size={12} className="text-neutral-400" /> Sent: {offer.sentDate}
                        </div>
                        <div className="flex items-center gap-[6px] font-body text-[12px] text-neutral-500">
                          <Clock size={12} className={offer.status === 'sent' || offer.status === 'viewed' ? 'text-amber-500' : 'text-neutral-400'} /> 
                          Exp: {offer.expiryDate}
                        </div>
                      </td>
                      <td className="px-[24px] py-[16px] text-right">
                        <button className="text-neutral-400 hover:text-neutral-700 transition-colors p-[4px] rounded-md hover:bg-neutral-100">
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
