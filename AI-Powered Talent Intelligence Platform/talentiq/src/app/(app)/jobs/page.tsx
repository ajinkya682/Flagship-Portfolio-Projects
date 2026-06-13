'use client'

import { useState } from 'react'
import { Search, Plus, LayoutGrid, List, SlidersHorizontal, Briefcase, TrendingUp, Users, Sparkles } from 'lucide-react'
import Link from 'next/link'
import JobCard from '@/components/jobs/JobCard'
import { Job } from '@/types/domain.types'

import { useDomainStore } from '@/store/domain.store'

const STATUSES = ['all', 'published', 'draft', 'closed']
const DEPARTMENTS = ['All', 'Engineering', 'Product', 'Design', 'Sales', 'Data', 'Marketing']

export default function JobsPage() {
  const { jobs, candidates } = useDomainStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deptFilter, setDeptFilter] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filtered = jobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.department.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || j.status === statusFilter
    const matchDept = deptFilter === 'All' || j.department === deptFilter
    return matchSearch && matchStatus && matchDept
  })

  const activeCount = jobs.filter(j => j.status === 'published').length
  const totalApplicants = candidates.length

  return (
    <div className="flex flex-col max-w-[1400px] mx-auto w-full gap-[24px]">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-[16px]">
        <div>
          <h1 className="font-display text-[28px] font-bold text-neutral-900 tracking-tight">
            Jobs
          </h1>
          <p className="font-body text-[14px] text-neutral-500 mt-[4px]">
            Manage your open roles and track pipeline performance.
          </p>
        </div>
        <Link
          href="/jobs/new"
          className="flex items-center gap-[6px] h-[40px] px-[16px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-body text-[13px] font-semibold rounded-[10px] shadow-md shadow-blue-500/20 transition-all hover:-translate-y-[1px] shrink-0"
        >
          <Plus size={15} />
          Post a Job
        </Link>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-3 gap-[12px]">
        {[
          { icon: Briefcase, label: 'Active Roles', value: activeCount, color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: Users, label: 'Total Applicants', value: totalApplicants, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { icon: Sparkles, label: 'Avg AI Score', value: '82', color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-[12px] border border-neutral-100 shadow-sm px-[16px] py-[12px] flex items-center gap-[12px]">
              <div className={`w-[36px] h-[36px] rounded-[10px] ${stat.bg} flex items-center justify-center`}>
                <Icon size={16} className={stat.color} />
              </div>
              <div>
                <p className={`font-display text-[20px] font-bold ${stat.color}`}>{stat.value}</p>
                <p className="font-body text-[11px] text-neutral-400">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters + View Toggle */}
      <div className="bg-white rounded-[14px] border border-neutral-100 shadow-sm p-[16px] flex flex-col gap-[12px]">
        {/* Search */}
        <div className="flex items-center gap-[10px]">
          <div className="relative flex-1 max-w-[380px]">
            <Search size={14} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-[38px] pl-[36px] pr-[12px] bg-neutral-50 border border-neutral-200 rounded-[8px] text-[13px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
            />
          </div>
          <div className="ml-auto flex items-center gap-[6px]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-[8px] rounded-[7px] transition-colors ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50'}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-[8px] rounded-[7px] transition-colors ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-[8px]">
          <div className="flex items-center gap-[6px] border-r border-neutral-100 pr-[12px]">
            <SlidersHorizontal size={12} className="text-neutral-400" />
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">Status</span>
          </div>
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`h-[28px] px-[12px] rounded-full text-[12px] font-semibold capitalize transition-all ${statusFilter === s ? 'bg-primary-600 text-white shadow-sm' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
            >
              {s}
            </button>
          ))}

          <div className="flex items-center gap-[6px] border-l border-neutral-100 pl-[12px] ml-[4px]">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">Dept</span>
          </div>
          {DEPARTMENTS.map(d => (
            <button
              key={d}
              onClick={() => setDeptFilter(d)}
              className={`h-[28px] px-[12px] rounded-full text-[12px] font-semibold transition-all ${deptFilter === d ? 'bg-indigo-600 text-white shadow-sm' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Results summary */}
      <div className="flex items-center justify-between">
        <p className="font-body text-[13px] text-neutral-500">
          Showing <span className="font-semibold text-neutral-900">{filtered.length}</span> of {jobs.length} jobs
        </p>
        <div className="flex items-center gap-[4px] text-[12px] text-emerald-600 font-semibold">
          <TrendingUp size={12} />
          Applications up 31% this week
        </div>
      </div>

      {/* Job Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm p-[60px] flex flex-col items-center justify-center text-center">
          <Briefcase size={40} className="text-neutral-200 mb-[16px]" />
          <h3 className="font-display text-[18px] font-bold text-neutral-700 mb-[6px]">No jobs found</h3>
          <p className="font-body text-[13px] text-neutral-400 mb-[20px]">Try adjusting your search or filters</p>
          <button onClick={() => { setSearch(''); setStatusFilter('all'); setDeptFilter('All') }} className="text-[13px] font-semibold text-primary-600 hover:text-primary-700">
            Clear filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[16px]">
          {filtered.map(job => <JobCard key={job.id} job={job as unknown as Job} />)}
        </div>
      ) : (
        <div className="flex flex-col gap-[8px]">
          {filtered.map(job => {
            const jobApplicants = candidates.filter(c => c.jobId === job.id).length;
            return (
              <div key={job.id} className="bg-white rounded-[12px] border border-neutral-100 shadow-sm px-[20px] py-[14px] flex items-center gap-[16px] hover:shadow-md hover:border-neutral-200 transition-all group">
                <div>
                  <p className="font-body text-[14px] font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors">{job.title}</p>
                  <p className="font-body text-[12px] text-neutral-400 mt-[1px]">{job.department} · {job.location}</p>
                </div>
                <div className="ml-auto flex items-center gap-[16px]">
                  <div className="text-center hidden md:block">
                    <p className="font-body text-[13px] font-bold text-neutral-900">{jobApplicants}</p>
                    <p className="font-body text-[10px] text-neutral-400">Applicants</p>
                  </div>
                  <Link href={`/jobs/${job.id}`} className="font-body text-[12px] font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 px-[10px] py-[5px] rounded-[7px] transition-colors">
                    View
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
