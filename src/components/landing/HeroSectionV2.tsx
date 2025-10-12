import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeroSectionV2Props {
  onCtaClick?: () => void;
}

export const HeroSectionV2 = ({ onCtaClick }: HeroSectionV2Props) => {
  const navigate = useNavigate();
  
  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      navigate('/signup');
    }
  };

  return (
    <section className="px-6 py-20 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left: Copy + CTA */}
          <div className="space-y-6 md:space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Drowning in applications? You're not alone.
            </h1>
            <div className="space-y-4 text-lg md:text-xl text-muted-foreground">
              <p>
                AI has made it easy for anyone to look perfect on paper.
              </p>
              <p>
                VettedAI helps you cut through the noise and see how people actually work, not just what they claim.
              </p>
            </div>
            <div className="pt-4">
              <Button 
                variant="hero" 
                size="lg" 
                onClick={handleCtaClick}
                className="text-base px-8 py-6 h-auto"
              >
                Try VettedAI for your next role
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Built by recruiters for recruiters.
              </p>
            </div>
          </div>

          {/* Right: Faux-UI "Shortlist Forming" Animation */}
          <div className="relative min-h-[500px] flex items-center justify-center">
            {/* Shortlist Group Container (top) */}
            <div className="absolute top-0 left-0 right-0 space-y-3 motion-safe:animate-fade-in">
              <div className="text-sm font-medium text-muted-foreground mb-2 px-2">Shortlist</div>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={`shortlist-${i}`}
                    className="bg-card border border-primary/30 rounded-lg p-4 shadow-elegant motion-safe:animate-slide-up-delayed"
                    style={{ 
                      animationDelay: `${300 + i * 150}ms`,
                      animationFillMode: 'backwards'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-muted rounded w-32" />
                        <div className="h-2 bg-muted rounded w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Candidate Pool (bottom) */}
            <div className="absolute bottom-0 left-0 right-0 space-y-3">
              <div className="text-sm font-medium text-muted-foreground mb-2 px-2">Candidates</div>
              <div className="grid grid-cols-2 gap-2">
                {[4, 5, 6, 7].map((i) => (
                  <div
                    key={`candidate-${i}`}
                    className="bg-card border border-border rounded-lg p-3 motion-safe:animate-fade-in"
                    style={{ 
                      animationDelay: `${i * 100}ms`,
                      animationFillMode: 'backwards'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-2 bg-muted rounded w-20" />
                        <div className="h-1.5 bg-muted rounded w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};