import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BadgeGroup } from "./BadgeSystem";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

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

  // Candidate data for the left column
  const applicants = [
    { id: 1, initials: "JD", chips: ["5y exp", "MBA"] },
    { id: 2, initials: "SK", chips: ["3y exp", "BS CS"] },
    { id: 3, initials: "AM", chips: ["7y exp", "MS Eng"] },
    { id: 4, initials: "RL", chips: ["4y exp", "BA Econ"] },
    { id: 5, initials: "TC", chips: ["6y exp", "PhD"] },
    { id: 6, initials: "NP", chips: ["2y exp", "Bootcamp"] }
  ];

  return (
    <section className="px-6 py-20 md:py-32 bg-background">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy + CTA */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Drowning in applications? You're not alone.
              </h1>
              <div className="space-y-3 text-lg md:text-xl text-muted-foreground leading-relaxed">
                <p>
                  AI has made it easy for anyone to look perfect on paper.
                </p>
                <p>
                  VettedAI helps you cut through the noise and see how people actually work, not just what they claim.
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button 
                variant="hero" 
                size="lg" 
                onClick={handleCtaClick}
                className="text-base px-8 py-6 h-auto"
              >
                Try VettedAI for your next role
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-muted-foreground">
                Built by recruiters for recruiters.
              </p>
            </div>
          </div>

          {/* Right: Two-column board with animation */}
          <div 
            className="bg-card border border-border/50 rounded-lg p-6 shadow-sm"
            aria-label="Applicants moving into Shortlist based on task results"
          >
            <div className="grid grid-cols-2 gap-6">
              {/* Left column: Applicants */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Applicants
                </h3>
                <div className="space-y-2">
                  {applicants.map((applicant, index) => (
                    <div
                      key={applicant.id}
                      className={cn(
                        "bg-muted/30 border border-border/30 rounded-lg p-3 space-y-2",
                        index < 3 && "motion-safe:animate-slide-right opacity-100"
                      )}
                      style={index < 3 ? { 
                        animationDelay: `${300 + index * 200}ms`,
                        animationFillMode: 'forwards'
                      } : undefined}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                            {applicant.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="h-2 bg-muted rounded flex-1" />
                      </div>
                      <div className="flex gap-1.5">
                        {applicant.chips.map((chip, i) => (
                          <div key={i} className="px-2 py-0.5 bg-muted/50 rounded-full text-xs text-muted-foreground">
                            {chip}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column: Shortlist (Proof met) */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">
                  Shortlist <span className="text-success">(Proof met)</span>
                </h3>
                <div className="space-y-2">
                  {[0, 1, 2].map((index) => (
                    <div
                      key={index}
                      className="bg-background border border-primary/30 rounded-lg p-3 space-y-2 motion-safe:animate-slide-right opacity-0"
                      style={{ 
                        animationDelay: `${300 + index * 200}ms`,
                        animationFillMode: 'forwards'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {applicants[index].initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="h-2 bg-foreground/80 rounded flex-1" />
                      </div>
                      <BadgeGroup 
                        animated={true}
                        className="pt-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
