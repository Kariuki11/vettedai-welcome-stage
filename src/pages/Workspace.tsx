import { useNavigate } from "react-router-dom";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { ProgressIndicator } from "@/components/workspace/ProgressIndicator";
import { ChatContainer } from "@/components/workspace/ChatContainer";
import { NavigationControls } from "@/components/workspace/NavigationControls";
import { JobDescriptionStep } from "@/components/workspace/steps/JobDescriptionStep";
import { JDConfirmationStep } from "@/components/workspace/steps/JDConfirmationStep";
import { CandidateSourceStepV2 } from "@/components/workspace/steps/CandidateSourceStepV2";
import { CandidatePreviewStep } from "@/components/workspace/steps/CandidatePreviewStep";
import { TierSelectionStep } from "@/components/workspace/steps/TierSelectionStep";
import { ReviewProjectStep } from "@/components/workspace/steps/ReviewProjectStep";
import { useChatFlow } from "@/hooks/useChatFlow";
import type { WizardState } from "@/hooks/useProjectWizard";

const Workspace = () => {
  const navigate = useNavigate();
  const {
    state,
    addMessage,
    setTyping,
    updateJobDescription,
    updateJDConfirmation,
    updateCandidateSource,
    confirmCandidateExperience,
    updateSelectedTier,
    goToStep,
    goToPreviousStep,
    goToNextStep,
    canGoBack,
    canGoForward,
  } = useChatFlow();

  const handleJobDescriptionComplete = (jd: string, summary: string, jobTitle: string) => {
    updateJobDescription(jd, summary, jobTitle);
  };

  const handleJDConfirmationComplete = (roleTitle: string, summary: string) => {
    updateJDConfirmation(roleTitle, summary);
  };

  const handleCandidateSourceComplete = (source: 'own' | 'network', files?: any[]) => {
    updateCandidateSource(source, files);
  };

  const handleCandidatePreviewComplete = () => {
    confirmCandidateExperience();
  };

  const handleTierSelectionComplete = (tier: any) => {
    updateSelectedTier(tier);
  };

  const handleProceedToCheckout = () => {
    if (!state.selectedTier) {
      return;
    }

    const wizardState: WizardState = {
      roleTitle: state.jobTitle,
      jobSummary: state.jobSummary,
      jobDescription: state.jobDescription,
      candidateSource: state.candidateSource ?? undefined,
      uploadedResumes: state.uploadedResumes?.map((file) => ({
        name: file.name,
        size: file.size,
        status: file.status,
        progress: file.progress,
      })),
      candidateCount: state.candidateCount,
      selectedTier: state.selectedTier ? { 
        ...state.selectedTier, 
        features: state.selectedTier.features || [] 
      } : undefined,
    };

    sessionStorage.setItem('project_wizard_state', JSON.stringify(wizardState));

    navigate('/checkout', {
      state: { wizardState },
    });
  };

  const handleEditFromReview = (step: number) => {
    goToStep(step);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <WorkspaceHeader />
      <ProgressIndicator currentStep={state.currentStep} totalSteps={6} />
      
      <ChatContainer 
        messages={state.messages}
        isTyping={state.isTyping}
      >
        {state.currentStep === 1 && (
          <JobDescriptionStep 
            onComplete={handleJobDescriptionComplete}
            onAddMessage={addMessage}
            onSetTyping={setTyping}
          />
        )}

        {state.currentStep === 2 && (
          <JDConfirmationStep
            initialRoleTitle={state.jobTitle}
            initialSummary={state.jobSummary}
            onComplete={handleJDConfirmationComplete}
            onAddMessage={addMessage}
          />
        )}

        {state.currentStep === 3 && (
          <CandidateSourceStepV2 
            onComplete={handleCandidateSourceComplete}
            onAddMessage={addMessage}
          />
        )}

        {state.currentStep === 4 && (
          <CandidatePreviewStep 
            onComplete={handleCandidatePreviewComplete}
            onAddMessage={addMessage}
          />
        )}

        {state.currentStep === 5 && (
          <TierSelectionStep
            candidateCount={state.candidateCount || 12}
            onComplete={handleTierSelectionComplete}
            onAddMessage={addMessage}
          />
        )}

        {state.currentStep === 6 && state.selectedTier && (
          <ReviewProjectStep
            roleTitle={state.jobTitle || 'Role Title'}
            jobSummary={state.jobSummary || 'No summary available'}
            candidateSource={state.candidateSource || 'network'}
            candidateCount={state.candidateCount || 0}
            tier={state.selectedTier}
            onComplete={handleProceedToCheckout}
            onEdit={handleEditFromReview}
          />
        )}
      </ChatContainer>

      <NavigationControls
        canGoBack={canGoBack()}
        canGoForward={canGoForward()}
        onBack={goToPreviousStep}
        onNext={goToNextStep}
        currentStep={state.currentStep}
        totalSteps={6}
      />
    </div>
  );
};

export default Workspace;
