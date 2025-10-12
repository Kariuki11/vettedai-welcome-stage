import { HeroSectionV2 } from "@/components/landing/HeroSectionV2";
import { PainSection } from "@/components/landing/PainSection";
import { InsightSection } from "@/components/landing/InsightSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { WhyUsSection } from "@/components/landing/WhyUsSection";
import { FinalCtaSectionV2 } from "@/components/landing/FinalCtaSectionV2";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSectionV2 />
      <PainSection />
      <InsightSection />
      <HowItWorksSection />
      <WhyUsSection />
      <FinalCtaSectionV2 />
      <Footer />
    </div>
  );
};

export default Index;
