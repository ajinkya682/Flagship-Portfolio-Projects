import dynamic from "next/dynamic";
import HeroSection from "@/components/marketing/HeroSection";
import LogoStrip from "@/components/marketing/LogoStrip";
import StatsStrip from "@/components/marketing/StatsStrip";
import AIExplainerSection from "@/components/marketing/AIExplainerSection";
import FeaturesShowcase from "@/components/marketing/FeaturesShowcase";
import PipelineExplainerSection from "@/components/marketing/PipelineExplainerSection";
import PersonasSection from "@/components/marketing/PersonasSection";
import IntegrationsSection from "@/components/marketing/IntegrationsSection";
import PricingSection from "@/components/marketing/PricingSection";
import TestimonialsSection from "@/components/marketing/TestimonialsSection";
import FAQSection from "@/components/marketing/FAQSection";
import FinalCTASection from "@/components/marketing/FinalCTASection";
import ScrollReveal from "@/components/marketing/ScrollReveal";
import HeroTextReveal from "@/components/marketing/HeroTextReveal";
import ScrollProgress from "@/components/marketing/ScrollProgress";

// Dynamically import heavy WebGL and GSAP horizontal scroll components
const ThreeHeroBackground = dynamic(
  () => import("@/components/marketing/ThreeHeroBackground"),
  { ssr: false },
);
const HorizontalBentoScroll = dynamic(
  () => import("@/components/marketing/HorizontalBentoScroll"),
  { ssr: false },
);

export default function MarketingHomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollProgress />

      <div className="relative">
        <ThreeHeroBackground />
        <HeroTextReveal>
          <HeroSection />
        </HeroTextReveal>
      </div>

      <HorizontalBentoScroll />

      <ScrollReveal animation="stagger" className="relative z-10 bg-white">
        <LogoStrip />
      </ScrollReveal>

      <ScrollReveal animation="cards" className="relative z-10 bg-white">
        <StatsStrip />
      </ScrollReveal>

      <ScrollReveal animation="mask" className="relative z-10 bg-white">
        <AIExplainerSection />
      </ScrollReveal>

      <ScrollReveal animation="none" className="relative z-10 bg-white">
        <FeaturesShowcase />
      </ScrollReveal>

      <ScrollReveal animation="none" className="relative z-10 bg-white">
        <PipelineExplainerSection />
      </ScrollReveal>

      <ScrollReveal animation="none" className="relative z-10 bg-white">
        <PersonasSection />
      </ScrollReveal>

      <ScrollReveal animation="none" className="relative z-10 bg-white">
        <IntegrationsSection />
      </ScrollReveal>

      <ScrollReveal animation="none" className="relative z-10 bg-white">
        <PricingSection />
      </ScrollReveal>

      <ScrollReveal animation="none" className="relative z-10 bg-white">
        <TestimonialsSection />
      </ScrollReveal>

      <ScrollReveal animation="stagger" className="relative z-10 bg-white">
        <FAQSection />
      </ScrollReveal>

      <ScrollReveal animation="mask" className="relative z-10 bg-white">
        <FinalCTASection />
      </ScrollReveal>
    </div>
  );
}
