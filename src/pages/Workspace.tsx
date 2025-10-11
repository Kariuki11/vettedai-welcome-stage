import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { ProgressIndicator } from "@/components/workspace/ProgressIndicator";
import { ChatContainer } from "@/components/workspace/ChatContainer";
import { JobDescriptionStep } from "@/components/workspace/steps/JobDescriptionStep";
import { CandidateSourceStep } from "@/components/workspace/steps/CandidateSourceStep";
import { ResumeUploadStep } from "@/components/workspace/steps/ResumeUploadStep";
import { TierSelectionStep } from "@/components/workspace/steps/TierSelectionStep";
import { PricingModal } from "@/components/workspace/steps/PricingModal";
import { CheckoutStep } from "@/components/workspace/steps/CheckoutStep";
import { useChatFlow } from "@/hooks/useChatFlow";

const Workspace = () => {
  const navigate = useNavigate();
  const {
    state,
    updateJobDescription,
    updateCandidateSource,
    updateUploadedResumes,
    updateSelectedTier,
    proceedToCheckout,
  } = useChatFlow();

  const [showPricingModal, setShowPricingModal] = useState(false);

  const handleJobDescriptionComplete = (jd: string, summary: string) => {
    updateJobDescription(jd, summary);
  };

  const handleCandidateSourceComplete = (source: 'own' | 'network') => {
    updateCandidateSource(source);
  };

  const handleResumeUploadComplete = (files: any[]) => {
    updateUploadedResumes(files);
  };

  const handleTierSelectionComplete = (tier: any) => {
    updateSelectedTier(tier);
    setShowPricingModal(true);
  };

  const handleProceedToCheckout = () => {
    setShowPricingModal(false);
    proceedToCheckout();
  };

  const handleCheckoutComplete = () => {
    // Navigate to a project folder (placeholder route)
    navigate('/workspace');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <WorkspaceHeader />
      <ProgressIndicator currentStep={state.currentStep} />
      
      <ChatContainer>
        {state.currentStep === 1 && (
          <JobDescriptionStep onComplete={handleJobDescriptionComplete} />
        )}

        {state.currentStep === 2 && (
          <CandidateSourceStep onComplete={handleCandidateSourceComplete} />
        )}

        {state.currentStep === 3 && state.candidateSource === 'own' && (
          <ResumeUploadStep onComplete={handleResumeUploadComplete} />
        )}

        {state.currentStep === 4 && (
          <TierSelectionStep
            candidateCount={state.candidateCount || 12}
            onComplete={handleTierSelectionComplete}
          />
        )}

        {state.currentStep === 6 && (
          <CheckoutStep onComplete={handleCheckoutComplete} />
        )}
      </ChatContainer>

      <PricingModal
        open={showPricingModal}
        candidateCount={state.candidateCount || 12}
        tier={state.selectedTier}
        onProceed={handleProceedToCheckout}
      />
    </div>
  );
};

export default Workspace;
