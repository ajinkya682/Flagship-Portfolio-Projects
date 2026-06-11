import HeroSection from '@/components/marketing/HeroSection'
import BentoGrid from '@/components/marketing/BentoGrid'
import LogoStrip from '@/components/marketing/LogoStrip'
import StatsStrip from '@/components/marketing/StatsStrip'
import AIExplainerSection from '@/components/marketing/AIExplainerSection'
import FeaturesShowcase from '@/components/marketing/FeaturesShowcase'
import PipelineExplainerSection from '@/components/marketing/PipelineExplainerSection'
import PersonasSection from '@/components/marketing/PersonasSection'
import IntegrationsSection from '@/components/marketing/IntegrationsSection'
import PricingSection from '@/components/marketing/PricingSection'
import TestimonialsSection from '@/components/marketing/TestimonialsSection'
import FAQSection from '@/components/marketing/FAQSection'
import FinalCTASection from '@/components/marketing/FinalCTASection'
import SectionWrapper from '@/components/marketing/SectionWrapper'

export default function MarketingHomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <BentoGrid />
      
      <SectionWrapper delay={0}>
        <LogoStrip />
      </SectionWrapper>
      
      <SectionWrapper delay={60}>
        <StatsStrip />
      </SectionWrapper>
      
      <SectionWrapper delay={120}>
        <AIExplainerSection />
      </SectionWrapper>
      
      <SectionWrapper delay={180}>
        <FeaturesShowcase />
      </SectionWrapper>
      
      <SectionWrapper delay={240}>
        <PipelineExplainerSection />
      </SectionWrapper>
      
      <SectionWrapper delay={300}>
        <PersonasSection />
      </SectionWrapper>
      
      <SectionWrapper delay={360}>
        <IntegrationsSection />
      </SectionWrapper>
      
      <SectionWrapper delay={420}>
        <PricingSection />
      </SectionWrapper>
      
      <SectionWrapper delay={480}>
        <TestimonialsSection />
      </SectionWrapper>
      
      <SectionWrapper delay={480}>
        <FAQSection />
      </SectionWrapper>
      
      <SectionWrapper delay={480}>
        <FinalCTASection />
      </SectionWrapper>
    </div>
  )
}
