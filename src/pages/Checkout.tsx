import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { WizardState } from "@/hooks/useProjectWizard";
import { PaymentSuccess } from "@/components/checkout/PaymentSuccess";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const wizardState = useMemo(() => {
    const stateWizard = (location.state as { wizardState?: WizardState })?.wizardState;

    if (stateWizard?.selectedTier) {
      return stateWizard;
    }

    const stored = sessionStorage.getItem('project_wizard_state');
    if (!stored) {
      return undefined;
    }

    try {
      const parsed = JSON.parse(stored) as WizardState;
      return parsed?.selectedTier ? parsed : undefined;
    } catch (error) {
      console.warn('Failed to parse stored wizard state', error);
      return undefined;
    }
  }, [location.state]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (!wizardState || !wizardState.selectedTier) {
      navigate('/workspace');
    }
  }, [wizardState, navigate]);

  if (!wizardState || !wizardState.selectedTier) {
    return null;
  }

  const { selectedTier, roleTitle, candidateCount, candidateSource } = wizardState;

  const candidatePoolText = candidateSource === 'own' 
    ? `${candidateCount} Candidates`
    : 'VettedAI Network';

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      console.log('Starting project creation...');
      
      if (!user) {
        console.error('No authenticated user found');
        throw new Error('You must be logged in to create a project');
      }

      console.log('User authenticated:', user.id);

      // Validate wizard state
      const hasMissingCount =
        candidateCount === undefined || candidateCount === null;

      if (!roleTitle || !selectedTier || hasMissingCount) {
        console.error('Incomplete wizard state:', wizardState);
        throw new Error('Please complete all project details before proceeding');
      }

      // Create project using server-side RPC
      const { data: projectId, error: projectError } = await supabase
        .rpc('create_project_for_current_user', {
          _role_title: roleTitle,
          _job_description: wizardState.jobDescription || '',
          _job_summary: wizardState.jobSummary || '',
          _tier_id: parseInt(selectedTier.id.toString()),
          _tier_name: selectedTier.name,
          _anchor_price: parseFloat(selectedTier.anchorPrice.toString()),
          _pilot_price: parseFloat(selectedTier.pilotPrice.toString()),
          _candidate_source: candidateSource || 'own',
          _candidate_count: candidateCount || 0,
        });

      if (projectError) {
        console.error('Error creating project:', projectError);
        throw new Error(projectError.message.includes('No recruiter profile')
          ? 'Recruiter profile not found. Please complete your profile setup.'
          : `Failed to create project: ${projectError.message}`);
      }

      if (!projectId) {
        console.error('No project ID returned');
        throw new Error('Project creation failed - no ID returned');
      }

      console.log('Project created successfully:', projectId);
      setCreatedProjectId(projectId);

      // Ensure the recruiter dashboard reflects the new project immediately
      await queryClient.invalidateQueries({ queryKey: ['user-projects'] });

      // Log analytics event (non-blocking)
      try {
        await supabase.from('analytics_events').insert({
          event_type: 'project_created',
          user_id: user.id,
          project_id: projectId,
          metadata: {
            tier: selectedTier.name,
            candidate_count: candidateCount,
          },
        });
      } catch (analyticsError) {
        console.warn('Analytics logging failed:', analyticsError);
      }
      
      setShowSuccess(true);
    } catch (error) {
      console.error('Error creating project:', error);
      const message = error instanceof Error
        ? error.message
        : 'Failed to create project. Please try again or contact support.';
      alert(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinueToFolder = async () => {
    sessionStorage.removeItem('project_wizard_state');
    // Wait a moment to ensure database transaction completes
    await new Promise(resolve => setTimeout(resolve, 1000));
    navigate('/workspace', {
      state: {
        refetch: true,
        refetchToken: Date.now(),
        lastCreatedProjectId: createdProjectId,
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
