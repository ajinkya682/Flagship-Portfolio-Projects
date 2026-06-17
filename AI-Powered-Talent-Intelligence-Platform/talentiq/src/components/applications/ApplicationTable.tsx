'use client'

import { useState } from 'react'
import { Application } from '@/types/domain.types'
import ApplicationRow from './ApplicationRow'
import BulkActionBar from './BulkActionBar'
import { ChevronDown, ChevronUp, ChevronsUpDown, Users } from 'lucide-react'
import { SkeletonBlock } from '@/components/shared/SkeletonBlock'
import { EmptyState } from '@/components/shared/EmptyState'

interface ApplicationTableProps {
  applications: Application[]
  isLoading?: boolean
}

type SortField = 'name' | 'job' | 'score' | 'stage' | 'applied'
type SortDir = 'asc' | 'desc'

export default function ApplicationTable({ applications, isLoading = false }: ApplicationTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [sortField, setSortField] = useState<SortField>('applied')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(applications.map(app => app.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSet = new Set(selectedIds)
    if (checked) newSet.add(id)
    else newSet.delete(id)
    setSelectedIds(newSet)
  }

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

  // Basic client-side sorting mock
  const sortedApps = [...applications].sort((a, b) => {
    // simplified for brevity
    return 0 
  })

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden flex flex-col">
        <div className="h-[48px] border-b border-neutral-100 flex items-center px-[16px]">
          <SkeletonBlock className="w-[16px] h-[16px] rounded-[4px] mr-[32px]" />
          <SkeletonBlock className="w-[120px] h-[14px]" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-[64px] border-b border-neutral-50 flex items-center px-[16px] gap-[32px]">
            <SkeletonBlock className="w-[16px] h-[16px] rounded-[4px] shrink-0" />
            <div className="flex items-center gap-[12px] w-[240px]">
              <SkeletonBlock className="w-[36px] h-[36px] rounded-full shrink-0" />
              <div className="flex flex-col gap-[4px] w-full">
                <SkeletonBlock className="w-[60%] h-[14px]" />
                <SkeletonBlock className="w-[40%] h-[12px]" />
              </div>
            </div>
            <SkeletonBlock className="w-[150px] h-[14px]" />
            <SkeletonBlock className="w-[60px] h-[24px] rounded-full" />
            <SkeletonBlock className="w-[80px] h-[24px] rounded-full" />
          </div>
        ))}
      </div>
    )
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-[64px]">
        <EmptyState 
          icon={Users}
          title="No applications found"
          description="We couldn't find any applications matching your current filters."
        />
      </div>
    )
  }

  const allSelected = applications.length > 0 && selectedIds.size === applications.length

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden flex flex-col relative w-full">
        
        <div className="overflow-x-auto">
          <table role="table" className="w-full text-left border-collapse">
            <thead>
              <tr role="row" className="bg-neutral-50/50 border-b border-neutral-200">
                <th role="columnheader" className="px-[16px] py-[12px] w-[48px]">
                  <input 
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-[16px] h-[16px] rounded-[4px] border-neutral-300 text-primary-500 focus:ring-primary-500 cursor-pointer"
                  />
                </th>
                <th 
                  role="columnheader"
                  aria-sort={sortField === 'name' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                  className="px-[16px] py-[12px] font-body text-[12px] font-bold text-neutral-500 uppercase tracking-wider cursor-pointer hover:bg-neutral-100 transition-colors select-none group"
                  onClick={() => toggleSort('name')}
                >
                  <div className="flex items-center gap-[6px]">
                    Candidate <SortIcon field="name" />
                  </div>
                </th>
                <th 
                  role="columnheader"
                  aria-sort={sortField === 'job' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                  className="px-[16px] py-[12px] font-body text-[12px] font-bold text-neutral-500 uppercase tracking-wider cursor-pointer hover:bg-neutral-100 transition-colors select-none group"
                  onClick={() => toggleSort('job')}
                >
                  <div className="flex items-center gap-[6px]">
                    Role <SortIcon field="job" />
                  </div>
                </th>
                <th 
                  role="columnheader"
                  aria-sort={sortField === 'score' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                  className="px-[16px] py-[12px] font-body text-[12px] font-bold text-neutral-500 uppercase tracking-wider cursor-pointer hover:bg-neutral-100 transition-colors select-none group"
                  onClick={() => toggleSort('score')}
                >
                  <div className="flex items-center gap-[6px]">
                    AI Score <SortIcon field="score" />
                  </div>
                </th>
                <th 
                  role="columnheader"
                  aria-sort={sortField === 'stage' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                  className="px-[16px] py-[12px] font-body text-[12px] font-bold text-neutral-500 uppercase tracking-wider cursor-pointer hover:bg-neutral-100 transition-colors select-none group"
                  onClick={() => toggleSort('stage')}
                >
                  <div className="flex items-center gap-[6px]">
                    Stage <SortIcon field="stage" />
                  </div>
                </th>
                <th 
                  role="columnheader"
                  aria-sort={sortField === 'applied' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                  className="px-[16px] py-[12px] font-body text-[12px] font-bold text-neutral-500 uppercase tracking-wider cursor-pointer hover:bg-neutral-100 transition-colors select-none group"
                  onClick={() => toggleSort('applied')}
                >
                  <div className="flex items-center gap-[6px]">
                    Applied <SortIcon field="applied" />
                  </div>
                </th>
                <th role="columnheader" className="px-[16px] py-[12px] font-body text-[12px] font-bold text-neutral-500 uppercase tracking-wider">
                  Source
                </th>
                <th role="columnheader" className="px-[16px] py-[12px] w-[120px]"></th>
              </tr>
            </thead>
            <tbody>
              {sortedApps.map(app => (
                <ApplicationRow 
                  key={app.id}
                  application={app}
                  isSelected={selectedIds.has(app.id)}
                  onSelect={handleSelectOne}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination mock */}
        <div className="p-[16px] border-t border-neutral-100 flex items-center justify-between bg-white text-[13px] text-neutral-500 font-body">
          <span>Showing 1 to {sortedApps.length} of 142 results</span>
          <div className="flex items-center gap-[8px]">
            <button className="px-[12px] py-[6px] border border-neutral-200 rounded-md hover:bg-neutral-50 disabled:opacity-50 transition-colors" disabled>Previous</button>
            <button className="px-[12px] py-[6px] border border-neutral-200 rounded-md hover:bg-neutral-50 disabled:opacity-50 transition-colors">Next</button>
          </div>
        </div>

      </div>

      <BulkActionBar 
        selectedCount={selectedIds.size} 
        onDeselectAll={() => setSelectedIds(new Set())} 
      />
    </>
  )
}
