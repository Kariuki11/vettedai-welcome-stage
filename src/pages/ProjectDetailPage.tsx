import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import ActivationInProgressView from "./project-detail/ActivationInProgressView";
import PendingActivationView from "./project-detail/PendingActivationView";
import type { ProjectDetail } from "./project-detail/types";

const STATUS_PENDING_ACTIVATION = "pending_activation";
const STATUS_ACTIVATION_IN_PROGRESS = "activation_in_progress";

const fetchProject = async (projectId: string): Promise<ProjectDetail> => {
  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, role_title, status, job_summary, candidate_source, tier_name, candidate_count, created_at"
    )
    .eq("id", projectId)
    .single<ProjectDetail>();

  if (error) {
    throw error;
  }

  return data;
};

const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    data: project,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["project", projectId],
    enabled: Boolean(projectId),
    queryFn: () => {
      if (!projectId) {
        throw new Error("A project identifier is required.");
      }

      return fetchProject(projectId);
    },
  });

  const handleConfirmActivation = async () => {
    if (!projectId) return;

    setIsUpdating(true);
    const { error } = await supabase.rpc("update_project_status", {
      project_id: projectId,
      new_status: STATUS_ACTIVATION_IN_PROGRESS,
    });

    if (error) {
      toast({
        title: "Unable to update project",
        description: error.message || "Please try again or contact support.",
        variant: "destructive",
      });
      setIsUpdating(false);
      return;
    }

    toast({
      title: "Setup call confirmed",
      description: "Thanks for confirming—your activation is underway.",
    });

    await refetch();
    setIsUpdating(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        <span className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading project details...
        </span>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <h1 className="text-2xl font-semibold">We couldn't find that project</h1>
        <p className="max-w-md text-muted-foreground">
          The project you're looking for might have been removed or you may not have permission to view it.
        </p>
        <Button onClick={() => navigate("/workspace")}>Back to Workspace</Button>
      </div>
    );
  }

  if (project.status === STATUS_PENDING_ACTIVATION) {
    return (
      <PendingActivationView
        project={project}
        onBack={() => navigate("/workspace")}
        onConfirmActivation={handleConfirmActivation}
        isConfirming={isUpdating}
      />
    );
  }

  if (project.status === STATUS_ACTIVATION_IN_PROGRESS) {
    return <ActivationInProgressView project={project} onBack={() => navigate("/workspace")} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <Card className="max-w-md border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">This project is already underway</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Status updates are only required for activation. Continue monitoring progress from your dashboard.
          </p>
          <Button onClick={() => navigate("/workspace")} variant="secondary">
            Return to Workspace
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetailPage;
