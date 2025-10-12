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
    name: "Essential PoW",
    description: "Basic skills assessment",
    anchorPrice: 100,
    pilotPrice: 10,
    features: [
      "Core competency evaluation",
      "Basic problem-solving tasks",
      "48-72 hour delivery"
    ]
  },
  {
    id: 2,
    name: "Advanced PoW",
    description: "Complex problem-solving",
    anchorPrice: 150,
    pilotPrice: 15,
    features: [
      "Advanced technical challenges",
      "Real-world scenario simulation",
      "Detailed performance insights"
    ]
  },
  {
    id: 3,
    name: "Expert PoW",
    description: "Senior-level evaluation",
    anchorPrice: 300,
    pilotPrice: 30,
    features: [
      "Executive-level assessment",
      "Strategic thinking evaluation",
      "Comprehensive skill analysis"
    ]
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
    navigate('/workspace/new/review', { state: { selectedTier } });
  };

  const handleBack = () => {
    navigate('/workspace/new/candidate-preview');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl">
        <CardHeader>
          <div className="mb-2 text-sm text-muted-foreground">Step 5 of 6</div>
          <CardTitle className="text-3xl">Choose Your Proof of Work Tier</CardTitle>
          <CardDescription>
            Select the assessment depth that matches your hiring needs. All tiers are available at pilot pricing.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => {
              const Icon = tierIcons[tier.id as keyof typeof tierIcons];
              const isSelected = selectedTier?.id === tier.id;
              
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
                      <h3 className="font-bold text-xl mb-1">{tier.name}</h3>
                      <p className="text-sm text-muted-foreground">{tier.description}</p>
                    </div>
                    
                    <ul className="space-y-2">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="text-primary mt-0.5">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="pt-4 border-t">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-primary">${tier.pilotPrice}</span>
                        <span className="text-sm text-muted-foreground line-through">
                          ${tier.anchorPrice}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">One-time pilot price</p>
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
              Review Project →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
