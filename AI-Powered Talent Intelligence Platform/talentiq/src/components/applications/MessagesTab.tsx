'use client'

import { useState } from 'react'
import { Application } from '@/types/domain.types'
import { useDomainStore } from '@/store/domain.store'
import { Send, User, Briefcase } from 'lucide-react'

interface MessagesTabProps {
  application: Application
}

export default function MessagesTab({ application }: MessagesTabProps) {
  const { messages, addMessage } = useDomainStore()
  const [newMessage, setNewMessage] = useState('')

  const candidateMessages = messages.filter(m => m.candidateId === application.candidate.id)

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    addMessage({
      id: `m_${Date.now()}`,
      candidateId: application.candidate.id,
      senderId: 'me', // Business owner is sending
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
    setNewMessage('')
  }

  return (
    <div className="flex flex-col h-[600px] border-t border-neutral-100">
      <div className="flex-1 overflow-y-auto p-[24px] flex flex-col gap-[16px] bg-neutral-50/50">
        {candidateMessages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-[48px] h-[48px] bg-white rounded-full flex items-center justify-center mb-[12px] shadow-sm border border-neutral-100">
              <User className="text-neutral-400" size={24} />
            </div>
            <p className="font-body text-[14px] text-neutral-500">No messages yet. Send a message to start chatting via the Candidate Portal.</p>
          </div>
        ) : (
          candidateMessages.map(msg => {
            const isMine = msg.senderId === 'me'
            return (
              <div key={msg.id} className={`flex max-w-[80%] ${isMine ? 'self-end' : 'self-start'}`}>
                {!isMine && (
                  <div className="w-[28px] h-[28px] rounded-full overflow-hidden mr-[8px] mt-auto shrink-0 border border-neutral-200">
                    {application.candidate.avatar ? (
                      <img src={application.candidate.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                        <User size={14} className="text-neutral-400" />
                      </div>
                    )}
                  </div>
                )}
                <div className={`p-[14px] rounded-[16px] shadow-sm ${isMine ? 'bg-primary-600 text-white rounded-br-[4px]' : 'bg-white border border-neutral-200 text-neutral-900 rounded-bl-[4px]'}`}>
                  <p className="font-body text-[14px] leading-relaxed">{msg.text}</p>
                  <p className={`font-body text-[10px] mt-[6px] ${isMine ? 'text-primary-200' : 'text-neutral-400'}`}>{msg.time}</p>
                </div>
              </div>
            )
          })
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-[16px] border-t border-neutral-100 bg-white">
        <div className="flex items-center gap-[12px]">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message ${application.candidate.name}...`}
            className="flex-1 h-[44px] px-[16px] rounded-full border border-neutral-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-neutral-50 text-[14px]"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="w-[44px] h-[44px] rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <Send size={18} className="ml-[2px]" />
          </button>
        </div>
      </form>
    </div>
  )
}
