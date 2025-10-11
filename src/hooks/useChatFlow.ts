import { useState } from "react";

export interface TierInfo {
  id: 1 | 2 | 3;
  name: string;
  description: string;
  pricePerCandidate: number;
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

export interface WorkspaceState {
  currentStep: number;
  jobDescription: string;
  jobSummary: string;
  candidateSource: 'own' | 'network' | null;
  uploadedResumes: UploadedFile[];
  selectedTier: TierInfo | null;
  totalCost: number;
  candidateCount: number;
}

export const useChatFlow = () => {
  const [state, setState] = useState<WorkspaceState>({
    currentStep: 1,
    jobDescription: '',
    jobSummary: '',
    candidateSource: null,
    uploadedResumes: [],
    selectedTier: null,
    totalCost: 0,
    candidateCount: 0,
  });

  const updateJobDescription = (jd: string, summary: string) => {
    setState(prev => ({
      ...prev,
      jobDescription: jd,
      jobSummary: summary,
      currentStep: 2,
    }));
  };

  const updateCandidateSource = (source: 'own' | 'network') => {
    setState(prev => ({
      ...prev,
      candidateSource: source,
      currentStep: source === 'own' ? 3 : 4,
    }));
  };

  const updateUploadedResumes = (resumes: UploadedFile[]) => {
    setState(prev => ({
      ...prev,
      uploadedResumes: resumes,
      candidateCount: resumes.length,
      currentStep: 4,
    }));
  };

  const updateSelectedTier = (tier: TierInfo) => {
    setState(prev => ({
      ...prev,
      selectedTier: tier,
      totalCost: prev.candidateCount * tier.pricePerCandidate,
      currentStep: 5,
    }));
  };

  const proceedToCheckout = () => {
    setState(prev => ({
      ...prev,
      currentStep: 6,
    }));
  };

  const resetFlow = () => {
    setState({
      currentStep: 1,
      jobDescription: '',
      jobSummary: '',
      candidateSource: null,
      uploadedResumes: [],
      selectedTier: null,
      totalCost: 0,
      candidateCount: 0,
    });
  };

  return {
    state,
    updateJobDescription,
    updateCandidateSource,
    updateUploadedResumes,
    updateSelectedTier,
    proceedToCheckout,
    resetFlow,
  };
};
