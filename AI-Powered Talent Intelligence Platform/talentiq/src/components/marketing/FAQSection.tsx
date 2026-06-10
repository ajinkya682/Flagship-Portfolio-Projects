"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { ScrollEntry } from "@/components/shared/ScrollEntry"
import { cn } from "@/lib/utils"

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="border-b border-neutral-100 py-[20px]">
      <button 
        className="flex w-full items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h5 className="font-display text-[14px] font-semibold text-neutral-900 pr-8">
          {question}
        </h5>
        <ChevronDown 
          size={16} 
          className={cn(
            "shrink-0 text-neutral-400 transition-transform duration-200 ease-out",
            isOpen && "rotate-180"
          )} 
        />
      </button>
      
      <div 
        className={cn(
          "grid transition-all duration-200 ease-out",
          isOpen ? "grid-rows-[1fr] mt-3 pb-1" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <p className="font-body text-[15px] text-neutral-700 leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}

export function FAQSection() {
  const faqs = [
    {
      question: "How does the AI scoring actually work?",
      answer: "Our AI analyzes candidates against your specific job requirements, looking at skills, context, and experience depth rather than just matching keywords."
    },
    {
      question: "Is TalentIQ compliant with GDPR and CCPA?",
      answer: "Yes, we are fully compliant with GDPR, CCPA, and SOC 2 Type II standards. All candidate data is encrypted and handled according to strict privacy protocols."
    },
    {
      question: "Can I use TalentIQ with my existing ATS?",
      answer: "Absolutely. We integrate seamlessly with Greenhouse, Workday, BambooHR, and many other popular ATS platforms."
    },
    {
      question: "How accurate is the bias detection?",
      answer: "Our bias detection engine is trained on millions of data points to flag inconsistent evaluations and standardize scoring criteria across all candidates."
    },
    {
      question: "What happens when my AI score quota runs out?",
      answer: "Your pipeline continues to work normally. New candidates simply won't receive an AI score until the next billing cycle, or you can choose to upgrade your quota."
    },
    {
      question: "Do candidates know their application was AI-scored?",
      answer: "We provide customizable transparency templates you can use to inform candidates about your hiring process, though it is ultimately up to your company's policy."
    },
    {
      question: "How long does the free trial last?",
      answer: "The free trial lasts for 14 days and gives you full access to all Growth plan features, including explainable AI scoring and integrations."
    },
    {
      question: "Can I cancel at any time?",
      answer: "Yes. There are no long-term contracts for our monthly plans. You can cancel your subscription at any time without penalty."
    }
  ]

  return (
    <ScrollEntry animation="fade-up">
      <section className="w-full bg-white py-[80px]">
        <div className="mx-auto max-w-[900px] px-5 md:px-10">
          <div className="flex flex-col md:flex-row md:gap-16">
            
            {/* Left Header */}
            <div className="md:w-1/2 md:sticky md:top-[88px] h-fit">
              <span className="font-body text-[12px] font-bold uppercase tracking-wider text-neutral-500">
                FAQ
              </span>
              <h2 className="mt-4 font-display text-[32px] md:text-[40px] font-bold leading-tight text-neutral-900 tracking-tight">
                Frequently asked questions
              </h2>
              <p className="mt-4 font-body text-[15px] text-neutral-600">
                Can't find your answer?
              </p>
              <a href="#" className="mt-3 inline-block font-body text-[15px] font-medium text-primary-500 hover:text-primary-600 hover:underline">
                Chat with us
              </a>
            </div>

            {/* Right Accordion */}
            <div className="mt-12 md:mt-0 md:w-1/2">
              <div className="flex flex-col">
                {faqs.map((faq, i) => (
                  <FAQItem key={i} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </ScrollEntry>
  )
}
