import * as React from "react"
import { HeroSection } from "@/components/marketing/HeroSection"
import { BentoGrid } from "@/components/marketing/BentoGrid"
import { LogoStrip } from "@/components/marketing/LogoStrip"
import { StatsStrip } from "@/components/marketing/StatsStrip"
import { AIExplainerSection } from "@/components/marketing/AIExplainerSection"
import { FeaturesShowcase } from "@/components/marketing/FeaturesShowcase"
import { PipelineExplainerSection } from "@/components/marketing/PipelineExplainerSection"
import { PersonasSection } from "@/components/marketing/PersonasSection"
import { IntegrationsSection } from "@/components/marketing/IntegrationsSection"
import { PricingSection } from "@/components/marketing/PricingSection"
import { TestimonialsSection } from "@/components/marketing/TestimonialsSection"
import { FAQSection } from "@/components/marketing/FAQSection"
import { FinalCTASection } from "@/components/marketing/FinalCTASection"

export default function MarketingHomePage() {
  return (
    <>
      <HeroSection />
      <BentoGrid />
      <LogoStrip />
      <StatsStrip />
      <AIExplainerSection />
      <FeaturesShowcase />
      <PipelineExplainerSection />
      <PersonasSection />
      <IntegrationsSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
    </>
  )
}
