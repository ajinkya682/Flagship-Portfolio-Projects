'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'

interface TeamPerformanceTableProps {
  data: {
    id: string
    name: string
    avatar?: string
    reviewed: number
    avgResponseHours: number
    interviews: number
    offers: number
    hireRate: number
  }[]
}

type SortField = 'name' | 'reviewed' | 'avgResponseHours' | 'interviews' | 'offers' | 'hireRate'
type SortDir = 'asc' | 'desc'

export default function TeamPerformanceTable({ data }: TeamPerformanceTableProps) {
  const [sortField, setSortField] = useState<SortField>('reviewed')
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

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-neutral-100">
            <th 
              className="px-[16px] py-[12px] font-body text-[12px] font-bold text-neutral-500 uppercase tracking-wider cursor-pointer hover:bg-neutral-50 transition-colors group"
              onClick={() => toggleSort('name')}
            >
              <div className="flex items-center gap-[6px]">Recruiter <SortIcon field="name" /></div>
            </th>
            <th 
              className="px-[16px] py-[12px] font-body text-[12px] font-bold text-neutral-500 uppercase tracking-wider cursor-pointer hover:bg-neutral-50 transition-colors group text-right"
              onClick={() => toggleSort('reviewed')}
            >
              <div className="flex items-center justify-end gap-[6px]"><SortIcon field="reviewed" /> Reviewed</div>
            </th>
            <th 
              className="px-[16px] py-[12px] font-body text-[12px] font-bold text-neutral-500 uppercase tracking-wider cursor-pointer hover:bg-neutral-50 transition-colors group text-right"
              onClick={() => toggleSort('avgResponseHours')}
            >
              <div className="flex items-center justify-end gap-[6px]"><SortIcon field="avgResponseHours" /> Avg Response</div>
            </th>
            <th 
              className="px-[16px] py-[12px] font-body text-[12px] font-bold text-neutral-500 uppercase tracking-wider cursor-pointer hover:bg-neutral-50 transition-colors group text-right"
              onClick={() => toggleSort('interviews')}
            >
              <div className="flex items-center justify-end gap-[6px]"><SortIcon field="interviews" /> Interviews</div>
            </th>
            <th 
              className="px-[16px] py-[12px] font-body text-[12px] font-bold text-neutral-500 uppercase tracking-wider cursor-pointer hover:bg-neutral-50 transition-colors group text-right"
              onClick={() => toggleSort('offers')}
            >
              <div className="flex items-center justify-end gap-[6px]"><SortIcon field="offers" /> Offers</div>
            </th>
            <th 
              className="px-[16px] py-[12px] font-body text-[12px] font-bold text-neutral-500 uppercase tracking-wider cursor-pointer hover:bg-neutral-50 transition-colors group text-right"
              onClick={() => toggleSort('hireRate')}
            >
              <div className="flex items-center justify-end gap-[6px]"><SortIcon field="hireRate" /> Hire Rate</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, i) => (
            <tr key={row.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
              <td className="px-[16px] py-[12px]">
                <div className="flex items-center gap-[10px]">
                  <div className="w-[32px] h-[32px] rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-[12px]">
                    {row.name.charAt(0)}
                  </div>
                  <span className="font-body text-[14px] font-semibold text-neutral-900">{row.name}</span>
                </div>
              </td>
              <td className="px-[16px] py-[12px] text-right font-body text-[14px] text-neutral-700">{row.reviewed}</td>
              <td className="px-[16px] py-[12px] text-right font-body text-[14px] text-neutral-700">{row.avgResponseHours}h</td>
              <td className="px-[16px] py-[12px] text-right font-body text-[14px] text-neutral-700">{row.interviews}</td>
              <td className="px-[16px] py-[12px] text-right font-body text-[14px] text-neutral-700">{row.offers}</td>
              <td className="px-[16px] py-[12px] text-right font-body text-[14px] text-neutral-700 font-medium">{row.hireRate}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
