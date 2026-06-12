"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageCircle, ArrowRight } from "lucide-react";
import FAQItem from "./FAQItem";

export default function FAQSection() {
  const faqs = [
    {
      question: "How does the AI scoring actually work?",
      answer:
        "TalentIQ uses a proprietary NLP model trained on millions of successful hiring outcomes to parse unstructured resume data and match it against your job requirements. It extracts skills, normalizes job titles, and evaluates the semantic context of a candidate's experience.",
    },
    {
      question: "Is TalentIQ compliant with GDPR and CCPA?",
      answer:
        "Yes. We maintain strict compliance with all major data privacy regulations. Candidate data is encrypted at rest and in transit, and we offer automated data retention policies to ensure you never hold onto PII longer than necessary.",
    },
    {
      question: "Can I use TalentIQ with my existing ATS?",
      answer:
        "Absolutely. We offer two-way sync integrations with Greenhouse, Lever, Workday, and BambooHR. You can use TalentIQ as your primary interface while data stays perfectly synced with your system of record.",
    },
    {
      question: "How accurate is the bias detection?",
      answer:
        "Our bias detection engine flags over 85 categories of exclusionary language, from gendered pronouns to subtle ageism markers. It's continuously updated by our compliance team and achieves a 98% true positive rate.",
    },
    {
      question: "What happens when my AI score quota runs out?",
      answer:
        "Your pipeline never stops working. You will still receive applications, but they will not be automatically scored until your billing cycle resets or you choose to upgrade your plan mid-cycle.",
    },
    {
      question: "Do candidates know their application was AI-scored?",
      answer:
        "Transparency is key to good candidate experience. We provide customizable disclosure templates you can include on your application forms to ensure candidates are aware of how their data is processed.",
    },
    {
      question: "How long does the free trial last?",
      answer:
        "Our free trial lasts 14 days and gives you full access to all Growth plan features. No credit card is required to start, and you can invite up to 5 team members to evaluate the platform with you.",
    },
    {
      question: "Can I cancel at any time?",
      answer:
        "Yes. All our plans are available on a month-to-month basis with no long-term lock-in. If you cancel, your subscription will remain active until the end of your current billing period.",
    },
  ];

  return (
    <section className="bg-[#FAFAFA] py-24 md:py-32 relative overflow-hidden border-t border-neutral-100">
      {/* Ambient Background Glow (Top Left) */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#3B58F6]/10 via-transparent to-transparent blur-[120px] pointer-events-none z-0" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 lg:gap-24">
          {/* Left Column (Sticky Content & Contact Card) */}
          <div className="lg:sticky lg:top-32 h-fit flex flex-col">
            {/* Premium Badge Pill */}
            <div className="inline-flex items-center gap-2 h-8 bg-white border border-neutral-200/80 rounded-full px-3.5 shadow-sm mb-6 w-fit">
              <MessageCircle className="w-3.5 h-3.5 text-[#3B58F6]" />
              <span className="font-body text-[12px] font-bold text-neutral-600 tracking-wider uppercase">
                Support & FAQ
              </span>
            </div>

            <h2 className="font-display text-[36px] md:text-[48px] font-extrabold text-[#0A101D] mt-2 leading-[1.1] tracking-tight">
              Got questions? <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B58F6] to-[#8B5CF6]">
                We've got answers.
              </span>
            </h2>

            <p className="font-body text-[18px] text-neutral-600 mt-5 leading-relaxed max-w-[400px]">
              Everything you need to know about the product, billing,
              integrations, and how our AI works.
            </p>

            {/* Premium Contact Card / Image Visual */}
            <div className="mt-12 bg-white rounded-[24px] p-6 md:p-8 border border-neutral-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
              {/* Subtle inner hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#3B58F6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10">
                {/* Visual Image/Avatar Element */}
                <div className="flex -space-x-4 mb-8">
                  {/* You can replace these src paths with your actual team images */}
                  <div className="w-14 h-14 rounded-full border-[3px] border-white bg-neutral-200 overflow-hidden relative shadow-sm z-30">
                    <Image
                      src="/images/avatar-1.png"
                      alt="Support Team Member"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="w-14 h-14 rounded-full border-[3px] border-white bg-neutral-300 overflow-hidden relative shadow-sm z-20">
                    <Image
                      src="/images/avatar-2.png"
                      alt="Support Team Member"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="w-14 h-14 rounded-full border-[3px] border-white bg-blue-100 flex items-center justify-center relative shadow-sm z-10">
                    <span className="font-body text-[13px] font-bold text-[#3B58F6]">
                      +4
                    </span>
                  </div>
                </div>

                <h3 className="font-display text-[20px] font-bold text-neutral-900">
                  Still have questions?
                </h3>
                <p className="font-body text-[14px] text-neutral-500 mt-2.5 leading-relaxed">
                  Our dedicated support team is available 24/7 to help you set
                  up your workspace and integrate your tools.
                </p>

                {/* Primary CTA */}
                <Link
                  href="/contact"
                  className="mt-8 group/btn inline-flex items-center justify-center w-full h-12 rounded-xl bg-[#0A101D] hover:bg-[#1a2333] text-white font-body text-[15px] font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  Chat with our team
                  <ArrowRight className="w-4 h-4 ml-2 text-neutral-400 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:text-white" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column (FAQ List) */}
          <div className="flex flex-col gap-4 pt-4 lg:pt-0">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
