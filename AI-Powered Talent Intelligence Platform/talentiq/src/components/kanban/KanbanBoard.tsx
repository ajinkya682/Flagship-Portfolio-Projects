"use client"

import * as React from "react"
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor,
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { ChevronDown, ChevronRight } from "lucide-react"
import confetti from "canvas-confetti"
import { KanbanColumn, type Stage } from "./KanbanColumn"
import { KanbanCard, type Candidate } from "./KanbanCard"
import { KanbanDragOverlay } from "./KanbanDragOverlay"
import { ApplicationSidePanel } from "./ApplicationSidePanel"

const initialStages: Stage[] = [
  { id: "screening", name: "Screening", color: "primary" },
  { id: "phone", name: "Phone Screen", color: "info" },
  { id: "interview", name: "Interview", color: "warning" },
  { id: "assessment", name: "Assessment", color: "purple" },
  { id: "offer", name: "Offer", color: "accent" },
  { id: "hired", name: "Hired", color: "hired" },
]

const initialCandidates: Record<string, Candidate[]> = {
  "screening": [
    { id: "c1", name: "David Kim", role: "Product Designer", score: 88, source: "Website", daysInStage: "2d", avatar: "https://i.pravatar.cc/150?u=1", recruiterAvatar: "https://i.pravatar.cc/150?u=a4" },
    { id: "c2", name: "Emily Johnson", role: "Senior Engineer", score: 72, source: "Website", daysInStage: "5d", avatar: "https://i.pravatar.cc/150?u=2", recruiterAvatar: "https://i.pravatar.cc/150?u=a4" },
  ],
  "phone": [
    { id: "c3", name: "Michael Chang", role: "Frontend Dev", score: 64, source: "Indeed", daysInStage: "1d", avatar: "https://i.pravatar.cc/150?u=3", recruiterAvatar: "https://i.pravatar.cc/150?u=a4" },
  ],
  "interview": [
    { id: "c4", name: "Maria Torres", role: "Senior Engineer", score: 92, source: "LinkedIn", daysInStage: "4h", avatar: "https://i.pravatar.cc/150?u=4", recruiterAvatar: "https://i.pravatar.cc/150?u=a4" },
    { id: "c5", name: "Anita Patel", role: "Product Manager", score: 95, source: "Website", daysInStage: "2d", avatar: "https://i.pravatar.cc/150?u=5", recruiterAvatar: "https://i.pravatar.cc/150?u=a4" },
  ],
  "assessment": [
    { id: "c6", name: "Robert Chen", role: "Data Scientist", score: 89, source: "Referral", daysInStage: "1d", avatar: "https://i.pravatar.cc/150?u=6", recruiterAvatar: "https://i.pravatar.cc/150?u=a4" },
  ],
  "offer": [
    { id: "c7", name: "James Wilson", role: "Senior Engineer", score: 76, source: "LinkedIn", daysInStage: "2d", avatar: "https://i.pravatar.cc/150?u=7", recruiterAvatar: "https://i.pravatar.cc/150?u=a4" },
  ],
  "hired": []
}

export function KanbanBoard() {
  const [columns, setColumns] = React.useState<Record<string, Candidate[]>>(initialCandidates)
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [activeCandidate, setActiveCandidate] = React.useState<Candidate | null>(null)
  
  // Side Panel State
  const [selectedCandidate, setSelectedCandidate] = React.useState<Candidate | null>(null)
  const [isPanelOpen, setIsPanelOpen] = React.useState(false)
  const [expandedMobileStage, setExpandedMobileStage] = React.useState<string | null>("screening")

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Requires 5px movement before drag starts (allows clicks)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleCardClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setIsPanelOpen(true)
  }

  // Find which column a candidate belongs to
  const findContainer = (id: string) => {
    if (columns[id]) return id // If the id is a column id
    return Object.keys(columns).find((key) => 
      columns[key].find((c) => c.id === id)
    )
  }

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)
    
    // Find the candidate object to pass to overlay
    const container = findContainer(active.id as string)
    if (container) {
      const candidate = columns[container].find(c => c.id === active.id)
      if (candidate) setActiveCandidate(candidate)
    }
  }

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeContainer = findContainer(activeId)
    const overContainer = findContainer(overId)

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return
    }

    // Moving between columns
    setColumns((prev) => {
      const activeItems = [...prev[activeContainer]]
      const overItems = [...prev[overContainer]]

      const activeIndex = activeItems.findIndex(c => c.id === activeId)
      const overIndex = overId in prev 
        ? overItems.length + 1 // dropping over a column area
        : overItems.findIndex(c => c.id === overId) // dropping over a specific card

      let newIndex
      if (overId in prev) {
        newIndex = overItems.length + 1
      } else {
        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height

        const modifier = isBelowOverItem ? 1 : 0
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1
      }

      return {
        ...prev,
        [activeContainer]: activeItems.filter(c => c.id !== activeId),
        [overContainer]: [
          ...overItems.slice(0, newIndex),
          activeItems[activeIndex],
          ...overItems.slice(newIndex, overItems.length)
        ]
      }
    })
  }

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) {
      setActiveId(null)
      setActiveCandidate(null)
      return
    }

    const activeId = active.id as string
    const overId = over.id as string

    const activeContainer = findContainer(activeId)
    const overContainer = findContainer(overId)

    if (activeContainer && overContainer && activeContainer === overContainer) {
      // Reordering within the same column
      const items = [...columns[activeContainer]]
      const activeIndex = items.findIndex(c => c.id === activeId)
      const overIndex = items.findIndex(c => c.id === overId)

      if (activeIndex !== overIndex) {
        setColumns(prev => {
          const newItems = [...items]
          const [removed] = newItems.splice(activeIndex, 1)
          newItems.splice(overIndex, 0, removed)
          return {
            ...prev,
            [activeContainer]: newItems
          }
        })
      }
    }

    // Fire Confetti if moved to Hired!
    if (activeContainer !== "hired" && overContainer === "hired") {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#10B981', '#3B82F6', '#6EE7B7']
      })
    }

    setActiveId(null)
    setActiveCandidate(null)
  }

  return (
    <>
      {/* Desktop View (Drag and Drop) */}
      <div className="hidden md:flex h-full gap-[16px] overflow-x-auto p-[20px] custom-scrollbar bg-neutral-100">
        <div id="dnd-instructions" className="sr-only">
          Press Space to grab a candidate card. Use arrow keys to move. Press Enter to drop, or Escape to cancel.
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          accessibility={{
            announcements: {
              onDragStart(id) {
                return `Picked up candidate. Use arrow keys to move.`
              },
              onDragOver({ over }) {
                if (over) {
                  return `Moved over ${over.id}.`
                }
                return `Moved outside.`
              },
              onDragEnd({ over }) {
                if (over) {
                  return `Candidate dropped successfully into ${over.id}.`
                }
                return `Candidate drop cancelled.`
              },
              onDragCancel() {
                return `Dragging cancelled.`
              }
            }
          }}
        >
          {initialStages.map((stage) => (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              candidates={columns[stage.id] || []}
              onCardClick={handleCardClick}
              selectedCardId={selectedCandidate?.id}
            />
          ))}

          <KanbanDragOverlay activeCandidate={activeCandidate} />
        </DndContext>
      </div>

      {/* Mobile View (Accordion) */}
      <div className="flex md:hidden flex-col h-full gap-[12px] overflow-y-auto p-[16px] bg-neutral-100 pb-[100px]">
        {initialStages.map((stage) => {
          const isExpanded = expandedMobileStage === stage.id
          const stageCandidates = columns[stage.id] || []
          
          const stageColors = {
            primary: "bg-primary-500",
            info: "bg-[#3B82F6]",
            warning: "bg-[#F59E0B]",
            purple: "bg-[#8B5CF6]",
            accent: "bg-accent-500",
            hired: "bg-accent-600",
          }
          const colorClass = stageColors[stage.color] || stageColors.primary

          return (
            <div key={stage.id} className="flex flex-col rounded-[var(--radius-md)] border border-neutral-200 bg-white overflow-hidden shadow-sm">
              <button 
                onClick={() => setExpandedMobileStage(isExpanded ? null : stage.id)}
                className="flex items-center justify-between p-[16px] bg-white text-left hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center gap-[12px]">
                  <div className={`h-[16px] w-[3px] rounded-full ${colorClass}`} />
                  <span className="font-display font-semibold text-neutral-900 text-[15px]">{stage.name}</span>
                  <span className="flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-neutral-100 px-[6px] text-[11px] font-bold text-neutral-600">
                    {stageCandidates.length}
                  </span>
                </div>
                {isExpanded ? <ChevronDown size={18} className="text-neutral-500" /> : <ChevronRight size={18} className="text-neutral-500" />}
              </button>
              
              {isExpanded && (
                <div className="flex flex-col gap-[12px] p-[16px] pt-0 bg-neutral-50/50 border-t border-neutral-100">
                  <div className="mt-[16px] flex flex-col gap-[12px]">
                    {stageCandidates.map(candidate => (
                      <KanbanCard 
                        key={candidate.id} 
                        candidate={candidate} 
                        onClick={handleCardClick}
                        isSelected={selectedCandidate?.id === candidate.id}
                      />
                    ))}
                    {stageCandidates.length === 0 && (
                      <div className="py-[20px] text-center text-neutral-400 text-[13px]">
                        No candidates in this stage.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <ApplicationSidePanel 
        candidate={selectedCandidate} 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)} 
      />
    </>
  )
}
