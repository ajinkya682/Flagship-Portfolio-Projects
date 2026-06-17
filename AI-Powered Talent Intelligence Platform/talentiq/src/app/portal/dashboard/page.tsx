'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { io, Socket } from 'socket.io-client'
import {
  LogOut, Clock, User, Briefcase, FileText, Video, MessageSquare,
  Linkedin, Github, Globe, Phone, Mail, Image as ImageIcon, Calendar,
  Loader2, CheckCircle2, Send, ExternalLink, X, Sparkles, MapPin, PenLine
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

type TabType = 'overview' | 'resume' | 'messages' | 'profile' | 'offer' | 'hireLetter' | 'assignment'

export default function CandidateDashboard() {
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

  const [realtimeMessages, setRealtimeMessages] = useState<any[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/portal/me')
      .then(res => {
        if (res.status === 401) { router.push('/portal/login'); return null }
        return res.json()
      })
      .then(data => { if (data) setPortalData(data) })
      .catch(() => router.push('/portal/login'))
      .finally(() => setIsLoading(false))
  }, [router])

  useEffect(() => {
    if (!portalData) return
    const candidateId = portalData.candidate.id

    fetch(`/api/messages?candidateId=${candidateId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRealtimeMessages(data)
      })
      .catch(console.error)

    fetch('/api/socket/io').finally(() => {
      const socket = io({ path: '/api/socket/io' })
      socketRef.current = socket

      socket.on('connect', () => {
        setIsConnected(true)
        socket.emit('join_room', candidateId)
      })

      socket.on('receive_message', (message: any) => {
        setRealtimeMessages(prev => [...prev, message])
      })

      socket.on('disconnect', () => {
        setIsConnected(false)
      })
    })

    return () => {
      if (socketRef.current) socketRef.current.disconnect()
    }
  }, [portalData?.candidate?.id])

  useEffect(() => {
    if (activeTab === 'messages') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [realtimeMessages, activeTab])

  const handleLogout = async () => {
    await fetch('/api/portal/logout', { method: 'POST' })
    router.push('/portal/login')
  }

  // Compute notification badges based on unread/unvisited data
  const computeBadges = (data: PortalData) => {
    const badges: Record<string, number> = {}
    const lastReadOffer = localStorage.getItem('portal_last_read_offer')
    const lastReadHire = localStorage.getItem('portal_last_read_hire')
    const lastReadAssignment = localStorage.getItem('portal_last_read_assignment')
    const lastReadMessages = localStorage.getItem('portal_last_read_messages')

    // Offer badge: has a sent offer that hasn't been read
    if (data.offer?.status === 'sent') {
      const offerSentAt = data.offer ? new Date(data.offer.startDate).getTime() : 0
      if (!lastReadOffer || new Date(lastReadOffer).getTime() < offerSentAt) {
        badges['offer'] = 1
      }
    }

    // Hire letter badge
    if (data.hireLetter?.status === 'sent') {
      if (!lastReadHire) {
        badges['hireLetter'] = 1
      }
    }

    // Assignment badge
    if (data.assignment?.status === 'pending') {
      if (!lastReadAssignment) {
        badges['assignment'] = 1
      }
    }

    return badges
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !socketRef.current || !portalData) return

    const messageData = {
      candidateId: portalData.candidate.id,
      senderId: 'candidate',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    socketRef.current.emit('send_message', messageData)
    setNewMessage('')
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
        const freshData = await fetch('/api/portal/me').then(r => r.json())
        setPortalData(freshData)
        setTabBadges(computeBadges(freshData))
      }
    } catch (error) {
      console.error('Failed to update offer status', error)
    } finally {
      setIsLoading(false)
    }
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
        const freshData = await fetch('/api/portal/me').then(r => r.json())
        setPortalData(freshData)
      }
    } catch (error) {
      console.error('Failed to process hire letter', error)
    } finally {
      setHireSubmitting(false)
    }
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
        const freshData = await fetch('/api/portal/me').then(r => r.json())
        setPortalData(freshData)
      }
    } catch (err) {
      console.error('Failed to submit assignment', err)
    } finally {
      setAssignmentSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-neutral-500 text-sm font-body">Loading your portal...</p>
        </div>
      </div>
    )
  }

  if (!portalData) return null

  const { candidate, application, job, company, timeline, interviews, messages } = portalData

  const STAGES = ['Applied', 'Screening', 'Interview', 'Assessment', 'Offer', 'Hired']
  const currentStageIndex = Math.max(0, STAGES.indexOf(application.stage))
  const upcomingInterview = interviews.find((i: any) => i.status === 'scheduled')

  const handleTabClick = (tabId: TabType) => {
    setActiveTab(tabId)
    // Clear badge and store read time in localStorage
    setTabBadges(prev => ({ ...prev, [tabId]: 0 }))
    const key = `portal_last_read_${tabId}`
    localStorage.setItem(key, new Date().toISOString())
  }

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Sparkles size={15} /> },
    ...(portalData.hireLetter ? [{ id: 'hireLetter' as TabType, label: 'Hire Letter', icon: <FileText size={15} /> }] : []),
    ...(portalData.offer ? [{ id: 'offer' as TabType, label: 'Offer', icon: <FileText size={15} /> }] : []),
    ...(portalData.assignment ? [{ id: 'assignment' as TabType, label: 'Assignment', icon: <FileText size={15} /> }] : []),
    { id: 'profile', label: 'My Profile', icon: <User size={15} /> },
    ...(candidate.resumeUrl ? [{ id: 'resume' as TabType, label: 'Resume', icon: <FileText size={15} /> }] : []),
    { id: 'messages', label: 'Messages', icon: <MessageSquare size={15} /> },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-neutral-100 flex flex-col font-body">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-neutral-200/60 py-[14px] px-[24px] flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-[12px]">
          <div className="w-[36px] h-[36px] bg-blue-600 rounded-[10px] flex items-center justify-center text-white font-display font-bold text-[15px] overflow-hidden shadow-md">
            {company.logo ? (
              <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
            ) : company.name.charAt(0)}
          </div>
          <div>
            <h2 className="font-display font-bold text-[15px] text-neutral-900 leading-tight">{company.name}</h2>
            <p className="text-[11px] text-neutral-400 font-medium">Candidate Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-[12px]">
          <div className="hidden sm:flex items-center gap-[8px] px-[12px] py-[6px] bg-neutral-50 border border-neutral-200 rounded-full">
            <div className="w-[24px] h-[24px] bg-neutral-200 rounded-full flex items-center justify-center overflow-hidden">
              {candidate.passportPhotoUrl || candidate.avatar ? (
                <img src={candidate.passportPhotoUrl || candidate.avatar} alt="" className="w-full h-full object-cover" />
              ) : <User size={12} className="text-neutral-500" />}
            </div>
            <span className="font-semibold text-[12px] text-neutral-700">{candidate.name}</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-[6px] px-[14px] py-[7px] bg-neutral-100 hover:bg-red-50 hover:text-red-600 text-neutral-600 rounded-full text-[12px] font-semibold transition-all">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-[1100px] w-full mx-auto p-[20px] md:p-[28px] flex flex-col gap-[20px]">

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-[20px] p-[28px] text-white shadow-lg">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-[16px]">
              <div className="w-[64px] h-[64px] rounded-[16px] bg-white/20 flex items-center justify-center overflow-hidden border-2 border-white/30 shrink-0">
                {candidate.passportPhotoUrl ? (
                  <img src={candidate.passportPhotoUrl} alt="" className="w-full h-full object-cover" />
                ) : candidate.avatar ? (
                  <img src={candidate.avatar} alt="" className="w-full h-full object-cover" />
                ) : <User size={28} className="text-white/80" />}
              </div>
              <div>
                <h1 className="font-display text-[22px] font-bold leading-tight">{candidate.name}</h1>
                <p className="text-blue-200 text-[13px] mt-[2px]">{candidate.email}</p>
                <div className="flex items-center gap-[8px] mt-[6px]">
                  <span className="text-[11px] bg-white/20 px-[10px] py-[3px] rounded-full font-semibold">
                    Applied for: {job.title}
                  </span>
                  {job.department && (
                    <span className="text-[11px] bg-white/10 px-[10px] py-[3px] rounded-full">
                      {job.department}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-[4px]">
              <span className="text-[11px] text-blue-200 uppercase tracking-wider font-semibold">Current Stage</span>
              <span className="text-[18px] font-display font-bold bg-white/20 px-[16px] py-[6px] rounded-xl">
                {application.stage}
              </span>
              <span className="text-[11px] text-blue-200">
                Applied {new Date(application.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-[20px]">
          {/* Left sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-[16px]">
            {/* Application Progress */}
            <div className="bg-white rounded-[18px] border border-neutral-100 shadow-sm p-[22px]">
              <h3 className="font-display text-[14px] font-bold text-neutral-900 mb-[18px] flex items-center gap-[8px]">
                <Briefcase size={14} className="text-blue-500" /> Application Progress
              </h3>
              <div className="flex flex-col gap-[12px] relative">
                <div className="absolute left-[10px] top-[10px] bottom-[10px] w-[2px] bg-neutral-100 z-0" />
                {STAGES.map((stage, i) => {
                  const isCompleted = i < currentStageIndex
                  const isCurrent = i === currentStageIndex
                  return (
                    <div key={stage} className="flex items-center gap-[12px] relative z-10">
                      <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isCompleted ? 'bg-emerald-500 text-white shadow-sm' :
                        isCurrent ? 'bg-blue-500 text-white ring-4 ring-blue-100 shadow-sm' :
                        'bg-white border-2 border-neutral-200'
                      }`}>
                        {isCompleted && <CheckCircle2 size={12} />}
                        {isCurrent && <div className="w-[7px] h-[7px] bg-white rounded-full" />}
                      </div>
                      <span className={`text-[13px] ${
                        isCurrent ? 'text-neutral-900 font-bold' :
                        isCompleted ? 'text-neutral-600 font-medium' :
                        'text-neutral-400'
                      }`}>{stage}</span>
                    </div>
                  )
                })}
              </div>

              {upcomingInterview && (
                <div className="mt-[18px] p-[14px] bg-blue-50 rounded-[12px] border border-blue-100">
                  <div className="flex items-center gap-[6px] mb-[6px]">
                    <Video size={13} className="text-blue-600" />
                    <span className="font-bold text-[12px] text-blue-900">Upcoming Interview</span>
                  </div>
                  <p className="text-[12px] text-blue-700 mb-[10px]">{upcomingInterview.date} at {upcomingInterview.time}</p>
                  <Link href={`/meet/${upcomingInterview.id}`} className="w-full h-[34px] bg-blue-600 text-white rounded-[8px] flex items-center justify-center text-[12px] font-semibold hover:bg-blue-700 transition-colors">
                    Join Interview
                  </Link>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-[18px] border border-neutral-100 shadow-sm p-[22px]">
              <h3 className="font-display text-[14px] font-bold text-neutral-900 mb-[16px] flex items-center gap-[8px]">
                <Clock size={14} className="text-blue-500" /> Timeline
              </h3>
              <div className="flex flex-col gap-[14px]">
                {timeline.map((item, i) => (
                  <div key={i} className="flex items-start gap-[10px]">
                    <div className="mt-[3px] w-[6px] h-[6px] rounded-full bg-blue-500 shrink-0" />
                    <div>
                      <p className="text-[12px] text-neutral-800 font-medium">{item.event}</p>
                      <p className="text-[11px] text-neutral-400 mt-[2px]">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 flex flex-col gap-[16px]">
            {/* Tabs */}
            <div className="bg-white rounded-[18px] border border-neutral-100 shadow-sm overflow-hidden">
              <div className="flex border-b border-neutral-100">
              {tabs.map(tab => {
                  const badge = tabBadges[tab.id] || 0
                  return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex-1 h-[52px] flex items-center justify-center gap-[7px] font-semibold text-[13px] transition-all relative ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/40'
                        : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
                    }`}
                  >
                    {tab.icon} {tab.label}
                    {badge > 0 && (
                      <span className="absolute top-[10px] right-[8px] w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm animate-pulse">
                        {badge}
                      </span>
                    )}
                  </button>
                  )
                })}
              </div>

              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="p-[28px] flex flex-col gap-[24px]">
                  {/* Quick Info Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-[14px]">
                    {candidate.email && (
                      <div className="p-[16px] bg-neutral-50 rounded-[14px] border border-neutral-100">
                        <div className="flex items-center gap-[8px] mb-[6px]">
                          <Mail size={13} className="text-blue-500" />
                          <span className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider">Email</span>
                        </div>
                        <p className="text-[13px] font-semibold text-neutral-800 truncate">{candidate.email}</p>
                      </div>
                    )}
                    {candidate.phone && (
                      <div className="p-[16px] bg-neutral-50 rounded-[14px] border border-neutral-100">
                        <div className="flex items-center gap-[8px] mb-[6px]">
                          <Phone size={13} className="text-blue-500" />
                          <span className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider">Phone</span>
                        </div>
                        <p className="text-[13px] font-semibold text-neutral-800">{candidate.phone}</p>
                      </div>
                    )}
                    {candidate.availableStartDate && (
                      <div className="p-[16px] bg-neutral-50 rounded-[14px] border border-neutral-100">
                        <div className="flex items-center gap-[8px] mb-[6px]">
                          <Calendar size={13} className="text-emerald-500" />
                          <span className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider">Available</span>
                        </div>
                        <p className="text-[13px] font-semibold text-neutral-800">{new Date(candidate.availableStartDate).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>

                  {/* Profile Links */}
                  {(candidate.linkedinUrl || candidate.githubUrl || candidate.portfolioUrl) && (
                    <div>
                      <h4 className="font-display text-[13px] font-bold text-neutral-700 mb-[12px] uppercase tracking-wider">Online Profiles</h4>
                      <div className="flex flex-wrap gap-[10px]">
                        {candidate.linkedinUrl && (
                          <a href={candidate.linkedinUrl} target="_blank" rel="noreferrer"
                            className="flex items-center gap-[8px] px-[14px] py-[9px] bg-[#0A66C2]/8 hover:bg-[#0A66C2]/15 text-[#0A66C2] border border-[#0A66C2]/20 rounded-[10px] text-[13px] font-semibold transition-all">
                            <Linkedin size={14} /> LinkedIn Profile <ExternalLink size={11} />
                          </a>
                        )}
                        {candidate.githubUrl && (
                          <a href={candidate.githubUrl} target="_blank" rel="noreferrer"
                            className="flex items-center gap-[8px] px-[14px] py-[9px] bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200 rounded-[10px] text-[13px] font-semibold transition-all">
                            <Github size={14} /> GitHub Profile <ExternalLink size={11} />
                          </a>
                        )}
                        {candidate.portfolioUrl && (
                          <a href={candidate.portfolioUrl} target="_blank" rel="noreferrer"
                            className="flex items-center gap-[8px] px-[14px] py-[9px] bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-100 rounded-[10px] text-[13px] font-semibold transition-all">
                            <Globe size={14} /> Portfolio Site <ExternalLink size={11} />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Resume Preview Card */}
                  {candidate.resumeUrl && (
                    <div>
                      <h4 className="font-display text-[13px] font-bold text-neutral-700 mb-[12px] uppercase tracking-wider">Resume</h4>
                      <div className="border border-neutral-200 rounded-[14px] overflow-hidden bg-neutral-50">
                        <div className="flex items-center justify-between px-[18px] py-[13px] border-b border-neutral-100 bg-white">
                          <div className="flex items-center gap-[10px]">
                            <div className="w-[32px] h-[32px] bg-red-50 border border-red-100 rounded-[8px] flex items-center justify-center">
                              <FileText size={15} className="text-red-500" />
                            </div>
                            <div>
                              <p className="text-[13px] font-semibold text-neutral-800">Uploaded Resume</p>
                              <p className="text-[11px] text-neutral-400">Click "View Full" to expand</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-[8px]">
                            <button
                              onClick={() => setActiveTab('resume')}
                              className="flex items-center gap-[6px] px-[14px] py-[7px] bg-blue-600 hover:bg-blue-700 text-white rounded-[8px] text-[12px] font-semibold transition-colors"
                            >
                              <FileText size={13} /> View Full Resume
                            </button>
                          </div>
                        </div>
                        <iframe
                          src={candidate.resumeUrl}
                          className="w-full h-[300px]"
                          title="Resume Preview"
                        />
                      </div>
                    </div>
                  )}

                  {/* Passport Photo */}
                  {candidate.passportPhotoUrl && (
                    <div>
                      <h4 className="font-display text-[13px] font-bold text-neutral-700 mb-[12px] uppercase tracking-wider">Passport Photo</h4>
                      <img
                        src={candidate.passportPhotoUrl}
                        alt="Passport Photo"
                        className="w-[100px] h-[120px] object-cover rounded-[12px] border border-neutral-200 shadow-sm"
                      />
                    </div>
                  )}

                  {/* Digital Signature */}
                  {candidate.signature && (
                    <div>
                      <h4 className="font-display text-[13px] font-bold text-neutral-700 mb-[12px] uppercase tracking-wider">Digital Signature</h4>
                      <div className="p-[20px] bg-neutral-50 border border-neutral-200 rounded-[14px]">
                        <div className="flex items-center gap-[8px] mb-[6px]">
                          <PenLine size={13} className="text-neutral-400" />
                          <span className="text-[11px] text-neutral-400">Digitally signed on {new Date(application.appliedAt).toLocaleDateString()}</span>
                        </div>
                        <p className="font-serif italic text-[26px] text-neutral-800">{candidate.signature}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <div className="p-[28px] flex flex-col gap-[24px]">
                  {/* Avatar */}
                  <div className="flex items-center gap-[20px]">
                    <div className="w-[80px] h-[80px] rounded-[18px] bg-neutral-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-md shrink-0">
                      {candidate.passportPhotoUrl ? (
                        <img src={candidate.passportPhotoUrl} alt="" className="w-full h-full object-cover" />
                      ) : candidate.avatar ? (
                        <img src={candidate.avatar} alt="" className="w-full h-full object-cover" />
                      ) : <User size={32} className="text-neutral-300" />}
                    </div>
                    <div>
                      <h2 className="font-display text-[20px] font-bold text-neutral-900">{candidate.name}</h2>
                      <p className="text-[14px] text-neutral-500">{job.title} Applicant</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
                    {/* Contact */}
                    <div className="p-[20px] bg-neutral-50 rounded-[16px] border border-neutral-100">
                      <h4 className="font-display text-[13px] font-bold text-neutral-700 mb-[14px] uppercase tracking-wider">Contact Details</h4>
                      <div className="flex flex-col gap-[12px]">
                        <div className="flex items-center gap-[10px]">
                          <Mail size={14} className="text-blue-400 shrink-0" />
                          <span className="text-[13px] text-neutral-700 break-all">{candidate.email}</span>
                        </div>
                        {candidate.phone && (
                          <div className="flex items-center gap-[10px]">
                            <Phone size={14} className="text-blue-400 shrink-0" />
                            <span className="text-[13px] text-neutral-700">{candidate.phone}</span>
                          </div>
                        )}
                        {candidate.availableStartDate && (
                          <div className="flex items-center gap-[10px]">
                            <Calendar size={14} className="text-emerald-400 shrink-0" />
                            <span className="text-[13px] text-neutral-700">
                              Available from {new Date(candidate.availableStartDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Links */}
                    {(candidate.linkedinUrl || candidate.githubUrl || candidate.portfolioUrl) && (
                      <div className="p-[20px] bg-neutral-50 rounded-[16px] border border-neutral-100">
                        <h4 className="font-display text-[13px] font-bold text-neutral-700 mb-[14px] uppercase tracking-wider">Online Profiles</h4>
                        <div className="flex flex-col gap-[12px]">
                          {candidate.linkedinUrl && (
                            <a href={candidate.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-[10px] text-[#0A66C2] hover:underline">
                              <Linkedin size={14} />
                              <span className="text-[13px] truncate">LinkedIn</span>
                              <ExternalLink size={11} className="ml-auto shrink-0" />
                            </a>
                          )}
                          {candidate.githubUrl && (
                            <a href={candidate.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-[10px] text-neutral-700 hover:underline">
                              <Github size={14} />
                              <span className="text-[13px] truncate">GitHub</span>
                              <ExternalLink size={11} className="ml-auto shrink-0" />
                            </a>
                          )}
                          {candidate.portfolioUrl && (
                            <a href={candidate.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-[10px] text-purple-600 hover:underline">
                              <Globe size={14} />
                              <span className="text-[13px] truncate">Portfolio</span>
                              <ExternalLink size={11} className="ml-auto shrink-0" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Documents */}
                  <div>
                    <h4 className="font-display text-[13px] font-bold text-neutral-700 mb-[14px] uppercase tracking-wider">Documents Submitted</h4>
                    <div className="flex flex-wrap gap-[10px]">
                      {candidate.resumeUrl && (
                        <button
                          onClick={() => setActiveTab('resume')}
                          className="flex items-center gap-[8px] px-[14px] py-[9px] bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 rounded-[10px] text-[13px] font-semibold transition-all"
                        >
                          <FileText size={14} /> Resume / CV
                        </button>
                      )}
                      {candidate.passportPhotoUrl && (
                        <span className="flex items-center gap-[8px] px-[14px] py-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-[10px] text-[13px] font-semibold">
                          <ImageIcon size={14} /> Passport Photo ✓
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Signature */}
                  {candidate.signature && (
                    <div>
                      <h4 className="font-display text-[13px] font-bold text-neutral-700 mb-[12px] uppercase tracking-wider">Digital Signature</h4>
                      <div className="p-[20px] bg-neutral-50 border border-dashed border-neutral-300 rounded-[14px]">
                        <p className="font-serif italic text-[26px] text-neutral-800">{candidate.signature}</p>
                        <p className="text-[11px] text-neutral-400 mt-[8px]">
                          Signed digitally on {new Date(application.appliedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* RESUME TAB */}
              {activeTab === 'resume' && candidate.resumeUrl && (
                <div className="flex flex-col" style={{ height: '78vh', minHeight: '560px' }}>
                  {/* Premium toolbar */}
                  <div className="shrink-0 bg-gradient-to-r from-neutral-900 to-neutral-800 px-[20px] py-[14px] flex items-center justify-between">
                    <div className="flex items-center gap-[14px]">
                      {/* Doc icon */}
                      <div className="relative">
                        <div className="w-[38px] h-[44px] bg-white rounded-[4px] flex flex-col items-center justify-end pb-[5px] gap-[3px] shadow-md">
                          <div className="w-[22px] h-[2px] bg-neutral-300 rounded-full" />
                          <div className="w-[22px] h-[2px] bg-neutral-300 rounded-full" />
                          <div className="w-[16px] h-[2px] bg-neutral-300 rounded-full self-start ml-[6px]" />
                        </div>
                        <div className="absolute -top-[1px] -right-[1px] w-[10px] h-[10px] bg-red-500 rounded-bl-[3px] rounded-tr-[4px]" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-[14px] leading-tight">{candidate.name}</p>
                        <p className="text-neutral-400 text-[11px] font-medium mt-[1px]">Resume · PDF Document</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-[8px]">
                      <button
                        onClick={() => setResumeFullscreen(true)}
                        className="flex items-center gap-[6px] px-[14px] py-[7px] bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-[8px] text-[12px] font-semibold transition-all backdrop-blur-sm"
                      >
                        <ExternalLink size={13} />
                        <span className="hidden sm:inline">Fullscreen</span>
                      </button>
                      <a
                        href={candidate.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-[6px] px-[14px] py-[7px] bg-blue-500 hover:bg-blue-400 text-white rounded-[8px] text-[12px] font-semibold transition-all shadow-sm"
                      >
                        <FileText size={13} />
                        <span className="hidden sm:inline">Download</span>
                      </a>
                    </div>
                  </div>

                  {/* Viewer area with subtle paper shadow effect */}
                  <div className="flex-1 overflow-hidden bg-neutral-200 relative">
                    {/* Subtle vignette overlay top */}
                    <div className="absolute top-0 left-0 right-0 h-[8px] bg-gradient-to-b from-black/10 to-transparent z-10 pointer-events-none" />
                    <iframe
                      src={candidate.resumeUrl}
                      className="w-full h-full border-0"
                      title="Resume Viewer"
                      allow="fullscreen"
                      style={{ display: 'block' }}
                    />
                    {/* Subtle vignette overlay bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-[8px] bg-gradient-to-t from-black/10 to-transparent z-10 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* OFFER TAB */}
              {activeTab === 'offer' && portalData.offer && (
                <div className="p-[28px] flex flex-col gap-[24px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-display text-[20px] font-bold text-neutral-900">Your Job Offer</h2>
                      <p className="text-[14px] text-neutral-500">Please review the details below</p>
                    </div>
                    <div>
                      {portalData.offer.status === 'sent' && (
                        <span className="px-[12px] py-[6px] bg-yellow-100 text-yellow-800 rounded-full text-[12px] font-bold tracking-wide uppercase">
                          Pending Your Review
                        </span>
                      )}
                      {portalData.offer.status === 'accepted' && (
                        <span className="px-[12px] py-[6px] bg-emerald-100 text-emerald-800 rounded-full text-[12px] font-bold tracking-wide uppercase flex items-center gap-[6px]">
                          <CheckCircle2 size={14} /> Accepted
                        </span>
                      )}
                      {portalData.offer.status === 'declined' && (
                        <span className="px-[12px] py-[6px] bg-red-100 text-red-800 rounded-full text-[12px] font-bold tracking-wide uppercase">
                          Declined
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                    <div className="p-[20px] bg-neutral-50 rounded-[16px] border border-neutral-200">
                      <p className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider mb-[4px]">Base Salary</p>
                      <p className="text-[24px] font-display font-bold text-neutral-900">
                        {portalData.offer.currency === 'USD' ? '$' : portalData.offer.currency}
                        {portalData.offer.salary.toLocaleString()}
                      </p>
                      <p className="text-[12px] text-neutral-500 mt-[2px]">Per year</p>
                    </div>
                    <div className="p-[20px] bg-neutral-50 rounded-[16px] border border-neutral-200">
                      <p className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider mb-[4px]">Proposed Start Date</p>
                      <p className="text-[20px] font-display font-bold text-neutral-900 mt-[4px]">
                        {new Date(portalData.offer.startDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-[8px]">
                    <h3 className="text-[14px] font-bold text-neutral-900 mb-[12px]">Offer Letter</h3>
                    <div className="p-[24px] bg-white border border-neutral-200 rounded-[16px] shadow-sm whitespace-pre-wrap font-serif leading-relaxed text-neutral-800">
                      {portalData.offer.letterContent}
                    </div>
                  </div>

                  {portalData.offer.status === 'sent' && (
                    <div className="mt-[16px] pt-[24px] border-t border-neutral-100 flex items-center gap-[12px] justify-end">
                      <button
                        onClick={() => handleUpdateOfferStatus('declined')}
                        className="px-[20px] py-[10px] text-neutral-600 font-semibold text-[14px] hover:bg-neutral-100 rounded-[12px] transition-colors"
                      >
                        Decline Offer
                      </button>
                      <button
                        onClick={() => handleUpdateOfferStatus('accepted')}
                        className="px-[24px] py-[10px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-[14px] rounded-[12px] shadow-[0_4px_14px_rgba(37,99,235,0.2)] transition-all flex items-center gap-[8px]"
                      >
                        <CheckCircle2 size={16} /> Accept Offer
                      </button>
                    </div>
                  )}
                  {portalData.offer.status === 'accepted' && (
                    <div className="mt-[16px] p-[16px] bg-emerald-50 border border-emerald-100 rounded-[16px] text-center">
                      <h4 className="text-[15px] font-bold text-emerald-900 mb-[4px]">Congratulations!</h4>
                      <p className="text-[13px] text-emerald-700">We're thrilled to have you join the team. Our HR team will be in touch shortly with next steps.</p>
                    </div>
                  )}
                </div>
              )}

              {/* HIRE LETTER TAB */}
              {activeTab === 'hireLetter' && portalData.hireLetter && (
                <div className="p-[28px] flex flex-col gap-[24px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-display text-[20px] font-bold text-neutral-900">Official Hire Letter</h2>
                      <p className="text-[14px] text-neutral-500">Review, sign, and join the team!</p>
                    </div>
                    <div>
                      {portalData.hireLetter.status === 'sent' && (
                        <span className="px-[12px] py-[6px] bg-indigo-100 text-indigo-800 rounded-full text-[12px] font-bold tracking-wide uppercase">Awaiting Signature</span>
                      )}
                      {portalData.hireLetter.status === 'signed' && (
                        <span className="px-[12px] py-[6px] bg-emerald-100 text-emerald-800 rounded-full text-[12px] font-bold tracking-wide uppercase flex items-center gap-[6px]">
                          <CheckCircle2 size={14} /> Signed & Joined!
                        </span>
                      )}
                      {portalData.hireLetter.status === 'rejected' && (
                        <span className="px-[12px] py-[6px] bg-red-100 text-red-800 rounded-full text-[12px] font-bold tracking-wide uppercase">Declined</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-[14px]">
                    <div className="p-[18px] bg-indigo-50 rounded-[14px] border border-indigo-100">
                      <p className="text-[11px] text-indigo-600 font-bold uppercase tracking-wider mb-[4px]">Position</p>
                      <p className="text-[16px] font-display font-bold text-neutral-900">{portalData.hireLetter.role}</p>
                    </div>
                    <div className="p-[18px] bg-neutral-50 rounded-[14px] border border-neutral-200">
                      <p className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider mb-[4px]">Salary</p>
                      <p className="text-[16px] font-display font-bold text-neutral-900">${portalData.hireLetter.salary?.toLocaleString()}/yr</p>
                    </div>
                    <div className="p-[18px] bg-neutral-50 rounded-[14px] border border-neutral-200">
                      <p className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider mb-[4px]">Start Date</p>
                      <p className="text-[15px] font-display font-bold text-neutral-900">
                        {new Date(portalData.hireLetter.startDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[14px] font-bold text-neutral-900 mb-[12px]">Hire Letter</h3>
                    <div className="p-[28px] bg-white border border-neutral-200 rounded-[16px] shadow-sm whitespace-pre-wrap font-serif leading-relaxed text-neutral-800 text-[14px]">
                      {portalData.hireLetter.letterContent}
                    </div>
                  </div>

                  {portalData.hireLetter.status === 'sent' && (
                    <div className="mt-[8px] pt-[24px] border-t border-neutral-100 flex flex-col gap-[16px]">
                      {hireSuccess === 'signed' ? (
                        <div className="p-[20px] bg-emerald-50 border border-emerald-200 rounded-[16px] text-center">
                          <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-[8px]" />
                          <h4 className="text-[16px] font-bold text-emerald-900">Welcome to the team!</h4>
                          <p className="text-[13px] text-emerald-700 mt-[4px]">You have officially accepted and signed the hire letter.</p>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col gap-[8px]">
                            <label className="text-[14px] font-semibold text-neutral-800">
                              Digital Signature <span className="text-red-500">*</span>
                            </label>
                            <p className="text-[12px] text-neutral-500">Type your full legal name to digitally sign this hire letter.</p>
                            <input
                              type="text"
                              value={hireSignature}
                              onChange={e => setHireSignature(e.target.value)}
                              placeholder={candidate.name}
                              className="h-[52px] px-[18px] rounded-[12px] border-2 border-neutral-200 focus:border-indigo-400 focus:outline-none text-[20px] font-serif italic text-neutral-800 transition-colors"
                            />
                          </div>
                          <div className="flex items-center gap-[12px] justify-end">
                            <button
                              onClick={() => handleHireLetterAction('reject')}
                              disabled={hireSubmitting}
                              className="px-[20px] py-[10px] text-neutral-600 font-semibold text-[14px] hover:bg-neutral-100 rounded-[12px] transition-colors disabled:opacity-50"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => handleHireLetterAction('sign')}
                              disabled={hireSubmitting || !hireSignature.trim()}
                              className="px-[28px] py-[10px] bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-[14px] rounded-[12px] shadow-lg transition-all flex items-center gap-[8px] disabled:opacity-60"
                            >
                              {hireSubmitting ? (
                                <div className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                <><CheckCircle2 size={16} /> Accept & Sign</>
                              )}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  {portalData.hireLetter.status === 'signed' && (
                    <div className="p-[16px] bg-emerald-50 border border-emerald-100 rounded-[16px] text-center">
                      <h4 className="text-[15px] font-bold text-emerald-900 mb-[4px]">You&apos;re officially on the team! 🎉</h4>
                      <p className="text-[13px] text-emerald-700">Signed on {portalData.hireLetter.signedAt ? new Date(portalData.hireLetter.signedAt).toLocaleDateString() : 'recently'}. Welcome aboard!</p>
                    </div>
                  )}
                </div>
              )}

              {/* ASSIGNMENT TAB */}
              {activeTab === 'assignment' && portalData.assignment && (
                <div className="p-[28px] flex flex-col gap-[24px]">
                  <div className="flex items-center justify-between flex-wrap gap-[12px]">
                    <div>
                      <h2 className="font-display text-[20px] font-bold text-neutral-900">{portalData.assignment.title}</h2>
                      <p className="text-[13px] text-neutral-500 mt-[2px]">Complete and submit before the deadline.</p>
                    </div>
                    <div className="flex items-center gap-[8px]">
                      {portalData.assignment.status === 'submitted' ? (
                        <span className="px-[12px] py-[6px] bg-emerald-100 text-emerald-800 rounded-full text-[12px] font-bold tracking-wide uppercase flex items-center gap-[6px]">
                          <CheckCircle2 size={14} /> Submitted
                        </span>
                      ) : (
                        <span className="px-[12px] py-[6px] bg-amber-100 text-amber-800 rounded-full text-[12px] font-bold tracking-wide uppercase">Pending</span>
                      )}
                      <span className="px-[12px] py-[6px] bg-red-50 text-red-700 rounded-full text-[12px] font-semibold">
                        Due: {new Date(portalData.assignment.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <div className="p-[20px] bg-neutral-50 rounded-[16px] border border-neutral-200 text-[14px] text-neutral-800 leading-relaxed whitespace-pre-wrap">
                    {portalData.assignment.description}
                  </div>

                  {portalData.assignment.referenceLink && (
                    <a
                      href={portalData.assignment.referenceLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-[8px] text-blue-600 text-[13px] font-semibold hover:underline"
                    >
                      <ExternalLink size={14} /> Reference Material
                    </a>
                  )}

                  {portalData.assignment.status === 'pending' && !assignmentSubmitted && (
                    <div className="flex flex-col gap-[14px] pt-[8px] border-t border-neutral-100">
                      <h3 className="text-[15px] font-bold text-neutral-900">Submit Your Work</h3>
                      <div className="flex flex-col gap-[8px]">
                        <label className="text-[13px] font-semibold text-neutral-700">Submission Link</label>
                        <input
                          type="url"
                          value={assignmentLink}
                          onChange={e => setAssignmentLink(e.target.value)}
                          placeholder="https://github.com/you/project or any link"
                          className="h-[42px] px-[14px] rounded-[10px] border border-neutral-200 focus:border-amber-400 focus:outline-none text-[14px] transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-[8px]">
                        <label className="text-[13px] font-semibold text-neutral-700">Additional Notes <span className="text-neutral-400 font-normal">(optional)</span></label>
                        <textarea
                          value={assignmentText}
                          onChange={e => setAssignmentText(e.target.value)}
                          placeholder="Any notes about your submission..."
                          rows={4}
                          className="px-[14px] py-[10px] rounded-[10px] border border-neutral-200 focus:border-amber-400 focus:outline-none text-[14px] resize-none transition-colors"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={handleSubmitAssignment}
                          disabled={assignmentSubmitting || (!assignmentLink.trim() && !assignmentText.trim())}
                          className="px-[24px] py-[10px] bg-amber-500 hover:bg-amber-600 text-white font-bold text-[14px] rounded-[12px] transition-all flex items-center gap-[8px] disabled:opacity-60"
                        >
                          {assignmentSubmitting ? (
                            <div className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <><Send size={16} /> Submit Assignment</>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                  {(portalData.assignment.status === 'submitted' || assignmentSubmitted) && (
                    <div className="p-[16px] bg-emerald-50 border border-emerald-100 rounded-[16px] text-center">
                      <CheckCircle2 size={28} className="text-emerald-500 mx-auto mb-[8px]" />
                      <h4 className="text-[15px] font-bold text-emerald-900 mb-[4px]">Assignment Submitted!</h4>
                      <p className="text-[13px] text-emerald-700">Your recruiter will review your submission. We&apos;ll be in touch soon.</p>
                    </div>
                  )}
                </div>
              )}

              {/* MESSAGES TAB */}
              {activeTab === 'messages' && (

                <div className="flex flex-col h-[500px] relative">
                  {!isConnected && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-neutral-800 text-white text-[11px] px-3 py-1 rounded-full opacity-70">
                      Connecting to chat...
                    </div>
                  )}
                  <div className="flex-1 overflow-y-auto p-[24px] flex flex-col gap-[14px]">
                    {realtimeMessages.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center h-full">
                        <div className="w-[52px] h-[52px] bg-neutral-50 rounded-full flex items-center justify-center mb-[12px] border border-neutral-100">
                          <MessageSquare className="text-neutral-300" size={24} />
                        </div>
                        <p className="font-body text-[14px] text-neutral-400 font-medium">No messages yet</p>
                        <p className="font-body text-[12px] text-neutral-300 mt-[4px]">Messages from your recruiter will appear here.</p>
                      </div>
                    ) : realtimeMessages.map((msg: any) => {
                      const isMine = msg.senderId === 'candidate';
                      return (
                        <div key={msg.id} className={`flex max-w-[80%] ${isMine ? 'self-end' : 'self-start'}`}>
                          <div className={`p-[14px] rounded-[16px] ${isMine ? 'bg-blue-600 text-white rounded-br-[4px]' : 'bg-neutral-100 text-neutral-900 rounded-bl-[4px]'}`}>
                            <p className="text-[14px] leading-relaxed">{msg.text}</p>
                            <p className={`text-[10px] mt-[6px] ${isMine ? 'text-blue-200' : 'text-neutral-400'}`}>{msg.time}</p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                  <form onSubmit={handleSendMessage} className="p-[16px] border-t border-neutral-100 shrink-0 bg-neutral-50/50 relative">
                    {candidate.isBlocked && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                        <p className="text-[13px] font-semibold text-neutral-600 bg-white px-[16px] py-[8px] rounded-full shadow-sm border border-neutral-200">
                          You have been blocked from sending messages.
                        </p>
                      </div>
                    )}
                    <div className="flex items-center gap-[10px]">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        disabled={candidate.isBlocked || !isConnected}
                        className="flex-1 h-[42px] px-[16px] rounded-full border border-neutral-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white text-[14px] disabled:opacity-50"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || !isConnected || candidate.isBlocked}
                        className="w-[42px] h-[42px] rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors disabled:opacity-40 shrink-0"
                      >
                        <Send size={16} className="ml-[1px]" />
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Resume Modal */}
      {resumeFullscreen && candidate.resumeUrl && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'rgba(0,0,0,0.92)' }}>
          <div className="shrink-0 bg-gradient-to-r from-neutral-900 to-neutral-800 px-[24px] py-[14px] flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-[16px]">
              <div className="relative shrink-0">
                <div className="w-[32px] h-[38px] bg-white rounded-[3px] flex flex-col items-center justify-end pb-[4px] gap-[2.5px] shadow">
                  <div className="w-[18px] h-[1.5px] bg-neutral-300 rounded-full" />
                  <div className="w-[18px] h-[1.5px] bg-neutral-300 rounded-full" />
                  <div className="w-[12px] h-[1.5px] bg-neutral-300 rounded-full self-start ml-[5px]" />
                </div>
                <div className="absolute -top-[1px] -right-[1px] w-[8px] h-[8px] bg-red-500 rounded-bl-[2px] rounded-tr-[3px]" />
              </div>
              <div>
                <p className="text-white font-bold text-[14px]">{candidate.name}</p>
                <p className="text-neutral-400 text-[11px] font-medium">Resume · Full View</p>
              </div>
            </div>
            <div className="flex items-center gap-[10px]">
              <a href={candidate.resumeUrl} target="_blank" rel="noreferrer"
                className="flex items-center gap-[6px] px-[14px] py-[7px] bg-blue-500 hover:bg-blue-400 text-white rounded-[8px] text-[12px] font-semibold transition-all">
                <FileText size={13} /> Download
              </a>
              <button onClick={() => setResumeFullscreen(false)}
                className="flex items-center gap-[6px] px-[14px] py-[7px] bg-white/10 hover:bg-red-500/80 text-white border border-white/20 rounded-[8px] text-[12px] font-semibold transition-all">
                <X size={14} /> Close
              </button>
            </div>
          </div>
          <div className="flex-1 relative bg-neutral-200">
            <div className="absolute top-0 left-0 right-0 h-[6px] bg-gradient-to-b from-black/20 to-transparent z-10 pointer-events-none" />
            <iframe src={candidate.resumeUrl} className="w-full h-full border-0" title="Resume Fullscreen" style={{ display: 'block' }} />
          </div>
        </div>
      )}
    </div>
  )
}
