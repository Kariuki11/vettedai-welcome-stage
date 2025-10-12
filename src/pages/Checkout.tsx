import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { WizardState } from "@/hooks/useProjectWizard";
import { PaymentSuccess } from "@/components/checkout/PaymentSuccess";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const wizardState = (location.state as { wizardState?: WizardState })?.wizardState;

  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);

  if (!wizardState || !wizardState.selectedTier) {
    navigate('/workspace');
    return null;
  }

  const { selectedTier, roleTitle, candidateCount, candidateSource } = wizardState;

  const candidatePoolText = candidateSource === 'own' 
    ? `${candidateCount} Candidates`
    : 'VettedAI Network';

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // First, get the recruiter ID for the current user
      const { data: recruiterData, error: recruiterError } = await supabase
        .from('recruiters')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (recruiterError || !recruiterData) {
        console.error('Error fetching recruiter:', recruiterError);
        throw new Error('Could not find recruiter profile');
      }

      // Generate project code
      const projectCode = `PROJ-${Date.now().toString(36).toUpperCase()}`;

      // Create project in database
      const { data, error } = await supabase
        .from('projects')
        .insert({
          recruiter_id: recruiterData.id,
          project_code: projectCode,
          role_title: roleTitle,
          job_description: wizardState.jobDescription,
          job_summary: wizardState.jobSummary,
          tier_id: selectedTier.id,
          tier_name: selectedTier.name,
          anchor_price: selectedTier.anchorPrice,
          pilot_price: selectedTier.pilotPrice,
          candidate_source: candidateSource || 'own',
          candidate_count: candidateCount || 0,
          status: 'awaiting',
          payment_status: 'paid',
        })
        .select()
        .single();

      if (error) throw error;
      
      setProjectId(data.id);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinueToFolder = () => {
    sessionStorage.removeItem('project_wizard_state');
    navigate('/workspace');
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
                ${selectedTier.anchorPrice}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Your Pilot Price</p>
              <div className="flex items-baseline justify-center gap-2">
                <p className="text-6xl font-bold text-primary">
                  ${selectedTier.pilotPrice}
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
                <span className="font-medium">{roleTitle}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Vetting Tier:</span>
                <span className="font-medium">{selectedTier.name}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Candidates:</span>
                <span className="font-medium">{candidatePoolText}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Delivery SLA:</span>
                <span className="font-medium">48-72 hours to verified shortlist</span>
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
