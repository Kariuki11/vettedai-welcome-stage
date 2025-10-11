import { useState, ReactNode } from "react";

export interface TierInfo {
  id: 1 | 2 | 3;
  name: string;
  description: string;
  anchorPrice: number;
  pilotPrice: number;
}

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  error?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string | ReactNode;
  timestamp: Date;
  stepId?: number;
}

export interface WorkspaceState {
  currentStep: number;
  stepHistory: number[];
  messages: ChatMessage[];
  
  jobDescription: string;
  jobSummary: string;
  jobTitle: string;
  jobSummaryConfirmed: boolean;
  candidateSource: 'own' | 'network' | null;
  uploadedResumes: UploadedFile[];
  selectedTier: TierInfo | null;
  candidateCount: number;
  
  isTyping: boolean;
  awaitingConfirmation: boolean;
}

export const useChatFlow = () => {
  const [state, setState] = useState<WorkspaceState>({
    currentStep: 1,
    stepHistory: [],
    messages: [
      {
        id: 'welcome',
        type: 'assistant',
        content: "👋 Welcome to Recruiter GPT. I'll help you vet candidates using our Proof-of-Work framework. This takes about 5 minutes. Ready to start?",
        timestamp: new Date(),
        stepId: 1,
      }
    ],
    jobDescription: '',
    jobSummary: '',
    jobTitle: '',
    jobSummaryConfirmed: false,
    candidateSource: null,
    uploadedResumes: [],
    selectedTier: null,
    candidateCount: 0,
    isTyping: false,
    awaitingConfirmation: false,
  });

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    setState(prev => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          ...message,
          id: Date.now().toString() + Math.random(),
          timestamp: new Date(),
        },
      ],
    }));
  };

  const setTyping = (isTyping: boolean) => {
    setState(prev => ({ ...prev, isTyping }));
  };

  const updateJobDescription = (jd: string, summary: string, jobTitle: string) => {
    setState(prev => ({
      ...prev,
      jobDescription: jd,
      jobSummary: summary,
      jobTitle: jobTitle,
      jobSummaryConfirmed: true,
      stepHistory: [...prev.stepHistory, prev.currentStep],
      currentStep: 2,
    }));
  };

  const updateCandidateSource = (source: 'own' | 'network') => {
    setState(prev => ({
      ...prev,
      candidateSource: source,
      stepHistory: [...prev.stepHistory, prev.currentStep],
      currentStep: source === 'own' ? 3 : 4,
    }));
  };

  const updateUploadedResumes = (resumes: UploadedFile[]) => {
    setState(prev => ({
      ...prev,
      uploadedResumes: resumes,
      candidateCount: resumes.length,
      stepHistory: [...prev.stepHistory, prev.currentStep],
      currentStep: 4,
    }));
  };

  const updateSelectedTier = (tier: TierInfo) => {
    setState(prev => ({
      ...prev,
      selectedTier: tier,
      stepHistory: [...prev.stepHistory, prev.currentStep],
      currentStep: 5,
    }));
  };

  const proceedToCheckout = () => {
    setState(prev => ({
      ...prev,
      stepHistory: [...prev.stepHistory, prev.currentStep],
      currentStep: 6,
    }));
  };

  const goToPreviousStep = () => {
    if (state.stepHistory.length === 0) return;
    
    const previousStep = state.stepHistory[state.stepHistory.length - 1];
    setState(prev => ({
      ...prev,
      currentStep: previousStep,
      stepHistory: prev.stepHistory.slice(0, -1),
    }));
  };

  const goToNextStep = () => {
    if (!canGoForward()) return;
    
    setState(prev => ({
      ...prev,
      stepHistory: [...prev.stepHistory, prev.currentStep],
      currentStep: prev.currentStep + 1,
    }));
  };

  const canGoBack = () => {
    return state.stepHistory.length > 0 && state.currentStep > 1;
  };

  const canGoForward = () => {
    switch (state.currentStep) {
      case 1:
        return state.jobSummaryConfirmed;
      case 2:
        return state.candidateSource !== null;
      case 3:
        return state.uploadedResumes.length > 0;
      case 4:
        return state.selectedTier !== null;
      case 5:
        return true;
      case 6:
        return false;
      default:
        return false;
    }
  };

  const resetFlow = () => {
    setState({
      currentStep: 1,
      stepHistory: [],
      messages: [
        {
          id: 'welcome',
          type: 'assistant',
          content: "👋 Welcome to Recruiter GPT. I'll help you vet candidates using our Proof-of-Work framework. This takes about 5 minutes. Ready to start?",
          timestamp: new Date(),
          stepId: 1,
        }
      ],
      jobDescription: '',
      jobSummary: '',
      jobTitle: '',
      jobSummaryConfirmed: false,
      candidateSource: null,
      uploadedResumes: [],
      selectedTier: null,
      candidateCount: 0,
      isTyping: false,
      awaitingConfirmation: false,
    });
  };

  return {
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
    resetFlow,
  };
};
