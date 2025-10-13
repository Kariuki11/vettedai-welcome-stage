import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProjectWizard } from "@/hooks/useProjectWizard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Target, CheckCircle2, Calendar } from "lucide-react";
import { useState } from "react";

const CALENDLY_URL = "https://calendly.com/lemuel-vettedai/30min";

export default function MagicMoment() {
  const navigate = useNavigate();
  const { wizardState, clearWizardState } = useProjectWizard();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const ensureRecruiterProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Check if recruiter profile exists
    const { data: recruiter, error: fetchError } = await supabase
      .from("recruiters")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    // If no recruiter profile, create one
    if (!recruiter) {
      const { error: insertError } = await supabase
        .from("recruiters")
        .insert({
          user_id: user.id,
          email: user.email || "",
          full_name: user.user_metadata?.full_name || "User",
          status: "active"
        });

      if (insertError) throw insertError;
    }
  };

  const createProject = async () => {
    await ensureRecruiterProfile();

    const { data: projectId, error } = await supabase.rpc("create_project_for_current_user", {
      _role_title: wizardState.roleTitle || "Untitled Role",
      _job_description: wizardState.jobDescription || "",
      _job_summary: wizardState.jobSummary || "",
      _tier_id: 1,
      _tier_name: "Founders Pilot",
      _anchor_price: 0,
      _pilot_price: 0,
      _candidate_source: "network",
      _candidate_count: 0,
    });

    if (error) throw error;

    // Update project status to awaiting_setup_call
    const { error: updateError } = await supabase
      .from("projects")
      .update({ status: "awaiting_setup_call" })
      .eq("id", projectId);

    if (updateError) throw updateError;

    return projectId;
  };

  const handleActivateShortlist = async () => {
    setIsCreating(true);
    try {
      await createProject();
      clearWizardState();
      
      // Open Calendly in new tab
      window.open(CALENDLY_URL, "_blank");
      
      navigate("/workspace");
      toast({
        title: "Project Created!",
        description: "Your project is awaiting a setup call. We'll be in touch soon.",
      });
    } catch (error) {
      console.error("Failed to create project:", error);
      toast({
        title: "Creation Failed",
        description: "Could not create project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleBookLater = async () => {
    setIsCreating(true);
    try {
      await createProject();
      clearWizardState();
      
      navigate("/workspace");
      toast({
        title: "Project Created!",
        description: "You can book a call anytime from your workspace.",
      });
    } catch (error) {
      console.error("Failed to create project:", error);
      toast({
        title: "Creation Failed",
        description: "Could not create project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Step 2 of 2</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/workspace')}
            >
              ← Back to Workspace
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <CardTitle className="text-3xl">
              We've Generated a Custom Proof of Work for Your {wizardState.roleTitle || "Role"}
            </CardTitle>
          </div>
          <p className="text-muted-foreground">
            Here's what we've prepared based on your job description
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Proof of Work Task Card */}
          <div className="rounded-lg border bg-card p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-lg">Suggested Proof of Work Task</h4>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {wizardState.proofOfWorkTask || "No task generated"}
            </p>
          </div>

          {/* Key Skills Card */}
          {wizardState.keySkills && wizardState.keySkills.length > 0 && (
            <div className="rounded-lg border bg-card p-6 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-lg">Key Skills Being Evaluated</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {wizardState.keySkills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Evaluation Rubric Card */}
          {wizardState.evaluationCriteria && wizardState.evaluationCriteria.length > 0 && (
            <div className="rounded-lg border bg-card p-6 space-y-4">
              <h4 className="font-semibold text-lg">Evaluation Criteria</h4>
              <div className="space-y-3">
                {wizardState.evaluationCriteria.map((criterion, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{criterion.name}</p>
                      <p className="text-sm text-muted-foreground">{criterion.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-6 space-y-4">
            <h4 className="font-semibold text-lg text-center">Ready to Activate Your First Shortlist?</h4>
            <p className="text-sm text-center text-muted-foreground max-w-2xl mx-auto">
              Let's quickly confirm your evaluation criteria and get this live. Our team will help you fine-tune your first Proof of Work and ensure you get a high-confidence shortlist.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button
                size="lg"
                onClick={handleActivateShortlist}
                disabled={isCreating}
                className="gap-2"
              >
                <Calendar className="w-4 h-4" />
                {isCreating ? "Creating Project..." : "Activate Your First Shortlist"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleBookLater}
                disabled={isCreating}
              >
                I'll Book Later
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
