import { HeroSection } from "@/components/landing/v1/HeroSection";
import { WhyItMattersSection } from "@/components/landing/v1/WhyItMattersSection";
import { PerformanceGraphSection } from "@/components/landing/v1/PerformanceGraphSection";
import { ProductSection } from "@/components/landing/v1/ProductSection";
import { FoundersNoteSection } from "@/components/landing/v1/FoundersNoteSection";
import { FinalCtaSection } from "@/components/landing/v1/FinalCtaSection";
import { Footer } from "@/components/landing/v1/Footer";

const IndexV1 = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <WhyItMattersSection />
      <PerformanceGraphSection />
      <ProductSection />
      <FoundersNoteSection />
      <FinalCtaSection />
      <Footer />
    </div>
  );
};

export default IndexV1;