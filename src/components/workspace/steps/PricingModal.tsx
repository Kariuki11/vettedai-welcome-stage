import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TierInfo } from "@/hooks/useChatFlow";

interface PricingModalProps {
  open: boolean;
  candidateCount: number;
  tier: TierInfo | null;
  onProceed: () => void;
}

const ANCHOR_PRICE = 200;
const PILOT_PRICE = 20;

export const PricingModal = ({ open, candidateCount, tier, onProceed }: PricingModalProps) => {
  if (!tier) return null;

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Pilot Pricing</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2 text-center">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Regular Price:</p>
              <p className="text-2xl text-muted-foreground line-through">
                ${ANCHOR_PRICE}
              </p>
            </div>

            <div className="space-y-1 py-4">
              <p className="text-sm font-medium text-foreground">Your Pilot Price:</p>
              <p className="text-5xl font-bold text-primary">
                ${PILOT_PRICE}
              </p>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed px-4">
              Pilot pricing helps us prioritize your shortlist and deliver exceptional results.
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Cost Breakdown:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Candidates:</span>
                <span className="font-medium">{candidateCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tier:</span>
                <span className="font-medium">{tier.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pilot Pricing:</span>
                <span className="font-medium">${PILOT_PRICE} (one-time)</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between items-center pt-2">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold text-primary">${PILOT_PRICE}</span>
          </div>

          <Button onClick={onProceed} size="lg" className="w-full">
            Proceed to Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
