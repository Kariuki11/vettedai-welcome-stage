import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useProjectWizard } from "@/hooks/useProjectWizard";
import { useToast } from "@/hooks/use-toast";

export default function JdConfirm() {
  const navigate = useNavigate();
  const { saveWizardState, wizardState } = useProjectWizard();
  const { toast } = useToast();
  
  const [roleTitle, setRoleTitle] = useState(wizardState.roleTitle || "");
  const [jobSummary, setJobSummary] = useState(wizardState.jobSummary || "");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // If no JD in state, redirect back
    if (!wizardState.jobDescription) {
      navigate('/workspace/new/jd-upload');
      return;
    }

    // Generate AI summary if not already generated
    if (!wizardState.roleTitle && !isGenerating) {
      generateSummary();
    }
  }, []);

  const generateSummary = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock AI-generated content
    const generatedTitle = "Senior Full-Stack Engineer";
    const generatedSummary = "Senior Full-Stack Engineer role requiring 5+ years experience with React, Node.js, and cloud infrastructure. Focus on building scalable systems and mentoring junior developers. Remote-friendly position with competitive compensation.";
    
    setRoleTitle(generatedTitle);
    setJobSummary(generatedSummary);
    setIsGenerating(false);
  };

  const handleContinue = () => {
    if (!roleTitle.trim() || !jobSummary.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both role title and job summary.",
        variant: "destructive",
      });
      return;
    }

    saveWizardState({ roleTitle, jobSummary });
    navigate('/workspace/new/candidate-source');
  };

  const handleBack = () => {
    navigate('/workspace/new/jd-upload');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="mb-2 text-sm text-muted-foreground">Step 2 of 6</div>
          <CardTitle className="text-3xl">Confirm Job Details</CardTitle>
          <CardDescription>
            Review and edit the AI-generated role title and summary for your job posting.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {isGenerating ? (
            <div className="py-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-muted-foreground">Analyzing your job description...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="role-title">Role Title</Label>
                <Input
                  id="role-title"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g., Senior Full-Stack Engineer"
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job-summary">Job Summary</Label>
                <Textarea
                  id="job-summary"
                  value={jobSummary}
                  onChange={(e) => setJobSummary(e.target.value)}
                  placeholder="Brief summary of the role..."
                  className="min-h-[150px] text-base resize-none"
                />
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <Button onClick={handleBack} variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!roleTitle.trim() || !jobSummary.trim() || isGenerating}
              size="lg"
            >
              Confirm & Next →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
