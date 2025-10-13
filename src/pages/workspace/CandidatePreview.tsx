import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Monitor } from "lucide-react";
import { useProjectWizard } from "@/hooks/useProjectWizard";

export default function CandidatePreview() {
  const navigate = useNavigate();
  const { wizardState } = useProjectWizard();

  const handleContinue = () => {
    navigate('/workspace/new/book-call');
  };

  const handleBack = () => {
    navigate('/workspace/new/candidate-source');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl">
        <CardHeader>
          <div className="mb-2 text-sm text-muted-foreground">Step 4 of 5</div>
          <CardTitle className="text-3xl">Preview the Candidate Experience</CardTitle>
          <CardDescription>
            See exactly what your candidates will receive when we send them their Proof of Work task.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Email Preview */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Mail className="w-4 h-4 text-primary" />
                <span>Email Preview</span>
              </div>
              <div className="border-2 border-border rounded-lg p-6 bg-card">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">VA</span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">VettedAI</div>
                      <div className="text-xs text-muted-foreground">team@vetted.ai</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Subject:</div>
                    <div className="font-semibold text-sm">
                      Your Proof of Work Task for {wizardState.roleTitle || "the Role"}
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>Hi [Candidate Name],</p>
                    <p>
                      You've been selected to complete a Proof of Work task for the position of{" "}
                      <span className="font-semibold text-foreground">
                        {wizardState.roleTitle || "Senior Full-Stack Engineer"}
                      </span>.
                    </p>
                    <p className="text-xs">
                      This task is designed to showcase your skills and should take approximately 2-3 hours.
                    </p>
                  </div>
                  
                  <Button className="w-full" size="sm">
                    Start Your Task →
                  </Button>
                </div>
              </div>
            </div>

            {/* Task Landing Page Preview */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Monitor className="w-4 h-4 text-primary" />
                <span>Task Landing Page</span>
              </div>
              <div className="border-2 border-border rounded-lg p-6 bg-card">
                <div className="space-y-4">
                  <div className="pb-3 border-b">
                    <h3 className="font-bold text-lg">{wizardState.roleTitle || "Senior Full-Stack Engineer"}</h3>
                    <p className="text-xs text-muted-foreground">Proof of Work Assessment</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-muted/50 rounded p-3">
                      <div className="text-xs font-semibold text-muted-foreground mb-1">TIME LIMIT</div>
                      <div className="text-sm font-semibold">3 hours</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-muted-foreground">TASK OVERVIEW</div>
                      <div className="text-sm text-muted-foreground">
                        Complete a real-world scenario that demonstrates your skills in:
                      </div>
                      <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                        <li>• Problem-solving</li>
                        <li>• Technical execution</li>
                        <li>• Communication</li>
                      </ul>
                    </div>
                  </div>
                  
                  <Button className="w-full" size="sm" variant="outline">
                    View Instructions
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button onClick={handleBack} variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleContinue} size="lg">
              Confirm Experience & Next →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
