'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X, Search, Video, Phone, Building2, Sparkles, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import InterviewerPicker from './InterviewerPicker'
import InterviewKitSelector from './InterviewKitSelector'

interface ScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  initialDate?: Date
}

export default function ScheduleModal({ isOpen, onClose, initialDate }: ScheduleModalProps) {
  const [locationType, setLocationType] = useState('video')
  const [interviewers, setInterviewers] = useState<any[]>([])
  const [kit, setKit] = useState('')

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-xl shadow-xl w-[90vw] max-w-[720px] max-h-[90vh] flex flex-col z-50 overflow-hidden animate-in fade-in zoom-in-95 font-body">
          
          <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-neutral-100 shrink-0">
            <Dialog.Title className="text-[18px] font-semibold text-neutral-900">
              Schedule Interview
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-neutral-400 hover:text-neutral-600 transition-colors p-[4px] rounded-md">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-[24px] overflow-y-auto flex flex-col gap-[24px]">
            
            {/* Candidate Search */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[13px] font-semibold text-neutral-700">Candidate / Application</label>
              <div className="relative">
                <Search size={16} className="absolute left-[12px] top-[12px] text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="Search candidates by name..." 
                  className="w-full h-[40px] pl-[36px] pr-[12px] rounded-md border border-neutral-200 text-[14px] focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
              {/* Date & Time */}
              <div className="flex flex-col gap-[16px]">
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[13px] font-semibold text-neutral-700">Date</label>
                  <input 
                    type="date" 
                    defaultValue={initialDate ? initialDate.toISOString().split('T')[0] : ''}
                    className="w-full h-[40px] rounded-md border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-primary-500"
                  />
                </div>
                
                <div className="flex gap-[12px]">
                  <div className="flex flex-col gap-[6px] flex-1">
                    <label className="text-[13px] font-semibold text-neutral-700">Time</label>
                    <select className="w-full h-[40px] rounded-md border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-primary-500 bg-white">
                      <option>09:00 AM</option>
                      <option>09:30 AM</option>
                      <option>10:00 AM</option>
                      <option>10:30 AM</option>
                      <option>11:00 AM</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-[6px] w-[100px]">
                    <label className="text-[13px] font-semibold text-neutral-700">Duration</label>
                    <select className="w-full h-[40px] rounded-md border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-primary-500 bg-white">
                      <option>30m</option>
                      <option>45m</option>
                      <option>60m</option>
                      <option>90m</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-[16px]">
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[13px] font-semibold text-neutral-700">Location Type</label>
                  <div className="grid grid-cols-3 gap-[8px]">
                    {[
                      { id: 'video', icon: Video, label: 'Video' },
                      { id: 'phone', icon: Phone, label: 'Phone' },
                      { id: 'onsite', icon: Building2, label: 'Onsite' }
                    ].map(type => (
                      <button
                        key={type.id}
                        onClick={() => setLocationType(type.id)}
                        className={`flex flex-col items-center justify-center gap-[4px] h-[64px] rounded-md border transition-colors ${
                          locationType === type.id 
                            ? 'bg-primary-50 border-primary-500 text-primary-700' 
                            : 'bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50'
                        }`}
                      >
                        <type.icon size={18} />
                        <span className="text-[12px] font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {locationType === 'video' && (
                  <div className="flex flex-col gap-[6px]">
                    <label className="text-[13px] font-semibold text-neutral-700">Meeting Link</label>
                    <input 
                      type="text" 
                      placeholder="https://zoom.us/j/..." 
                      className="w-full h-[40px] rounded-md border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-primary-500"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="h-[1px] bg-neutral-100 w-full" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
              <InterviewerPicker selected={interviewers} onChange={setInterviewers} />
              
              <div className="flex flex-col gap-[12px]">
                <InterviewKitSelector value={kit} onChange={setKit} />
                <button className="flex items-center justify-center gap-[8px] bg-accent-50 text-accent-700 hover:bg-accent-100 border border-accent-200 px-[16px] py-[8px] rounded-md text-[13px] font-medium transition-colors w-full">
                  <Sparkles size={14} /> Generate with AI
                </button>
              </div>
            </div>

            <div className="h-[1px] bg-neutral-100 w-full" />

            {/* Email Preview Accordion Mock */}
            <div className="border border-neutral-200 rounded-md overflow-hidden bg-white">
              <button className="w-full px-[16px] py-[12px] flex items-center justify-between bg-neutral-50 hover:bg-neutral-100 transition-colors">
                <span className="text-[13px] font-semibold text-neutral-700">Candidate Email Preview</span>
                <ChevronDown size={16} className="text-neutral-500" />
              </button>
            </div>

          </div>

          <div className="flex items-center justify-end gap-[12px] px-[24px] py-[16px] border-t border-neutral-100 bg-neutral-50 shrink-0">
            <Dialog.Close asChild>
              <button className="px-[16px] py-[8px] text-[14px] font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                Cancel
              </button>
            </Dialog.Close>
            <button 
              className="px-[24px] py-[8px] text-[14px] font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-md transition-colors shadow-sm"
            >
              Schedule Interview
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
