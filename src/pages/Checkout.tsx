import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { TierInfo } from "@/hooks/useChatFlow";
import { PaymentSuccess } from "@/components/checkout/PaymentSuccess";

interface CheckoutState {
  tier: TierInfo;
  jobTitle: string;
  candidateCount: number;
  candidateSource: 'own' | 'network' | null;
  uploadedResumes?: any[];
}

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as CheckoutState;

  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!state || !state.tier) {
    navigate('/workspace');
    return null;
  }

  const { tier, jobTitle, candidateCount, candidateSource, uploadedResumes } = state;

  const candidatePoolText = candidateSource === 'own' 
    ? `${candidateCount} Candidates`
    : 'VettedAI Network';

  const handlePayment = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
    }, 2000);
  };

  const handleContinueToFolder = () => {
    navigate('/workspace/project', {
      state: {
        projectId: `proj-${Date.now()}`,
        roleTitle: jobTitle,
        tier: tier,
        candidateSource: candidateSource || 'own',
        candidateCount: candidateCount,
        uploadedResumes: uploadedResumes || [],
        status: 'awaiting',
        paymentStatus: 'paid',
        progress: {
          hoursElapsed: 0,
          totalHours: 48,
          percentage: 0,
        },
      },
    });
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center px-6">
        <div className="w-full max-w-2xl">
          <PaymentSuccess onContinue={handleContinueToFolder} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Pilot Checkout – Validation Build</h1>
          <p className="text-muted-foreground">Confirm your order and proceed to payment</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 space-y-8">
          <div className="space-y-6 text-center pb-6 border-b border-border">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Regular Price</p>
              <p className="text-4xl text-muted-foreground line-through">
                ${tier.anchorPrice}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Your Pilot Price</p>
              <div className="flex items-baseline justify-center gap-2">
                <p className="text-6xl font-bold text-primary">
                  ${tier.pilotPrice}
                </p>
                <span className="text-sm text-muted-foreground">(one-time)</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Project Details</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Role:</span>
                <span className="font-medium">{jobTitle}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Vetting Tier:</span>
                <span className="font-medium">{tier.name}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Candidates:</span>
                <span className="font-medium">{candidatePoolText}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Delivery SLA:</span>
                <span className="font-medium">48 hours to verified shortlist</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <Button 
              onClick={handlePayment} 
              disabled={isProcessing}
              size="lg" 
              className="w-full gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  Proceed to Secure Payment
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center mt-4">
              Pilot pricing helps us prioritize your shortlist and deliver exceptional results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
