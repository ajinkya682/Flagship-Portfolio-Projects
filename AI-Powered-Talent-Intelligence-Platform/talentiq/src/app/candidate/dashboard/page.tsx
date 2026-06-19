'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Briefcase, Building2, MapPin, Loader2, Sparkles, User, ExternalLink, Clock, Target, CheckCircle } from 'lucide-react'
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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-[36px] h-[36px] text-blue-600 animate-spin mb-[20px]" />
        <p className="font-body text-[15px] font-medium text-slate-500 animate-pulse">Loading your portal...</p>
      </div>
    )
  }

  if (!isLoggedIn || !candidate) return null;

  const activeApps = applications.filter(a => !['Rejected', 'Hired'].includes(a.stage)).length;
  const offersCount = applications.filter(a => a.stage === 'Offer').length;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-body selection:bg-blue-500/30">
      {/* Sleek Glassmorphic Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 py-[16px] px-[24px] sticky top-0 z-20 shadow-sm">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-[12px] group cursor-pointer">
            <div className="w-[40px] h-[40px] bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[12px] flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h2 className="font-display font-bold text-[19px] text-slate-900 leading-tight tracking-tight">TalentIQ Portal</h2>
              <p className="text-[12.5px] font-medium text-slate-500">Candidate Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-[20px]">
            <div className="hidden sm:flex items-center gap-[12px] px-[16px] py-[8px] bg-white border border-slate-200/80 rounded-full shadow-sm hover:border-slate-300 transition-colors">
              {candidate.avatar ? (
                <img src={candidate.avatar} alt="Avatar" className="w-[28px] h-[28px] rounded-full object-cover border border-slate-100" />
              ) : (
                <div className="w-[28px] h-[28px] rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <User size={14} />
                </div>
              )}
              <div className="flex flex-col justify-center">
                <p className="font-semibold text-[13px] text-slate-800 leading-tight">{candidate.name}</p>
                <p className="text-[11px] text-slate-500 font-medium leading-tight">{candidate.email}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-[8px] px-[18px] py-[9px] bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-[12px] text-[13px] font-bold transition-all duration-200"
            >
              <LogOut size={15} /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1100px] mx-auto p-[16px] md:p-[24px] mt-[8px] md:mt-[16px] pb-[60px]">
        
        {/* Dynamic Welcome Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-blue-900 rounded-[24px] p-[32px] sm:p-[40px] text-white shadow-xl shadow-blue-900/10 mb-[32px]">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -mr-[100px] -mt-[100px] w-[300px] h-[300px] bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-[50px] -mb-[50px] w-[200px] h-[200px] bg-blue-500/20 rounded-full blur-2xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-[30px]">
            <div>
              <h1 className="font-display text-[32px] sm:text-[38px] font-extrabold mb-[8px] leading-tight tracking-tight">
                Welcome back, {candidate.name.split(' ')[0]}!
              </h1>
              <p className="text-blue-100 text-[15px] sm:text-[17px] max-w-[500px] leading-relaxed">
                You are on the path to your next great opportunity. Track your applications, prepare for interviews, and manage your offers.
              </p>
            </div>
            <div className="hidden lg:flex flex-col gap-[12px]">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-[16px] p-[16px] flex items-center gap-[16px] min-w-[200px]">
                 <div className="w-[44px] h-[44px] rounded-[12px] bg-white/20 flex items-center justify-center">
                    <Briefcase className="text-white w-[20px] h-[20px]" />
                 </div>
                 <div>
                    <p className="text-[12px] text-blue-100 font-semibold uppercase tracking-wider">Total Applied</p>
                    <p className="text-[24px] font-display font-bold leading-none">{applications.length}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[16px] mb-[40px]">
            <div className="bg-white rounded-[20px] p-[24px] border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-[12px] mb-[12px]">
                <div className="w-[36px] h-[36px] bg-blue-50 rounded-full flex items-center justify-center">
                  <Target size={18} className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-700 text-[14px]">Active Processes</h3>
              </div>
              <p className="font-display text-[28px] font-bold text-slate-900">{activeApps}</p>
            </div>
            
            <div className="bg-white rounded-[20px] p-[24px] border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-[12px] mb-[12px]">
                <div className="w-[36px] h-[36px] bg-emerald-50 rounded-full flex items-center justify-center">
                  <CheckCircle size={18} className="text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-700 text-[14px]">Total Offers</h3>
              </div>
              <p className="font-display text-[28px] font-bold text-slate-900">{offersCount}</p>
            </div>

            <div className="bg-white rounded-[20px] p-[24px] border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-[12px] mb-[12px]">
                <div className="w-[36px] h-[36px] bg-purple-50 rounded-full flex items-center justify-center">
                  <Clock size={18} className="text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-700 text-[14px]">Last Application</h3>
              </div>
              <p className="font-display text-[18px] font-bold text-slate-900 mt-[6px]">
                {applications.length > 0 
                  ? new Date(Math.max(...applications.map(a => new Date(a.appliedAt).getTime()))).toLocaleDateString()
                  : 'N/A'
                }
              </p>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[16px] mb-[20px]">
          <h3 className="font-display text-[20px] sm:text-[22px] font-bold text-slate-900 tracking-tight">Your Applications</h3>
          <span className="text-[13px] sm:text-[14px] font-semibold text-slate-500 bg-slate-200/50 px-[12px] py-[4px] rounded-full self-start sm:self-auto">
            {applications.length} Position{applications.length === 1 ? '' : 's'}
          </span>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white border border-slate-200/60 rounded-[24px] p-[60px] text-center flex flex-col items-center shadow-sm">
            <div className="w-[80px] h-[80px] bg-slate-50 rounded-full flex items-center justify-center mb-[20px]">
              <Briefcase className="w-[36px] h-[36px] text-slate-300" />
            </div>
            <h4 className="font-display text-[20px] font-bold text-slate-900 mb-[8px]">No applications yet</h4>
            <p className="font-body text-[15px] text-slate-500 max-w-[300px]">When you apply to open positions across our platform, they will securely appear right here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-[16px]">
            {applications.map((app) => (
              <Link href={`/candidate/dashboard/${app.id}`} key={app.id} 
                className="bg-white border border-slate-200/60 hover:border-blue-400 rounded-[20px] p-[24px] sm:p-[28px] shadow-sm hover:shadow-lg hover:-translate-y-[2px] transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-[24px] group cursor-pointer"
              >
                
                <div className="flex items-start gap-[20px] flex-1">
                  <div className="w-[64px] h-[64px] rounded-[16px] bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden shadow-sm group-hover:shadow transition-shadow">
                    {app.company.logo ? (
                      <img src={app.company.logo} alt={app.company.name} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="text-slate-400 w-[28px] h-[28px]" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-display text-[19px] font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors mb-[4px]">
                      {app.job.title}
                    </h4>
                    <p className="font-body text-[15px] font-medium text-slate-600 mb-[12px]">{app.company.name}</p>
                    
                    <div className="flex flex-wrap items-center gap-[8px]">
                      <span className="flex items-center gap-[6px] text-[12.5px] font-medium text-slate-600 bg-slate-100 px-[10px] py-[4px] rounded-lg">
                        <MapPin size={13} className="text-slate-400" /> {app.job.location || 'Remote'}
                      </span>
                      <span className="flex items-center gap-[6px] text-[12.5px] font-medium text-slate-600 bg-slate-100 px-[10px] py-[4px] rounded-lg">
                        <Briefcase size={13} className="text-slate-400" /> {app.job.employmentType || 'Full-time'}
                      </span>
                      <span className="flex items-center gap-[6px] text-[12.5px] font-medium text-slate-500 ml-1">
                        <Clock size={13} className="text-slate-400" /> Applied {new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between gap-[16px] border-t md:border-t-0 md:border-l border-slate-100 pt-[16px] md:pt-0 md:pl-[32px] shrink-0">
                  <div className="flex flex-col md:items-end">
                    <span className="text-[11.5px] text-slate-400 uppercase tracking-wider font-bold mb-[6px]">Status</span>
                    <span className={`px-[16px] py-[6px] font-bold text-[13px] rounded-full inline-flex items-center justify-center border shadow-sm ${
                      app.stage === 'Hired' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      app.stage === 'Offer' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      app.stage === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {app.stage}
                    </span>
                  </div>
                  <div className="flex items-center gap-[6px] text-[13.5px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details <ExternalLink size={15} />
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
