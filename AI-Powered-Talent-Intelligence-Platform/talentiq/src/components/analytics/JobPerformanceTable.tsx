'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'

interface JobPerformanceTableProps {
  data: {
    id: string
    title: string
    applications: number
    avgScore: number
    convRate: number
    daysOpen: number
    status: 'active' | 'paused' | 'closed'
  }[]
}

type SortField = 'title' | 'applications' | 'avgScore' | 'convRate' | 'daysOpen' | 'status'
type SortDir = 'asc' | 'desc'

export default function JobPerformanceTable({ data }: JobPerformanceTableProps) {
  const [sortField, setSortField] = useState<SortField>('applications')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronsUpDown size={14} className="text-neutral-300" />
    return sortDir === 'asc' ? <ChevronUp size={14} className="text-neutral-700" /> : <ChevronDown size={14} className="text-neutral-700" />
  }

  const sortedData = [...data].sort((a, b) => {
    const modifier = sortDir === 'asc' ? 1 : -1
    if (a[sortField] < b[sortField]) return -1 * modifier
    if (a[sortField] > b[sortField]) return 1 * modifier
    return 0
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <span className="px-[8px] py-[2px] rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold uppercase tracking-wider">Active</span>
      case 'paused': return <span className="px-[8px] py-[2px] rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold uppercase tracking-wider">Paused</span>
      case 'closed': return <span className="px-[8px] py-[2px] rounded-full bg-neutral-100 text-neutral-600 text-[11px] font-bold uppercase tracking-wider">Closed</span>
      default: return null
    }
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-neutral-100">
            <th 
              className="px-[16px] py-[12px] font-body text-[12px] font-bold text-neutral-500 uppercase tracking-wider cursor-pointer hover:bg-neutral-50 transition-colors group"
              onClick={() => toggleSort('title')}
            >
              <div className="flex items-center gap-[6px]">Job Title <SortIcon field="title" /></div>
            </th>
            <th 
              className="px-[16px] py-[12px] font-body text-[12px] font-bold text-neutral-500 uppercase tracking-wider cursor-pointer hover:bg-neutral-50 transition-colors group text-right"
              onClick={() => toggleSort('applications')}
            >
              <div className="flex items-center justify-end gap-[6px]"><SortIcon field="applications" /> Apps</div>
            </th>
            <th 
              className="px-[16px] py-[12px] font-body text-[12px] font-bold text-neutral-500 uppercase tracking-wider cursor-pointer hover:bg-neutral-50 transition-colors group text-right"
              onClick={() => toggleSort('avgScore')}
            >
              <div className="flex items-center justify-end gap-[6px]"><SortIcon field="avgScore" /> Avg Score</div>
            </th>
            <th 
              className="px-[16px] py-[12px] font-body text-[12px] font-bold text-neutral-500 uppercase tracking-wider cursor-pointer hover:bg-neutral-50 transition-colors group text-right"
              onClick={() => toggleSort('convRate')}
            >
              <div className="flex items-center justify-end gap-[6px]"><SortIcon field="convRate" /> Conv Rate</div>
            </th>
            <th 
              className="px-[16px] py-[12px] font-body text-[12px] font-bold text-neutral-500 uppercase tracking-wider cursor-pointer hover:bg-neutral-50 transition-colors group text-right"
              onClick={() => toggleSort('daysOpen')}
            >
              <div className="flex items-center justify-end gap-[6px]"><SortIcon field="daysOpen" /> Days Open</div>
            </th>
            <th 
              className="px-[16px] py-[12px] font-body text-[12px] font-bold text-neutral-500 uppercase tracking-wider cursor-pointer hover:bg-neutral-50 transition-colors group"
              onClick={() => toggleSort('status')}
            >
              <div className="flex items-center gap-[6px]">Status <SortIcon field="status" /></div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, i) => (
            <tr key={row.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
              <td className="px-[16px] py-[12px]">
                <span className="font-body text-[14px] font-semibold text-neutral-900">{row.title}</span>
              </td>
              <td className="px-[16px] py-[12px] text-right font-body text-[14px] text-neutral-700">{row.applications}</td>
              <td className="px-[16px] py-[12px] text-right font-body text-[14px] text-neutral-700">{row.avgScore}</td>
              <td className="px-[16px] py-[12px] text-right font-body text-[14px] text-neutral-700">{row.convRate}%</td>
              <td className="px-[16px] py-[12px] text-right font-body text-[14px] text-neutral-700">{row.daysOpen}</td>
              <td className="px-[16px] py-[12px]">{getStatusBadge(row.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
