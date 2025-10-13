import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Loader2 } from "lucide-react";
import { useProjectWizard } from "@/hooks/useProjectWizard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function JdUpload() {
  const navigate = useNavigate();
  const { saveWizardState, wizardState } = useProjectWizard();
  const { toast } = useToast();
  const [jd, setJd] = useState(wizardState.jdContent || wizardState.jobDescription || "");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setJd(text);
    };
    reader.readAsText(file);
  };

  const handleContinue = async () => {
    if (jd.length < 50) {
      toast({
        title: "Job description too short",
        description: "Please provide a more detailed job description (at least 50 characters).",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Call AI parsing edge function
      const { data, error } = await supabase.functions.invoke("parse-job-description", {
        body: { jd_text: jd },
      });

      if (error) {
        console.error("AI parsing error:", error);
        throw error;
      }

      const parsedPayload =
        typeof data === "string"
          ? (JSON.parse(data) as Record<string, unknown> | null)
          : ((data as Record<string, unknown> | null) ?? null);

      if (!parsedPayload) {
        throw new Error("Empty response from JD parser");
      }

      if (typeof parsedPayload.error === "string" && parsedPayload.error.trim().length > 0) {
        throw new Error(parsedPayload.error);
      }

      const roleTitle = parsedPayload.role_title;
      const jobSummary = parsedPayload.job_summary;

      if (typeof roleTitle !== "string" || typeof jobSummary !== "string") {
        throw new Error("Invalid response from JD parser");
      }

      const companyName =
        typeof parsedPayload.company_name === "string" ? parsedPayload.company_name : undefined;
      const keySkills = Array.isArray(parsedPayload.key_skills)
        ? (parsedPayload.key_skills as string[])
        : undefined;
      const experienceLevel =
        typeof parsedPayload.experience_level === "string"
          ? parsedPayload.experience_level
          : undefined;
      const proofOfWorkTask =
        typeof parsedPayload.proof_of_work_task === "string"
          ? parsedPayload.proof_of_work_task
          : undefined;
      const evaluationCriteria = Array.isArray(parsedPayload.evaluation_criteria)
        ? (parsedPayload.evaluation_criteria as Array<{ name: string; description: string }>)
        : undefined;

      // Save parsed data to wizard state
      saveWizardState({
        jobDescription: jd,
        jdContent: jd,
        roleTitle,
        jobSummary,
        companyName,
        keySkills,
        experienceLevel,
        proofOfWorkTask,
        evaluationCriteria,
      });

      navigate("/workspace/new/magic-moment");
    } catch (error) {
      console.error("Failed to parse JD:", error);
      setErrorMessage(
        "We couldn't process that Job Description. Please try again or simplify the text."
      );
      toast({
        title: "Processing failed",
        description: "Could not analyze the job description. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-muted-foreground">Step 1 of 2</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/workspace')}
            >
              ← Back to Workspace
            </Button>
          </div>
          <CardTitle className="text-3xl">Start Your Vetting Project</CardTitle>
          <CardDescription>
            Paste your Job Description below or upload a file to get started.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste your job description here...&#10;&#10;Example: We're looking for a Senior Full-Stack Engineer with 5+ years of experience..."
              className="min-h-[300px] text-base resize-none"
            />

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-sm text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <label htmlFor="file-upload">
              <Button variant="outline" className="w-full" asChild>
                <div className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File (PDF, DOCX, TXT)
                </div>
              </Button>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleContinue}
              disabled={jd.length < 50 || isLoading}
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing JD...
                </>
              ) : (
                'Analyze JD →'
              )}
            </Button>
          </div>
          {errorMessage && (
            <div className="text-sm text-destructive text-right">{errorMessage}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
