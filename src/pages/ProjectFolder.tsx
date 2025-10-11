import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ProjectLayout } from "@/components/project/ProjectLayout";
import { RoleSummaryCard } from "@/components/project/RoleSummaryCard";
import { CandidateCard } from "@/components/project/CandidateCard";
import { EmptyState } from "@/components/project/EmptyState";
import { Button } from "@/components/ui/button";
import { useProjectState, CandidateInfo } from "@/hooks/useProjectState";
import { TierInfo, UploadedFile } from "@/hooks/useChatFlow";

interface ProjectFolderState {
  projectId: string;
  roleTitle: string;
  tier: TierInfo;
  candidateSource: 'own' | 'network';
  candidateCount: number;
  uploadedResumes?: UploadedFile[];
  status: 'awaiting' | 'scoring' | 'ready';
  paymentStatus: 'paid' | 'pending';
  progress: {
    hoursElapsed: number;
    totalHours: 48;
    percentage: number;
  };
}

const ProjectFolder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ProjectFolderState;
  
  const { project, parseCandidatesFromFiles } = useProjectState(state);

  useEffect(() => {
    if (!state) {
      navigate('/workspace');
    }
  }, [state, navigate]);

  if (!state) {
    return null;
  }

  const candidates: CandidateInfo[] = state.uploadedResumes 
    ? parseCandidatesFromFiles(state.uploadedResumes)
    : [];

  const showCandidates = state.candidateSource === 'own' && candidates.length > 0;

  return (
    <ProjectLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Role Summary */}
          <div className="lg:col-span-1">
            <RoleSummaryCard
              roleTitle={project.roleTitle}
              tier={project.tier}
              candidateSource={project.candidateSource}
              candidateCount={project.candidateCount}
              paymentStatus={project.paymentStatus}
              status={project.status}
              progress={project.progress}
            />
          </div>

          {/* Right Panel - Candidates */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Candidates</h3>
                {showCandidates && (
                  <Button variant="outline" size="sm">
                    Upload More
                  </Button>
                )}
              </div>

              {showCandidates ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {candidates.map((candidate) => (
                    <CandidateCard
                      key={candidate.id}
                      fileName={candidate.fileName}
                      parsedName={candidate.parsedName}
                      status={candidate.status}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}

              {project.status === 'ready' && (
                <div className="mt-8 pt-6 border-t border-border">
                  <Button size="lg" className="w-full">
                    View Shortlist →
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProjectLayout>
  );
};

export default ProjectFolder;
