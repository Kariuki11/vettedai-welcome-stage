import { useNavigate } from "react-router-dom";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { ProgressIndicator } from "@/components/workspace/ProgressIndicator";
import { ChatContainer } from "@/components/workspace/ChatContainer";
import { NavigationControls } from "@/components/workspace/NavigationControls";
import { JobDescriptionStep } from "@/components/workspace/steps/JobDescriptionStep";
import { CandidateSourceStep } from "@/components/workspace/steps/CandidateSourceStep";
import { ResumeUploadStep } from "@/components/workspace/steps/ResumeUploadStep";
import { TierSelectionStep } from "@/components/workspace/steps/TierSelectionStep";
import { PricingSummaryStep } from "@/components/workspace/steps/PricingSummaryStep";
import { CheckoutStep } from "@/components/workspace/steps/CheckoutStep";
import { useChatFlow } from "@/hooks/useChatFlow";

const Workspace = () => {
  const navigate = useNavigate();
  const {
    state,
    addMessage,
    setTyping,
    updateJobDescription,
    updateCandidateSource,
    updateUploadedResumes,
    updateSelectedTier,
    proceedToCheckout,
    goToPreviousStep,
    goToNextStep,
    canGoBack,
    canGoForward,
  } = useChatFlow();

  const handleJobDescriptionComplete = (jd: string, summary: string, jobTitle: string) => {
    updateJobDescription(jd, summary, jobTitle);
  };

  const handleCandidateSourceComplete = (source: 'own' | 'network') => {
    updateCandidateSource(source);
  };

  const handleResumeUploadComplete = (files: any[]) => {
    updateUploadedResumes(files);
  };

  const handleTierSelectionComplete = (tier: any) => {
    updateSelectedTier(tier);
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout', {
      state: {
        tier: state.selectedTier,
        jobTitle: state.jobTitle,
        candidateCount: state.candidateCount,
        candidateSource: state.candidateSource,
        uploadedResumes: state.uploadedResumes,
      },
    });
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
          <>
            {!state.messages.find(m => m.content === "Let's start by understanding the role you're hiring for. Paste your Job Description below.") && (
              (() => {
                addMessage({
                  type: 'assistant',
                  content: "Let's start by understanding the role you're hiring for. Paste your Job Description below.",
                  stepId: 1,
                });
                return null;
              })()
            )}
            <JobDescriptionStep 
              onComplete={handleJobDescriptionComplete}
              onAddMessage={addMessage}
              onSetTyping={setTyping}
            />
          </>
        )}

        {state.currentStep === 2 && (
          <CandidateSourceStep 
            onComplete={handleCandidateSourceComplete}
            onAddMessage={addMessage}
          />
        )}

        {state.currentStep === 3 && state.candidateSource === 'own' && (
          <ResumeUploadStep 
            onComplete={handleResumeUploadComplete}
            onAddMessage={addMessage}
          />
        )}

        {state.currentStep === 4 && (
          <TierSelectionStep
            candidateCount={state.candidateCount || 12}
            onComplete={handleTierSelectionComplete}
            onAddMessage={addMessage}
          />
        )}

        {state.currentStep === 5 && state.selectedTier && (
          <PricingSummaryStep
            candidateCount={state.candidateCount || 12}
            tier={state.selectedTier}
            jobTitle={state.jobTitle || 'Role Title'}
            candidateSource={state.candidateSource}
            onComplete={handleProceedToCheckout}
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
