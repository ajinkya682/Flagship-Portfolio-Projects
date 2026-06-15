'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Sparkles, Mail, Phone, Linkedin, Globe, FileText, MessageSquare,
  CheckCircle2, XCircle, ChevronRight, Tag, Clock, Star, Plus, Send, AlertTriangle
} from 'lucide-react'
import { useDomainStore } from '@/store/domain.store'
import { v4 as uuidv4 } from 'uuid'

const REJECT_REASONS = [
  'Not a skills fit',
  'Overqualified',
  'Underqualified',
  'Salary expectations too high',
  'Position filled',
  'Withdrew from process',
  'Other',
]

const PIPELINE_STAGES = ['Applied', 'Screening', 'Interview', 'Assessment', 'Offer', 'Hired']

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-[10px]">
      <div className="flex-1 h-[7px] bg-neutral-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="font-body text-[12px] font-bold text-neutral-700 w-[30px] text-right">{value}</span>
    </div>
  )
}

export default function ApplicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const candidateId = params?.id as string

  const { candidates, jobs, moveCandidateStage, addCandidateNote } = useDomainStore()
  const candidate = candidates.find(c => c.id === candidateId)
  const job = jobs.find(j => j.id === candidate?.jobId)

  const [noteText, setNoteText] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState(REJECT_REASONS[0])
  const [rejectConfirmed, setRejectConfirmed] = useState(false)
  
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [moveConfirmed, setMoveConfirmed] = useState(false)

  const [showMoveBackModal, setShowMoveBackModal] = useState(false)
  const [moveBackConfirmed, setMoveBackConfirmed] = useState(false)

  if (!candidate || !job) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-bold">Candidate Not Found</h2>
        <Link href="/applications" className="text-blue-600 underline">Back to Candidates</Link>
      </div>
    )
  }

  const currentStageIdx = PIPELINE_STAGES.indexOf(candidate.stage)

  const scoreColor = candidate.aiScore >= 85 ? '#10B981' : candidate.aiScore >= 70 ? '#F59E0B' : '#EF4444'

  // Fallbacks for rich UI if fields are missing
  const location = candidate.location || 'San Francisco, CA'
  const yearsExp = candidate.yearsExp || 5
  const linkedinUrl = candidate.linkedinUrl || '#'
  const resumeUrl = candidate.resumeUrl || '#'
  const extractedSkills = candidate.extractedSkills || ['React', 'TypeScript', 'Node.js', 'System Design']
  const extractedCompanies = candidate.extractedCompanies || ['Google', 'Stripe']
  const extractedEducation = candidate.extractedEducation || ['B.S. Computer Science']
  const scoreBreakdown = candidate.scoreBreakdown || { skills: 90, experience: 85, education: 95, keywords: 88 }
  const strengths = candidate.strengths || ['Strong technical skills', 'Relevant experience']
  const gaps = candidate.gaps || ['Missing some keyword matches']
  const tags = candidate.tags || ['Top-tier']
  const assignedTo = candidate.assignedTo || 'Alex Manager'

  const handleAddNote = () => {
    if (!noteText.trim()) return
    addCandidateNote(candidate.id, {
      id: uuidv4(),
      author: 'You',
      avatar: 'https://randomuser.me/api/portraits/lego/1.jpg', // Placeholder for current user avatar
      text: noteText,
      createdAt: 'Just now'
    })
    setNoteText('')
  }

  const handleNextStage = () => {
    setShowMoveModal(true)
  }

  const handlePreviousStage = () => {
    setShowMoveBackModal(true)
  }

  const handleConfirmMove = () => {
    const nextStage = PIPELINE_STAGES[currentStageIdx + 1]
    if (nextStage) {
      moveCandidateStage(candidate.id, nextStage)
      setMoveConfirmed(true)
      setTimeout(() => {
        setShowMoveModal(false)
        setMoveConfirmed(false)
      }, 1500)
    }
  }

  const handleConfirmMoveBack = () => {
    const prevStage = PIPELINE_STAGES[currentStageIdx - 1]
    if (prevStage) {
      moveCandidateStage(candidate.id, prevStage)
      setMoveBackConfirmed(true)
      setTimeout(() => {
        setShowMoveBackModal(false)
        setMoveBackConfirmed(false)
      }, 1500)
    }
  }

  const handleReject = () => {
    setShowRejectModal(true)
  }

  const handleConfirmReject = () => {
    moveCandidateStage(candidate.id, 'Rejected')
    setRejectConfirmed(true)
    setTimeout(() => {
      setShowRejectModal(false)
      setRejectConfirmed(false)
      router.push('/applications')
    }, 1500)
  }

  return (
    <>
    <div className="flex flex-col h-full -mx-[16px] md:-mx-[32px] -mt-[16px] md:-mt-[32px] bg-neutral-50/50 min-h-screen">

      {/* Top bar */}
      <div className="px-[16px] md:px-[32px] py-[14px] border-b border-neutral-100 bg-white shrink-0 flex items-center gap-[12px] z-10 sticky top-0">
        <Link href="/applications" className="flex items-center gap-[6px] text-[13px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors group">
          <ArrowLeft size={15} className="group-hover:-translate-x-[2px] transition-transform" />
          Back to Candidates
        </Link>
        <span className="text-neutral-200">/</span>
        <span className="font-body text-[13px] font-semibold text-neutral-900">{candidate.name}</span>
        <div className="ml-auto flex items-center gap-[8px]">
          <button onClick={handleReject} className="h-[34px] px-[14px] bg-red-50 hover:bg-red-100 text-red-600 font-body text-[12px] font-semibold rounded-[8px] transition-colors flex items-center gap-[5px]">
            <XCircle size={13} /> Reject
          </button>
          {currentStageIdx > 0 && candidate.stage !== 'Rejected' && (
            <button onClick={handlePreviousStage} className="h-[34px] px-[14px] bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-600 font-body text-[12px] font-semibold rounded-[8px] transition-colors flex items-center gap-[5px]">
              <ArrowLeft size={13} /> Move back to {PIPELINE_STAGES[currentStageIdx - 1]}
            </button>
          )}
          {currentStageIdx < PIPELINE_STAGES.length - 1 && candidate.stage !== 'Rejected' && (
            <button onClick={handleNextStage} className="h-[34px] px-[14px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-body text-[12px] font-semibold rounded-[8px] shadow-sm flex items-center gap-[5px]">
              <CheckCircle2 size={13} /> Move to {PIPELINE_STAGES[currentStageIdx + 1]}
            </button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-[16px] md:p-[28px]">
        <div className="flex flex-col xl:flex-row gap-[20px] max-w-[1280px] mx-auto">

          {/* LEFT: Candidate Profile */}
          <div className="flex-1 flex flex-col gap-[16px] min-w-0">

            {/* Hero card */}
            <div className="bg-white rounded-[18px] border border-neutral-100 shadow-sm overflow-hidden">
              <div className="h-[80px] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
              <div className="px-[24px] pb-[24px]">
                <div className="flex items-end justify-between -mt-[36px] mb-[16px]">
                  <div className="relative">
                    <img
                      src={candidate.avatar}
                      alt={candidate.name}
                      className="w-[72px] h-[72px] rounded-[16px] border-4 border-white object-cover shadow-lg bg-white"
                    />
                    {/* Score ring on avatar */}
                    <div
                      className="absolute -bottom-[6px] -right-[6px] w-[28px] h-[28px] rounded-full border-[2.5px] border-white flex items-center justify-center text-white text-[9px] font-bold shadow-md"
                      style={{ backgroundColor: scoreColor }}
                    >
                      {candidate.aiScore}
                    </div>
                  </div>
                  <span
                    className="text-[12px] font-semibold px-[10px] py-[4px] rounded-full border"
                    style={{ backgroundColor: scoreColor + '15', borderColor: scoreColor + '40', color: scoreColor }}
                  >
                    {candidate.stage}
                  </span>
                </div>

                <h2 className="font-display text-[22px] font-bold text-neutral-900">{candidate.name}</h2>
                <p className="font-body text-[13px] text-neutral-500 mt-[2px]">{candidate.role} · {location}</p>
                <p className="font-body text-[12px] text-neutral-400 mt-[2px]">{yearsExp} years experience · Applied {candidate.appliedAt.slice(0, 10)}</p>

                {/* Contact links */}
                <div className="flex flex-wrap gap-[8px] mt-[14px]">
                  <a href={`mailto:${candidate.email}`} className="flex items-center gap-[5px] h-[30px] px-[10px] bg-neutral-50 border border-neutral-200 rounded-[7px] text-[11px] font-medium text-neutral-700 hover:border-neutral-300 transition-colors">
                    <Mail size={12} />{candidate.email}
                  </a>
                  <a href={`tel:${candidate.phone}`} className="flex items-center gap-[5px] h-[30px] px-[10px] bg-neutral-50 border border-neutral-200 rounded-[7px] text-[11px] font-medium text-neutral-700 hover:border-neutral-300 transition-colors">
                    <Phone size={12} />{candidate.phone}
                  </a>
                  <a href={linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-[5px] h-[30px] px-[10px] bg-blue-50 border border-blue-200 rounded-[7px] text-[11px] font-medium text-blue-700 hover:bg-blue-100 transition-colors">
                    <Linkedin size={12} />LinkedIn
                  </a>
                  <a href={resumeUrl} className="flex items-center gap-[5px] h-[30px] px-[10px] bg-neutral-50 border border-neutral-200 rounded-[7px] text-[11px] font-medium text-neutral-700 hover:border-neutral-300 transition-colors">
                    <FileText size={12} />Resume
                  </a>
                </div>
              </div>
            </div>

            {/* AI Score Breakdown */}
            <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm p-[20px]">
              <div className="flex items-center gap-[8px] mb-[16px]">
                <div className="w-[32px] h-[32px] rounded-[8px] bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                  <Sparkles size={14} className="text-white" />
                </div>
                <div>
                  <h3 className="font-display text-[14px] font-bold text-neutral-900">AI Match Score</h3>
                  <p className="font-body text-[11px] text-neutral-400">Powered by TalentIQ Intelligence</p>
                </div>
                <div className="ml-auto text-center">
                  <p className="font-display text-[32px] font-bold leading-none" style={{ color: scoreColor }}>{candidate.aiScore}</p>
                  <p className="font-body text-[10px] text-neutral-400">/ 100</p>
                </div>
              </div>

              <div className="flex flex-col gap-[10px] mb-[16px]">
                {[
                  { label: 'Skills Match', value: scoreBreakdown.skills, color: '#3B82F6' },
                  { label: 'Experience', value: scoreBreakdown.experience, color: '#8B5CF6' },
                  { label: 'Education', value: scoreBreakdown.education, color: '#10B981' },
                  { label: 'Keyword Density', value: scoreBreakdown.keywords, color: '#F59E0B' },
                ].map(row => (
                  <div key={row.label}>
                    <div className="flex justify-between mb-[4px]">
                      <span className="font-body text-[12px] text-neutral-600">{row.label}</span>
                    </div>
                    <ProgressBar value={row.value} color={row.color} />
                  </div>
                ))}
              </div>

              {/* Strengths + Gaps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
                <div className="bg-emerald-50 rounded-[10px] border border-emerald-100 p-[12px]">
                  <p className="font-body text-[11px] font-bold text-emerald-700 uppercase tracking-wide mb-[8px]">✓ Strengths</p>
                  <ul className="flex flex-col gap-[6px]">
                    {strengths.map((s, i) => (
                      <li key={i} className="font-body text-[11px] text-emerald-800 leading-snug">{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber-50 rounded-[10px] border border-amber-100 p-[12px]">
                  <p className="font-body text-[11px] font-bold text-amber-700 uppercase tracking-wide mb-[8px]">⚠ Gaps</p>
                  <ul className="flex flex-col gap-[6px]">
                    {gaps.map((g, i) => (
                      <li key={i} className="font-body text-[11px] text-amber-800 leading-snug">{g}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm p-[20px]">
              <h3 className="font-display text-[14px] font-bold text-neutral-900 mb-[12px]">Extracted Skills</h3>
              <div className="flex flex-wrap gap-[7px]">
                {extractedSkills.map(skill => (
                  <span key={skill} className="px-[10px] py-[4px] bg-blue-50 border border-blue-200/60 text-blue-700 rounded-full text-[12px] font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="mt-[14px] pt-[14px] border-t border-neutral-50">
                <p className="font-body text-[11px] font-semibold text-neutral-400 uppercase tracking-wide mb-[8px]">Previous Companies</p>
                <div className="flex flex-wrap gap-[6px]">
                  {extractedCompanies.map(c => (
                    <span key={c} className="px-[8px] py-[3px] bg-neutral-100 text-neutral-700 rounded-full text-[11px] font-semibold">{c}</span>
                  ))}
                </div>
              </div>
              <div className="mt-[10px]">
                <p className="font-body text-[11px] font-semibold text-neutral-400 uppercase tracking-wide mb-[6px]">Education</p>
                {extractedEducation.map(e => (
                  <p key={e} className="font-body text-[12px] text-neutral-700">{e}</p>
                ))}
              </div>
            </div>

            {/* Recruiter Notes */}
            <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm p-[20px]">
              <h3 className="font-display text-[14px] font-bold text-neutral-900 mb-[14px] flex items-center gap-[6px]">
                <MessageSquare size={15} className="text-neutral-400" /> Recruiter Notes
              </h3>
              <div className="flex flex-col gap-[12px] mb-[16px]">
                {candidate.notes.length === 0 ? (
                  <p className="text-[12px] text-neutral-500 italic">No notes yet.</p>
                ) : candidate.notes.map(note => (
                  <div key={note.id} className="flex items-start gap-[10px]">
                    <img src={note.avatar} alt={note.author} className="w-[30px] h-[30px] rounded-full object-cover shrink-0 bg-neutral-100" />
                    <div className="flex-1 bg-neutral-50 rounded-[10px] border border-neutral-100 p-[10px]">
                      <div className="flex items-center justify-between mb-[4px]">
                        <span className="font-body text-[12px] font-semibold text-neutral-900">{note.author}</span>
                        <span className="font-body text-[10px] text-neutral-400">{note.createdAt}</span>
                      </div>
                      <p className="font-body text-[12px] text-neutral-700 leading-relaxed whitespace-pre-wrap">{note.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add note */}
              <div className="flex items-start gap-[10px]">
                <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                  <span className="text-white text-[10px] font-bold">U</span>
                </div>
                <div className="flex-1">
                  <textarea
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    placeholder="Add a recruiter note..."
                    rows={2}
                    className="w-full text-[12px] font-body text-neutral-900 placeholder:text-neutral-400 bg-neutral-50 border border-neutral-200 rounded-[10px] p-[10px] resize-none focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                  />
                  {noteText && (
                    <button onClick={handleAddNote} className="mt-[6px] flex items-center gap-[4px] h-[30px] px-[12px] bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold rounded-[7px] transition-colors">
                      <Send size={11} /> Add Note
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Action Panel */}
          <div className="xl:w-[320px] flex flex-col gap-[16px] shrink-0">

            {/* Pipeline Stage */}
            <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm p-[20px]">
              <h3 className="font-display text-[14px] font-bold text-neutral-900 mb-[14px]">Pipeline Progress</h3>
              <div className="flex flex-col gap-[6px]">
                {PIPELINE_STAGES.map((stage, i) => {
                  const isDone = i < currentStageIdx
                  const isCurrent = i === currentStageIdx
                  return (
                    <div key={stage} className={`flex items-center gap-[10px] px-[10px] py-[8px] rounded-[8px] ${isCurrent ? 'bg-blue-50 border border-blue-200/60' : 'border border-transparent'}`}>
                      <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold ${isDone ? 'bg-emerald-500' : isCurrent ? 'bg-blue-600' : 'bg-neutral-100'}`}>
                        {isDone ? <CheckCircle2 size={12} className="text-white" /> : <span className={isCurrent ? 'text-white' : 'text-neutral-400'}>{i + 1}</span>}
                      </div>
                      <span className={`font-body text-[12px] font-semibold ${isCurrent ? 'text-blue-700' : isDone ? 'text-emerald-700' : 'text-neutral-400'}`}>
                        {stage}
                      </span>
                      {isCurrent && <span className="ml-auto text-[10px] font-semibold text-blue-500">{candidate.daysInStage}d</span>}
                    </div>
                  )
                })}
              </div>

              <div className="flex flex-col gap-[6px] mt-[14px] pt-[14px] border-t border-neutral-50">
                {currentStageIdx < PIPELINE_STAGES.length - 1 && (
                  <button onClick={handleNextStage} className="w-full h-[38px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-body text-[13px] font-semibold rounded-[10px] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-[6px]">
                    <CheckCircle2 size={14} /> Move to {PIPELINE_STAGES[currentStageIdx + 1]}
                  </button>
                )}
                <button onClick={handleReject} className="w-full h-[36px] border border-red-200 text-red-600 font-body text-[12px] font-semibold rounded-[10px] hover:bg-red-50 transition-colors flex items-center justify-center gap-[5px]">
                  <XCircle size={13} /> Reject Candidate
                </button>
              </div>
            </div>

            {/* Assignment */}
            <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm p-[20px]">
              <h3 className="font-display text-[14px] font-bold text-neutral-900 mb-[10px]">Assignment</h3>
              <div className="flex items-center gap-[8px] mb-[6px]">
                <img src="https://randomuser.me/api/portraits/men/22.jpg" alt="Alex" className="w-[28px] h-[28px] rounded-full object-cover" />
                <span className="font-body text-[12px] font-semibold text-neutral-700">{assignedTo}</span>
              </div>
              <button className="text-[11px] font-medium text-primary-600 hover:text-primary-700">Change assignee</button>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm p-[20px]">
              <h3 className="font-display text-[14px] font-bold text-neutral-900 mb-[10px] flex items-center gap-[5px]">
                <Tag size={13} className="text-neutral-400" /> Tags
              </h3>
              <div className="flex flex-wrap gap-[6px] mb-[8px]">
                {tags.map(tag => (
                  <span key={tag} className="font-body text-[11px] font-semibold px-[8px] py-[3px] bg-neutral-100 text-neutral-600 rounded-full border border-neutral-200">
                    {tag}
                  </span>
                ))}
                <button className="flex items-center gap-[3px] text-[11px] font-medium text-primary-600 hover:text-primary-700">
                  <Plus size={11} /> Add tag
                </button>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm p-[20px]">
              <h3 className="font-display text-[14px] font-bold text-neutral-900 mb-[12px]">Activity Timeline</h3>
              <div className="relative">
                <div className="absolute left-[11px] top-0 bottom-0 w-[1px] bg-neutral-100" />
                <div className="flex flex-col gap-[12px]">
                  {candidate.timeline.map((item, i) => (
                    <div key={i} className="flex items-start gap-[10px]">
                      <div className={`relative z-10 w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm text-white text-[9px] ${item.type === 'ai' ? 'bg-purple-500' : item.type === 'stage' ? 'bg-blue-500' : item.type === 'interview' ? 'bg-amber-500' : 'bg-neutral-300'}`}>
                        {item.type === 'ai' ? <Sparkles size={10} /> : <ChevronRight size={10} />}
                      </div>
                      <div className="pt-[2px] flex-1">
                        <p className="font-body text-[11px] text-neutral-700 leading-snug">{item.event}</p>
                        <p className="font-body text-[10px] text-neutral-400 mt-[1px]">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Reject Confirmation Modal */}
    {showRejectModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-[420px] overflow-hidden">
          {/* Modal Header */}
          <div className="bg-red-50 px-[24px] py-[20px] border-b border-red-100 flex items-center gap-[12px]">
            <div className="w-[40px] h-[40px] rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle size={18} className="text-red-600" />
            </div>
            <div>
              <h3 className="font-display text-[16px] font-bold text-neutral-900">Reject Candidate</h3>
              <p className="font-body text-[12px] text-neutral-500 mt-[2px]">This action will remove them from the pipeline</p>
            </div>
          </div>

          {!rejectConfirmed ? (
            <div className="p-[24px] flex flex-col gap-[16px]">
              <div className="bg-neutral-50 rounded-[12px] p-[14px] flex items-center gap-[12px]">
                <img src={candidate.avatar} alt={candidate.name} className="w-[40px] h-[40px] rounded-[10px] object-cover" />
                <div>
                  <p className="font-body text-[14px] font-semibold text-neutral-900">{candidate.name}</p>
                  <p className="font-body text-[12px] text-neutral-500">{candidate.role}</p>
                </div>
              </div>

              <div className="flex flex-col gap-[8px]">
                <label className="font-body text-[12px] font-semibold text-neutral-700">Reason for rejection</label>
                <select
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  className="h-[40px] px-[12px] bg-white border border-neutral-200 rounded-[8px] text-[13px] text-neutral-900 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all appearance-none"
                >
                  {REJECT_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <p className="font-body text-[12px] text-neutral-500 bg-amber-50 border border-amber-100 rounded-[8px] p-[10px]">
                ⚠️ The candidate will be notified via email that they are no longer being considered for this role.
              </p>

              <div className="flex items-center gap-[10px] mt-[4px]">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 h-[40px] border border-neutral-200 text-neutral-700 font-body text-[13px] font-semibold rounded-[10px] hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReject}
                  className="flex-1 h-[40px] bg-red-600 hover:bg-red-700 text-white font-body text-[13px] font-semibold rounded-[10px] shadow-sm transition-colors flex items-center justify-center gap-[5px]"
                >
                  <XCircle size={14} /> Confirm Rejection
                </button>
              </div>
            </div>
          ) : (
            <div className="p-[24px] flex flex-col items-center gap-[12px] text-center">
              <div className="w-[56px] h-[56px] rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 size={28} className="text-emerald-600" />
              </div>
              <p className="font-display text-[16px] font-bold text-neutral-900">Rejection recorded</p>
              <p className="font-body text-[13px] text-neutral-500">Returning to candidates list...</p>
            </div>
          )}
        </div>
      </div>
    )}

    {/* Move Confirmation Modal */}
    {showMoveModal && currentStageIdx < PIPELINE_STAGES.length - 1 && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-[420px] overflow-hidden">
          {/* Modal Header */}
          <div className="bg-blue-50 px-[24px] py-[20px] border-b border-blue-100 flex items-center gap-[12px]">
            <div className="w-[40px] h-[40px] rounded-full bg-blue-100 flex items-center justify-center">
              <CheckCircle2 size={18} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-display text-[16px] font-bold text-neutral-900">Move to {PIPELINE_STAGES[currentStageIdx + 1]}</h3>
              <p className="font-body text-[12px] text-neutral-500 mt-[2px]">They will be advanced to the next pipeline stage</p>
            </div>
          </div>

          {!moveConfirmed ? (
            <div className="p-[24px] flex flex-col gap-[16px]">
              <div className="bg-neutral-50 rounded-[12px] p-[14px] flex items-center gap-[12px]">
                <img src={candidate.avatar} alt={candidate.name} className="w-[40px] h-[40px] rounded-[10px] object-cover" />
                <div>
                  <p className="font-body text-[14px] font-semibold text-neutral-900">{candidate.name}</p>
                  <p className="font-body text-[12px] text-neutral-500">Currently in: <span className="font-semibold">{candidate.stage}</span></p>
                </div>
              </div>

              <p className="font-body text-[12px] text-neutral-500 bg-blue-50/50 border border-blue-100 rounded-[8px] p-[10px]">
                ℹ️ The candidate's timeline and stats will be updated. You can always move them back later if needed.
              </p>

              <div className="flex items-center gap-[10px] mt-[4px]">
                <button
                  onClick={() => setShowMoveModal(false)}
                  className="flex-1 h-[40px] border border-neutral-200 text-neutral-700 font-body text-[13px] font-semibold rounded-[10px] hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmMove}
                  className="flex-1 h-[40px] bg-blue-600 hover:bg-blue-700 text-white font-body text-[13px] font-semibold rounded-[10px] shadow-sm transition-colors flex items-center justify-center gap-[5px]"
                >
                  <CheckCircle2 size={14} /> Confirm Move
                </button>
              </div>
            </div>
          ) : (
            <div className="p-[24px] flex flex-col items-center gap-[12px] text-center">
              <div className="w-[56px] h-[56px] rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 size={28} className="text-emerald-600" />
              </div>
              <p className="font-display text-[16px] font-bold text-neutral-900">Successfully Moved</p>
              <p className="font-body text-[13px] text-neutral-500">Candidate advanced to {PIPELINE_STAGES[currentStageIdx + 1]}</p>
            </div>
          )}
        </div>
      </div>
    )}

    {/* Move Back Confirmation Modal */}
    {showMoveBackModal && currentStageIdx > 0 && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-[420px] overflow-hidden">
          {/* Modal Header */}
          <div className="bg-neutral-100 px-[24px] py-[20px] border-b border-neutral-200 flex items-center gap-[12px]">
            <div className="w-[40px] h-[40px] rounded-full bg-white flex items-center justify-center border border-neutral-200">
              <ArrowLeft size={18} className="text-neutral-600" />
            </div>
            <div>
              <h3 className="font-display text-[16px] font-bold text-neutral-900">Move back to {PIPELINE_STAGES[currentStageIdx - 1]}</h3>
              <p className="font-body text-[12px] text-neutral-500 mt-[2px]">They will be reverted to the previous stage</p>
            </div>
          </div>

          {!moveBackConfirmed ? (
            <div className="p-[24px] flex flex-col gap-[16px]">
              <div className="bg-neutral-50 rounded-[12px] p-[14px] flex items-center gap-[12px]">
                <img src={candidate.avatar} alt={candidate.name} className="w-[40px] h-[40px] rounded-[10px] object-cover" />
                <div>
                  <p className="font-body text-[14px] font-semibold text-neutral-900">{candidate.name}</p>
                  <p className="font-body text-[12px] text-neutral-500">Currently in: <span className="font-semibold">{candidate.stage}</span></p>
                </div>
              </div>

              <p className="font-body text-[12px] text-neutral-500 bg-amber-50 border border-amber-100 rounded-[8px] p-[10px]">
                ⚠️ Are you sure you want to move them back? This will update their pipeline status accordingly.
              </p>

              <div className="flex items-center gap-[10px] mt-[4px]">
                <button
                  onClick={() => setShowMoveBackModal(false)}
                  className="flex-1 h-[40px] border border-neutral-200 text-neutral-700 font-body text-[13px] font-semibold rounded-[10px] hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmMoveBack}
                  className="flex-1 h-[40px] bg-neutral-900 hover:bg-black text-white font-body text-[13px] font-semibold rounded-[10px] shadow-sm transition-colors flex items-center justify-center gap-[5px]"
                >
                  <ArrowLeft size={14} /> Confirm Move Back
                </button>
              </div>
            </div>
          ) : (
            <div className="p-[24px] flex flex-col items-center gap-[12px] text-center">
              <div className="w-[56px] h-[56px] rounded-full bg-neutral-100 flex items-center justify-center border border-neutral-200">
                <CheckCircle2 size={28} className="text-neutral-600" />
              </div>
              <p className="font-display text-[16px] font-bold text-neutral-900">Successfully Reverted</p>
              <p className="font-body text-[13px] text-neutral-500">Candidate moved back to {PIPELINE_STAGES[currentStageIdx - 1]}</p>
            </div>
          )}
        </div>
      </div>
    )}
  </>
  )
}
