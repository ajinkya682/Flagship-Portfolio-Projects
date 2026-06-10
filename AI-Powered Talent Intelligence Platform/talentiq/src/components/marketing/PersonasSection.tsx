import * as React from "react"
import { Users, UserCheck, BarChart, Star, CheckCircle } from "lucide-react"
import { ScrollEntry } from "@/components/shared/ScrollEntry"

function PersonaCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  pain,
  solution,
  features
}: {
  icon: React.ElementType
  iconBg: string
  iconColor: string
  title: string
  pain: string
  solution: string
  features: string[]
}) {
  return (
    <div className="group flex flex-col rounded-[var(--radius-xl)] bg-white p-8 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      {/* Icon */}
      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg}`}>
        <Icon size={20} className={iconColor} />
      </div>

      <h3 className="mt-4 font-display text-[17px] font-semibold text-neutral-900">{title}</h3>
      
      <p className="mt-2 font-body text-[13px] italic text-neutral-500">
        Before TalentIQ: {pain}
      </p>
      
      <p className="mt-2 font-body text-[13px] text-neutral-700">
        {solution}
      </p>

      <div className="my-4 h-[1px] w-full bg-neutral-100" />

      <ul className="flex flex-col gap-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle size={14} className="mt-0.5 shrink-0 text-accent-500" />
            <span className="font-body text-[12px] text-neutral-700">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function PersonasSection() {
  const personas = [
    {
      title: "Recruiters",
      icon: Users,
      iconBg: "bg-primary-50",
      iconColor: "text-primary-500",
      pain: '"Drowning in 400 resumes per role."',
      solution: "Instantly see the top 10% of applicants ranked by actual requirements.",
      features: ["Automated pre-screening", "Bulk actions", "Source tracking"]
    },
    {
      title: "Hiring Managers",
      icon: UserCheck,
      iconBg: "bg-accent-50",
      iconColor: "text-accent-500",
      pain: '"Guessing which candidates matter."',
      solution: "Review candidates with explainable scorecards showing exact skill matches.",
      features: ["Clear scorecards", "Interview guides", "Feedback loops"]
    },
    {
      title: "HR Leaders",
      icon: BarChart,
      iconBg: "bg-primary-50",
      iconColor: "text-primary-500",
      pain: '"No visibility until it\'s too late."',
      solution: "Track pipeline velocity, bottleneck metrics, and ROI in real-time.",
      features: ["Pipeline analytics", "Diversity tracking", "Custom reports"]
    },
    {
      title: "Candidates",
      icon: Star,
      iconBg: "bg-accent-50",
      iconColor: "text-accent-500",
      pain: '"Applying blind, hearing nothing."',
      solution: "Get faster responses and fairer evaluations based on skills, not keywords.",
      features: ["Faster feedback", "Fair evaluations", "Clear process"]
    }
  ]

  return (
    <ScrollEntry animation="fade-up">
      <section className="w-full bg-neutral-50 py-[96px]">
        <div className="mx-auto max-w-[1100px] px-5 md:px-10 lg:px-[80px]">
          
          <div className="mx-auto max-w-[600px] text-center">
            <span className="font-body text-[12px] font-bold uppercase tracking-wider text-neutral-500">
              BUILT FOR EVERY STAKEHOLDER
            </span>
            <h2 className="mt-4 font-display text-[32px] md:text-[40px] font-bold leading-tight text-neutral-900 tracking-tight">
              One platform, every perspective.
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {personas.map((p, i) => (
              <PersonaCard key={i} {...p} />
            ))}
          </div>

        </div>
      </section>
    </ScrollEntry>
  )
}
