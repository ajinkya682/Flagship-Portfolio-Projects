'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDomainStore } from '@/store/domain.store'
import { LogOut, Send, CheckCircle2, Clock, User, Briefcase, FileText, Video } from 'lucide-react'
import Link from 'next/link'

export default function CandidateDashboard() {
  const router = useRouter()
  const { candidates, messages, addMessage, settings, jobs, interviews } = useDomainStore()
  const [candidateId, setCandidateId] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    const id = localStorage.getItem('portal_candidate_id')
    if (!id) {
      router.push('/portal/login')
    } else {
      setCandidateId(id)
    }
  }, [router])

  if (!candidateId) return null

  const candidate = candidates.find(c => c.id === candidateId)
  if (!candidate) {
    localStorage.removeItem('portal_candidate_id')
    router.push('/portal/login')
    return null
  }

  const job = jobs.find(j => j.id === candidate.jobId)
  const candidateMessages = messages.filter(m => m.candidateId === candidate.id)
  const upcomingInterview = interviews.find(i => i.candidateId === candidate.id && i.status === 'scheduled')

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    addMessage({
      id: `m_${Date.now()}`,
      candidateId: candidate.id,
      senderId: candidate.id, // Candidate is sending
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
    setNewMessage('')
  }

  const handleLogout = () => {
    localStorage.removeItem('portal_candidate_id')
    router.push('/portal/login')
  }

  const STAGES = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired']
  const currentStageIndex = STAGES.indexOf(candidate.stage)

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-body">
      {/* Header */}
      <header className="bg-white border-b border-neutral-100 py-[16px] px-[24px] flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-[12px]">
          <div className="w-[32px] h-[32px] bg-blue-600 rounded-[8px] flex items-center justify-center text-white font-display font-bold text-[14px]">
            {settings.companyName.charAt(0)}
          </div>
          <div>
            <h2 className="font-display font-bold text-[16px] text-neutral-900 leading-tight">
              {settings.companyName} Portal
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-[16px]">
          <div className="flex items-center gap-[8px] mr-[16px]">
            <div className="w-[32px] h-[32px] bg-neutral-100 rounded-full flex items-center justify-center overflow-hidden">
              {candidate.avatar ? <img src={candidate.avatar} alt="" /> : <User size={16} className="text-neutral-500" />}
            </div>
            <span className="font-semibold text-[13px] text-neutral-700">{candidate.name}</span>
          </div>
          <button onClick={handleLogout} className="text-neutral-500 hover:text-neutral-900 flex items-center gap-[6px] text-[13px] font-semibold transition-colors">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-[1000px] w-full mx-auto p-[24px] grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
        {/* Left Col: Status & Details */}
        <div className="lg:col-span-1 flex flex-col gap-[24px]">
          {/* Status Card */}
          <div className="bg-white rounded-[20px] shadow-sm border border-neutral-100 p-[24px]">
            <h3 className="font-display text-[16px] font-bold text-neutral-900 mb-[4px]">Application Status</h3>
            <p className="font-body text-[13px] text-neutral-500 mb-[24px]">
              {job?.title || candidate.role}
            </p>

            <div className="flex flex-col gap-[16px] relative">
              <div className="absolute left-[11px] top-[10px] bottom-[10px] w-[2px] bg-neutral-100 z-0" />
              {STAGES.map((stage, i) => {
                const isCompleted = i < currentStageIndex
                const isCurrent = i === currentStageIndex
                return (
                  <div key={stage} className="flex items-center gap-[16px] relative z-10">
                    <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isCompleted ? 'bg-emerald-500 text-white' : 
                      isCurrent ? 'bg-blue-500 text-white ring-4 ring-blue-50' : 
                      'bg-white border-2 border-neutral-200 text-transparent'
                    }`}>
                      {isCompleted && <CheckCircle2 size={14} />}
                      {isCurrent && <div className="w-[8px] h-[8px] bg-white rounded-full" />}
                    </div>
                    <div className={isCurrent ? 'text-neutral-900 font-bold text-[14px]' : isCompleted ? 'text-neutral-700 font-medium text-[14px]' : 'text-neutral-400 font-medium text-[14px]'}>
                      {stage}
                    </div>
                  </div>
                )
              })}
            </div>

            {upcomingInterview && (
              <div className="mt-[24px] p-[16px] bg-blue-50 rounded-[12px] border border-blue-100">
                <div className="flex items-center gap-[8px] mb-[8px]">
                  <Video size={16} className="text-blue-600" />
                  <h4 className="font-display font-bold text-[14px] text-blue-900">Upcoming Interview</h4>
                </div>
                <p className="font-body text-[13px] text-blue-800 mb-[16px]">
                  {upcomingInterview.date} at {upcomingInterview.time} ({upcomingInterview.type})
                </p>
                <Link 
                  href={`/meet/${upcomingInterview.id}`}
                  className="w-full h-[40px] bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[13px] rounded-[8px] flex items-center justify-center transition-colors"
                >
                  Join Interview Now
                </Link>
              </div>
            )}
          </div>

          {/* Timeline Card */}
          <div className="bg-white rounded-[20px] shadow-sm border border-neutral-100 p-[24px]">
            <h3 className="font-display text-[16px] font-bold text-neutral-900 mb-[16px]">Timeline</h3>
            <div className="flex flex-col gap-[16px]">
              {candidate.timeline.map((item, i) => (
                <div key={i} className="flex items-start gap-[12px]">
                  <div className="mt-[2px] text-neutral-400">
                    <Clock size={14} />
                  </div>
                  <div>
                    <p className="font-body text-[13px] text-neutral-900 font-medium">{item.event}</p>
                    <p className="font-body text-[11px] text-neutral-500 mt-[2px]">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Messaging */}
        <div className="lg:col-span-2 bg-white rounded-[20px] shadow-sm border border-neutral-100 flex flex-col overflow-hidden h-[calc(100vh-100px)]">
          <div className="p-[20px] border-b border-neutral-100 shrink-0">
            <h3 className="font-display text-[16px] font-bold text-neutral-900">Messages</h3>
            <p className="font-body text-[13px] text-neutral-500">Communicate directly with the hiring team.</p>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-[24px] flex flex-col gap-[16px]">
            {candidateMessages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-[48px] h-[48px] bg-neutral-50 rounded-full flex items-center justify-center mb-[12px]">
                  <Briefcase className="text-neutral-400" size={24} />
                </div>
                <p className="font-body text-[14px] text-neutral-500">No messages yet. Send a message to start the conversation.</p>
              </div>
            ) : (
              candidateMessages.map(msg => {
                const isMine = msg.senderId === candidate.id
                return (
                  <div key={msg.id} className={`flex max-w-[80%] ${isMine ? 'self-end' : 'self-start'}`}>
                    <div className={`p-[14px] rounded-[16px] ${isMine ? 'bg-blue-600 text-white rounded-br-[4px]' : 'bg-neutral-100 text-neutral-900 rounded-bl-[4px]'}`}>
                      <p className="font-body text-[14px] leading-relaxed">{msg.text}</p>
                      <p className={`font-body text-[10px] mt-[6px] ${isMine ? 'text-blue-200' : 'text-neutral-500'}`}>{msg.time}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-[16px] border-t border-neutral-100 shrink-0 bg-neutral-50">
            <div className="flex items-center gap-[12px]">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 h-[44px] px-[16px] rounded-full border border-neutral-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white text-[14px]"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="w-[44px] h-[44px] rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <Send size={18} className="ml-[2px]" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
