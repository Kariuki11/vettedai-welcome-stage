import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useProjectWizard, TierInfo } from "@/hooks/useProjectWizard";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const MicrophoneIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 6.75v3a3.75 3.75 0 0 0 7.5 0v-3a3.75 3.75 0 0 0-7.5 0Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 16.5v4.125M15.75 21H8.25M19.5 10.5v.75a7.5 7.5 0 0 1-15 0v-.75"
    />
  </svg>
);

const LightBulbIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.348 16.155a3.75 3.75 0 0 1-1.848-3.21 4.5 4.5 0 1 1 9 0 3.75 3.75 0 0 1-1.848 3.21c-.788.49-1.152 1.366-1.152 2.115v.18a1.5 1.5 0 0 1-1.5 1.5h-1.5a1.5 1.5 0 0 1-1.5-1.5v-.18c0-.749-.364-1.625-1.152-2.115Z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 21h6" />
  </svg>
);

const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3.75 4.5 6v6.75a9 9 0 0 0 5.4 8.28l1.35.57 1.35-.57a9 9 0 0 0 5.4-8.28V6L12 3.75Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m9 12.75 2.25 2.25 4.5-4.5"
    />
  </svg>
);

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
  1: MicrophoneIcon,
  2: LightBulbIcon,
  3: ShieldCheckIcon
};

export default function TierSelection() {
  const navigate = useNavigate();
  const { saveWizardState, wizardState } = useProjectWizard();
  const { toast } = useToast();

  const recommendedTierId = 2;
  const [selectedTier, setSelectedTier] = useState<TierInfo | null>(
    wizardState.selectedTier || tiers.find((tier) => tier.id === recommendedTierId) || null
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
          <div className="mb-2 text-sm text-muted-foreground">Step 3 of 4</div>
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
              const isRecommended = tier.id === recommendedTierId;
              const bestFor = tier.bestFor ?? tier.description;
              const whatItIs = tier.whatItIs ?? tier.description;
              const output = tier.output ?? "We'll summarize the signal you can expect at this level.";

              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setSelectedTier(tier)}
                  aria-pressed={isSelected}
                  className={cn(
                    "relative group h-full rounded-xl border-2 p-6 text-left shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                    isSelected
                      ? "border-primary bg-primary/10 shadow-lg"
                      : "bg-card hover:border-primary/70 hover:shadow-md",
                    !isSelected && !isRecommended && "border-border",
                    !isSelected && isRecommended && "border-primary/40"
                  )}
                >
                  {isRecommended && (
                    <span
                      className={cn(
                        "absolute right-4 top-4 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
                        isSelected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-primary/40 bg-primary/5 text-primary"
                      )}
                    >
                      Recommended
                    </span>
                  )}
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
              Continue to Review →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
