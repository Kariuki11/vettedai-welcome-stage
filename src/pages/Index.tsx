import { useState } from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { CredibilityBand } from "@/components/landing/CredibilityBand";
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
      <BenefitsSection />
      <CredibilityBand />
      <Footer />
      
      <OnboardingWizard 
        open={showOnboarding} 
        onOpenChange={setShowOnboarding} 
      />
    </div>
  );
};

export default Index;
