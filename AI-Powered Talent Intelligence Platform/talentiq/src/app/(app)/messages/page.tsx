'use client'

import { useState } from 'react'
import {
  MessageSquare, Search, Send, Paperclip, MoreVertical,
  Check, CheckCheck, Clock, Video, Phone
} from 'lucide-react'
import { useDomainStore } from '@/store/domain.store'
import { v4 as uuidv4 } from 'uuid'
import Link from 'next/link'

export default function MessagesPage() {
  const { candidates, messages, addMessage } = useDomainStore()
  const [activeContactId, setActiveContactId] = useState<string | null>(candidates.length > 0 ? candidates[0].id : null)
  const [inputText, setInputText] = useState('')
  const [search, setSearch] = useState('')

  const activeContact = candidates.find(c => c.id === activeContactId)

  // Get last message for each candidate
  const contactsWithLastMessage = candidates.map(c => {
    const candidateMessages = messages.filter(m => m.candidateId === c.id)
    const lastMessage = candidateMessages.length > 0 ? candidateMessages[candidateMessages.length - 1] : null
    return {
      ...c,
      lastMessageText: lastMessage ? lastMessage.text : 'No messages yet.',
      lastMessageTime: lastMessage ? lastMessage.time : '',
      unread: 0, // Mock unread count
      online: Math.random() > 0.5 // Mock online status
    }
  }).filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase()))

  const activeMessages = activeContact ? messages.filter(m => m.candidateId === activeContact.id) : []

  const handleSendMessage = () => {
    if (!inputText.trim() || !activeContact) return
    
    addMessage({
      id: uuidv4(),
      candidateId: activeContact.id,
      senderId: 'me',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
    setInputText('')
  }

  return (
    <div className="flex flex-col h-full -mx-[16px] md:-mx-[32px] -mt-[16px] md:-mt-[32px] bg-neutral-50/50 min-h-[calc(100vh-60px)]">
      
      {/* Container to give a unified split-pane look */}
      <div className="flex-1 flex overflow-hidden m-[16px] md:m-[24px] bg-white rounded-[16px] border border-neutral-200 shadow-sm">
        
        {/* Left Pane: Contacts List */}
        <div className="w-full md:w-[320px] lg:w-[360px] flex flex-col border-r border-neutral-100 shrink-0">
          
          {/* Header */}
          <div className="px-[20px] py-[16px] border-b border-neutral-100 shrink-0">
            <h1 className="font-display text-[20px] font-bold text-neutral-900 mb-[16px]">Messages</h1>
            <div className="relative">
              <Search size={14} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full h-[36px] pl-[34px] pr-[12px] bg-neutral-50 border border-neutral-200 rounded-[8px] text-[13px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-primary-400 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Contact List */}
          <div className="flex-1 overflow-y-auto">
            {contactsWithLastMessage.map(contact => (
              <button
                key={contact.id}
                onClick={() => setActiveContactId(contact.id)}
                className={`w-full flex items-start gap-[12px] p-[16px] border-b border-neutral-50 transition-colors text-left ${
                  activeContactId === contact.id ? 'bg-blue-50/50' : 'hover:bg-neutral-50'
                }`}
              >
                <div className="relative shrink-0">
                  <img src={contact.avatar} alt={contact.name} className="w-[44px] h-[44px] rounded-[10px] object-cover bg-neutral-100" />
                  {contact.online && (
                    <span className="absolute -bottom-[2px] -right-[2px] w-[12px] h-[12px] rounded-full bg-emerald-500 border-[2px] border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-[2px]">
                    <span className="font-body text-[14px] font-semibold text-neutral-900 truncate pr-[8px]">
                      {contact.name}
                    </span>
                    <span className={`text-[11px] font-medium shrink-0 ${contact.unread > 0 ? 'text-blue-600 font-bold' : 'text-neutral-400'}`}>
                      {contact.lastMessageTime}
                    </span>
                  </div>
                  <p className="font-body text-[12px] text-neutral-500 truncate mb-[4px]">{contact.role}</p>
                  <div className="flex items-center justify-between">
                    <p className={`font-body text-[12px] truncate pr-[8px] ${contact.unread > 0 ? 'text-neutral-900 font-semibold' : 'text-neutral-500'}`}>
                      {contact.lastMessageText}
                    </p>
                    {contact.unread > 0 && (
                      <span className="w-[18px] h-[18px] rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Pane: Chat Window (Hidden on mobile if list is active) */}
        <div className="hidden md:flex flex-col flex-1 bg-white">
          
          {/* Chat Header */}
          {activeContact ? (
            <>
              <div className="px-[24px] py-[16px] border-b border-neutral-100 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-sm z-10">
                <div className="flex items-center gap-[12px]">
                  <img src={activeContact.avatar} alt={activeContact.name} className="w-[40px] h-[40px] rounded-[10px] object-cover bg-neutral-100" />
                  <div>
                    <h2 className="font-display text-[16px] font-bold text-neutral-900 leading-snug">{activeContact.name}</h2>
                    <p className="font-body text-[12px] text-neutral-500">{activeContact.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-[8px]">
                  <Link href={`/meet/${activeContact.id}?type=Voice`} className="h-[36px] w-[36px] flex items-center justify-center rounded-[8px] border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors">
                    <Phone size={16} />
                  </Link>
                  <Link href={`/meet/${activeContact.id}?type=Video`} className="h-[36px] w-[36px] flex items-center justify-center rounded-[8px] border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors">
                    <Video size={16} />
                  </Link>
                  <Link href={`/applications/${activeContact.id}`} className="flex items-center justify-center h-[36px] px-[14px] bg-white border border-neutral-200 text-neutral-700 font-body text-[13px] font-semibold rounded-[8px] hover:bg-neutral-50 transition-colors ml-[8px]">
                    View Profile
                  </Link>
                </div>
              </div>

              {/* Chat History */}
              <div className="flex-1 overflow-y-auto p-[24px] flex flex-col gap-[16px] bg-neutral-50/30">
                <div className="text-center mb-[8px]">
                  <span className="bg-neutral-100 text-neutral-500 text-[10px] font-bold uppercase tracking-wide px-[10px] py-[4px] rounded-full">
                    Conversation Started
                  </span>
                </div>
                
                {activeMessages.map((msg, i) => {
                  const isMe = msg.senderId === 'me'
                  return (
                    <div key={msg.id} className={`flex flex-col max-w-[75%] ${isMe ? 'self-end' : 'self-start'}`}>
                      <div className={`p-[14px] rounded-[14px] font-body text-[13px] leading-relaxed shadow-sm ${
                        isMe 
                          ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-[4px]' 
                          : 'bg-white border border-neutral-200 text-neutral-800 rounded-tl-[4px]'
                      }`}>
                        {msg.text}
                      </div>
                      <div className={`flex items-center gap-[4px] mt-[6px] text-[10px] font-medium text-neutral-400 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {msg.time}
                        {isMe && <CheckCheck size={12} className="text-blue-500 ml-[2px]" />}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Chat Input */}
              <div className="p-[20px] bg-white border-t border-neutral-100 shrink-0">
                <div className="flex items-end gap-[12px] bg-neutral-50 border border-neutral-200 rounded-[12px] p-[10px] focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <button className="p-[8px] text-neutral-400 hover:text-neutral-600 transition-colors rounded-[8px] hover:bg-neutral-100 shrink-0">
                    <Paperclip size={18} />
                  </button>
                  <textarea
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent border-none text-[13px] font-body text-neutral-900 placeholder:text-neutral-400 resize-none py-[8px] px-[4px] max-h-[120px] min-h-[40px] focus:outline-none"
                    rows={1}
                  />
                  <button onClick={handleSendMessage} className="h-[40px] px-[16px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-body text-[13px] font-semibold rounded-[8px] shadow-sm transition-all flex items-center gap-[6px] shrink-0">
                    Send <Send size={14} />
                  </button>
                </div>
                <p className="font-body text-[11px] text-neutral-400 text-center mt-[12px]">
                  Messages are sent via email if the candidate is not currently online.
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center flex-col text-center p-[40px]">
              <MessageSquare size={48} className="text-neutral-200 mb-[16px]" />
              <h3 className="font-display text-[18px] font-bold text-neutral-900">Your Messages</h3>
              <p className="font-body text-[14px] text-neutral-500 mt-[4px]">Select a conversation from the left to start chatting.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
