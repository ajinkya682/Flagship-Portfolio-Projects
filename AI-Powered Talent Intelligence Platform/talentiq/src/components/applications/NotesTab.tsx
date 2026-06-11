'use client'

import { useState } from 'react'
import { Application } from '@/types/domain.types'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { formatDate } from '@/lib/utils'

interface NotesTabProps {
  application: Application
}

export default function NotesTab({ application }: NotesTabProps) {
  const { user } = useCurrentUser()
  const [newNote, setNewNote] = useState('')
  const [notes, setNotes] = useState(application.recruiterNotes || [])

  const handlePostNote = () => {
    if (!newNote.trim()) return
    setNotes([newNote, ...notes])
    setNewNote('')
    // In a real app, make API call here
  }

  return (
    <div className="p-[24px] max-w-[800px] flex flex-col gap-[32px]">
      
      {/* Input Area */}
      <div className="flex flex-col gap-[12px]">
        <textarea 
          placeholder="Leave a note about this candidate..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="w-full min-h-[96px] rounded-md border border-neutral-200 p-[16px] font-body text-[14px] focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-y transition-all shadow-sm"
        />
        <div className="flex justify-end gap-[8px]">
          {newNote && (
            <button 
              onClick={() => setNewNote('')}
              className="px-[16px] py-[8px] rounded-md text-[13px] font-medium text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              Cancel
            </button>
          )}
          <button 
            onClick={handlePostNote}
            disabled={!newNote.trim()}
            className="px-[16px] py-[8px] bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-medium rounded-md transition-colors shadow-sm"
          >
            Post Note
          </button>
        </div>
      </div>

      {/* Notes List */}
      <div className="flex flex-col gap-[20px]">
        {notes.length === 0 ? (
          <div className="text-center py-[40px] text-neutral-400 font-body text-[14px] italic">
            No notes yet. Be the first to add one.
          </div>
        ) : (
          notes.map((note, idx) => (
            <div key={idx} className="flex gap-[16px] bg-white border border-[#E5E7EB] rounded-lg p-[20px] shadow-sm">
              <div className="w-[32px] h-[32px] rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-[12px] shrink-0">
                {user?.name?.charAt(0) || 'R'}
              </div>
              <div className="flex flex-col gap-[4px] w-full">
                <div className="flex justify-between items-center">
                  <span className="font-body text-[13px] font-semibold text-neutral-900">{user?.name || 'Recruiter'}</span>
                  <span className="font-body text-[11px] text-neutral-400">{formatDate(new Date().toISOString())}</span>
                </div>
                <p className="font-body text-[14px] text-neutral-700 leading-relaxed mt-[4px] whitespace-pre-wrap">
                  {note}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  )
}
