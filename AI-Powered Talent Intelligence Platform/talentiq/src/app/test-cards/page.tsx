"use client"

import * as React from "react"
import { Users, Briefcase, TrendingUp } from "lucide-react"

import { Card, GlassCard } from "@/components/ui/card"
import { PremiumStatCard } from "@/components/dashboard/PremiumStatCard"
import { KanbanCandidateCard } from "@/components/dashboard/KanbanCandidateCard"
import { AIScoreDetailCard } from "@/components/dashboard/AIScoreDetailCard"
import {
  BentoFeatureCard,
  BentoStatCard,
  BentoSocialCard,
} from "@/components/marketing/BentoGridCard"
import { FeatureCard } from "@/components/marketing/FeatureCard"
import { PricingCard } from "@/components/marketing/PricingCard"
import { TestimonialCard } from "@/components/marketing/TestimonialCard"

export default function CardsTestPage() {
  return (
    <div className="min-h-screen bg-neutral-50 p-8 font-body">
      <div className="mx-auto max-w-5xl space-y-16">
        <div>
          <h1 className="font-display text-3xl font-bold text-neutral-900 mb-2">Card Components Test</h1>
          <p className="text-neutral-500 text-lg">Testing all card variants from Section 2.3</p>
        </div>

        {/* Base Card */}
        <section className="space-y-6">
          <h2 className="border-b pb-2 font-display text-xl font-semibold">1. Base Card</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <h3 className="font-semibold text-lg mb-2">Standard Card</h3>
              <p className="text-neutral-600">This is a basic card with default padding, border, and shadow. It does not have a hover effect.</p>
            </Card>
            <Card hoverable>
              <h3 className="font-semibold text-lg mb-2">Hoverable Card</h3>
              <p className="text-neutral-600">This card elevates and adds a shadow on hover. Try interacting with it.</p>
            </Card>
          </div>
        </section>

        {/* Premium Stat Card */}
        <section className="space-y-6">
          <h2 className="border-b pb-2 font-display text-xl font-semibold">2. Premium Stat Card (Dashboard)</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <PremiumStatCard
              title="Total Active Candidates"
              value="2,845"
              icon={Users}
              deltaValue="12.5%"
              deltaType="positive"
              periodLabel="vs last month"
              sparklineData={[400, 300, 550, 450, 700, 650, 800]}
              colorVariant="primary"
            />
            <PremiumStatCard
              title="Time to Hire (Days)"
              value="18.2"
              icon={TrendingUp}
              deltaValue="4.1%"
              deltaType="negative"
              periodLabel="vs last month"
              sparklineData={[25, 24, 22, 20, 19, 18.5, 18.2]}
              colorVariant="accent"
            />
            <PremiumStatCard
              title="Open Positions"
              value="34"
              icon={Briefcase}
              deltaValue="2"
              deltaType="positive"
              periodLabel="new this week"
              colorVariant="primary"
            />
          </div>
        </section>

        {/* Kanban Candidate Card */}
        <section className="space-y-6">
          <h2 className="border-b pb-2 font-display text-xl font-semibold">3. Kanban Candidate Card</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4 items-start bg-neutral-100 p-6 rounded-xl border border-neutral-200">
            <KanbanCandidateCard
              name="Eleanor Shellstrop"
              role="Senior Product Designer"
              daysInStage={4}
              aiScore={92}
              sourcePillLabel="Referral"
              recruiterAvatarUrl="https://i.pravatar.cc/150?u=r1"
            />
            <KanbanCandidateCard
              name="Chidi Anagonye"
              role="Ethics Professor"
              daysInStage={12}
              aiScore={75}
              sourcePillLabel="LinkedIn"
              recruiterAvatarUrl="https://i.pravatar.cc/150?u=r2"
            />
            <KanbanCandidateCard
              name="Jason Mendoza"
              role="Amateur DJ"
              daysInStage={2}
              aiScore={42}
              sourcePillLabel="Applied"
              recruiterAvatarUrl="https://i.pravatar.cc/150?u=r3"
            />
            <KanbanCandidateCard
              name="Tahani Al-Jamil"
              role="Event Coordinator"
              daysInStage={1}
              aiScore={88}
              sourcePillLabel="Sourced"
              recruiterAvatarUrl="https://i.pravatar.cc/150?u=r4"
              isSelected
            />
          </div>
        </section>

        {/* AI Score Detail Card */}
        <section className="space-y-6">
          <h2 className="border-b pb-2 font-display text-xl font-semibold">4. AI Score Detail Card</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            <AIScoreDetailCard
              score={92}
              subscores={[
                { label: "Technical Skills", percent: 95 },
                { label: "Experience Match", percent: 88 },
                { label: "Culture Fit", percent: 90 },
              ]}
              strengths={["React Expert", "5+ years enterprise", "Strong leadership"]}
              gaps={["No GraphQL experience"]}
            />
            <AIScoreDetailCard
              score={68}
              subscores={[
                { label: "Technical Skills", percent: 60 },
                { label: "Experience Match", percent: 75 },
                { label: "Culture Fit", percent: 80 },
              ]}
              strengths={["Eager learner", "Good communication"]}
              gaps={["Missing key framework", "Junior level"]}
            />
          </div>
        </section>

        {/* Bento Grid */}
        <section className="space-y-6">
          <h2 className="border-b pb-2 font-display text-xl font-semibold">5. Bento Grid Cards (Marketing)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:grid-cols-[1.4fr_1fr_1fr]">
            <BentoFeatureCard />
            <BentoStatCard />
            <BentoSocialCard />
          </div>
        </section>

        {/* Feature Card */}
        <section className="space-y-6">
          <h2 className="border-b pb-2 font-display text-xl font-semibold">6. Feature Card (Marketing)</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            <FeatureCard
              title="Automated Sourcing"
              description="Our AI continuously scans millions of profiles to find the perfect match for your open roles before you even ask."
              icon={Users}
            />
            <FeatureCard
              title="Bias Reduction"
              description="Evaluate candidates strictly on their skills and experience, hiding demographic data during the initial screening."
              icon={Briefcase}
              colorVariant="accent"
            />
            <FeatureCard
              title="Predictive Analytics"
              description="Forecast time-to-hire and identify bottlenecks in your pipeline using historical data and market trends."
              icon={TrendingUp}
            />
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="space-y-6">
          <h2 className="border-b pb-2 font-display text-xl font-semibold">7. Pricing Card</h2>
          <div className="grid gap-6 md:grid-cols-3 items-center">
            <PricingCard
              planName="Starter"
              price="$299"
              subLine="Perfect for small teams hiring up to 5 roles."
              features={["Up to 5 active jobs", "Basic AI screening", "Email support", "Standard integrations"]}
              buttonText="Start Free Trial"
            />
            <PricingCard
              planName="Growth"
              price="$799"
              subLine="For scaling companies with constant hiring needs."
              features={["Unlimited active jobs", "Advanced AI analytics", "Priority 24/7 support", "Custom ATS integrations", "Dedicated account manager"]}
              buttonText="Get Started"
              isFeatured
            />
            <PricingCard
              planName="Enterprise"
              price="Custom"
              period=""
              subLine="Tailored solutions for large organizations."
              features={["Unlimited everything", "Custom AI models", "SSO & Advanced Security", "SLA guarantees", "On-premise deployment options"]}
              buttonText="Contact Sales"
            />
          </div>
        </section>

        {/* Testimonial Card */}
        <section className="space-y-6">
          <h2 className="border-b pb-2 font-display text-xl font-semibold">8. Testimonial Card</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <TestimonialCard
              quote="TalentIQ completely transformed how we hire. We're finding better candidates in half the time, and our engineering team loves the quality of the pipeline."
              authorName="Michael Chen"
              authorTitle="Director of Engineering"
              authorCompany="CloudScale"
              authorAvatarUrl="https://i.pravatar.cc/150?u=m1"
              metricCallout="Cut time-to-hire by 45%"
            />
            <TestimonialCard
              quote="The bias reduction features alone make this platform worth it. We've seen a 30% increase in diverse hires since switching to TalentIQ."
              authorName="Jessica Alba"
              authorTitle="VP of Talent"
              authorCompany="Innovate Inc"
              authorAvatarUrl="https://i.pravatar.cc/150?u=j1"
              metricCallout="Increased diversity by 30%"
            />
          </div>
        </section>

        {/* Glass Card */}
        <section className="space-y-6">
          <h2 className="border-b pb-2 font-display text-xl font-semibold">9. Glass Card</h2>
          {/* Simulated dark section background */}
          <div className="rounded-2xl bg-neutral-900 p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute top-0 left-0 w-64 h-64 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            
            <div className="relative z-10 grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto">
              <GlassCard>
                <h3 className="font-display text-xl font-bold mb-2">Secure by Design</h3>
                <p className="text-white/80">Enterprise-grade security built into every layer of the platform.</p>
              </GlassCard>
              <GlassCard>
                <h3 className="font-display text-xl font-bold mb-2">Global Compliance</h3>
                <p className="text-white/80">Fully compliant with GDPR, CCPA, and global data protection laws.</p>
              </GlassCard>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
