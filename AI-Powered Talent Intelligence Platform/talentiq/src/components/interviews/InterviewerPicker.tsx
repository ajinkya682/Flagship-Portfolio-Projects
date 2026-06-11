'use client'

import * as Popover from '@radix-ui/react-popover'
import { Plus, X, Search } from 'lucide-react'
import { useState } from 'react'

interface Interviewer {
  id: string
  name: string
  avatar?: string
}

const TEAM_MEMBERS: Interviewer[] = [
  { id: '1', name: 'Sarah Recruiter' },
  { id: '2', name: 'Alex Manager' },
  { id: '3', name: 'Jordan Lee' },
  { id: '4', name: 'Taylor Smith' }
]

interface InterviewerPickerProps {
  selected: Interviewer[]
  onChange: (selected: Interviewer[]) => void
}

export default function InterviewerPicker({ selected, onChange }: InterviewerPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filteredMembers = TEAM_MEMBERS.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) && 
    !selected.find(s => s.id === m.id)
  )

  const handleSelect = (member: Interviewer) => {
    onChange([...selected, member])
    setIsOpen(false)
    setSearch('')
  }

  const handleRemove = (id: string) => {
    onChange(selected.filter(m => m.id !== id))
  }

  return (
    <div className="flex flex-col gap-[8px]">
      <label className="text-[13px] font-semibold text-neutral-700">Interviewers</label>
      
      <div className="flex flex-wrap gap-[8px] items-center">
        {selected.map(member => (
          <div key={member.id} className="flex items-center gap-[6px] bg-neutral-100 pl-[6px] pr-[8px] py-[4px] rounded-full">
            <div className="w-[20px] h-[20px] rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-[10px]">
              {member.name.charAt(0)}
            </div>
            <span className="text-[13px] font-medium text-neutral-700">{member.name.split(' ')[0]}</span>
            <button 
              onClick={() => handleRemove(member.id)}
              className="text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
          <Popover.Trigger asChild>
            <button className="flex items-center gap-[4px] border border-dashed border-neutral-300 text-neutral-500 hover:text-neutral-700 hover:border-neutral-400 px-[12px] py-[6px] rounded-full text-[13px] font-medium transition-colors">
              <Plus size={14} /> Add
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content 
              align="start" 
              className="bg-white rounded-lg shadow-lg border border-neutral-100 w-[240px] z-50 overflow-hidden font-body animate-in fade-in zoom-in-95"
            >
              <div className="p-[8px] border-b border-neutral-100 relative">
                <Search size={14} className="absolute left-[16px] top-[16px] text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="Search team..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-[32px] pl-[28px] pr-[8px] text-[13px] bg-neutral-50 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div className="max-h-[200px] overflow-y-auto p-[4px]">
                {filteredMembers.length === 0 ? (
                  <div className="p-[12px] text-center text-[13px] text-neutral-500">No members found</div>
                ) : (
                  filteredMembers.map(member => (
                    <button
                      key={member.id}
                      onClick={() => handleSelect(member)}
                      className="w-full flex items-center gap-[8px] p-[8px] rounded-md hover:bg-neutral-50 transition-colors text-left"
                    >
                      <div className="w-[24px] h-[24px] rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                        {member.name.charAt(0)}
                      </div>
                      <span className="text-[13px] font-medium text-neutral-900">{member.name}</span>
                    </button>
                  ))
                )}
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </div>
  )
}
