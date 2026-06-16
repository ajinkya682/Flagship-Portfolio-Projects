'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  MessageSquare, Search, Send, MoreVertical,
  CheckCheck, Phone, Video, User, ArrowLeft,
  Trash, ShieldAlert, ShieldCheck, Eraser
} from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { io, Socket } from 'socket.io-client'
import Link from 'next/link'
import { useCandidatesStore } from '@/store/candidates.store'

interface Contact {
  id: string
  name: string
  email: string
  avatar: string | null
  lastMessageText: string
  lastMessageTime: string
  lastMessageSender: string
  lastMessageAt: string | null
  unread?: number
  isBlocked?: boolean
}

interface Message {
  id: string
  candidateId: string
  senderId: string
  text: string
  time: string
  createdAt?: string
}

export default function MessagesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const candidateIdParam = searchParams?.get('candidateId') ?? null

  const [contacts, setContacts] = useState<Contact[]>([])
  const [activeContactId, setActiveContactId] = useState<string | null>(candidateIdParam)
  const [activeMessages, setActiveMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [search, setSearch] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isLoadingContacts, setIsLoadingContacts] = useState(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [showMobileChat, setShowMobileChat] = useState(false)

  const { candidates } = useCandidatesStore()

  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const joinedRoomRef = useRef<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const activeContact = contacts.find(c => c.id === activeContactId)

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  // Fetch contacts who have active conversations
  const fetchContacts = useCallback(async (forcedCandidateId?: string | null) => {
    try {
      const targetId = forcedCandidateId !== undefined ? forcedCandidateId : candidateIdParam
      const url = targetId ? `/api/messages/contacts?candidateId=${targetId}` : '/api/messages/contacts'
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setContacts(data)
        
        setActiveContactId(prev => {
          if (targetId) return targetId
          if (!prev && data.length > 0) return data[0].id
          return prev
        })
      }
    } catch (err) {
      console.error('Failed to fetch contacts:', err)
    } finally {
      setIsLoadingContacts(false)
    }
  }, [candidateIdParam])

  // Fetch messages for active contact
  const fetchMessages = useCallback(async (candidateId: string) => {
    setIsLoadingMessages(true)
    try {
      const res = await fetch(`/api/messages?candidateId=${candidateId}`)
      if (res.ok) {
        const data = await res.json()
        setActiveMessages(data)
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err)
    } finally {
      setIsLoadingMessages(false)
    }
  }, [])

  // Initialize Socket.io and Contacts
  useEffect(() => {
    // If a candidateIdParam is provided but not in contacts, fetch it.
    // We also fetch on initial mount.
    const exists = contacts.find(c => c.id === candidateIdParam)
    if ((candidateIdParam && !exists) || contacts.length === 0) {
      fetchContacts(candidateIdParam)
    }
  }, [candidateIdParam, contacts.length])

  useEffect(() => {
    let socket: Socket | null = null;
    fetch('/api/socket/io').finally(() => {
      socket = io({ path: '/api/socket/io' })
      socketRef.current = socket

      socket.on('connect', () => setIsConnected(true))
      socket.on('disconnect', () => setIsConnected(false))

      // Listen for any new message globally to update sidebar
      socket.on('receive_message_global', (message: Message) => {
        setContacts(prev => {
          const exists = prev.find(c => c.id === message.candidateId)
          if (exists) {
            return prev
              .map(c =>
                c.id === message.candidateId
                  ? {
                      ...c,
                      lastMessageText: message.text,
                      lastMessageTime: message.time,
                      lastMessageSender: message.senderId,
                      lastMessageAt: message.createdAt || new Date().toISOString(),
                      unread: c.id !== activeContactId && message.senderId === 'candidate'
                        ? (c.unread || 0) + 1
                        : c.unread,
                    }
                  : c
              )
              .sort((a, b) => {
                if (!a.lastMessageAt) return 1
                if (!b.lastMessageAt) return -1
                return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
              })
          } else {
            // New contact with first message — refetch contacts list
            fetchContacts()
            return prev
          }
        })
      })

      // Listen for messages in the active candidate room
      socket.on('receive_message', (message: Message) => {
        setActiveMessages(prev => {
          const alreadyExists = prev.find(m => m.id === message.id)
          if (alreadyExists) return prev
          return [...prev, message]
        })
      })
    })

    return () => {
      if (socketRef.current) socketRef.current.disconnect()
    }
  }, [])

  // When active contact changes, join new room & fetch history
  useEffect(() => {
    if (!activeContactId) return

    fetchMessages(activeContactId)

    if (socketRef.current && isConnected) {
      // Leave old room
      if (joinedRoomRef.current && joinedRoomRef.current !== activeContactId) {
        socketRef.current.emit('leave_room', joinedRoomRef.current)
      }
      socketRef.current.emit('join_room', activeContactId)
      joinedRoomRef.current = activeContactId
    }
  }, [activeContactId])

  // Join room after socket connects
  useEffect(() => {
    if (isConnected && activeContactId && socketRef.current) {
      socketRef.current.emit('join_room', activeContactId)
      joinedRoomRef.current = activeContactId
    }
  }, [isConnected])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeMessages])

  // Clear unread when selecting a contact
  const handleSelectContact = (contactId: string) => {
    setActiveContactId(contactId)
    setShowMobileChat(true)
    setContacts(prev => prev.map(c => c.id === contactId ? { ...c, unread: 0 } : c))
    router.replace(`/messages?candidateId=${contactId}`, { scroll: false })
  }

  const handleSendMessage = () => {
    if (!inputText.trim() || !activeContactId || !socketRef.current) return

    const messageData = {
      candidateId: activeContactId,
      senderId: 'me',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    socketRef.current.emit('send_message', messageData)
    setInputText('')

    // Auto-resize textarea back to normal
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value)
    // Auto-resize
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }

  const handleClearChat = async () => {
    if (!activeContactId) return
    try {
      const res = await fetch(`/api/messages?candidateId=${activeContactId}`, { method: 'DELETE' })
      if (res.ok) {
        setActiveMessages([])
      }
    } catch (e) {
      console.error('Failed to clear chat', e)
    }
  }

  const handleDeleteChat = async () => {
    if (!activeContactId) return
    try {
      const res = await fetch(`/api/messages?candidateId=${activeContactId}`, { method: 'DELETE' })
      if (res.ok) {
        setActiveMessages([])
        setContacts(prev => prev.filter(c => c.id !== activeContactId))
        setActiveContactId(null)
      }
    } catch (e) {
      console.error('Failed to delete chat', e)
    }
  }

  const handleToggleBlock = async () => {
    if (!activeContact || !activeContactId) return
    const newStatus = !activeContact.isBlocked
    try {
      const res = await fetch(`/api/candidates/${activeContactId}/block`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBlocked: newStatus })
      })
      if (res.ok) {
        setContacts(prev => prev.map(c => c.id === activeContactId ? { ...c, isBlocked: newStatus } : c))
      }
    } catch (e) {
      console.error('Failed to toggle block status', e)
    }
  }

  // --- Render helpers ---

  const ContactAvatar = ({ contact, size = 44 }: { contact: Contact; size?: number }) => (
    <div
      className="rounded-[10px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold overflow-hidden shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {contact.avatar ? (
        <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
      ) : (
        contact.name.charAt(0).toUpperCase()
      )}
    </div>
  )

  return (
    <div className="flex flex-col h-full -mx-[16px] md:-mx-[32px] -mt-[16px] md:-mt-[32px] bg-neutral-50 min-h-[calc(100vh-60px)]">
      <div className="flex-1 flex overflow-hidden m-[12px] md:m-[20px] bg-white rounded-[20px] border border-neutral-200 shadow-sm" style={{ height: 'calc(100vh - 100px)' }}>

        {/* ─── LEFT PANE: Contacts ─── */}
        <div className={`${showMobileChat ? 'hidden' : 'flex'} md:flex w-full md:w-[300px] lg:w-[340px] flex-col border-r border-neutral-100 shrink-0`}>

          {/* Header */}
          <div className="px-[20px] pt-[20px] pb-[14px] border-b border-neutral-100">
            <div className="flex items-center justify-between mb-[14px]">
              <h1 className="font-display text-[20px] font-bold text-neutral-900">Messages</h1>
              <div className={`w-[8px] h-[8px] rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-neutral-300'} transition-colors`} title={isConnected ? 'Connected' : 'Connecting...'} />
            </div>
            <div className="relative">
              <Search size={13} className="absolute left-[11px] top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full h-[36px] pl-[32px] pr-[12px] bg-neutral-50 border border-neutral-200 rounded-[10px] text-[13px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Contact list */}
          <div className="flex-1 overflow-y-auto">
            {isLoadingContacts ? (
              <div className="flex flex-col gap-[2px] p-[8px]">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-[12px] p-[12px] rounded-[12px] animate-pulse">
                    <div className="w-[44px] h-[44px] rounded-[10px] bg-neutral-100 shrink-0" />
                    <div className="flex-1">
                      <div className="h-[12px] bg-neutral-100 rounded-full w-[60%] mb-[8px]" />
                      <div className="h-[10px] bg-neutral-100 rounded-full w-[80%]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-[32px]">
                <div className="w-[52px] h-[52px] bg-blue-50 rounded-full flex items-center justify-center mb-[14px]">
                  <MessageSquare size={22} className="text-blue-400" />
                </div>
                <p className="font-display text-[14px] font-bold text-neutral-800 mb-[6px]">No conversations yet</p>
                <p className="font-body text-[12px] text-neutral-400 leading-relaxed">
                  Open a candidate profile and click "Message" to start a conversation.
                </p>
              </div>
            ) : (
              <div className="py-[6px]">
                {filteredContacts.map(contact => (
                  <button
                    key={contact.id}
                    onClick={() => handleSelectContact(contact.id)}
                    className={`w-full flex items-start gap-[12px] px-[16px] py-[14px] transition-all text-left group ${
                      activeContactId === contact.id
                        ? 'bg-blue-50 border-r-[3px] border-blue-500'
                        : 'hover:bg-neutral-50 border-r-[3px] border-transparent'
                    }`}
                  >
                    <div className="relative">
                      <ContactAvatar contact={contact} size={44} />
                      {contact.lastMessageSender === 'candidate' && (contact.unread || 0) > 0 && (
                        <span className="absolute -top-[4px] -right-[4px] w-[16px] h-[16px] rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center border-[2px] border-white">
                          {contact.unread}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-[3px]">
                        <span className={`text-[14px] font-semibold truncate pr-[6px] ${activeContactId === contact.id ? 'text-blue-700' : 'text-neutral-900'}`}>
                          {contact.name}
                        </span>
                        <span className="text-[10px] text-neutral-400 shrink-0 font-medium">
                          {contact.lastMessageTime}
                        </span>
                      </div>
                      <p className={`text-[12px] truncate ${(contact.unread || 0) > 0 && contact.lastMessageSender === 'candidate' ? 'text-neutral-900 font-semibold' : 'text-neutral-400'}`}>
                        {contact.lastMessageSender === 'me' ? 'You: ' : ''}{contact.lastMessageText || 'No messages yet'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─── RIGHT PANE: Chat Window ─── */}
        <div className={`${!showMobileChat ? 'hidden' : 'flex'} md:flex flex-col flex-1 min-w-0 bg-white`}>

          {activeContact ? (
            <>
              {/* Chat Header */}
              <div className="px-[20px] py-[14px] border-b border-neutral-100 flex items-center gap-[12px] bg-white/90 backdrop-blur-sm shrink-0 shadow-sm">
                {/* Mobile back button */}
                <button
                  onClick={() => setShowMobileChat(false)}
                  className="md:hidden flex items-center justify-center w-[34px] h-[34px] rounded-[8px] text-neutral-500 hover:bg-neutral-100 transition-colors shrink-0"
                >
                  <ArrowLeft size={18} />
                </button>

                <ContactAvatar contact={activeContact} size={40} />

                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-[15px] font-bold text-neutral-900 leading-tight truncate">{activeContact.name}</h2>
                  <p className="text-[11px] text-neutral-400 truncate">{activeContact.email}</p>
                </div>

                <div className="flex items-center gap-[6px]">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button className="h-[32px] w-[32px] flex items-center justify-center text-neutral-500 border border-neutral-200 rounded-[8px] hover:bg-neutral-50 transition-colors shrink-0 outline-none">
                        <MoreVertical size={16} />
                      </button>
                    </DropdownMenu.Trigger>
                    
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content 
                        align="end" 
                        sideOffset={5}
                        className="min-w-[180px] bg-white rounded-[12px] p-[6px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-100 z-50 animate-in fade-in zoom-in-95 duration-200"
                      >
                        <DropdownMenu.Item className="outline-none" asChild>
                          <Link
                            href={`/applications/${activeContact.id}`}
                            className="flex items-center gap-[8px] w-full px-[12px] py-[10px] text-[13px] font-medium text-neutral-700 hover:bg-neutral-50 rounded-[8px] cursor-pointer"
                          >
                            <User size={15} className="text-neutral-400" />
                            View Profile
                          </Link>
                        </DropdownMenu.Item>

                        <DropdownMenu.Separator className="h-[1px] bg-neutral-100 my-[4px]" />

                        <DropdownMenu.Item 
                          onSelect={handleClearChat}
                          className="flex items-center gap-[8px] w-full px-[12px] py-[10px] text-[13px] font-medium text-neutral-700 hover:bg-neutral-50 rounded-[8px] cursor-pointer outline-none"
                        >
                          <Eraser size={15} className="text-neutral-400" />
                          Clear Chat
                        </DropdownMenu.Item>

                        <DropdownMenu.Item 
                          onSelect={handleDeleteChat}
                          className="flex items-center gap-[8px] w-full px-[12px] py-[10px] text-[13px] font-medium text-red-600 hover:bg-red-50 rounded-[8px] cursor-pointer outline-none"
                        >
                          <Trash size={15} className="text-red-500" />
                          Delete Chat
                        </DropdownMenu.Item>

                        <DropdownMenu.Separator className="h-[1px] bg-neutral-100 my-[4px]" />

                        <DropdownMenu.Item 
                          onSelect={handleToggleBlock}
                          className="flex items-center gap-[8px] w-full px-[12px] py-[10px] text-[13px] font-medium text-neutral-700 hover:bg-neutral-50 rounded-[8px] cursor-pointer outline-none"
                        >
                          {activeContact.isBlocked ? (
                            <>
                              <ShieldCheck size={15} className="text-emerald-500" />
                              Unblock Candidate
                            </>
                          ) : (
                            <>
                              <ShieldAlert size={15} className="text-neutral-400" />
                              Block Candidate
                            </>
                          )}
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>
              </div>

              {/* Messages Area */}
              <div
                className="flex-1 overflow-y-auto px-[20px] py-[20px] flex flex-col gap-[10px]"
                style={{
                  background: 'linear-gradient(180deg, #f8f9ff 0%, #f4f6fb 100%)',
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e8eaf6' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
                }}
              >
                {isLoadingMessages ? (
                  <div className="flex flex-col gap-[12px] py-[8px]">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`flex max-w-[65%] ${i % 2 === 0 ? 'self-end' : 'self-start'}`}>
                        <div className="h-[44px] rounded-[14px] bg-white/80 border border-neutral-100 w-[220px] animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : activeMessages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-[60px]">
                    <div className="w-[60px] h-[60px] bg-blue-50 rounded-full flex items-center justify-center mb-[14px]">
                      <MessageSquare size={26} className="text-blue-400" />
                    </div>
                    <p className="font-display text-[15px] font-bold text-neutral-700 mb-[6px]">Start the conversation</p>
                    <p className="font-body text-[13px] text-neutral-400">
                      Send a message to {activeContact.name} below.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center mb-[8px]">
                      <span className="bg-white/80 text-neutral-400 text-[10px] font-bold uppercase tracking-wider px-[12px] py-[5px] rounded-full border border-neutral-100 shadow-sm">
                        Chat History
                      </span>
                    </div>
                    {activeMessages.map((msg, i) => {
                      const isMe = msg.senderId === 'me'
                      const prevMsg = activeMessages[i - 1]
                      const showAvatar = !isMe && (!prevMsg || prevMsg.senderId !== msg.senderId)

                      return (
                        <div key={msg.id || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%] ${isMe ? 'self-end' : 'self-start'}`}>
                          {showAvatar && (
                            <div className="flex items-center gap-[6px] mb-[4px] ml-[2px]">
                              <ContactAvatar contact={activeContact} size={18} />
                              <span className="text-[10px] font-semibold text-neutral-500">{activeContact.name}</span>
                            </div>
                          )}
                          <div className={`px-[14px] py-[10px] rounded-[16px] shadow-sm text-[13px] leading-relaxed font-body ${
                            isMe
                              ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-[4px]'
                              : 'bg-white border border-neutral-200 text-neutral-800 rounded-tl-[4px]'
                          }`}>
                            {msg.text}
                          </div>
                          <div className={`flex items-center gap-[4px] mt-[4px] text-[10px] font-medium text-neutral-400 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <span>{msg.time}</span>
                            {isMe && <CheckCheck size={11} className="text-blue-400" />}
                          </div>
                        </div>
                      )
                    })}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="px-[16px] py-[14px] bg-white border-t border-neutral-100 shrink-0 relative">
                {activeContact.isBlocked && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                    <p className="text-[13px] font-semibold text-neutral-600 bg-white px-[16px] py-[8px] rounded-full shadow-sm border border-neutral-200">
                      This candidate is blocked. You cannot send messages.
                    </p>
                  </div>
                )}
                <div className="flex items-end gap-[10px] bg-neutral-50 border border-neutral-200 rounded-[14px] px-[14px] py-[10px] focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <textarea
                    ref={textareaRef}
                    value={inputText}
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyDown}
                    placeholder={`Message ${activeContact.name}...`}
                    disabled={!isConnected || activeContact.isBlocked}
                    className="flex-1 bg-transparent border-none text-[13px] font-body text-neutral-900 placeholder:text-neutral-400 resize-none py-[6px] focus:outline-none max-h-[120px] min-h-[36px] disabled:opacity-50"
                    rows={1}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || !isConnected || activeContact.isBlocked}
                    className="h-[36px] w-[36px] rounded-[10px] bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center justify-center transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  >
                    <Send size={15} className="ml-[1px]" />
                  </button>
                </div>
                <p className="text-[10px] text-neutral-400 text-center mt-[8px]">
                  Press <kbd className="bg-neutral-100 px-[5px] py-[1px] rounded text-[10px]">Enter</kbd> to send · <kbd className="bg-neutral-100 px-[5px] py-[1px] rounded text-[10px]">Shift+Enter</kbd> for new line
                </p>
              </div>
            </>
          ) : (
            // Empty state — no contact selected
            <div className="flex-1 flex flex-col items-center justify-center text-center p-[48px]">
              <div className="w-[72px] h-[72px] bg-blue-50 rounded-full flex items-center justify-center mb-[18px]">
                <MessageSquare size={32} className="text-blue-400" />
              </div>
              <h3 className="font-display text-[20px] font-bold text-neutral-900 mb-[8px]">Your Messages</h3>
              <p className="font-body text-[14px] text-neutral-500 max-w-[280px] leading-relaxed">
                Select a conversation from the left, or open a candidate profile and click "Message" to start chatting.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
