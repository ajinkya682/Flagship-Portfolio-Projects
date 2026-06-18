'use client'

import { useState, useEffect, useRef } from 'react'
import { Application } from '@/types/domain.types'
import { Send, User } from 'lucide-react'
import { io, Socket } from 'socket.io-client'

interface MessagesTabProps {
  application: Application
}

interface Message {
  id: string
  candidateId: string
  senderId: string
  text: string
  time: string
}

export default function MessagesTab({ application }: MessagesTabProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const candidateId = application.candidate.id

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages?candidateId=${candidateId}`)
        if (res.ok) {
          const data = await res.json()
          setMessages(prev => {
            if (prev.length !== data.length) return data
            return prev
          })
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error)
      }
    }
    fetchMessages()
    const interval = setInterval(fetchMessages, 5000)

    return () => clearInterval(interval)
  }, [candidateId])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const messageData = {
      candidateId: candidateId,
      senderId: 'me', // Business owner is sending
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    // Optimistically update UI
    setMessages((prev) => [...prev, { ...messageData, id: Date.now().toString() }])
    setNewMessage('')

    // Emit message to server via fetch
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      })
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  return (
    <div className="flex flex-col h-[600px] border-t border-neutral-100 relative">
      
      <div className="flex-1 overflow-y-auto p-[24px] flex flex-col gap-[16px] bg-neutral-50/50">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-[48px] h-[48px] bg-white rounded-full flex items-center justify-center mb-[12px] shadow-sm border border-neutral-100">
              <User className="text-neutral-400" size={24} />
            </div>
            <p className="font-body text-[14px] text-neutral-500">No messages yet. Send a message to start chatting via the Candidate Portal.</p>
          </div>
        ) : (
          messages.map(msg => {
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
        <div ref={messagesEndRef} />
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
