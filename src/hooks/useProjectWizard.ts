import { useState, useEffect } from "react";

export interface TierInfo {
  id: number;
  name: string;
  description: string;
  anchorPrice: number;
  pilotPrice: number;
  features: string[];
  bestFor?: string;
  whatItIs?: string;
  output?: string;
}

export interface UploadedFile {
  name: string;
  size: number;
  status: 'uploading' | 'complete' | 'error';
  progress: number;
}

export interface WizardState {
  jobDescription?: string;
  jdContent?: string;
  roleTitle?: string;
  jobSummary?: string;
  companyName?: string;
  keySkills?: string[];
  experienceLevel?: string;
  candidateSource?: 'own' | 'network';
  uploadedResumes?: UploadedFile[];
  candidateCount?: number;
  selectedTier?: TierInfo;
  projectId?: string;
  proofOfWorkTask?: string;
  evaluationCriteria?: Array<{
    name: string;
    description: string;
  }>;
}

const STORAGE_KEY = 'project_wizard_state';

export const useProjectWizard = () => {
  const [wizardState, setWizardState] = useState<WizardState>(() => {
    // Initialize from sessionStorage
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return {};
      }
    }
    return {};
  });

  // Save to sessionStorage whenever state changes
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(wizardState));
  }, [wizardState]);

  const saveWizardState = (newState: Partial<WizardState>) => {
    setWizardState(prev => ({ ...prev, ...newState }));
  };

  const getWizardState = (): WizardState => {
    return wizardState;
  };

  const clearWizardState = () => {
    setWizardState({});
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const canProceedToNextStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1: // Job Description
        return !!wizardState.jdContent && wizardState.jdContent.length > 50;
      case 2: // Candidate Source
        if (!wizardState.candidateSource) return false;
        if (wizardState.candidateSource === 'own') {
          return !!wizardState.uploadedResumes && wizardState.uploadedResumes.length > 0;
        }
        return true;
      case 3: // Proof Level Selection
        return !!wizardState.selectedTier;
      case 4: // Magic Moment Snapshot
        return true;
      case 5: // Final CTA
        return true;
      default:
        return false;
    }
  };

  return {
    wizardState,
    saveWizardState,
    getWizardState,
    clearWizardState,
    canProceedToNextStep,
  };
}
