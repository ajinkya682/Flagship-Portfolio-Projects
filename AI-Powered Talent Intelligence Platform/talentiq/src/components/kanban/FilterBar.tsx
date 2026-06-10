"use client"

import * as React from "react"
import { Search, X, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function FilterBar() {
  const [searchValue, setSearchValue] = React.useState("")
  const [scoreRange, setScoreRange] = React.useState([70, 100])
  const [source, setSource] = React.useState("all")

  // For mock purposes, just a simple boolean if filters are active
  const hasFilters = searchValue !== "" || scoreRange[0] > 0 || source !== "all"

  return (
    <div className="flex flex-col border-b border-neutral-200 bg-white p-[16px_32px]">
      
      {/* Top Row Controls */}
      <div className="flex flex-wrap items-center gap-[12px]">
        
        {/* Source Dropdown */}
        <div className="w-[140px]">
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="h-[32px] text-[13px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Score Slider */}
        <div className="flex w-[200px] items-center gap-3 rounded-[var(--radius-sm)] border border-neutral-200 bg-white px-3 h-[32px]">
          <span className="font-body text-[12px] text-neutral-500 whitespace-nowrap">AI Score</span>
          <Slider 
            value={scoreRange}
            min={0}
            max={100}
            step={5}
            onValueChange={setScoreRange}
            className="flex-1"
          />
        </div>

        {/* Search */}
        <div className="relative flex w-[240px] items-center">
          <Search size={14} className="absolute left-3 text-neutral-400" />
          <Input 
            type="text" 
            placeholder="Search candidates..." 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="h-[32px] pl-[32px] text-[13px]"
          />
        </div>

        {/* Divider & Clear */}
        {hasFilters && (
          <>
            <div className="mx-[4px] h-[20px] w-px bg-neutral-200" />
            <Button 
              variant="ghost" 
              className="h-[32px] px-3 text-[13px] text-neutral-500 hover:text-neutral-900"
              onClick={() => {
                setSearchValue("")
                setScoreRange([0, 100])
                setSource("all")
              }}
            >
              Clear filters
            </Button>
          </>
        )}
      </div>

      {/* Active Filter Chips */}
      {hasFilters && (
        <div className="mt-[8px] flex flex-wrap gap-2">
          <div className="flex h-[24px] items-center gap-1 rounded-full bg-primary-50 px-2 font-body text-[12px] font-medium text-primary-700">
            <Filter size={10} className="mr-1" />
            Active Filters:
          </div>
          
          {(scoreRange[0] > 0 || scoreRange[1] < 100) && (
            <div className="flex h-[24px] items-center gap-1 rounded-full bg-primary-100 px-[8px] font-body text-[12px] font-medium text-primary-700">
              Score: {scoreRange[0]}-{scoreRange[1]}
              <button className="ml-1 flex h-[14px] w-[14px] items-center justify-center rounded-full hover:bg-primary-200" onClick={() => setScoreRange([0, 100])}>
                <X size={10} />
              </button>
            </div>
          )}

          {source !== "all" && (
            <div className="flex h-[24px] items-center gap-1 rounded-full bg-primary-100 px-[8px] font-body text-[12px] font-medium text-primary-700 capitalize">
              Source: {source}
              <button className="ml-1 flex h-[14px] w-[14px] items-center justify-center rounded-full hover:bg-primary-200" onClick={() => setSource("all")}>
                <X size={10} />
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  )
}
