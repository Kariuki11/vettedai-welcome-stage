import { useState, useEffect } from "react";

export interface TierInfo {
  id: number;
  name: string;
  description: string;
  anchorPrice: number;
  pilotPrice: number;
  features: string[];
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
  candidateSource?: 'own' | 'network';
  uploadedResumes?: UploadedFile[];
  candidateCount?: number;
  selectedTier?: TierInfo;
  projectId?: string;
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
      case 1: // JD Upload
        return !!wizardState.jdContent && wizardState.jdContent.length > 50;
      case 2: // JD Confirmation
        return true;
      case 3: // Candidate Source
        if (!wizardState.candidateSource) return false;
        if (wizardState.candidateSource === 'own') {
          return !!wizardState.uploadedResumes && wizardState.uploadedResumes.length > 0;
        }
        return true;
      case 4: // Candidate Preview
        return true; // No validation needed
      case 5: // Book a Call
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
