'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Sparkles, Mail, Phone, Linkedin, Globe, FileText, MessageSquare,
  CheckCircle2, XCircle, ChevronRight, Tag, Clock, Star, Plus, Send, AlertTriangle,
  Code, GraduationCap, Search, ThumbsUp, ThumbsDown, Briefcase
} from 'lucide-react'
import { useDomainStore } from '@/store/domain.store'
import { useJobsStore } from '@/store/jobs.store'
import { useCandidatesStore } from '@/store/candidates.store'
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

  const { jobs } = useJobsStore()
  const { candidates, moveCandidateStage, addCandidateNote, updateCandidate } = useCandidatesStore()
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

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzeError, setAnalyzeError] = useState('')

  const handleAnalyzeResume = async () => {
    if (!candidate) return
    setIsAnalyzing(true)
    setAnalyzeError('')
    try {
      const targetId = candidate.applicationId || candidate.id; 
      const res = await fetch(`/api/applications/${targetId}/rescore`, {
        method: 'POST',
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to analyze resume')
      }
      const updatedData = await res.json()
      updateCandidate(candidate.id, updatedData)
    } catch (err: any) {
      setAnalyzeError(err.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Auto-analyze on load if score is 0
  useEffect(() => {
    if (candidate && candidate.aiScore === 0 && candidate.resumeUrl && !isAnalyzing && !analyzeError) {
      handleAnalyzeResume()
    }
  }, [candidate?.aiScore, candidate?.resumeUrl])

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

  // Use real data from DB — no fallback mock values
  const location = candidate.location || ''
  const yearsExp = candidate.yearsExp || null
  const linkedinUrl = candidate.linkedinUrl || '#'
  const resumeUrl = candidate.resumeUrl || '#'
  const extractedSkills = candidate.extractedSkills || []
  const extractedCompanies = candidate.extractedCompanies || []
  const extractedEducation = candidate.extractedEducation || []
  const scoreBreakdown = candidate.scoreBreakdown || { skills: 0, experience: 0, education: 0, keywords: 0 }
  const strengths = candidate.strengths || []
  const gaps = candidate.gaps || []
  const tags = candidate.tags || []
  const assignedTo = candidate.assignedTo || ''

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
                <div className="flex items-center justify-between mt-[2px]">
                  <p className="font-body text-[13px] text-neutral-500">{candidate.role}</p>
                  {candidate.aiScore > 0 && (
                    <div className="flex items-center gap-[4px] px-[8px] py-[4px] bg-emerald-50 rounded-[6px] border border-emerald-100">
                      <Sparkles size={11} className="text-emerald-500" />
                      <span className="font-body text-[10px] font-bold text-emerald-700 uppercase tracking-wide">AI-Powered Match</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-[12px] mt-[12px]">
                  {location && (
                    <div className="flex items-center gap-[4px] text-neutral-500">
                      <Briefcase size={12} />
                      <span className="font-body text-[11px] font-medium">{location}</span>
                    </div>
                  )}
                  {yearsExp !== null && (
                    <div className="flex items-center gap-[4px] text-neutral-500">
                      <Star size={12} />
                      <span className="font-body text-[11px] font-medium">{yearsExp} Years Experience</span>
                    </div>
                  )}
                  <div className="flex items-center gap-[4px] text-neutral-500">
                    <Clock size={12} />
                    <span className="font-body text-[11px] font-medium">Full-time</span>
                  </div>
                </div>

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
                  <Link
                    href={`/messages?candidateId=${candidate.id}`}
                    className="flex items-center gap-[5px] h-[30px] px-[10px] bg-emerald-50 border border-emerald-200 rounded-[7px] text-[11px] font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
                  >
                    <MessageSquare size={12} />Message
                  </Link>
                </div>
              </div>
            </div>

            {/* AI Score Breakdown & Skills (Redesigned) */}
            {candidate.aiScore === 0 ? (
              <div className="flex flex-col items-center justify-center py-[40px] text-center gap-[12px] bg-neutral-50/50 rounded-[24px] border border-neutral-100 mt-[0px]">
                <Sparkles size={32} className="text-neutral-300" />
                <p className="font-display text-[16px] font-bold text-neutral-700">Resume not yet analyzed</p>
                <p className="font-body text-[13px] text-neutral-500 max-w-[280px]">Run the AI analysis to extract skills, experience, and calculate a match score against the job description.</p>
                {analyzeError && <p className="font-body text-[12px] text-red-500">{analyzeError}</p>}
                <button 
                  onClick={handleAnalyzeResume} 
                  disabled={isAnalyzing}
                  className="mt-[8px] h-[36px] px-[16px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-body text-[13px] font-semibold rounded-[8px] shadow-sm transition-all flex items-center justify-center gap-[6px]"
                >
                  <Sparkles size={14} /> {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-[24px] shadow-sm border border-neutral-100 overflow-hidden">
                {/* Top Gradient Background Area */}
                <div className="relative pt-[40px] pb-[32px] px-[32px] bg-gradient-to-b from-[#f0f7ff] via-white to-white flex flex-col items-center text-center">
                  
                  {/* Decorative Sparkles */}
                  <Sparkles size={16} className="absolute top-[30px] left-[20%] text-blue-200" />
                  <Sparkles size={20} className="absolute top-[40px] right-[25%] text-purple-200" />
                  <Sparkles size={12} className="absolute top-[120px] left-[30%] text-emerald-200" />
                  <Sparkles size={14} className="absolute top-[100px] right-[20%] text-amber-200" />

                  {/* Score Circle */}
                  <div className="relative mb-[24px]">
                    <svg className="w-[140px] h-[140px] transform -rotate-90">
                      <circle cx="70" cy="70" r="60" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                      <circle cx="70" cy="70" r="60" stroke={scoreColor} strokeWidth="8" fill="none" 
                              strokeDasharray="377" strokeDashoffset={377 - (candidate.aiScore / 100) * 377} 
                              strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-display text-[42px] font-bold leading-none" style={{ color: scoreColor }}>
                        {candidate.aiScore}
                      </span>
                      <span className="font-body text-[11px] text-neutral-400 font-medium mt-[4px]">
                        out of 100
                      </span>
                    </div>
                  </div>

                  <h3 className="font-display text-[20px] font-bold" style={{ color: scoreColor }}>
                    {candidate.aiScore >= 85 ? 'Strong match for this role' : candidate.aiScore >= 70 ? 'Good match for this role' : 'Moderate match for this role'}
                  </h3>
                  <p className="font-body text-[13px] text-neutral-500 mt-[6px] max-w-[340px]">
                    {candidate.name.split(' ')[0]} demonstrates {candidate.aiScore >= 85 ? 'strong' : candidate.aiScore >= 70 ? 'good' : 'moderate'} alignment with the key requirements and responsibilities.
                  </p>

                  {/* Horizontal Progress Bars */}
                  <div className="w-full mt-[32px] bg-white rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-neutral-100 p-[24px]">
                    <div className="flex flex-col gap-[20px]">
                      {[
                        { label: 'Skills Match', value: scoreBreakdown.skills, color: '#10B981', icon: <Code size={14} className="text-blue-500" /> },
                        { label: 'Experience', value: scoreBreakdown.experience, color: '#10B981', icon: <Briefcase size={14} className="text-blue-500" /> },
                        { label: 'Education', value: scoreBreakdown.education, color: '#F59E0B', icon: <GraduationCap size={14} className="text-blue-500" /> },
                        { label: 'Keywords', value: scoreBreakdown.keywords, color: '#10B981', icon: <Search size={14} className="text-blue-500" /> },
                      ].map(row => (
                        <div key={row.label} className="flex flex-col gap-[8px]">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-[8px]">
                              {row.icon}
                              <span className="font-body text-[13px] text-neutral-700 font-medium">{row.label}</span>
                            </div>
                            <span className="font-body text-[13px] font-bold text-neutral-900">{row.value}%</span>
                          </div>
                          <div className="h-[6px] bg-neutral-100 rounded-full overflow-hidden w-full">
                            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${row.value}%`, backgroundColor: row.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Why this score */}
                <div className="bg-neutral-50/30 p-[32px] border-t border-neutral-100">
                  <h4 className="font-display text-[15px] font-bold text-neutral-900 mb-[16px] flex items-center gap-[6px]">
                    <Sparkles size={16} className="text-purple-500" /> Why this score
                  </h4>
                  <div className="flex flex-col gap-[14px]">
                    {candidate.reasons && candidate.reasons.length > 0 ? (
                      candidate.reasons.map((r, i) => (
                        <div key={i} className="flex items-start gap-[12px]">
                          {r.positive ? (
                            <div className="mt-[2px]"><ThumbsUp size={15} className="text-emerald-500" /></div>
                          ) : (
                            <div className="mt-[2px]"><ThumbsDown size={15} className="text-red-400" /></div>
                          )}
                          <span className={`font-body text-[13px] leading-relaxed ${r.positive ? 'text-neutral-700' : 'text-neutral-600'}`}>{r.text}</span>
                        </div>
                      ))
                    ) : (
                      // Fallback to old strengths/gaps if reasons array is empty
                      <>
                        {strengths.map((s, i) => (
                          <div key={'s'+i} className="flex items-start gap-[12px]">
                            <div className="mt-[2px]"><ThumbsUp size={15} className="text-emerald-500" /></div>
                            <span className="font-body text-[13px] leading-relaxed text-neutral-700">{s}</span>
                          </div>
                        ))}
                        {gaps.map((g, i) => (
                          <div key={'g'+i} className="flex items-start gap-[12px]">
                            <div className="mt-[2px]"><ThumbsDown size={15} className="text-red-400" /></div>
                            <span className="font-body text-[13px] leading-relaxed text-neutral-600">{g}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  {/* Top Skills */}
                  <h4 className="font-display text-[15px] font-bold text-neutral-900 mt-[32px] mb-[16px] flex items-center gap-[6px]">
                    <Star size={16} className="text-purple-500" /> Top Skills
                  </h4>
                  <div className="flex flex-wrap gap-[8px]">
                    {extractedSkills.length > 0 ? (
                      extractedSkills.map((skill, i) => {
                        const isTechnical = i % 2 === 0; // Alternating colors
                        return (
                          <span key={skill} className={`px-[12px] py-[6px] rounded-full font-body text-[12px] font-medium ${isTechnical ? 'bg-emerald-100/50 text-emerald-700' : 'bg-amber-100/50 text-amber-700'}`}>
                            {skill}
                          </span>
                        )
                      })
                    ) : (
                      <p className="text-[12px] text-neutral-400">No skills extracted.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

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
