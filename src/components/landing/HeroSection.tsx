import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
interface HeroSectionProps {
  onCtaClick: () => void;
}
export const HeroSection = ({
  onCtaClick
}: HeroSectionProps) => {
  return <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-subtle -z-10" />
      
      {/* Content Container */}
      <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
          Hire on Proof, <span className="text-primary">Not Promise.</span>
        </h1>
        
        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-delayed">
          The era of the resume is over. VettedAI is the first intelligent workspace designed for recruiters to see what candidates can actually do. Go from a noisy pipeline to a confident decision, backed by verifiable proof.
        </p>
        
        {/* CTA Button */}
        <div className="pt-6 animate-slide-in-up">
          <Button variant="hero" size="lg" onClick={onCtaClick} className="text-base px-8 py-6 h-auto">
            Create My Recruiter Workspace
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        
        {/* Trust Badge */}
        <p className="text-sm text-muted-foreground pt-4 animate-fade-in-delayed">
          See True Ability • Decide in Days, Not Weeks • Your Intelligent Workspace
        </p>
      </div>
    </section>;
};