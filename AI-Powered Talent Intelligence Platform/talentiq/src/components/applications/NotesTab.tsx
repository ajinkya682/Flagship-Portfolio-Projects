"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function NotesTab() {
  const [newNote, setNewNote] = React.useState("")
  const [notes, setNotes] = React.useState([
    {
      id: "note_1",
      author: "Alex Kumar",
      avatar: "https://i.pravatar.cc/150?u=a2",
      timestamp: "Oct 18, 2026 at 4:30 PM",
      content: "Reached out regarding compensation expectations. He's looking for $150k base, which is within our range. I'll pass him to the hiring manager round."
    },
    {
      id: "note_2",
      author: "Sarah Chen",
      avatar: "https://i.pravatar.cc/150?u=a1",
      timestamp: "Oct 15, 2026 at 11:15 AM",
      content: "Passed initial technical screen with flying colors. Very strong React fundamentals."
    }
  ])

  const handlePostNote = () => {
    if (!newNote.trim()) return

    const newEntry = {
      id: `note_${Date.now()}`,
      author: "Current User",
      avatar: "https://i.pravatar.cc/150?u=current", // Placeholder
      timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }),
      content: newNote
    }

    setNotes([newEntry, ...notes])
    setNewNote("")
  }

  return (
    <div className="flex flex-col animate-fade-slide-up">
      
      {/* New Note Composer */}
      <div className="mb-[32px] flex flex-col rounded-[var(--radius-lg)] border border-neutral-200 bg-neutral-50 p-[16px]">
        <Textarea 
          placeholder="Leave a note about this candidate..." 
          className="min-h-[96px] bg-white text-[14px]"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <div className="mt-[12px] flex items-center justify-end gap-[8px]">
          {newNote.length > 0 && (
            <Button variant="ghost" className="h-[32px] px-3 text-[13px]" onClick={() => setNewNote("")}>
              Cancel
            </Button>
          )}
          <Button 
            variant="primary" 
            className="h-[32px] px-4 text-[13px]"
            disabled={!newNote.trim()}
            onClick={handlePostNote}
          >
            Post Note
          </Button>
        </div>
      </div>

      {/* Note List */}
      <div className="flex flex-col gap-[16px]">
        {notes.map(note => (
          <div key={note.id} className="flex gap-[16px]">
            <img src={note.avatar} alt={note.author} className="h-[32px] w-[32px] shrink-0 rounded-full object-cover" />
            <div className="flex flex-col w-full">
              <div className="flex items-center gap-[8px] mb-[4px]">
                <span className="font-body text-[13px] font-semibold text-neutral-900">{note.author}</span>
                <span className="font-body text-[11px] text-neutral-400">{note.timestamp}</span>
              </div>
              <div className="rounded-[var(--radius-md)] border border-neutral-200 bg-white p-[12px] shadow-sm">
                <p className="font-body text-[14px] leading-relaxed text-neutral-700 whitespace-pre-wrap">
                  {note.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
