'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import gsap from '@/lib/gsap'

interface FAQItemProps {
  question: string
  answer: string
}

export default function FAQItem({
  question,
  answer,
}: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const content = contentRef.current

    if (!content) return

    // Reduced motion accessibility support
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      content.style.height = isOpen ? 'auto' : '0px'
      content.style.display = 'block'
      return
    }

    if (isOpen) {
      gsap.fromTo(
        content,
        {
          height: 0,
          clipPath: 'inset(0 0 100% 0)',
        },
        {
          height: 'auto',
          clipPath: 'inset(0 0 0% 0)',
          duration: 0.4,
          ease: 'power2.out',
        }
      )
    } else {
      gsap.to(content, {
        height: 0,
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.3,
        ease: 'power2.inOut',
      })
    }
  }, [isOpen])

  return (
    <div className="border-b border-neutral-100 py-5">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-sm text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        aria-expanded={isOpen}
      >
        <span className="pr-6 font-body text-[15px] font-semibold text-neutral-900">
          {question}
        </span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{ height: 0 }}
      >
        <p className="mt-3 pb-1 font-body text-[14px] leading-relaxed text-neutral-600">
          {answer}
        </p>
      </div>
    </div>
  )
}