import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Target, Zap, Crown } from "lucide-react";
import { useProjectWizard, TierInfo } from "@/hooks/useProjectWizard";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const tiers: TierInfo[] = [
  {
    id: 1,
    name: "Fast Proof",
    description: "Early screening & high-volume roles.",
    anchorPrice: 0,
    pilotPrice: 0,
    features: [],
    bestFor: "Early screening & high-volume roles.",
    whatItIs: "A timed Voice Screen to check for motivation and core communication skills.",
    output: "A quick signal on candidate fit."
  },
  {
    id: 2,
    name: "Focused Proof",
    description: "Structured thinking for mid-level roles.",
    anchorPrice: 0,
    pilotPrice: 0,
    features: [],
    bestFor: "Mid-level roles where structured thinking is key.",
    whatItIs: "A Voice Screen + a Mini-Case Scenario to see how candidates reason and solve problems.",
    output: "Clear behavioral data on their thought process."
  },
  {
    id: 3,
    name: "Full Proof",
    description: "High-confidence vetting for strategic hires.",
    anchorPrice: 0,
    pilotPrice: 0,
    features: [],
    bestFor: "Senior or strategic hires where the cost of a mis-hire is high.",
    whatItIs: "A full Role Simulation task that closely mirrors the actual work they'll be doing.",
    output: "A comprehensive view of their ability, backed by verifiable proof."
  }
];

const tierIcons = {
  1: Target,
  2: Zap,
  3: Crown
};

export default function TierSelection() {
  const navigate = useNavigate();
  const { saveWizardState, wizardState } = useProjectWizard();
  const { toast } = useToast();
  
  const [selectedTier, setSelectedTier] = useState<TierInfo | null>(
    wizardState.selectedTier || null
  );

  const handleContinue = () => {
    if (!selectedTier) {
      toast({
        title: "Selection required",
        description: "Please select a Proof of Work tier to continue.",
        variant: "destructive",
      });
      return;
    }

    saveWizardState({ selectedTier });
    navigate('/workspace/new/magic-moment');
  };

  const handleBack = () => {
    navigate('/workspace/new/candidate-source');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl">
        <CardHeader>
          <div className="mb-2 text-sm text-muted-foreground">Step 3 of 5</div>
          <CardTitle className="text-3xl">How much proof do you need before you shortlist?</CardTitle>
          <CardDescription>
            Pick the experience that matches the level of certainty you want before moving candidates forward.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => {
              const Icon = tierIcons[tier.id as keyof typeof tierIcons];
              const isSelected = selectedTier?.id === tier.id;
              const bestFor = tier.bestFor ?? tier.description;
              const whatItIs = tier.whatItIs ?? tier.description;
              const output = tier.output ?? "We'll summarize the signal you can expect at this level.";

              return (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTier(tier)}
                  className={cn(
                    "p-6 rounded-lg border-2 transition-all text-left h-full",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-lg"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-primary uppercase tracking-wide">Level</p>
                      <h3 className="font-bold text-xl">{tier.name}</h3>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase">Best for</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{bestFor}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase">What it is</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{whatItIs}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase">Output</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{output}</p>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between">
            <Button onClick={handleBack} variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!selectedTier}
              size="lg"
            >
              See the Gemini Snapshot →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
