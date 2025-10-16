import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjectWizard, TierInfo } from "@/hooks/useProjectWizard";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

const MicrophoneIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v6a3.75 3.75 0 1 1-7.5 0v-6Z" />
    <path d="M5.25 10.5a.75.75 0 0 0-1.5 0v.75a7.5 7.5 0 0 0 6.75 7.47V21H8.25a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-2.25v-2.28a7.5 7.5 0 0 0 6.75-7.47v-.75a.75.75 0 0 0-1.5 0v.75a6 6 0 1 1-12 0v-.75Z" />
  </svg>
);

const LightBulbIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M12 2.25a7.5 7.5 0 0 0-4.41 13.59c.535.413.91.935 1.114 1.51h6.592c.204-.575.579-1.097 1.114-1.51A7.5 7.5 0 0 0 12 2.25Z"
      clipRule="evenodd"
    />
    <path d="M9.528 18h4.944a1.5 1.5 0 0 1 1.5 1.5v.75A1.5 1.5 0 0 1 14.472 21h-4.944A1.5 1.5 0 0 1 8.028 20.25v-.75A1.5 1.5 0 0 1 9.528 18Z" />
  </svg>
);

const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M11.484 2.132a.75.75 0 0 1 .532 0l7.5 2.75a.75.75 0 0 1 .484.705v6.472a11.25 11.25 0 0 1-7.136 10.455l-1.546.6a.75.75 0 0 1-.552 0l-1.546-.6A11.25 11.25 0 0 1 3 12.059V5.587a.75.75 0 0 1 .484-.705l7.5-2.75Zm3.842 7.222a.75.75 0 0 0-1.06-1.06l-3.546 3.545-1.474-1.474a.75.75 0 1 0-1.06 1.06l2.004 2.005a.75.75 0 0 0 1.06 0l4.076-4.076Z"
      clipRule="evenodd"
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
                    "relative group flex h-full flex-col rounded-xl border-2 p-6 text-left shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
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
                  <div className="flex h-full flex-col">
                    <div className="flex min-h-[80px] flex-col items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#6B7280]">Level</p>
                    </div>

                    <h3 className="mb-4 mt-4 text-xl font-bold text-[#111827]">{tier.name}</h3>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#6B7280]">Best for</p>
                        <p className="text-sm text-[#374151] leading-[1.5]">{bestFor}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#6B7280]">What it is</p>
                        <p className="text-sm text-[#374151] leading-[1.5]">{whatItIs}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#6B7280]">Output</p>
                        <p className="text-sm text-[#374151] leading-[1.5]">{output}</p>
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
