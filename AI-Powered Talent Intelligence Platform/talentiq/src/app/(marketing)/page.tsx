import * as React from "react"
import { HeroSection } from "@/components/marketing/HeroSection"
import { BentoGrid } from "@/components/marketing/BentoGrid"

export default function MarketingHomePage() {
  return (
    <>
      <HeroSection />
      <BentoGrid />
      {/* 
        Remaining sections to be built later:
        - LogoStrip
        - StatsStrip
        - AIExplainerSection
        - FeaturesShowcase
        - PipelineExplainer
        - PersonasSection
        - Integrations
        - Pricing
        - Testimonials
        - FAQ
        - FinalCTA
      */}
    </>
  )
}
