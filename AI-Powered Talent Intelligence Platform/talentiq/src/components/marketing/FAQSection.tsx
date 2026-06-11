import Link from 'next/link'
import FAQItem from './FAQItem'

export default function FAQSection() {
  const faqs = [
    {
      question: "How does the AI scoring actually work?",
      answer: "TalentIQ uses a proprietary NLP model trained on millions of successful hiring outcomes to parse unstructured resume data and match it against your job requirements. It extracts skills, normalizes job titles, and evaluates the semantic context of a candidate's experience."
    },
    {
      question: "Is TalentIQ compliant with GDPR and CCPA?",
      answer: "Yes. We maintain strict compliance with all major data privacy regulations. Candidate data is encrypted at rest and in transit, and we offer automated data retention policies to ensure you never hold onto PII longer than necessary."
    },
    {
      question: "Can I use TalentIQ with my existing ATS?",
      answer: "Absolutely. We offer two-way sync integrations with Greenhouse, Lever, Workday, and BambooHR. You can use TalentIQ as your primary interface while data stays perfectly synced with your system of record."
    },
    {
      question: "How accurate is the bias detection?",
      answer: "Our bias detection engine flags over 85 categories of exclusionary language, from gendered pronouns to subtle ageism markers. It's continuously updated by our compliance team and achieves a 98% true positive rate."
    },
    {
      question: "What happens when my AI score quota runs out?",
      answer: "Your pipeline never stops working. You will still receive applications, but they will not be automatically scored until your billing cycle resets or you choose to upgrade your plan mid-cycle."
    },
    {
      question: "Do candidates know their application was AI-scored?",
      answer: "Transparency is key to good candidate experience. We provide customizable disclosure templates you can include on your application forms to ensure candidates are aware of how their data is processed."
    },
    {
      question: "How long does the free trial last?",
      answer: "Our free trial lasts 14 days and gives you full access to all Growth plan features. No credit card is required to start, and you can invite up to 5 team members to evaluate the platform with you."
    },
    {
      question: "Can I cancel at any time?",
      answer: "Yes. All our plans are available on a month-to-month basis with no long-term lock-in. If you cancel, your subscription will remain active until the end of your current billing period."
    }
  ]

  return (
    <section className="bg-white py-20">
      <div className="max-w-[900px] mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12 md:gap-16">
          
          {/* Left Column (Sticky) */}
          <div className="md:sticky md:top-24 h-fit">
            <span className="overline text-[11px] font-bold text-neutral-500 tracking-widest uppercase">
              FAQ
            </span>
            <h2 className="font-display text-[28px] md:text-[32px] font-bold text-neutral-900 mt-2 leading-tight">
              Frequently asked questions.
            </h2>
            <p className="font-body text-[15px] text-neutral-600 mt-4 leading-relaxed">
              Can&apos;t find your answer?
            </p>
            <Link href="/contact" className="font-body text-[15px] font-semibold text-primary-500 hover:text-primary-600 mt-1 inline-block transition-colors">
              Chat with us
            </Link>
          </div>

          {/* Right Column (FAQ List) */}
          <div className="flex flex-col">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
