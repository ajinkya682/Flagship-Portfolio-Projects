'use client'

import { Search } from 'lucide-react'
import FilterChip from './FilterChip'
import ScoreRangeSlider from './ScoreRangeSlider'

export interface FiltersState {
  source: string
  scoreRange: number[]
  stages: string[]
  search: string
}

interface FilterBarProps {
  filters: FiltersState
  onFiltersChange: (newFilters: FiltersState) => void
}

export default function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const hasFilters = filters.source !== '' || filters.scoreRange[0] > 0 || filters.scoreRange[1] < 100 || filters.stages.length > 0 || filters.search !== ''

  const handleClear = () => {
    onFiltersChange({
      source: '',
      scoreRange: [0, 100],
      stages: [],
      search: ''
    })
  }

  return (
    <div className="flex flex-col border-b border-[#E5E7EB] bg-white w-full">
      <div className="p-[16px] md:px-[32px] flex gap-[12px] flex-wrap items-center">
        
        <select 
          value={filters.source}
          onChange={(e) => onFiltersChange({ ...filters, source: e.target.value })}
          className="h-[36px] w-[140px] rounded-md border border-neutral-200 px-[12px] font-body text-[13px] focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white"
        >
          <option value="">All Sources</option>
          <option value="linkedin">LinkedIn</option>
          <option value="referral">Referral</option>
          <option value="career-page">Career Page</option>
          <option value="indeed">Indeed</option>
        </select>

        <div className="flex flex-col gap-[4px] w-[200px] border border-neutral-200 rounded-md px-[12px] py-[6px] justify-center bg-white h-[36px]">
          <span className="text-[9px] font-semibold text-neutral-400 uppercase tracking-wider leading-none">Score</span>
          <ScoreRangeSlider 
            value={filters.scoreRange}
            onValueChange={(val) => onFiltersChange({ ...filters, scoreRange: val })}
          />
        </div>

        <select 
          value={filters.stages[0] || ''}
          onChange={(e) => {
            const val = e.target.value
            onFiltersChange({ ...filters, stages: val ? [val] : [] })
          }}
          className="h-[36px] w-[180px] rounded-md border border-neutral-200 px-[12px] font-body text-[13px] focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white"
        >
          <option value="">All Stages</option>
          <option value="Screening">Screening</option>
          <option value="Phone Screen">Phone Screen</option>
          <option value="Interview">Interview</option>
          <option value="Assessment">Assessment</option>
          <option value="Offer">Offer</option>
          <option value="Hired">Hired</option>
        </select>

        <div className="relative">
          <Search size={14} className="absolute left-[10px] top-[11px] text-neutral-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            placeholder="Search candidates..."
            className="w-[240px] h-[36px] pl-[32px] pr-[12px] bg-white border border-neutral-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-md text-[13px] text-neutral-900 placeholder:text-neutral-500 focus:outline-none transition-colors"
          />
        </div>

        {hasFilters && (
          <button 
            onClick={handleClear}
            className="text-[13px] font-medium text-neutral-500 hover:text-neutral-700 ml-auto transition-colors px-[12px]"
          >
            Clear filters
          </button>
        )}
      </div>

      {hasFilters && (
        <div className="px-[16px] md:px-[32px] pb-[16px] pt-[4px] flex gap-[8px] flex-wrap">
          {filters.source && (
            <FilterChip label={`Source: ${filters.source}`} onRemove={() => onFiltersChange({ ...filters, source: '' })} />
          )}
          {(filters.scoreRange[0] > 0 || filters.scoreRange[1] < 100) && (
            <FilterChip label={`Score: ${filters.scoreRange[0]}-${filters.scoreRange[1]}`} onRemove={() => onFiltersChange({ ...filters, scoreRange: [0, 100] })} />
          )}
          {filters.stages.map(stage => (
            <FilterChip key={stage} label={`Stage: ${stage}`} onRemove={() => onFiltersChange({ ...filters, stages: filters.stages.filter(s => s !== stage) })} />
          ))}
          {filters.search && (
            <FilterChip label={`Search: ${filters.search}`} onRemove={() => onFiltersChange({ ...filters, search: '' })} />
          )}
        </div>
      )}
    </div>
  )
}
