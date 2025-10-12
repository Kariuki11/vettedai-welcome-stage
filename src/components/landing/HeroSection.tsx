import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
interface HeroSectionProps {
  onCtaClick: () => void;
}
export const HeroSection = ({ onCtaClick }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-subtle -z-10" />

      {/* Animated UI Cards - Layered Behind Content */}
      <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-1/4 w-64 h-40 bg-secondary/30 backdrop-blur-sm rounded-lg animate-float"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute top-40 right-1/4 w-72 h-48 bg-secondary/20 backdrop-blur-sm rounded-lg animate-float"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute bottom-32 left-1/3 w-56 h-36 bg-secondary/25 backdrop-blur-sm rounded-lg animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Content Container */}
      <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-subtle border border-primary/20 text-primary text-sm font-medium mb-4">
          <Zap className="h-4 w-4" />
          The Assessment Platform for Non-Technical Roles
        </div>
        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
          Hire on Proof, <span className="text-primary">Not Promise.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-delayed">
          The resume has become the biggest lie in business. VettedAI is the intelligent workspace built to show you the
          truth: what a candidate can <em>actually</em> do.
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
          Verifiable Proof • 48-Hour Shortlists • Hire with Confidence
        </p>
      </div>
    </section>
  );
};
