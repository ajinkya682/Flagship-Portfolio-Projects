'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  LogOut, Clock, User, Briefcase, FileText, Video, MessageSquare,
  Linkedin, Github, Globe, Phone, Mail, Image as ImageIcon, Calendar,
  Loader2, CheckCircle2, Send, ExternalLink, X, Sparkles, MapPin, PenLine, ChevronRight, Download, Target, Building2
} from 'lucide-react'
import Link from 'next/link'

interface PortalData {
  candidate: {
    id: string
    name: string
    email: string
    phone?: string
    avatar?: string
    linkedinUrl?: string
    githubUrl?: string
    portfolioUrl?: string
    resumeUrl?: string
    passportPhotoUrl?: string
    signature?: string
    availableStartDate?: string
    extractedSkills?: string[]
    strengths?: string[]
    gaps?: string[]
    isBlocked?: boolean
  }
  application: {
    id: string
    stage: string
    appliedAt: string
    source?: string
    aiScore?: number
    strengths?: string[]
    gaps?: string[]
  }
  job: {
    id: string
    title: string
    department?: string
    location?: string
    description?: string
    employmentType?: string
    salaryRange?: { min: number; max: number; currency: string }
  }
  company: {
    name: string
    logo: string
  }
  timeline: { event: string; date: string; type: string }[]
  interviews: any[]
  messages: any[]
  offer?: {
    id: string
    salary: number
    currency: string
    startDate: string
    letterContent: string
    status: 'draft' | 'sent' | 'accepted' | 'declined' | 'expired'
  } | null
  hireLetter?: {
    id: string
    role: string
    companyName: string
    salary: number
    startDate: string
    letterContent: string
    status: 'draft' | 'sent' | 'signed' | 'rejected'
    sentAt?: string
    signedAt?: string
  } | null
  assignment?: {
    id: string
    title: string
    description: string
    deadline: string
    referenceLink?: string
    status: 'pending' | 'submitted' | 'reviewed'
    submittedAt?: string
    submissionLink?: string
  } | null
}

type TabType = 'overview' | 'jobDetails' | 'resume' | 'messages' | 'profile' | 'offer' | 'hireLetter' | 'assignment'

export default function CandidateDashboardApplicationDetail({ params }: { params: { applicationId: string } }) {
  const router = useRouter()
  const [portalData, setPortalData] = useState<PortalData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [resumeFullscreen, setResumeFullscreen] = useState(false)
  const [tabBadges, setTabBadges] = useState<Record<string, number>>({})
  const [hireSignature, setHireSignature] = useState('')
  const [hireSubmitting, setHireSubmitting] = useState(false)
  const [hireSuccess, setHireSuccess] = useState<'signed' | 'rejected' | null>(null)
  const [assignmentLink, setAssignmentLink] = useState('')
  const [assignmentText, setAssignmentText] = useState('')
  const [assignmentSubmitting, setAssignmentSubmitting] = useState(false)
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false)
  const [isUpcomingInterviewJoinable, setIsUpcomingInterviewJoinable] = useState(false)

  // Derive upcoming interview
  const upcomingInterview = portalData?.interviews?.find((i: any) => {
    if (i.status !== 'scheduled') return false;
    const dateObj = new Date(i.scheduledAt);
    const endTime = new Date(dateObj.getTime() + (Number(i.duration) || 60) * 60000);
    return new Date() <= endTime;
  })

  useEffect(() => {
    if (!upcomingInterview) return;
    const checkJoinable = () => {
      const now = new Date();
      const dateObj = new Date(upcomingInterview.scheduledAt);
      const endTime = new Date(dateObj.getTime() + (Number(upcomingInterview.duration) || 60) * 60000);
      const joinable = now >= new Date(dateObj.getTime() - 15 * 60000) && now <= endTime;
      setIsUpcomingInterviewJoinable(joinable);
    };
    checkJoinable();
    const interval = setInterval(checkJoinable, 10000);
    return () => clearInterval(interval);
  }, [upcomingInterview]);

  const [realtimeMessages, setRealtimeMessages] = useState<any[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`/api/portal/me?applicationId=${params.applicationId}`)
      .then(res => {
        if (res.status === 401) { router.push('/candidate/login'); return null }
        if (!res.ok) throw new Error('Failed to load')
        return res.json()
      })
      .then(data => { if (data) setPortalData(data) })
      .catch(() => router.push('/candidate/dashboard'))
      .finally(() => setIsLoading(false))
  }, [router, params.applicationId])

  useEffect(() => {
    if (!portalData) return
    const candidateId = portalData.candidate.id

    const fetchMessages = () => {
      fetch(`/api/messages?candidateId=${candidateId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setRealtimeMessages(prev => {
              if (prev.length !== data.length) return data
              return prev
            })
          }
        })
        .catch(console.error)
    }

    fetchMessages()
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [portalData?.candidate?.id])

  useEffect(() => {
    if (activeTab === 'messages') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [realtimeMessages, activeTab])

  const handleLogout = async () => {
    await fetch('/api/auth/candidate/logout', { method: 'POST' })
    router.push('/candidate/login')
  }

  const computeBadges = (data: PortalData) => {
    const badges: Record<string, number> = {}
    const lastReadOffer = localStorage.getItem('portal_last_read_offer')
    const lastReadHire = localStorage.getItem('portal_last_read_hire')
    const lastReadAssignment = localStorage.getItem('portal_last_read_assignment')

    if (data.offer?.status === 'sent') {
      const offerSentAt = data.offer ? new Date(data.offer.startDate).getTime() : 0
      if (!lastReadOffer || new Date(lastReadOffer).getTime() < offerSentAt) badges['offer'] = 1
    }
    if (data.hireLetter?.status === 'sent') {
      if (!lastReadHire) badges['hireLetter'] = 1
    }
    if (data.assignment?.status === 'pending') {
      if (!lastReadAssignment) badges['assignment'] = 1
    }
    return badges
  }

  useEffect(() => {
    if (portalData) setTabBadges(computeBadges(portalData))
  }, [portalData])

  const handleTabClick = (tabId: TabType) => {
    setActiveTab(tabId)
    setTabBadges(prev => ({ ...prev, [tabId]: 0 }))
    localStorage.setItem(`portal_last_read_${tabId}`, new Date().toISOString())
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !portalData) return
    const messageData = {
      candidateId: portalData.candidate.id,
      senderId: 'candidate',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setRealtimeMessages(prev => [...prev, { ...messageData, id: Date.now().toString() }])
    setNewMessage('')
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      })
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  const handleUpdateOfferStatus = async (status: 'accepted' | 'declined') => {
    if (!portalData?.offer) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/portal/offers/${portalData.offer.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        const freshData = await fetch(`/api/portal/me?applicationId=${params.applicationId}`).then(r => r.json())
        setPortalData(freshData)
      }
    } catch (error) { console.error(error) } 
    finally { setIsLoading(false) }
  }

  const handleHireLetterAction = async (action: 'sign' | 'reject') => {
    if (!portalData?.hireLetter) return
    if (action === 'sign' && !hireSignature.trim()) return
    setHireSubmitting(true)
    try {
      const res = await fetch(`/api/portal/hire-letters/${portalData.hireLetter.id}/sign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, signature: hireSignature })
      })
      if (res.ok) {
        setHireSuccess(action === 'sign' ? 'signed' : 'rejected')
        const freshData = await fetch(`/api/portal/me?applicationId=${params.applicationId}`).then(r => r.json())
        setPortalData(freshData)
      }
    } catch (error) { console.error(error) } 
    finally { setHireSubmitting(false) }
  }

  const handleSubmitAssignment = async () => {
    if (!portalData?.assignment) return
    if (!assignmentLink.trim() && !assignmentText.trim()) return
    setAssignmentSubmitting(true)
    try {
      const res = await fetch(`/api/portal/assignments/${portalData.assignment.id}/submit`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionLink: assignmentLink, submissionText: assignmentText })
      })
      if (res.ok) {
        setAssignmentSubmitted(true)
        const freshData = await fetch(`/api/portal/me?applicationId=${params.applicationId}`).then(r => r.json())
        setPortalData(freshData)
      }
    } catch (err) { console.error(err) } 
    finally { setAssignmentSubmitting(false) }
  }

  const handleDownloadPDF = async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId)
    if (!element) return
    try {
      const html2pdf = (await import('html2pdf.js')).default
      const opt = {
        margin:       15,
        filename:     filename,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      }
      html2pdf().set(opt).from(element).save()
    } catch (error) { console.error(error) }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-slate-500 text-sm font-body">Loading your portal...</p>
        </div>
      </div>
    )
  }

  if (!portalData) return null

  const { candidate, application, job, company, timeline, messages } = portalData
  const STAGES = ['Applied', 'Screening', 'Interview', 'Assessment', 'Offer', 'Hired']
  const currentStageIndex = Math.max(0, STAGES.indexOf(application.stage))

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Sparkles size={16} /> },
    { id: 'jobDetails', label: 'Job Details', icon: <Briefcase size={16} /> },
    { id: 'profile', label: 'My Profile', icon: <User size={16} /> },
    ...(candidate.resumeUrl ? [{ id: 'resume' as TabType, label: 'Resume', icon: <FileText size={16} /> }] : []),
    { id: 'messages', label: 'Messages', icon: <MessageSquare size={16} /> },
    ...(portalData.assignment ? [{ id: 'assignment' as TabType, label: 'Assignment', icon: <FileText size={16} /> }] : []),
    ...(portalData.offer ? [{ id: 'offer' as TabType, label: 'Offer Letter', icon: <FileText size={16} /> }] : []),
    ...(portalData.hireLetter ? [{ id: 'hireLetter' as TabType, label: 'Hire Letter', icon: <FileText size={16} /> }] : []),
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-body selection:bg-blue-500/30">
      
      {/* Sleek Header */}
      <header className="h-[70px] bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-[24px] flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-[16px]">
          <Link href="/candidate/dashboard" className="flex items-center gap-[6px] px-[12px] py-[6px] text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors text-[13px] font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Dashboard
          </Link>
          <ChevronRight size={14} className="text-slate-300" />
          <div className="flex items-center gap-[10px]">
            <div className="w-[32px] h-[32px] bg-white border border-slate-200 rounded-[8px] flex items-center justify-center text-slate-900 font-display font-bold text-[14px] overflow-hidden shadow-sm">
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
              ) : company.name.charAt(0)}
            </div>
            <div className="hidden sm:block">
              <h2 className="font-display font-bold text-[14px] text-slate-900 leading-tight">{job.title}</h2>
              <p className="text-[11px] text-slate-500 font-medium">at {company.name}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-[12px]">
          <div className="hidden sm:flex items-center gap-[8px] px-[12px] py-[6px] bg-slate-50 border border-slate-200 rounded-full">
            <div className="w-[24px] h-[24px] bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
              {candidate.passportPhotoUrl || candidate.avatar ? (
                <img src={candidate.passportPhotoUrl || candidate.avatar} alt="" className="w-full h-full object-cover" />
              ) : <User size={12} className="text-slate-500" />}
            </div>
            <span className="font-semibold text-[12px] text-slate-700">{candidate.name}</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-[6px] px-[14px] py-[7px] bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-full text-[12px] font-semibold transition-all">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col md:flex-row max-w-[1400px] w-full mx-auto relative">
        
        {/* Sidebar */}
        <aside className="w-[240px] shrink-0 border-r border-slate-200/60 bg-white/50 backdrop-blur-sm p-[20px] sticky top-[70px] h-[calc(100vh-70px)] hidden md:flex flex-col overflow-y-auto">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-[16px] px-[12px]">Navigation</h3>
          <nav className="flex flex-col gap-[4px]">
            {navItems.map(item => {
              const isActive = activeTab === item.id
              const badge = tabBadges[item.id] || 0
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center justify-between w-full px-[14px] py-[12px] rounded-[12px] text-[13.5px] font-semibold transition-all group ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-[12px]">
                    <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`}>{item.icon}</span>
                    {item.label}
                  </div>
                  {badge > 0 && (
                    <span className={`w-[20px] h-[20px] rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive ? 'bg-white text-blue-600' : 'bg-red-500 text-white animate-pulse shadow-sm'
                    }`}>
                      {badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Mobile Navigation Dropdown/Scroll (Alternative to Sidebar for mobile) */}
        <div className="md:hidden w-full bg-white border-b border-slate-200 overflow-x-auto p-[16px] flex gap-[12px]">
           {navItems.map(item => {
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`shrink-0 px-[16px] py-[8px] rounded-full text-[13px] font-semibold flex items-center gap-[6px] ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              )
           })}
        </div>

        {/* Dynamic Main Content */}
        <main className="flex-1 min-w-0 p-[16px] md:p-[20px] lg:p-[32px] overflow-y-auto">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="flex flex-col xl:flex-row gap-[24px] items-start">
              
              <div className="flex-1 w-full flex flex-col gap-[24px]">
                {/* Premium Hero Banner */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-blue-900 rounded-[24px] p-[32px] text-white shadow-xl shadow-blue-900/10">
                  <div className="absolute top-0 right-0 -mr-[100px] -mt-[100px] w-[300px] h-[300px] bg-white/10 rounded-full blur-3xl" />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-[24px]">
                    <div className="flex items-center gap-[20px]">
                      <div className="w-[72px] h-[72px] rounded-[16px] bg-white/20 flex items-center justify-center overflow-hidden border border-white/30 shrink-0 backdrop-blur-md">
                        {company.logo ? (
                          <img src={company.logo} alt="" className="w-full h-full object-contain p-[4px] bg-white" />
                        ) : <Building2 size={32} className="text-white" />}
                      </div>
                      <div>
                        <h1 className="font-display text-[26px] font-bold leading-tight tracking-tight">{job.title}</h1>
                        <p className="text-blue-100 text-[14px] mt-[4px]">{company.name}</p>
                        <div className="flex items-center gap-[8px] mt-[8px]">
                          <span className="text-[12px] font-medium bg-white/20 px-[12px] py-[4px] rounded-full backdrop-blur-sm border border-white/10">
                            {job.location || 'Remote'}
                          </span>
                          <span className="text-[12px] font-medium bg-white/20 px-[12px] py-[4px] rounded-full backdrop-blur-sm border border-white/10">
                            {job.employmentType || 'Full-time'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-[6px] bg-black/20 p-[16px] rounded-[16px] backdrop-blur-md border border-white/10">
                      <span className="text-[11px] text-blue-200 uppercase tracking-wider font-bold">Current Stage</span>
                      <span className="text-[20px] font-display font-bold text-white">
                        {application.stage}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Upcoming Interview */}
                {upcomingInterview && (
                  <div className="bg-white rounded-[20px] border border-blue-200 shadow-sm p-[24px] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-[4px] h-full bg-blue-500" />
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px]">
                      <div>
                        <div className="flex items-center gap-[8px] mb-[8px]">
                          <div className="w-[32px] h-[32px] bg-blue-100 rounded-full flex items-center justify-center">
                            <Video size={16} className="text-blue-600" />
                          </div>
                          <h3 className="font-display text-[18px] font-bold text-slate-900">Upcoming Interview</h3>
                        </div>
                        <p className="text-[14px] text-slate-600 ml-[40px] font-medium">{upcomingInterview.date} at {upcomingInterview.time}</p>
                      </div>
                      {isUpcomingInterviewJoinable ? (
                        <Link href={`/portal/interviews/room/${upcomingInterview.id}?role=candidate`} className="h-[44px] px-[24px] bg-blue-600 text-white rounded-[12px] flex items-center justify-center text-[14px] font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 group">
                          Join Room <ChevronRight size={16} className="ml-[4px] group-hover:translate-x-[4px] transition-transform" />
                        </Link>
                      ) : (
                        <div className="h-[44px] px-[24px] bg-slate-100 text-slate-500 rounded-[12px] flex items-center justify-center text-[13px] font-bold cursor-not-allowed">
                          Join (Available 15m before)
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px]">
                  <div className="bg-white p-[20px] rounded-[20px] border border-slate-200/60 shadow-sm">
                    <div className="w-[36px] h-[36px] bg-blue-50 rounded-full flex items-center justify-center mb-[12px]">
                      <Calendar size={18} className="text-blue-500" />
                    </div>
                    <p className="text-[12px] text-slate-500 font-bold uppercase tracking-wider mb-[4px]">Applied On</p>
                    <p className="text-[15px] font-bold text-slate-900">{new Date(application.appliedAt).toLocaleDateString()}</p>
                  </div>
                  {job.department && (
                     <div className="bg-white p-[20px] rounded-[20px] border border-slate-200/60 shadow-sm">
                      <div className="w-[36px] h-[36px] bg-indigo-50 rounded-full flex items-center justify-center mb-[12px]">
                        <Briefcase size={18} className="text-indigo-500" />
                      </div>
                      <p className="text-[12px] text-slate-500 font-bold uppercase tracking-wider mb-[4px]">Department</p>
                      <p className="text-[15px] font-bold text-slate-900">{job.department}</p>
                    </div>
                  )}
                  {job.salaryRange && (
                    <div className="bg-white p-[20px] rounded-[20px] border border-slate-200/60 shadow-sm col-span-2">
                      <div className="w-[36px] h-[36px] bg-emerald-50 rounded-full flex items-center justify-center mb-[12px]">
                        <FileText size={18} className="text-emerald-500" />
                      </div>
                      <p className="text-[12px] text-slate-500 font-bold uppercase tracking-wider mb-[4px]">Salary Indication</p>
                      <p className="text-[15px] font-bold text-slate-900">
                        {job.salaryRange.currency} {job.salaryRange.min.toLocaleString()} - {job.salaryRange.max.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel: Timeline & Progress */}
              <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-[24px]">
                {/* Progress Stepper */}
                <div className="bg-white rounded-[20px] border border-slate-200/60 shadow-sm p-[24px]">
                  <h3 className="font-display text-[16px] font-bold text-slate-900 mb-[20px] flex items-center gap-[8px]">
                    <Target size={18} className="text-blue-500" /> Application Progress
                  </h3>
                  <div className="flex flex-col gap-[20px] relative ml-[8px]">
                    <div className="absolute left-[11px] top-[14px] bottom-[14px] w-[2px] bg-slate-100 z-0" />
                    {STAGES.map((stage, i) => {
                      const isCompleted = i < currentStageIndex
                      const isCurrent = i === currentStageIndex
                      return (
                        <div key={stage} className="flex items-center gap-[16px] relative z-10 group">
                          <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                            isCompleted ? 'bg-emerald-500 text-white shadow-md' :
                            isCurrent ? 'bg-blue-500 text-white ring-4 ring-blue-100 shadow-md scale-110' :
                            'bg-white border-2 border-slate-200'
                          }`}>
                            {isCompleted && <CheckCircle2 size={14} />}
                            {isCurrent && <div className="w-[8px] h-[8px] bg-white rounded-full animate-pulse" />}
                          </div>
                          <span className={`text-[14px] transition-colors ${
                            isCurrent ? 'text-blue-700 font-bold' :
                            isCompleted ? 'text-slate-700 font-semibold' :
                            'text-slate-400 font-medium'
                          }`}>{stage}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-[20px] border border-slate-200/60 shadow-sm p-[24px]">
                  <h3 className="font-display text-[16px] font-bold text-slate-900 mb-[20px] flex items-center gap-[8px]">
                    <Clock size={18} className="text-indigo-500" /> Activity Timeline
                  </h3>
                  <div className="flex flex-col gap-[16px]">
                    {timeline.length === 0 ? (
                      <p className="text-[13px] text-slate-400">No activity yet.</p>
                    ) : timeline.map((item, i) => (
                      <div key={i} className="flex items-start gap-[12px]">
                        <div className="mt-[5px] w-[8px] h-[8px] rounded-full bg-slate-300 shrink-0 ring-4 ring-slate-50" />
                        <div>
                          <p className="text-[13.5px] text-slate-800 font-semibold leading-tight">{item.event}</p>
                          <p className="text-[11.5px] text-slate-500 font-medium mt-[2px]">{item.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* JOB DETAILS TAB */}
          {activeTab === 'jobDetails' && (
            <div className="bg-white rounded-[24px] border border-slate-200/60 shadow-sm p-[32px] md:p-[40px] max-w-[900px]">
              <h2 className="font-display text-[28px] font-bold text-slate-900 mb-[16px]">{job.title}</h2>
              <div className="flex items-center gap-[12px] flex-wrap mb-[32px] pb-[32px] border-b border-slate-100">
                <span className="flex items-center gap-[6px] text-slate-600 text-[14px] font-medium bg-slate-50 border border-slate-100 px-[12px] py-[6px] rounded-[10px]">
                  <MapPin size={16} className="text-slate-400" /> {job.location || 'Remote'}
                </span>
                {job.department && (
                  <span className="flex items-center gap-[6px] text-slate-600 text-[14px] font-medium bg-slate-50 border border-slate-100 px-[12px] py-[6px] rounded-[10px]">
                    <Briefcase size={16} className="text-slate-400" /> {job.department}
                  </span>
                )}
                {job.employmentType && (
                  <span className="flex items-center gap-[6px] text-slate-600 text-[14px] font-medium bg-slate-50 border border-slate-100 px-[12px] py-[6px] rounded-[10px]">
                    <User size={16} className="text-slate-400" /> {job.employmentType}
                  </span>
                )}
              </div>

              {job.description ? (
                <div 
                  className="prose prose-slate max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-p:leading-relaxed prose-li:text-slate-700"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              ) : (
                <p className="text-slate-500 italic">No detailed description available for this role.</p>
              )}
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="flex flex-col gap-[24px] max-w-[900px]">
              <div className="bg-white rounded-[24px] border border-slate-200/60 shadow-sm p-[32px] md:p-[40px]">
                <div className="flex flex-col md:flex-row gap-[32px] items-start">
                  <div className="w-[120px] h-[120px] rounded-[24px] bg-slate-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg shrink-0">
                    {candidate.passportPhotoUrl ? (
                      <img src={candidate.passportPhotoUrl} alt="" className="w-full h-full object-cover" />
                    ) : candidate.avatar ? (
                      <img src={candidate.avatar} alt="" className="w-full h-full object-cover" />
                    ) : <User size={48} className="text-slate-300" />}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-[28px] font-bold text-slate-900">{candidate.name}</h2>
                    <p className="text-[16px] text-slate-500 font-medium">{job.title} Applicant</p>
                    
                    <div className="mt-[24px] grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
                      <div className="flex items-center gap-[12px] p-[16px] bg-slate-50 rounded-[16px] border border-slate-100">
                        <Mail size={18} className="text-blue-500" />
                        <span className="text-[14px] font-semibold text-slate-800 break-all">{candidate.email}</span>
                      </div>
                      {candidate.phone && (
                        <div className="flex items-center gap-[12px] p-[16px] bg-slate-50 rounded-[16px] border border-slate-100">
                          <Phone size={18} className="text-emerald-500" />
                          <span className="text-[14px] font-semibold text-slate-800">{candidate.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profiles & Links */}
                {(candidate.linkedinUrl || candidate.githubUrl || candidate.portfolioUrl) && (
                  <div className="mt-[40px] pt-[32px] border-t border-slate-100">
                    <h3 className="font-display text-[16px] font-bold text-slate-900 mb-[16px]">Online Presence</h3>
                    <div className="flex flex-wrap gap-[12px]">
                      {candidate.linkedinUrl && (
                        <a href={candidate.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-[8px] px-[16px] py-[10px] bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] rounded-[12px] font-semibold text-[14px] transition-colors">
                          <Linkedin size={16} /> LinkedIn
                        </a>
                      )}
                      {candidate.githubUrl && (
                        <a href={candidate.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-[8px] px-[16px] py-[10px] bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-[12px] font-semibold text-[14px] transition-colors">
                          <Github size={16} /> GitHub
                        </a>
                      )}
                      {candidate.portfolioUrl && (
                        <a href={candidate.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-[8px] px-[16px] py-[10px] bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-[12px] font-semibold text-[14px] transition-colors">
                          <Globe size={16} /> Portfolio
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* RESUME TAB */}
          {activeTab === 'resume' && candidate.resumeUrl && (
            <div className="bg-white rounded-[24px] border border-slate-200/60 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-160px)] min-h-[600px] max-w-[1000px]">
              <div className="bg-slate-900 px-[24px] py-[16px] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-[16px]">
                  <FileText className="text-white/80" size={24} />
                  <div>
                    <h3 className="font-bold text-white text-[15px]">{candidate.name} - Resume</h3>
                    <p className="text-slate-400 text-[12px]">PDF Document</p>
                  </div>
                </div>
                <div className="flex items-center gap-[12px]">
                  <button onClick={() => setResumeFullscreen(true)} className="flex items-center gap-[8px] px-[16px] py-[8px] bg-white/10 hover:bg-white/20 text-white rounded-[10px] text-[13px] font-semibold transition-colors">
                    <ExternalLink size={14} /> Fullscreen
                  </button>
                  <a href={candidate.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-[8px] px-[16px] py-[8px] bg-blue-600 hover:bg-blue-500 text-white rounded-[10px] text-[13px] font-semibold transition-colors">
                    <Download size={14} /> Download
                  </a>
                </div>
              </div>
              <div className="flex-1 bg-slate-200 p-[20px] md:p-[40px] overflow-hidden">
                <iframe src={candidate.resumeUrl} className="w-full h-full border-0 rounded-[8px] shadow-lg bg-white" title="Resume" />
              </div>
            </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <div className="bg-white rounded-[24px] border border-slate-200/60 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-160px)] min-h-[600px] max-w-[1000px]">
              <div className="px-[24px] py-[20px] border-b border-slate-100 bg-white flex items-center gap-[16px] shrink-0">
                <div className="w-[44px] h-[44px] bg-blue-50 rounded-[14px] flex items-center justify-center">
                  <MessageSquare className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-[18px] text-slate-900">Messages</h3>
                  <p className="text-[13px] text-slate-500">Communicate directly with your recruiter.</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-[24px] md:p-[32px] flex flex-col gap-[16px] bg-slate-50/50">
                {realtimeMessages.length === 0 ? (
                  <div className="m-auto text-center">
                    <div className="w-[64px] h-[64px] bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-[16px]">
                      <MessageSquare className="text-slate-300" size={28} />
                    </div>
                    <p className="text-[16px] font-bold text-slate-700">No messages yet</p>
                    <p className="text-[14px] text-slate-500 mt-[4px]">Start a conversation with the hiring team.</p>
                  </div>
                ) : realtimeMessages.map((msg: any) => {
                  const isMine = msg.senderId === 'candidate';
                  return (
                    <div key={msg.id} className={`flex w-full ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] p-[16px] rounded-[20px] shadow-sm ${isMine ? 'bg-blue-600 text-white rounded-br-[4px]' : 'bg-white border border-slate-200/60 text-slate-800 rounded-bl-[4px]'}`}>
                        <p className="text-[15px] leading-relaxed">{msg.text}</p>
                        <p className={`text-[11px] mt-[8px] font-medium ${isMine ? 'text-blue-200' : 'text-slate-400'}`}>{msg.time}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-[20px] md:p-[24px] border-t border-slate-100 bg-white shrink-0">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={candidate.isBlocked}
                    className="w-full h-[54px] pl-[20px] pr-[60px] rounded-[16px] border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-[15px] outline-none transition-all disabled:opacity-50 disabled:bg-slate-50"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || candidate.isBlocked}
                    className="absolute right-[8px] w-[38px] h-[38px] bg-blue-600 hover:bg-blue-700 text-white rounded-[12px] flex items-center justify-center transition-all disabled:opacity-50"
                  >
                    <Send size={16} className="ml-[2px]" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* OFFER LETTER TAB - Split Premium View */}
          {activeTab === 'offer' && portalData.offer && (
            <div className="flex flex-col lg:flex-row gap-[24px] lg:h-[calc(100vh-160px)] lg:min-h-[600px] max-w-[1400px]">
              
              {/* Document Preview */}
              <div className="flex-1 bg-neutral-200 rounded-[24px] border border-slate-200 overflow-hidden shadow-inner relative flex flex-col">
                <div className="bg-slate-800 px-[20px] py-[12px] flex items-center justify-between text-white shrink-0 z-10 shadow-md">
                   <div className="flex items-center gap-[12px]">
                     <FileText size={16} className="text-slate-300" />
                     <span className="font-semibold text-[13px]">Official_Offer_Letter.pdf</span>
                   </div>
                   <button onClick={() => handleDownloadPDF('offer-letter-doc', 'Offer_Letter.pdf')} className="p-[6px] hover:bg-white/10 rounded-[6px] transition-colors text-slate-300 hover:text-white">
                     <Download size={16} />
                   </button>
                </div>
                <div className="flex-1 overflow-y-auto p-[20px] md:p-[40px] flex justify-center">
                  <div id="offer-letter-doc" className="bg-white shadow-xl max-w-[210mm] w-full shrink-0" style={{ minHeight: '297mm', padding: '25mm' }}>
                    {/* Letter Content - Exact same formatting but cleaner layout */}
                    <div className="flex items-start justify-between border-b-[2px] border-slate-900 pb-[24px] mb-[40px]">
                      <div className="flex items-center gap-[16px]">
                        {company.logo ? (
                          <img src={company.logo} alt={company.name} className="h-[48px] object-contain" />
                        ) : (
                          <div className="w-[48px] h-[48px] bg-blue-600 rounded-[10px] flex items-center justify-center text-white font-bold text-[22px]">{company.name.charAt(0)}</div>
                        )}
                        <div>
                          <h2 className="text-[24px] font-bold text-slate-900 leading-none">{company.name}</h2>
                          <p className="text-[13px] text-slate-500 font-medium mt-[4px] uppercase tracking-wider">Official Offer</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[13px] font-semibold text-slate-700 bg-slate-100 px-[12px] py-[6px] rounded-[6px]">
                          {new Date(portalData.offer.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="whitespace-pre-wrap font-serif text-[15px] leading-[1.8] text-slate-800 text-justify">
                      {portalData.offer.letterContent}
                    </div>
                    <div className="mt-[80px] grid grid-cols-2 gap-[60px] pb-[40px]">
                      <div>
                        <div className="border-b-[1.5px] border-slate-400 pb-[8px] mb-[12px]">
                          <p className="font-serif italic text-slate-400 text-[22px] px-[8px]">Authorized Signatory</p>
                        </div>
                        <p className="text-[15px] font-bold text-slate-900">{company.name} HR</p>
                      </div>
                      <div>
                        <div className="border-b-[1.5px] border-slate-400 pb-[8px] mb-[12px]">
                          {portalData.offer.status === 'accepted' ? (
                            <p className="font-serif italic text-blue-700 text-[26px] px-[8px]">{candidate.name}</p>
                          ) : <div className="h-[34px]" />}
                        </div>
                        <p className="text-[15px] font-bold text-slate-900">{candidate.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Sidebar */}
              <div className="w-full lg:w-[380px] bg-white rounded-[24px] border border-slate-200/60 shadow-sm p-[32px] flex flex-col shrink-0">
                <h3 className="font-display text-[22px] font-bold text-slate-900 mb-[8px]">Action Required</h3>
                <p className="text-[14px] text-slate-500 mb-[32px]">Please review the offer document carefully. Once ready, you can accept or decline below.</p>
                
                <div className="flex flex-col gap-[16px] mb-[40px]">
                   <div className="bg-slate-50 p-[16px] rounded-[16px] border border-slate-100 flex items-center justify-between">
                     <span className="text-[13px] font-bold text-slate-500 uppercase">Base Salary</span>
                     <span className="text-[16px] font-bold text-slate-900">{portalData.offer.currency === 'USD' ? '$' : portalData.offer.currency}{portalData.offer.salary.toLocaleString()}/yr</span>
                   </div>
                   <div className="bg-slate-50 p-[16px] rounded-[16px] border border-slate-100 flex items-center justify-between">
                     <span className="text-[13px] font-bold text-slate-500 uppercase">Start Date</span>
                     <span className="text-[15px] font-bold text-slate-900">{new Date(portalData.offer.startDate).toLocaleDateString()}</span>
                   </div>
                </div>

                <div className="mt-auto">
                  {portalData.offer.status === 'sent' && (
                    <div className="flex flex-col gap-[12px]">
                      <button onClick={() => handleUpdateOfferStatus('accepted')} className="w-full h-[52px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-[16px] font-bold text-[15px] shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-[8px]">
                        <CheckCircle2 size={20} /> Accept Offer
                      </button>
                      <button onClick={() => handleUpdateOfferStatus('declined')} className="w-full h-[52px] bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 rounded-[16px] font-bold text-[15px] transition-all">
                        Decline
                      </button>
                    </div>
                  )}
                  {portalData.offer.status === 'accepted' && (
                    <div className="p-[20px] bg-emerald-50 border border-emerald-200 rounded-[16px] text-center">
                      <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-[12px]" />
                      <h4 className="text-[16px] font-bold text-emerald-900">Offer Accepted!</h4>
                      <p className="text-[13px] text-emerald-700 mt-[4px]">We will be in touch with the next steps shortly.</p>
                    </div>
                  )}
                  {portalData.offer.status === 'declined' && (
                    <div className="p-[20px] bg-red-50 border border-red-200 rounded-[16px] text-center">
                      <h4 className="text-[16px] font-bold text-red-900">Offer Declined</h4>
                      <p className="text-[13px] text-red-700 mt-[4px]">Thank you for your time. We wish you the best.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* HIRE LETTER TAB - Split Premium View */}
          {activeTab === 'hireLetter' && portalData.hireLetter && (
            <div className="flex flex-col lg:flex-row gap-[24px] lg:h-[calc(100vh-160px)] lg:min-h-[600px] max-w-[1400px]">
              {/* Document Preview */}
              <div className="flex-1 bg-neutral-200 rounded-[24px] border border-slate-200 overflow-hidden shadow-inner relative flex flex-col">
                 <div className="bg-slate-800 px-[20px] py-[12px] flex items-center justify-between text-white shrink-0 z-10 shadow-md">
                   <div className="flex items-center gap-[12px]">
                     <FileText size={16} className="text-slate-300" />
                     <span className="font-semibold text-[13px]">Official_Hire_Letter.pdf</span>
                   </div>
                   <button onClick={() => handleDownloadPDF('hire-letter-doc', 'Hire_Letter.pdf')} className="p-[6px] hover:bg-white/10 rounded-[6px] transition-colors text-slate-300 hover:text-white">
                     <Download size={16} />
                   </button>
                </div>
                <div className="flex-1 overflow-y-auto p-[20px] md:p-[40px] flex justify-center">
                  <div id="hire-letter-doc" className="bg-white shadow-xl max-w-[210mm] w-full shrink-0" style={{ minHeight: '297mm', padding: '25mm' }}>
                     <div className="flex items-start justify-between border-b-[2px] border-slate-900 pb-[24px] mb-[40px]">
                      <div className="flex items-center gap-[16px]">
                        {company.logo ? (
                          <img src={company.logo} alt={company.name} className="h-[48px] object-contain" />
                        ) : (
                          <div className="w-[48px] h-[48px] bg-indigo-600 rounded-[10px] flex items-center justify-center text-white font-bold text-[22px]">{company.name.charAt(0)}</div>
                        )}
                        <div>
                          <h2 className="text-[24px] font-bold text-slate-900 leading-none">{company.name}</h2>
                          <p className="text-[13px] text-slate-500 font-medium mt-[4px] uppercase tracking-wider">Official Hire Letter</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[13px] font-semibold text-slate-700 bg-slate-100 px-[12px] py-[6px] rounded-[6px]">
                          {new Date(portalData.hireLetter.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="whitespace-pre-wrap font-serif text-[15px] leading-[1.8] text-slate-800 text-justify">
                      {portalData.hireLetter.letterContent}
                    </div>
                    <div className="mt-[80px] grid grid-cols-2 gap-[60px] pb-[40px]">
                      <div>
                        <div className="border-b-[1.5px] border-slate-400 pb-[8px] mb-[12px]">
                          <p className="font-serif italic text-slate-400 text-[22px] px-[8px]">Authorized Signatory</p>
                        </div>
                        <p className="text-[15px] font-bold text-slate-900">{company.name} HR</p>
                      </div>
                      <div>
                        <div className="border-b-[1.5px] border-slate-400 pb-[8px] mb-[12px]">
                          {portalData.hireLetter.status === 'signed' ? (
                            <p className="font-serif italic text-indigo-700 text-[26px] px-[8px]">{candidate.signature || candidate.name}</p>
                          ) : <div className="h-[34px]" />}
                        </div>
                        <p className="text-[15px] font-bold text-slate-900">{candidate.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Sidebar */}
              <div className="w-full lg:w-[380px] bg-white rounded-[24px] border border-slate-200/60 shadow-sm p-[32px] flex flex-col shrink-0">
                <h3 className="font-display text-[22px] font-bold text-slate-900 mb-[8px]">Sign Hire Letter</h3>
                <p className="text-[14px] text-slate-500 mb-[32px]">To officially join the team, please review and digitally sign the document.</p>
                
                <div className="mt-auto">
                  {portalData.hireLetter.status === 'sent' && (
                    <div className="flex flex-col gap-[20px]">
                      {hireSuccess === 'signed' ? (
                         <div className="p-[20px] bg-emerald-50 border border-emerald-200 rounded-[16px] text-center">
                           <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-[12px]" />
                           <h4 className="text-[16px] font-bold text-emerald-900">Signed successfully!</h4>
                         </div>
                      ) : (
                        <>
                          <div className="flex flex-col gap-[8px]">
                            <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">Digital Signature <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              value={hireSignature}
                              onChange={e => setHireSignature(e.target.value)}
                              placeholder={candidate.name}
                              className="w-full h-[56px] px-[16px] rounded-[16px] border-2 border-slate-200 focus:border-indigo-500 outline-none text-[22px] font-serif italic text-slate-900 transition-colors bg-slate-50 focus:bg-white"
                            />
                            <p className="text-[12px] text-slate-400 mt-[4px]">Type your full legal name.</p>
                          </div>
                          <button
                            onClick={() => handleHireLetterAction('sign')}
                            disabled={hireSubmitting || !hireSignature.trim()}
                            className="w-full h-[52px] bg-indigo-600 hover:bg-indigo-700 text-white rounded-[16px] font-bold text-[15px] shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-[8px] disabled:opacity-50"
                          >
                            {hireSubmitting ? <Loader2 size={20} className="animate-spin" /> : <><PenLine size={18} /> Sign Document</>}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                  {portalData.hireLetter.status === 'signed' && (
                    <div className="p-[24px] bg-indigo-50 border border-indigo-200 rounded-[20px] text-center">
                      <div className="w-[56px] h-[56px] bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-[16px]">
                         <Sparkles size={28} />
                      </div>
                      <h4 className="text-[18px] font-display font-bold text-indigo-900 mb-[8px]">Welcome Aboard! 🎉</h4>
                      <p className="text-[14px] text-indigo-700">You are officially part of the team. We are excited for your journey.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Fullscreen Resume Modal */}
      {resumeFullscreen && candidate.resumeUrl && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/95 backdrop-blur-md">
          <div className="bg-slate-900 px-[24px] py-[16px] flex items-center justify-between border-b border-white/10 shrink-0">
             <h3 className="font-bold text-white text-[16px]">{candidate.name} - Resume</h3>
             <button onClick={() => setResumeFullscreen(false)} className="px-[16px] py-[8px] bg-white/10 hover:bg-red-500 text-white rounded-[10px] text-[13px] font-semibold transition-colors flex items-center gap-[6px]">
               <X size={14} /> Close
             </button>
          </div>
          <div className="flex-1 p-[20px] md:p-[40px] flex justify-center overflow-hidden">
             <iframe src={candidate.resumeUrl} className="w-full max-w-[1200px] h-full border-0 rounded-[12px] shadow-2xl bg-white" title="Resume Fullscreen" />
          </div>
        </div>
      )}
    </div>
  )
}
