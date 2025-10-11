import { Button } from "@/components/ui/button";
import { ChatMessage } from "../ChatMessage";
import { ArrowRight } from "lucide-react";
import { TierInfo } from "@/hooks/useChatFlow";

interface PricingSummaryStepProps {
  candidateCount: number;
  tier: TierInfo;
  onComplete: () => void;
}

const ANCHOR_PRICE = 200;
const PILOT_PRICE = 20;

export const PricingSummaryStep = ({ 
  candidateCount, 
  tier, 
  onComplete 
}: PricingSummaryStepProps) => {
  return (
    <div className="space-y-6">
      <ChatMessage
        type="assistant"
        content={
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Pilot Pricing</h3>
              
              <div className="space-y-3 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Regular Price</p>
                  <p className="text-3xl text-muted-foreground line-through">
                    ${ANCHOR_PRICE}
                  </p>
                </div>
                
                <div className="py-4">
                  <p className="text-sm font-medium mb-2">Your Pilot Price</p>
                  <p className="text-6xl font-bold text-primary">
                    ${PILOT_PRICE}
                  </p>
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                  Pilot pricing helps us prioritize your shortlist and deliver 
                  exceptional results.
                </p>
              </div>
              
              <div className="pt-4 border-t border-border space-y-3">
                <p className="font-semibold text-sm">What's Included:</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Candidates:</span>
                    <span className="font-medium">{candidateCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vetting Tier:</span>
                    <span className="font-medium">{tier.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pilot Pricing:</span>
                    <span className="font-medium">${PILOT_PRICE} (one-time)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        delay={0}
      />
      
      <div className="flex justify-center pt-4 animate-fade-in">
        <Button onClick={onComplete} size="lg" className="gap-2">
          Proceed to Payment
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
