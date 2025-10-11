import { useState } from "react";
import { Mic, Lightbulb, BarChart, ArrowRight } from "lucide-react";
import { ChatMessage } from "../ChatMessage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TierInfo } from "@/hooks/useChatFlow";

interface TierSelectionStepProps {
  candidateCount: number;
  onComplete: (tier: TierInfo) => void;
}

const tiers: TierInfo[] = [
  {
    id: 1,
    name: "Quick Fit Screen",
    description: "5-minute async video response to key questions about their experience and approach.",
    pricePerCandidate: 15,
  },
  {
    id: 2,
    name: "Scenario Fit",
    description: "Real work scenario with evaluation. Candidates solve a realistic problem from your domain.",
    pricePerCandidate: 35,
  },
  {
    id: 3,
    name: "Role Simulation",
    description: "Full role simulation with TI Matrix. Comprehensive assessment across all key competencies.",
    pricePerCandidate: 75,
  },
];

const tierIcons = {
  1: Mic,
  2: Lightbulb,
  3: BarChart,
};

export const TierSelectionStep = ({ candidateCount, onComplete }: TierSelectionStepProps) => {
  const [selected, setSelected] = useState<TierInfo | null>(null);

  const handleSelect = (tier: TierInfo) => {
    setSelected(tier);
  };

  const handleContinue = () => {
    if (selected) {
      onComplete(selected);
    }
  };

  return (
    <div className="space-y-6">
      <ChatMessage
        type="assistant"
        content="Choose your Proof-of-Work tier. Each tier provides deeper insight into candidate abilities."
        delay={0}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((tier) => {
          const Icon = tierIcons[tier.id];
          const isSelected = selected?.id === tier.id;

          return (
            <button
              key={tier.id}
              onClick={() => handleSelect(tier)}
              className={cn(
                "group relative p-6 rounded-xl border-2 transition-all duration-250 text-left",
                "hover:-translate-y-1 hover:shadow-md",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                isSelected
                  ? "border-primary bg-secondary/30"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">
                    Tier {tier.id}: {tier.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-2xl font-bold text-primary">
                    ${tier.pricePerCandidate}
                    <span className="text-sm font-normal text-muted-foreground"> per candidate</span>
                  </p>
                </div>
              </div>

              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-lg bg-secondary/30 border border-secondary">
            <p className="text-sm text-center">
              You're vetting <span className="font-semibold text-primary">{candidateCount} candidates</span> at{" "}
              <span className="font-semibold text-primary">Tier {selected.id}</span> ={" "}
              <span className="font-bold text-primary text-lg">${candidateCount * selected.pricePerCandidate} total</span>
            </p>
          </div>

          <div className="flex justify-center">
            <Button onClick={handleContinue} size="lg">
              Continue to Pricing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
