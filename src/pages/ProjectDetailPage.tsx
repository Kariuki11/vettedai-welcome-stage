import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, CheckCircle2, Clock3, ListChecks } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/project/StatusBadge";

const STRATEGY_CALL_URL = "https://calendly.com/lemuelabishua";
const SHORTLIST_URL = "https://cal.mixmax.com/ventureforafrica/antler_30";

type ProjectDetailRow = Pick<
  Database["public"]["Tables"]["projects"]["Row"],
  | "id"
  | "role_title"
  | "status"
  | "job_summary"
  | "candidate_source"
  | "tier_name"
  | "candidate_count"
  | "created_at"
>;

type ProjectDetail = ProjectDetailRow & {
  proof_tier?: string | null;
};

type StatusValue = Parameters<typeof StatusBadge>[0]["status"];

const candidateSourceCopy: Record<string, string> = {
  own: "You will upload candidates",
  network: "VettedAI Talent Network",
};

const formatCandidateSource = (source?: string | null) => {
  if (!source) return "Not specified";
  return candidateSourceCopy[source] || source;
};

const formatProofLevel = (tierName?: string | null) => tierName || "Proof level not selected";

const STATUS_PENDING_ACTIVATION = "pending_activation";
const STATUS_ACTIVATION_IN_PROGRESS = "activation_in_progress";

type PendingActivationStateProps = {
  project: ProjectDetail;
  onConfirmActivation: () => Promise<void>;
  isUpdating: boolean;
};

type ActivationInProgressStateProps = {
  project: ProjectDetail;
};

const PendingActivationState = ({ project, onConfirmActivation, isUpdating }: PendingActivationStateProps) => (
  <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr]">
    <Card className="border border-border shadow-sm">
      <CardHeader>
        <CardTitle>Your Project Configuration</CardTitle>
        <p className="text-sm text-muted-foreground">
          Review the selections you made in the project wizard. These guide our team before the activation call.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Job Summary</h3>
          <p className="text-base leading-relaxed text-foreground">
            {project.job_summary?.trim() || "You haven't provided a job summary yet."}
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Candidate Source</h3>
          <p className="text-base text-foreground">{formatCandidateSource(project.candidate_source)}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Proof Level</h3>
          <p className="text-base text-foreground">{formatProofLevel(project.proof_tier ?? project.tier_name)}</p>
        </div>

        {typeof project.candidate_count === "number" && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Candidate Count</h3>
            <p className="text-base text-foreground">{project.candidate_count}</p>
          </div>
        )}
      </CardContent>
    </Card>

    <Card className="border border-border shadow-sm bg-muted/30">
      <CardHeader>
        <CardTitle>Your Project is Ready for Activation</CardTitle>
        <p className="text-sm text-muted-foreground">
          The final step is a 15-minute setup call to confirm your evaluation criteria. This ensures the Proof of Work task is
          perfectly tuned to find your ideal candidate.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Button asChild className="w-full justify-center" variant="default">
            <a href={STRATEGY_CALL_URL} target="_blank" rel="noopener noreferrer">
              Strategy Call with a Product Expert
            </a>
          </Button>
          <Button asChild className="w-full justify-center" variant="outline">
            <a href={SHORTLIST_URL} target="_blank" rel="noopener noreferrer">
              Deploy Your First VettedAI Shortlist
            </a>
          </Button>
        </div>

        <div className="rounded-lg border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
          Confirm once you've booked your call so we can start preparing your activation.
        </div>

        <Button className="w-full" onClick={onConfirmActivation} disabled={isUpdating}>
          {isUpdating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Updating status...
            </>
          ) : (
            "I've Scheduled My Call"
          )}
        </Button>
      </CardContent>
    </Card>
  </div>
);

const ActivationInProgressState = ({ project }: ActivationInProgressStateProps) => (
  <Card className="border border-border shadow-sm">
    <CardHeader className="space-y-3">
      <Badge variant="secondary" className="w-fit bg-blue-100 text-blue-700 border-blue-200">
        Activation in Progress
      </Badge>
      <CardTitle className="text-2xl">Your setup call is confirmed.</CardTitle>
      <p className="text-muted-foreground">
        We're excited to speak with you. Please check your email for the calendar invite.
      </p>
    </CardHeader>
    <CardContent className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Why We Start with a Conversation.</h2>
        <p className="text-muted-foreground leading-relaxed">
          At VettedAI, "Proof of Work" isn't a generic test. It's a precise simulation of the role, designed to reveal a
          candidate's true ability. Your setup call is a 15-minute strategy session where we fine-tune the task to ensure it
          captures the exact signals you care about. This collaborative step is the secret to delivering a high-confidence
          shortlist.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">What happens next</h3>
        <ol className="relative border-l border-border pl-6 space-y-6">
          <li className="ml-4">
            <span className="absolute -left-9 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-green-700">Step 1 · Setup Call</p>
              <p className="text-sm text-muted-foreground">✓ Completed</p>
            </div>
          </li>
          <li className="ml-4">
            <span className="absolute -left-9 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <Clock3 className="h-4 w-4" />
            </span>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-blue-700">Step 2 · Task Deployment &amp; Vetting</p>
              <p className="text-sm text-muted-foreground">In progress now</p>
            </div>
          </li>
          <li className="ml-4">
            <span className="absolute -left-9 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <ListChecks className="h-4 w-4" />
            </span>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">Step 3 · Shortlist Delivered</p>
              <p className="text-sm text-muted-foreground">We'll send your curated shortlist once vetting is complete.</p>
            </div>
          </li>
        </ol>
      </section>
    </CardContent>
  </Card>
);

const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: project, isLoading, isError, refetch } = useQuery({
    queryKey: ["project-detail", projectId],
    enabled: !!projectId,
    queryFn: async () => {
      if (!projectId) {
        throw new Error("A project identifier is required.");
      }

      const { data, error } = await supabase
        .from("projects")
        .select(
          "id, role_title, status, job_summary, candidate_source, tier_name, candidate_count, created_at"
        )
        .eq("id", projectId)
        .single<ProjectDetailRow>();

      if (error) {
        throw error;
      }

      return { ...data, proof_tier: data.tier_name } satisfies ProjectDetail;
    },
  });

  const handleStatusConfirmation = async () => {
    if (!projectId) return;

    setIsUpdating(true);
    const { error } = await supabase.rpc("update_project_status", {
      project_id: projectId,
      new_status: "activation_in_progress",
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading project details...
        </div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-center px-6">
        <h1 className="text-2xl font-semibold">We couldn't find that project</h1>
        <p className="text-muted-foreground max-w-md">
          The project you're looking for might have been removed or you may not have permission to view it.
        </p>
        <Button onClick={() => navigate("/workspace")}>Back to Workspace</Button>
      </div>
    );
  }

  const statusForBadge: StatusValue =
    project.status === STATUS_PENDING_ACTIVATION || project.status === STATUS_ACTIVATION_IN_PROGRESS
      ? (project.status as StatusValue)
      : ((project.status as StatusValue) ?? STATUS_PENDING_ACTIVATION);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <Button
          variant="ghost"
          className="px-0 text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/workspace")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to workspace
        </Button>

        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Project Detail</p>
            <h1 className="text-3xl font-bold text-foreground">{project.role_title}</h1>
          </div>
          <StatusBadge status={statusForBadge} />
        </header>

        {project.status === STATUS_PENDING_ACTIVATION ? (
          <PendingActivationState
            project={project}
            onConfirmActivation={handleStatusConfirmation}
            isUpdating={isUpdating}
          />
        ) : project.status === STATUS_ACTIVATION_IN_PROGRESS ? (
          <ActivationInProgressState project={project} />
        ) : (
          <Card className="border border-border shadow-sm">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl">This project is already underway</CardTitle>
              <p className="text-muted-foreground">
                Status updates are only required for activation. Continue monitoring progress from your dashboard.
              </p>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/workspace")} variant="secondary">
                Return to Workspace
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailPage;
