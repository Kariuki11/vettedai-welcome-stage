import { useState } from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { WhyItMattersSection } from "@/components/landing/WhyItMattersSection";
import { PerformanceGraphSection } from "@/components/landing/PerformanceGraphSection";
import { ProductSection } from "@/components/landing/ProductSection";
import { FoundersNoteSection } from "@/components/landing/FoundersNoteSection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { Footer } from "@/components/landing/Footer";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleCtaClick = () => {
    setShowOnboarding(true);
  };

  return (
    <div className="min-h-screen">
      <HeroSection onCtaClick={handleCtaClick} />
      <WhyItMattersSection />
      <PerformanceGraphSection />
      <ProductSection />
      <FoundersNoteSection />
      <FinalCtaSection onCtaClick={handleCtaClick} />
      <Footer />
      
      <OnboardingWizard 
        open={showOnboarding} 
        onOpenChange={setShowOnboarding} 
      />
    </div>
  );
};

export default Index;
