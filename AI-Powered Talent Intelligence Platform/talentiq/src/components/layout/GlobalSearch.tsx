'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Briefcase, Users, GitMerge, Loader2, ArrowRight } from 'lucide-react'

interface SearchResults {
  jobs: { id: string; title: string; department: string; location: string; href: string }[]
  candidates: { id: string; name: string; email: string; avatar?: string; skills: string[]; href: string }[]
  applications: { id: string; candidateName: string; jobTitle: string; stage: string; href: string }[]
}

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
}

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
      setResults(null)
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Keyboard shortcut Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) onClose()
      }
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Debounced search
  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults(null)
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      if (res.ok) {
        const data = await res.json()
        setResults(data)
      }
    } catch (err) {
      // Silent fail
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(query), 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, doSearch])

  const allResults = [
    ...(results?.jobs || []).map(j => ({ ...j, type: 'job' })),
    ...(results?.candidates || []).map(c => ({ ...c, type: 'candidate' })),
    ...(results?.applications || []).map(a => ({ ...a, type: 'application' })),
  ]

  const handleNavigate = (href: string) => {
    router.push(href)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[80px] px-[16px]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[600px] bg-white rounded-[16px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 border border-neutral-100">

        {/* Search Input */}
        <div className="flex items-center gap-[12px] px-[20px] py-[16px] border-b border-neutral-100">
          {isLoading ? (
            <Loader2 size={18} className="text-neutral-400 animate-spin shrink-0" />
          ) : (
            <Search size={18} className="text-neutral-400 shrink-0" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search jobs, candidates, pipeline stages..."
            className="flex-1 text-[15px] text-neutral-900 placeholder:text-neutral-400 outline-none bg-transparent"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-neutral-400 hover:text-neutral-600 transition-colors">
              <X size={16} />
            </button>
          )}
          <kbd className="hidden sm:flex items-center gap-[2px] h-[20px] px-[6px] bg-neutral-100 border border-neutral-200 rounded-[4px] text-[11px] font-mono text-neutral-400">
            esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
          {!query && (
            <div className="px-[20px] py-[32px] flex flex-col items-center justify-center text-center">
              <div className="w-[48px] h-[48px] bg-neutral-50 rounded-full flex items-center justify-center mb-[12px]">
                <Search size={22} className="text-neutral-300" />
              </div>
              <p className="text-[14px] text-neutral-500 font-medium">Search anything</p>
              <p className="text-[12px] text-neutral-400 mt-[4px]">Jobs, candidates, stages, offers, messages</p>
            </div>
          )}

          {query.length > 0 && !isLoading && results && (
            <>
              {/* Jobs */}
              {results.jobs.length > 0 && (
                <div className="py-[8px]">
                  <div className="px-[20px] py-[6px] flex items-center gap-[6px]">
                    <Briefcase size={11} className="text-neutral-400" />
                    <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Jobs</span>
                  </div>
                  {results.jobs.map(job => (
                    <button
                      key={job.id}
                      onClick={() => handleNavigate(job.href)}
                      className="w-full flex items-center gap-[12px] px-[20px] py-[10px] hover:bg-blue-50 transition-colors group text-left"
                    >
                      <div className="w-[32px] h-[32px] bg-blue-100 rounded-[8px] flex items-center justify-center shrink-0">
                        <Briefcase size={14} className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-neutral-900 truncate">{job.title}</p>
                        <p className="text-[12px] text-neutral-500">{job.department} · {job.location}</p>
                      </div>
                      <ArrowRight size={14} className="text-neutral-300 group-hover:text-blue-500 transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {/* Candidates */}
              {results.candidates.length > 0 && (
                <div className="py-[8px] border-t border-neutral-50">
                  <div className="px-[20px] py-[6px] flex items-center gap-[6px]">
                    <Users size={11} className="text-neutral-400" />
                    <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Candidates</span>
                  </div>
                  {results.candidates.map(c => (
                    <button
                      key={c.id}
                      onClick={() => handleNavigate(c.href)}
                      className="w-full flex items-center gap-[12px] px-[20px] py-[10px] hover:bg-emerald-50 transition-colors group text-left"
                    >
                      <div className="w-[32px] h-[32px] rounded-[8px] overflow-hidden shrink-0 bg-neutral-100">
                        {c.avatar ? (
                          <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-emerald-100 flex items-center justify-center">
                            <Users size={14} className="text-emerald-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-neutral-900 truncate">{c.name}</p>
                        <p className="text-[12px] text-neutral-500 truncate">{c.email}</p>
                        {c.skills.length > 0 && (
                          <div className="flex gap-[4px] mt-[2px] flex-wrap">
                            {c.skills.map(s => (
                              <span key={s} className="text-[10px] bg-neutral-100 text-neutral-600 px-[5px] py-[1px] rounded-full">{s}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <ArrowRight size={14} className="text-neutral-300 group-hover:text-emerald-500 transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {/* Pipeline Applications */}
              {results.applications.length > 0 && (
                <div className="py-[8px] border-t border-neutral-50">
                  <div className="px-[20px] py-[6px] flex items-center gap-[6px]">
                    <GitMerge size={11} className="text-neutral-400" />
                    <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Pipeline</span>
                  </div>
                  {results.applications.map(a => (
                    <button
                      key={a.id}
                      onClick={() => handleNavigate(a.href)}
                      className="w-full flex items-center gap-[12px] px-[20px] py-[10px] hover:bg-purple-50 transition-colors group text-left"
                    >
                      <div className="w-[32px] h-[32px] bg-purple-100 rounded-[8px] flex items-center justify-center shrink-0">
                        <GitMerge size={14} className="text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-neutral-900 truncate">{a.candidateName}</p>
                        <p className="text-[12px] text-neutral-500 truncate">{a.jobTitle} · <span className="font-medium">{a.stage}</span></p>
                      </div>
                      <ArrowRight size={14} className="text-neutral-300 group-hover:text-purple-500 transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {/* No results */}
              {allResults.length === 0 && query.length >= 2 && (
                <div className="px-[20px] py-[32px] text-center">
                  <p className="text-[14px] text-neutral-500">No results for <span className="font-semibold">&quot;{query}&quot;</span></p>
                  <p className="text-[12px] text-neutral-400 mt-[4px]">Try a different search term</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-[20px] py-[10px] border-t border-neutral-50 bg-neutral-50/50 flex items-center gap-[16px]">
          <span className="text-[11px] text-neutral-400">
            <kbd className="font-mono bg-white border border-neutral-200 rounded px-[4px] py-[1px]">↵</kbd> to select
          </span>
          <span className="text-[11px] text-neutral-400">
            <kbd className="font-mono bg-white border border-neutral-200 rounded px-[4px] py-[1px]">esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  )
}
