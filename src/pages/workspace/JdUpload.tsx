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
  const [isProcessing, setIsProcessing] = useState(false);

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

    setIsProcessing(true);
    
    try {
      // Call AI parsing edge function
      const { data, error } = await supabase.functions.invoke('parse-job-description', {
        body: { jd_text: jd }
      });

      if (error) {
        console.error('AI parsing error:', error);
        throw error;
      }

      // Save parsed data to wizard state
      saveWizardState({
        jobDescription: jd,
        jdContent: jd,
        roleTitle: data.role_title,
        jobSummary: data.job_summary,
        companyName: data.company_name,
        keySkills: data.key_skills,
        experienceLevel: data.experience_level,
      });
      
      navigate('/workspace/new/jd-confirm');
    } catch (error) {
      console.error('Failed to parse JD:', error);
      toast({
        title: "Processing failed",
        description: "Could not analyze the job description. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="mb-2 text-sm text-muted-foreground">Step 1 of 5</div>
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
              disabled={jd.length < 50 || isProcessing}
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing JD...
                </>
              ) : (
                'Analyze JD →'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
