'use client'

import { useState } from 'react'
import {
  Search, Filter, Plus, MoreHorizontal, Sparkles,
  Clock, GitMerge, ChevronDown, CheckCircle2, ArrowLeft, XCircle
} from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core'

import { useDomainStore } from '@/store/domain.store'
import { useJobsStore } from '@/store/jobs.store'
import { useCandidatesStore } from '@/store/candidates.store'
import AddCandidateModal from '@/components/pipeline/AddCandidateModal'
import InterviewBookingModal from '@/components/pipeline/InterviewBookingModal'
import CreateOfferModal from '@/components/offers/CreateOfferModal'
import AssignmentModal from '@/components/pipeline/AssignmentModal'
import HireLetterModal from '@/components/pipeline/HireLetterModal'

const STAGE_CONFIG = [
  { id: 'Applied', name: 'Applied', color: '#94A3B8' },
  { id: 'Screening', name: 'Screening', color: '#3B82F6' },
  { id: 'Interview', name: 'Interview', color: '#8B5CF6' },
  { id: 'Assessment', name: 'Assessment', color: '#F59E0B' },
  { id: 'Offer', name: 'Offer', color: '#10B981' },
  { id: 'Hired', name: 'Hired', color: '#059669' },
]

function ScoreChip({ score }: { score: number }) {
  const cls = score >= 85 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : score >= 70 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-600 border-red-200'
  return (
    <div className={`flex items-center gap-[3px] px-[6px] py-[1px] rounded-full border text-[10px] font-bold ${cls}`}>
      <Sparkles size={8} />
      {score}
    </div>
  )
}

function CandidateCard({ candidate, isDragging = false, listeners, attributes, setNodeRef, transform, onMoveStage }: any) {
  const { jobs } = useJobsStore()
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.5 : 1,
  } : undefined

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes} 
      className={`bg-white rounded-[10px] border p-[14px] shadow-sm hover:shadow-md transition-all group cursor-grab active:cursor-grabbing ${isDragging ? 'border-primary-400 shadow-lg' : 'border-neutral-200 hover:-translate-y-[2px]'}`}
    >
      <div className="flex justify-between items-start mb-[12px]">
        <div className="flex items-center gap-[10px]">
          <img src={candidate.avatar} alt={candidate.name} className="w-[32px] h-[32px] rounded-[8px] object-cover bg-neutral-100 pointer-events-none" />
          <div>
            <Link 
              href={`/applications/${candidate.id}`}
              className="font-body text-[13px] font-semibold text-neutral-900 hover:text-primary-600 transition-colors leading-tight block"
              onPointerDown={(e) => e.stopPropagation()} // Prevent drag when clicking link
            >
              {candidate.name}
            </Link>
            <p className="font-body text-[11px] text-neutral-500 mt-[2px] truncate max-w-[140px]">{candidate.role}</p>
          </div>
        </div>
        <div onPointerDown={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-neutral-300 hover:text-neutral-600 transition-colors outline-none focus:ring-2 focus:ring-blue-100 rounded-sm">
                <MoreHorizontal size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] bg-white rounded-[12px] shadow-xl border border-neutral-100 p-[4px] font-body z-50">
              {STAGE_CONFIG.findIndex(s => s.id === candidate.stage) < STAGE_CONFIG.length - 1 && candidate.stage !== 'Rejected' && (
                <DropdownMenuItem 
                  onClick={() => onMoveStage(candidate, STAGE_CONFIG[STAGE_CONFIG.findIndex(s => s.id === candidate.stage) + 1].id)}
                  className="flex items-center gap-[8px] px-[8px] py-[6px] rounded-[6px] text-[13px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 cursor-pointer outline-none"
                >
                  <CheckCircle2 size={14} className="text-blue-500" /> Move Forward
                </DropdownMenuItem>
              )}
              {STAGE_CONFIG.findIndex(s => s.id === candidate.stage) > 0 && candidate.stage !== 'Rejected' && (
                <DropdownMenuItem 
                  onClick={() => onMoveStage(candidate, STAGE_CONFIG[STAGE_CONFIG.findIndex(s => s.id === candidate.stage) - 1].id)}
                  className="flex items-center gap-[8px] px-[8px] py-[6px] rounded-[6px] text-[13px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 cursor-pointer outline-none"
                >
                  <ArrowLeft size={14} className="text-neutral-400" /> Move Backward
                </DropdownMenuItem>
              )}
              {candidate.stage !== 'Rejected' && (
                <>
                  <DropdownMenuSeparator className="bg-neutral-100 h-[1px] my-[4px]" />
                  <DropdownMenuItem 
                    onClick={() => onMoveStage(candidate, 'Rejected')}
                    className="flex items-center gap-[8px] px-[8px] py-[6px] rounded-[6px] text-[13px] text-red-600 hover:bg-red-50 cursor-pointer outline-none"
                  >
                    <XCircle size={14} /> Reject
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center justify-between mt-[14px] pt-[12px] border-t border-neutral-50">
        <div className="flex items-center gap-[10px]">
          <ScoreChip score={candidate.aiScore} />
          <span className="font-body text-[10px] font-medium text-neutral-400 bg-neutral-50 px-[6px] py-[2px] rounded-[4px] border border-neutral-100">
            {candidate.source}
          </span>
        </div>
        <div className={`flex items-center gap-[4px] font-body text-[10px] font-medium ${candidate.daysInStage >= 5 && candidate.stage !== 'Hired' ? 'text-red-500' : 'text-neutral-400'}`}>
          <Clock size={11} /> {candidate.daysInStage}d
        </div>
      </div>
    </div>
  )
}

function DraggableCandidate({ candidate, onMoveStage }: { candidate: any, onMoveStage: (c: any, s: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: candidate.id,
    data: { candidate },
  })

  return (
    <CandidateCard 
      candidate={candidate} 
      isDragging={isDragging} 
      listeners={listeners} 
      attributes={attributes} 
      setNodeRef={setNodeRef} 
      transform={transform} 
      onMoveStage={onMoveStage}
    />
  )
}

function DroppableColumn({ stage, children, count }: { stage: any, children: React.ReactNode, count: number }) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.name,
  })

  return (
    <div className="flex flex-col min-w-[85vw] max-w-[320px] sm:min-w-[280px] sm:w-[280px] shrink-0 bg-neutral-100/50 rounded-[12px] border border-neutral-200/60 overflow-hidden shadow-sm transition-colors snap-center sm:snap-align-none">
      {/* Column Header */}
      <div className="px-[16px] py-[14px] bg-neutral-50 border-b border-neutral-200/60" style={{ borderTop: `4px solid ${stage.color}` }}>
        <div className="flex items-center justify-between mb-[4px]">
          <h3 className="font-display text-[14px] font-bold text-neutral-900">{stage.name}</h3>
          <span className="bg-white border border-neutral-200 text-neutral-600 text-[11px] font-bold px-[8px] py-[2px] rounded-full shadow-sm">
            {count}
          </span>
        </div>
      </div>

      {/* Column Content */}
      <div 
        ref={setNodeRef} 
        className={`flex-1 overflow-y-auto p-[10px] flex flex-col gap-[10px] transition-colors ${isOver ? 'bg-blue-50/30 ring-2 ring-blue-400 ring-inset rounded-b-[12px]' : ''}`}
      >
        {children}
        {count === 0 && (
          <div className="h-[80px] flex items-center justify-center border-2 border-dashed border-neutral-200 rounded-[10px] text-[12px] font-medium text-neutral-400">
            Drop here
          </div>
        )}
      </div>
    </div>
  )
}

export default function PipelinePage() {
  const { jobs } = useJobsStore()
  const { candidates, moveCandidateStage } = useCandidatesStore()
  const [search, setSearch] = useState('')
  const [jobFilter, setJobFilter] = useState('All Jobs')
  const [activeCandidate, setActiveCandidate] = useState<any>(null)
  const [bookingCandidate, setBookingCandidate] = useState<any>(null)
  const [offerCandidate, setOfferCandidate] = useState<any>(null)
  const [assignmentCandidate, setAssignmentCandidate] = useState<any>(null)
  const [hireCandidate, setHireCandidate] = useState<any>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  
  const JOBS = ['All Jobs', ...Array.from(new Set(jobs.map(j => j.title)))]

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Requires a 5px drag to trigger, allowing normal clicks to pass through
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveCandidate(active.data.current?.candidate)
  }

  const handleStageChange = (candidate: any, newStage: string) => {
    if (newStage === 'Interview') {
      setBookingCandidate(candidate)
    } else if (newStage === 'Offer') {
      setOfferCandidate(candidate)
    } else if (newStage === 'Assessment') {
      setAssignmentCandidate(candidate)
    } else if (newStage === 'Hired') {
      setHireCandidate(candidate)
    } else {
      moveCandidateStage(candidate.id, newStage)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveCandidate(null)

    if (over && over.id) {
      const candidateId = active.id as string
      const newStage = over.id as string
      
      const candidate = candidates.find(c => c.id === candidateId)
      if (candidate && candidate.stage !== newStage) {
        handleStageChange(candidate, newStage)
      }
    }
  }

  return (
    <div className="flex flex-col h-full -mx-[16px] md:-mx-[32px] -mt-[16px] md:-mt-[32px] bg-neutral-50/50 min-h-[calc(100vh-60px)]">

      {/* Header & Filters Bar */}
      <div className="px-[16px] md:px-[32px] py-[20px] bg-white border-b border-neutral-100 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-[16px] mb-[16px]">
          <div>
            <div className="flex items-center gap-[10px] mb-[4px]">
              <div className="w-[32px] h-[32px] rounded-[8px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                <GitMerge size={16} className="text-white" />
              </div>
              <h1 className="font-display text-[26px] font-bold text-neutral-900 tracking-tight">Pipeline Board</h1>
            </div>
            <p className="font-body text-[13px] text-neutral-500">Visual overview of candidates across all stages.</p>
          </div>
          <div className="flex items-center gap-[12px]">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="h-[38px] px-[14px] bg-white border border-neutral-200 text-neutral-700 font-body text-[13px] font-semibold rounded-[8px] hover:bg-neutral-50 transition-colors shadow-sm flex items-center gap-[6px]"
            >
              <Plus size={14} /> Add Candidate
            </button>
          </div>
        </div>

        {/* Filter Strip */}
        <div className="flex flex-wrap items-center gap-[12px]">
          <div className="relative">
            <Search size={14} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search candidates..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-[240px] h-[36px] pl-[34px] pr-[12px] bg-neutral-50 border border-neutral-200 rounded-[8px] text-[13px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-primary-400 focus:bg-white transition-all"
            />
          </div>

          <div className="h-[20px] w-[1px] bg-neutral-200 hidden md:block mx-[4px]" />

          <div className="flex items-center gap-[6px]">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider hidden md:block">Job</span>
            <div className="relative">
              <select
                value={jobFilter}
                onChange={e => setJobFilter(e.target.value)}
                className="appearance-none h-[36px] pl-[12px] pr-[32px] bg-white border border-neutral-200 text-neutral-700 text-[13px] font-semibold rounded-[8px] focus:outline-none focus:border-primary-400 transition-all cursor-pointer"
              >
                {JOBS.map(j => <option key={j} value={j}>{j}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-[12px] top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          <button className="h-[36px] px-[12px] bg-white border border-neutral-200 text-neutral-600 font-body text-[13px] font-medium rounded-[8px] hover:bg-neutral-50 transition-colors flex items-center gap-[6px] ml-auto">
            <Filter size={14} /> More Filters
          </button>
        </div>
      </div>

      {/* Kanban Board Area */}
      <div className="flex-1 overflow-x-auto p-[16px] md:p-[24px] snap-x snap-mandatory sm:snap-none scroll-smooth">
        {candidates.length === 0 ? (
          <div className="w-full h-full min-h-[400px] flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-[40px] flex flex-col items-center justify-center text-center max-w-[400px]">
              <div className="w-[48px] h-[48px] bg-primary-50 rounded-full flex items-center justify-center mb-[16px]">
                <GitMerge size={24} className="text-primary-600" />
              </div>
              <h3 className="font-display text-[16px] font-bold text-neutral-900 mb-[8px]">Your pipeline is empty</h3>
              <p className="font-body text-[13px] text-neutral-500 mb-[20px]">
                You don't have any candidates yet. Add your first candidate to start tracking them through your hiring stages.
              </p>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-[6px] bg-primary-500 hover:bg-primary-600 text-white font-body text-[13px] font-medium px-[16px] py-[8px] rounded-md transition-colors shadow-sm"
              >
                <Plus size={16} /> Add Candidate
              </button>
            </div>
          </div>
        ) : (
          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCorners} 
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-[16px] h-full min-h-[500px]">
              {STAGE_CONFIG.map(stage => {
                const stageCandidates = candidates.filter(c => c.stage === stage.name)
                const visibleCandidates = stageCandidates.filter(c => {
                  const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase())
                  const matchJob = jobFilter === 'All Jobs' || c.role === jobFilter
                  return matchSearch && matchJob
                })

                return (
                  <DroppableColumn key={stage.id} stage={stage} count={visibleCandidates.length}>
                    {visibleCandidates.map(c => (
                      <DraggableCandidate key={c.id} candidate={c} onMoveStage={handleStageChange} />
                    ))}
                  </DroppableColumn>
                )
              })}
            </div>

            <DragOverlay>
              {activeCandidate ? (
                <CandidateCard candidate={activeCandidate} isDragging={true} />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      <AddCandidateModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      
      <InterviewBookingModal 
        isOpen={!!bookingCandidate}
        candidate={bookingCandidate}
        onClose={() => setBookingCandidate(null)}
        onConfirm={() => {
          if (bookingCandidate) {
            moveCandidateStage(bookingCandidate.id, 'Interview')
            setBookingCandidate(null)
          }
        }}
      />
      
      <CreateOfferModal
        isOpen={!!offerCandidate}
        onClose={() => setOfferCandidate(null)}
        initialCandidateId={offerCandidate?.id}
        onSuccess={(candidateId) => {
          moveCandidateStage(candidateId, 'Offer')
          setOfferCandidate(null)
        }}
      />

      <AssignmentModal
        isOpen={!!assignmentCandidate}
        onClose={() => setAssignmentCandidate(null)}
        initialCandidateId={assignmentCandidate?.id}
        candidateName={assignmentCandidate?.name}
        onSuccess={(candidateId) => {
          moveCandidateStage(candidateId, 'Assessment')
          setAssignmentCandidate(null)
        }}
      />

      <HireLetterModal
        isOpen={!!hireCandidate}
        onClose={() => setHireCandidate(null)}
        initialCandidateId={hireCandidate?.id}
        candidateName={hireCandidate?.name}
        roleName={hireCandidate?.currentJobTitle}
        onSuccess={(candidateId) => {
          moveCandidateStage(candidateId, 'Hired')
          setHireCandidate(null)
        }}
      />
    </div>
  )
}
