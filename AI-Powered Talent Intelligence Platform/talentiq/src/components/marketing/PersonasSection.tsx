'use client'

import { Users, UserCheck, BarChart2, Star } from 'lucide-react'
import PersonaCard from './PersonaCard'
import AnimatedGrid from './AnimatedGrid'

export default function PersonasSection() {
  const personas = [
    {
      icon: Users,
      iconColor: '#2563EB',
      iconBg: '#EFF6FF',
      title: 'Recruiters',
      pain: 'Before TalentIQ: drowning in 400 resumes per role.',
      solution: 'Now: score, rank, and explain automatically.',
      bullets: [
        'Score every applicant in seconds',
        'Filter by match, not just keywords',
        'Spend time on top 10% only'
      ]
    },
    {
      icon: UserCheck,
      iconColor: '#10B981',
      iconBg: '#ECFDF5',
      title: 'Hiring Managers',
      pain: 'Before TalentIQ: guessing which candidates actually matter.',
      solution: 'Now: see data-backed recommendations.',
      bullets: [
        'Understand why each score was given',
        'Compare finalists side by side',
        'Submit scorecards from one place'
      ]
    },
    {
      icon: BarChart2,
      iconColor: '#2563EB',
      iconBg: '#EFF6FF',
      title: 'HR Leaders',
      pain: 'Before TalentIQ: no visibility until it was too late.',
      solution: 'Now: full pipeline analytics in real time.',
      bullets: [
        'Track team performance and speed',
        'Identify bottlenecks before they compound',
        'Prove ROI on every open role'
      ]
    },
    {
      icon: Star,
      iconColor: '#10B981',
      iconBg: '#ECFDF5',
      title: 'Candidates',
      pain: 'Before TalentIQ: applying blind and hearing nothing.',
      solution: 'Now: tracked and notified at every stage.',
      bullets: [
        'Real-time application status',
        'Professional application portal',
        'Clear communication at every step'
      ]
    }
  ]

  return (
    <section className="bg-[#F9FAFB] py-24">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 lg:px-8 xl:px-12">
        
        {/* Header */}
        <div className="max-w-[600px] mx-auto text-center">
          <span className="overline text-[11px] font-bold text-neutral-500 tracking-widest uppercase">
            BUILT FOR EVERY STAKEHOLDER
          </span>
          <h2 className="font-display text-[32px] md:text-[40px] font-bold text-neutral-900 mt-3 leading-tight tracking-tight">
            One platform, every perspective.
          </h2>
        </div>

        {/* Grid */}
        <AnimatedGrid animation="cascade" columns={4} gap={24} className="mt-12 max-w-[1100px] mx-auto">
          {personas.map((p, i) => (
            <PersonaCard key={i} {...p} />
          ))}
        </AnimatedGrid>

      </div>
    </section>
  )
}
