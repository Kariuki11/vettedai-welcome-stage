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

          {/* Right: Static two-column board */}
          <div className="space-y-4">
            <p className="text-xs md:text-sm text-muted-foreground">
              VettedAI in action: From 100 CVs to the few that pass the proof test.
            </p>
            <div 
              className="bg-card border border-border/50 rounded-lg p-6 shadow-sm"
              aria-label="Static view of VettedAI shortlisting: 6 applicants and 3 shortlisted candidates with proof metrics"
            >
              <div className="grid grid-cols-2 gap-6">
                {/* Left column: Applicants */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    Applicants
                  </h3>
                  <div className="space-y-2">
                    {applicants.map((applicant) => (
                      <div
                        key={applicant.id}
                        className="bg-muted/30 border border-border/30 rounded-lg p-3 space-y-2"
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
                    {[
                      { initials: "AM" },
                      { initials: "SK" },
                      { initials: "RL" }
                    ].map((candidate, index) => (
                      <div
                        key={index}
                        className="bg-background border border-primary/30 rounded-lg p-3 space-y-2 shadow-elegant"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {candidate.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="h-2 bg-foreground/80 rounded flex-1" />
                        </div>
                        <BadgeGroup 
                          animated={false}
                          className="pt-1"
                        />
                        {/* Proof strip */}
                        <div 
                          className="flex items-center gap-2 pt-2 border-t border-border/50"
                          aria-label="Proof metrics: Performance, Communication, Speed"
                        >
                          <div className="flex items-center gap-1">
                            <div className="h-1.5 w-12 bg-success rounded-full" />
                            <span className="text-[10px] text-muted-foreground">Performance</span>
                          </div>
                          <span className="text-muted-foreground text-[10px]">·</span>
                          <div className="flex items-center gap-1">
                            <div className="h-1.5 w-10 bg-primary rounded-full" />
                            <span className="text-[10px] text-muted-foreground">Communication</span>
                          </div>
                          <span className="text-muted-foreground text-[10px]">·</span>
                          <div className="flex items-center gap-1">
                            <div className="h-1.5 w-8 bg-success rounded-full" />
                            <span className="text-[10px] text-muted-foreground">Speed</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
