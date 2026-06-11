'use client'

import { useState, useRef } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItemProps {
  question: string
  answer: string
}

export default function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <div className="border-b border-neutral-100 py-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm"
        aria-expanded={isOpen}
      >
        <span className="font-body text-[15px] font-semibold text-neutral-900 pr-6">
          {question}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
        />
      </button>
      
      <div 
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ 
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight || 200}px` : '0px',
          opacity: isOpen ? 1 : 0
        }}
      >
        <p className="font-body text-[14px] text-neutral-600 mt-3 pb-1 leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  )
}
