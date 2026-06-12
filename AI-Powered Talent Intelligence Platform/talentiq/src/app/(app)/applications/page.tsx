'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search, Filter, Sparkles, ExternalLink, ChevronDown,
  Users, TrendingUp, Clock, CheckCircle2, Linkedin, Globe
} from 'lucide-react'
import { useDomainStore } from '@/store/domain.store'

const STAGES = ['All', 'Applied', 'Screening', 'Interview', 'Assessment', 'Offer', 'Hired']
const SOURCES = ['All', 'LinkedIn', 'Indeed', 'Referral', 'Direct', 'Other']

const STAGE_STYLES: Record<string, string> = {
  Applied: 'bg-neutral-100 text-neutral-600',
  Screening: 'bg-blue-50 text-blue-700',
  Interview: 'bg-purple-50 text-purple-700',
  Assessment: 'bg-amber-50 text-amber-700',
  Offer: 'bg-emerald-50 text-emerald-700',
  Hired: 'bg-green-100 text-green-800',
}

function ScoreChip({ score }: { score: number }) {
  const cls = score >= 85 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : score >= 70 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-600 border-red-200'
  return (
    <span className={`inline-flex items-center gap-[3px] px-[7px] py-[2px] rounded-full border text-[11px] font-bold ${cls}`}>
      <Sparkles size={8} />{score}
    </span>
  )
}

export default function ApplicationsPage() {
  const { candidates } = useDomainStore()
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('All')
  const [sourceFilter, setSourceFilter] = useState('All')
  const [selected, setSelected] = useState<string[]>([])

  const filtered = candidates.filter(app => {
    const matchSearch = app.name.toLowerCase().includes(search.toLowerCase()) || app.role.toLowerCase().includes(search.toLowerCase())
    const matchStage = stageFilter === 'All' || app.stage === stageFilter
    const matchSource = sourceFilter === 'All' || app.source === sourceFilter
    return matchSearch && matchStage && matchSource
  })

  const toggleSelect = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const allSelected = filtered.length > 0 && filtered.every(a => selected.includes(a.id))

  return (
    <div className="flex flex-col h-full -mx-[16px] md:-mx-[32px] -mt-[16px] md:-mt-[32px] bg-neutral-50/50 min-h-screen">

      {/* Header */}
      <div className="px-[16px] md:px-[32px] py-[20px] border-b border-neutral-100 bg-white shrink-0">
        <div className="flex items-start justify-between gap-[16px] flex-wrap">
          <div>
            <h1 className="font-display text-[26px] font-bold text-neutral-900 tracking-tight">Candidates</h1>
            <p className="font-body text-[13px] text-neutral-500 mt-[3px]">Review and manage all applicants across your open roles</p>
          </div>
          <div className="flex items-center gap-[8px]">
            <button className="h-[36px] px-[14px] border border-neutral-200 rounded-[8px] text-[12px] font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors flex items-center gap-[6px]">
              <CheckCircle2 size={13} /> Export CSV
            </button>
          </div>
        </div>

        {/* Summary strip */}
        <div className="flex items-center gap-[20px] mt-[14px] pt-[14px] border-t border-neutral-50 flex-wrap">
          {[
            { icon: Users, label: 'Total', value: candidates.length, color: 'text-neutral-700' },
            { icon: Clock, label: 'In Screening', value: candidates.filter(a => a.stage === 'Screening').length, color: 'text-blue-600' },
            { icon: TrendingUp, label: 'In Interview', value: candidates.filter(a => a.stage === 'Interview').length, color: 'text-purple-600' },
            { icon: CheckCircle2, label: 'In Offer', value: candidates.filter(a => a.stage === 'Offer').length, color: 'text-emerald-600' },
          ].map(stat => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="flex items-center gap-[6px]">
                <Icon size={13} className={stat.color} />
                <span className={`font-display text-[17px] font-bold ${stat.color}`}>{stat.value}</span>
                <span className="font-body text-[12px] text-neutral-400">{stat.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Filters bar */}
      <div className="px-[16px] md:px-[32px] py-[12px] bg-white border-b border-neutral-50 shrink-0 flex flex-wrap items-center gap-[10px]">
        {/* Search */}
        <div className="relative">
          <Search size={13} className="absolute left-[10px] top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search candidates..."
            className="h-[34px] pl-[30px] pr-[10px] w-[220px] bg-neutral-50 border border-neutral-200 rounded-[7px] text-[12px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-primary-400 focus:bg-white transition-all"
          />
        </div>

        {/* Stage pills */}
        <div className="flex items-center gap-[4px] flex-wrap">
          {STAGES.map(s => (
            <button
              key={s}
              onClick={() => setStageFilter(s)}
              className={`h-[28px] px-[10px] rounded-full text-[11px] font-semibold transition-all ${stageFilter === s ? 'bg-blue-600 text-white shadow-sm' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="h-[20px] w-[1px] bg-neutral-100 hidden md:block" />

        {/* Source pills */}
        <div className="flex items-center gap-[4px] flex-wrap">
          {SOURCES.map(s => (
            <button
              key={s}
              onClick={() => setSourceFilter(s)}
              className={`h-[28px] px-[10px] rounded-full text-[11px] font-semibold transition-all ${sourceFilter === s ? 'bg-indigo-600 text-white shadow-sm' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.length > 0 && (
        <div className="px-[16px] md:px-[32px] py-[10px] bg-blue-600 shrink-0 flex items-center gap-[12px]">
          <span className="font-body text-[13px] font-semibold text-white">{selected.length} selected</span>
          <div className="flex items-center gap-[6px] ml-auto">
            {['Move Stage', 'Assign', 'Reject', 'Export'].map(action => (
              <button key={action} className="h-[30px] px-[12px] rounded-[6px] bg-white/20 hover:bg-white/30 text-white text-[12px] font-semibold transition-colors">
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto px-[16px] md:px-[32px] py-[20px]">
        <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50">
                <th className="px-[16px] py-[10px] w-[40px]">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={() => setSelected(allSelected ? [] : filtered.map(a => a.id))}
                    className="w-[14px] h-[14px] rounded border-neutral-300 accent-blue-600"
                  />
                </th>
                <th className="text-left px-[4px] py-[10px] font-body text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Candidate</th>
                <th className="text-left px-[12px] py-[10px] font-body text-[11px] font-semibold text-neutral-400 uppercase tracking-wider hidden md:table-cell">Role</th>
                <th className="text-left px-[12px] py-[10px] font-body text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Stage</th>
                <th className="text-center px-[12px] py-[10px] font-body text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">AI Score</th>
                <th className="text-left px-[12px] py-[10px] font-body text-[11px] font-semibold text-neutral-400 uppercase tracking-wider hidden lg:table-cell">Source</th>
                <th className="text-left px-[12px] py-[10px] font-body text-[11px] font-semibold text-neutral-400 uppercase tracking-wider hidden lg:table-cell">Assigned</th>
                <th className="text-left px-[12px] py-[10px] font-body text-[11px] font-semibold text-neutral-400 uppercase tracking-wider hidden md:table-cell">Applied</th>
                <th className="px-[12px] py-[10px] w-[60px]" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app.id} className={`border-b border-neutral-50 last:border-0 transition-colors group ${selected.includes(app.id) ? 'bg-blue-50/40' : 'hover:bg-neutral-50/60'}`}>
                  <td className="px-[16px] py-[12px]">
                    <input
                      type="checkbox"
                      checked={selected.includes(app.id)}
                      onChange={() => toggleSelect(app.id)}
                      className="w-[14px] h-[14px] rounded border-neutral-300 accent-blue-600"
                    />
                  </td>
                  <td className="px-[4px] py-[12px]">
                    <div className="flex items-center gap-[10px]">
                      <div className="w-[36px] h-[36px] rounded-[8px] overflow-hidden shrink-0">
                        <img src={app.avatar} alt={app.name} className="w-full h-full object-cover bg-neutral-100" />
                      </div>
                      <div className="min-w-0">
                        <Link href={`/applications/${app.id}`} className="font-body text-[13px] font-semibold text-neutral-900 hover:text-primary-700 transition-colors">
                          {app.name}
                        </Link>
                        <p className="font-body text-[11px] text-neutral-400">{app.email}</p>
                        {app.tags && app.tags.length > 0 && (
                          <div className="flex gap-[4px] mt-[3px]">
                            {app.tags.map(tag => (
                              <span key={tag} className="text-[9px] font-bold bg-neutral-100 text-neutral-500 px-[5px] py-[1px] rounded-full uppercase">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-[12px] py-[12px] hidden md:table-cell">
                    <span className="font-body text-[12px] text-neutral-600 max-w-[180px] block truncate">{app.role}</span>
                  </td>
                  <td className="px-[12px] py-[12px]">
                    <span className={`font-body text-[11px] font-semibold px-[8px] py-[3px] rounded-full ${STAGE_STYLES[app.stage] ?? 'bg-neutral-100 text-neutral-600'}`}>
                      {app.stage}
                    </span>
                  </td>
                  <td className="px-[12px] py-[12px] text-center">
                    <div className="flex justify-center">
                      <ScoreChip score={app.aiScore} />
                    </div>
                  </td>
                  <td className="px-[12px] py-[12px] hidden lg:table-cell">
                    <span className="font-body text-[12px] text-neutral-500">{app.source}</span>
                  </td>
                  <td className="px-[12px] py-[12px] hidden lg:table-cell">
                    <span className="font-body text-[11px] bg-neutral-100 text-neutral-600 px-[7px] py-[2px] rounded-full">{app.assignedTo || 'Alex M.'}</span>
                  </td>
                  <td className="px-[12px] py-[12px] hidden md:table-cell">
                    <span className="font-body text-[12px] text-neutral-400">{new Date(app.appliedAt).toLocaleDateString('en-US')}</span>
                  </td>
                  <td className="px-[12px] py-[12px]">
                    <Link
                      href={`/applications/${app.id}`}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-[3px] text-[11px] font-semibold text-primary-600 hover:text-primary-700"
                    >
                      View <ExternalLink size={10} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-[60px] flex flex-col items-center text-center">
              <Users size={36} className="text-neutral-200 mb-[12px]" />
              <p className="font-display text-[16px] font-bold text-neutral-500">No candidates found</p>
              <p className="font-body text-[13px] text-neutral-400 mt-[4px]">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
