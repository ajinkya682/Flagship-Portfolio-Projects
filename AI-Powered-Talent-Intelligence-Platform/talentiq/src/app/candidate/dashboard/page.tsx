'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Briefcase, Building2, MapPin, Loader2, Sparkles, User, ExternalLink } from 'lucide-react'
import { useCandidateAuth } from '@/hooks/useCandidateAuth'
import Link from 'next/link'

interface Application {
  id: string;
  job: {
    id: string;
    title: string;
    department: string;
    location: string;
    employmentType: string;
  };
  company: {
    id: string;
    name: string;
    logo: string | null;
  };
  stage: string;
  appliedAt: string;
}

export default function CandidateDashboard() {
  const router = useRouter()
  const { candidate, isLoading: isAuthLoading, isLoggedIn, logout } = useCandidateAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoadingApps, setIsLoadingApps] = useState(true)

  useEffect(() => {
    if (!isAuthLoading && !isLoggedIn) {
      router.push('/candidate/login')
    }
  }, [isAuthLoading, isLoggedIn, router])

  useEffect(() => {
    if (isLoggedIn) {
      fetch('/api/candidates/me/applications')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setApplications(data)
          }
        })
        .catch(err => console.error("Failed to fetch applications", err))
        .finally(() => setIsLoadingApps(false))
    }
  }, [isLoggedIn])

  if (isAuthLoading || (isLoggedIn && isLoadingApps)) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center">
        <Loader2 className="w-[32px] h-[32px] text-blue-600 animate-spin mb-[16px]" />
        <p className="font-body text-[14px] text-neutral-500">Loading your candidate portal...</p>
      </div>
    )
  }

  if (!isLoggedIn || !candidate) return null;

  return (
    <div className="min-h-screen bg-neutral-50/50 font-body">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 py-[16px] px-[24px] sticky top-0 z-10">
        <div className="max-w-[1000px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-[12px]">
            <div className="w-[36px] h-[36px] bg-blue-600 rounded-[10px] flex items-center justify-center">
              <Sparkles className="text-white" size={18} />
            </div>
            <div>
              <h2 className="font-display font-bold text-[18px] text-neutral-900 leading-tight">Candidate Portal</h2>
              <p className="text-[12px] text-neutral-500">Track your applications</p>
            </div>
          </div>

          <div className="flex items-center gap-[16px]">
            <div className="hidden sm:flex items-center gap-[10px]">
              {candidate.avatar ? (
                <img src={candidate.avatar} alt="Avatar" className="w-[32px] h-[32px] rounded-full object-cover border border-neutral-200" />
              ) : (
                <div className="w-[32px] h-[32px] rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
                  <User size={16} />
                </div>
              )}
              <div className="text-right">
                <p className="font-semibold text-[13px] text-neutral-900 leading-tight">{candidate.name}</p>
                <p className="text-[11px] text-neutral-500">{candidate.email}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-[6px] px-[16px] py-[8px] bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-[13px] font-semibold transition-colors"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1000px] mx-auto p-[24px] mt-[16px]">
        
        {/* Welcome Card */}
        <div className="bg-blue-600 rounded-[20px] p-[32px] text-white shadow-sm mb-[32px] flex items-center justify-between">
          <div>
            <h1 className="font-display text-[28px] font-bold mb-[4px]">Welcome back, {candidate.name.split(' ')[0]}!</h1>
            <p className="text-blue-100 text-[15px]">You have applied to {applications.length} position{applications.length === 1 ? '' : 's'} across the platform.</p>
          </div>
          <div className="hidden md:flex w-[80px] h-[80px] bg-white/10 rounded-full items-center justify-center">
            <Briefcase className="text-white w-[32px] h-[32px]" />
          </div>
        </div>

        <h3 className="font-display text-[20px] font-bold text-neutral-900 mb-[16px]">Your Applications</h3>

        {applications.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-[16px] p-[48px] text-center flex flex-col items-center">
            <Briefcase className="w-[48px] h-[48px] text-neutral-300 mb-[16px]" />
            <h4 className="font-display text-[18px] font-bold text-neutral-900">No applications yet</h4>
            <p className="font-body text-[14px] text-neutral-500 mt-[8px]">When you apply to jobs, they will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-[16px]">
            {applications.map((app) => (
              <Link href={`/candidate/dashboard/${app.id}`} key={app.id} className="bg-white border border-neutral-200 hover:border-blue-300 rounded-[16px] p-[24px] shadow-sm transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-[20px] group cursor-pointer">
                
                <div className="flex items-start gap-[16px]">
                  <div className="w-[56px] h-[56px] rounded-[12px] bg-neutral-50 border border-neutral-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {app.company.logo ? (
                      <img src={app.company.logo} alt={app.company.name} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="text-neutral-400 w-[24px] h-[24px]" />
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-display text-[18px] font-bold text-neutral-900 leading-tight group-hover:text-blue-600 transition-colors">{app.job.title}</h4>
                    <p className="font-body text-[14px] text-neutral-600 mt-[2px]">{app.company.name}</p>
                    
                    <div className="flex flex-wrap items-center gap-[12px] mt-[8px]">
                      <span className="flex items-center gap-[4px] text-[12px] text-neutral-500 bg-neutral-100 px-[8px] py-[2px] rounded-md">
                        <MapPin size={12} /> {app.job.location || 'Remote'}
                      </span>
                      <span className="flex items-center gap-[4px] text-[12px] text-neutral-500 bg-neutral-100 px-[8px] py-[2px] rounded-md">
                        <Briefcase size={12} /> {app.job.employmentType || 'Full-time'}
                      </span>
                      <span className="text-[12px] text-neutral-400">
                        Applied {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-[12px] sm:gap-[8px] border-t sm:border-t-0 sm:border-l border-neutral-100 pt-[16px] sm:pt-0 sm:pl-[24px] shrink-0">
                  <div className="flex flex-col sm:items-end">
                    <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold mb-[4px]">Status</span>
                    <span className="px-[12px] py-[4px] bg-blue-50 text-blue-700 font-bold text-[13px] rounded-full inline-flex items-center justify-center">
                      {app.stage}
                    </span>
                  </div>
                  <div className="hidden sm:flex text-blue-600 items-center gap-1 text-[13px] font-semibold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details <ExternalLink size={14} />
                  </div>
                </div>

              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
