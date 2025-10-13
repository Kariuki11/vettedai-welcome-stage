import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Calendar, Loader2 } from "lucide-react";
import { useProjectWizard } from "@/hooks/useProjectWizard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { normalizeProject, type Project, userProjectsQueryKey } from "@/hooks/useUserProjects";
import type { Database } from "@/integrations/supabase/types";

const LEMUEL_CALENDLY_URL = "https://calendly.com/lemuelabishua";
const TOBI_CALENDLY_URL = "https://cal.mixmax.com/ventureforafrica/antler_30";

const DEFAULT_TIER = {
  id: 1,
  name: "Founders Pilot",
  anchorPrice: 0,
  pilotPrice: 0,
};

type BookingAction = "lemuel" | "tobi" | "later";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];

export default function BookCall() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const { wizardState, saveWizardState, clearWizardState } = useProjectWizard();
  const [loadingAction, setLoadingAction] = useState<BookingAction | null>(null);

  const jdContent = wizardState.jdContent || wizardState.jobDescription;

  useEffect(() => {
    if (!jdContent) {
      navigate('/workspace/new/jd-upload');
    }
  }, [jdContent, navigate]);

  const ensureProject = async (): Promise<string> => {
    if (wizardState.projectId) {
      return wizardState.projectId;
    }

    if (!user?.id) {
      throw new Error('You need to be signed in to save your project.');
    }

    const roleTitle = wizardState.roleTitle?.trim() || 'Pending Role Title';
    const jobSummary = wizardState.jobSummary || '';
    const jobDescription = jdContent || '';
    const candidateSource = wizardState.candidateSource || 'network';
    const candidateCount = candidateSource === 'own'
      ? wizardState.candidateCount || wizardState.uploadedResumes?.length || 0
      : wizardState.candidateCount || 0;

    const { data: projectId, error } = await supabase
      .rpc('create_project_for_current_user', {
        _user_id: user.id,
        _role_title: roleTitle,
        _job_description: jobDescription,
        _job_summary: jobSummary,
        _tier_id: DEFAULT_TIER.id,
        _tier_name: DEFAULT_TIER.name,
        _anchor_price: DEFAULT_TIER.anchorPrice,
        _pilot_price: DEFAULT_TIER.pilotPrice,
        _candidate_source: candidateSource,
        _candidate_count: candidateCount,
      });

    if (error) {
      throw new Error(error.message || 'Failed to create project.');
    }

    if (!projectId) {
      throw new Error('Project could not be created.');
    }

    saveWizardState({ projectId: projectId as string });
    return projectId as string;
  };

  const finalizeProject = async (action: BookingAction) => {
    if (loadingAction) return;
    setLoadingAction(action);

    try {
      if (!user?.id) {
        throw new Error('You need to be signed in to complete this action.');
      }

      const projectId = await ensureProject();

      const { error: statusError } = await supabase
        .rpc('mark_project_awaiting_setup_call', {
          _project_id: projectId,
          _user_id: user.id,
        });

      if (statusError) {
        throw new Error(statusError.message || 'Failed to update project status.');
      }

      if (user?.id) {
        const { data: createdProject, error: fetchError } = await supabase
          .from('projects')
          .select('id, role_title, status, payment_status, candidate_count, created_at, tier_name')
          .eq('id', projectId)
          .maybeSingle<ProjectRow>();

        if (fetchError) {
          console.warn('Unable to fetch project after update', fetchError);
        } else if (createdProject) {
          queryClient.setQueryData<Project[]>(
            userProjectsQueryKey(user.id),
            (existing) => {
              const normalized = normalizeProject(createdProject);
              const withoutDuplicate = (existing || []).filter((project) => project.id !== normalized.id);
              return [normalized, ...withoutDuplicate];
            }
          );

          await queryClient.invalidateQueries({ queryKey: userProjectsQueryKey(user.id), exact: false });
        }
      }

      clearWizardState();

      if (action !== 'later') {
        const url = action === 'lemuel' ? LEMUEL_CALENDLY_URL : TOBI_CALENDLY_URL;
        window.open(url, '_blank', 'noopener,noreferrer');
      }

      navigate('/workspace');
    } catch (error) {
      console.error(error);
      toast({
        title: 'Something went wrong',
        description: error instanceof Error ? error.message : 'Please try again or contact support.',
        variant: 'destructive',
      });
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-xl text-center shadow-lg">
        <CardHeader className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#5A4FCF] text-white">
            <Check className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl">You're almost set — book a quick call</CardTitle>
          <p className="text-lg text-muted-foreground">
            Choose a time with Lemuel or Tobi based on your availability. Either founder will walk you through finalizing your project.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center -space-x-6">
            <Avatar className="h-16 w-16 border-4 border-background shadow-sm">
              <AvatarImage src="/placeholder.svg" alt="Lemuel" />
              <AvatarFallback>L</AvatarFallback>
            </Avatar>
            <Avatar className="h-16 w-16 border-4 border-background shadow-sm">
              <AvatarImage src="/placeholder.svg" alt="Tobi" />
              <AvatarFallback>T</AvatarFallback>
            </Avatar>
          </div>
          <p className="text-sm text-muted-foreground">
            We’ll confirm the details of your Proof of Work during this call.
          </p>

          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full py-6 text-lg"
              onClick={() => finalizeProject('lemuel')}
              disabled={!!loadingAction}
            >
              {loadingAction === 'lemuel' ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Calendar className="mr-2 h-5 w-5" />
              )}
              Book with Lemuel
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full py-6 text-lg"
              onClick={() => finalizeProject('tobi')}
              disabled={!!loadingAction}
            >
              {loadingAction === 'tobi' ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Calendar className="mr-2 h-5 w-5" />
              )}
              Book with Tobi
            </Button>

            <Button
              size="lg"
              variant="ghost"
              className="w-full"
              onClick={() => finalizeProject('later')}
              disabled={!!loadingAction}
            >
              {loadingAction === 'later' ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : null}
              I'll book later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
