import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  onCtaClick?: () => void;
}

export const HeroSection = ({ onCtaClick }: HeroSectionProps) => {
  const navigate = useNavigate();
  
  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      navigate('/signup');
    }
  };
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
          <Sparkles className="h-4 w-4" />
          The Talent Intelligence Workspace
        </div>
        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
          Hire on proof, <span className="text-primary">not promise.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-delayed">
          Drowning in perfect resumes that fall apart at interview? VettedAI lets you see how people actually work—so you
          can move forward with confidence, not guesswork.
        </p>

        {/* CTA Button */}
        <div className="pt-6 animate-slide-in-up">
          <Button variant="hero" size="lg" onClick={handleCtaClick} className="text-base px-7 py-4 h-auto">
            Create my recruiter workspace
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Trust Badge */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4 animate-fade-in-delayed">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Verifiable proof in 48-72 hours
        </div>
      </div>
    </section>
  );
};
