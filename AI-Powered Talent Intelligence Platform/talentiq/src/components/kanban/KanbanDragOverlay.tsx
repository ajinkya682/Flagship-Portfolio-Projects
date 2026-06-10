"use client"

import * as React from "react"
import { DragOverlay, defaultDropAnimationSideEffects } from "@dnd-kit/core"
import { KanbanCard, type Candidate } from "./KanbanCard"

interface KanbanDragOverlayProps {
  activeCandidate: Candidate | null
}

export function KanbanDragOverlay({ activeCandidate }: KanbanDragOverlayProps) {
  if (!activeCandidate) return null

  // Custom animation when dropping
  const dropAnimationConfig = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  }

  return (
    <DragOverlay dropAnimation={dropAnimationConfig}>
      {activeCandidate ? (
        <div 
          className="scale-[1.02] shadow-[var(--shadow-xl)] rotate-[0.8deg] cursor-grabbing"
          style={{ width: "100%", height: "100%" }}
        >
          <KanbanCard candidate={activeCandidate} />
        </div>
      ) : null}
    </DragOverlay>
  )
}
