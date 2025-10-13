import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProjectWizard } from "@/hooks/useProjectWizard";
import { Sparkles, Target, CheckCircle2 } from "lucide-react";

export default function MagicMoment() {
  const navigate = useNavigate();
  const { wizardState } = useProjectWizard();

  const selectedTier = wizardState.selectedTier;
  const proofLevelName = selectedTier?.name || "Proof Level";
  const bestForCopy = selectedTier?.bestFor || "We'll guide you to the right candidates for this role.";
  const whatItIsCopy = selectedTier?.whatItIs || "Gemini will tailor the Proof of Work experience based on the role you shared.";
  const outputCopy = selectedTier?.output || "Expect a clear snapshot of how candidates perform against your must-have skills.";

  const handleBack = () => {
    navigate('/workspace/new/tier-selection');
  };

  const handleContinue = () => {
    navigate('/workspace/new/book-call');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Step 4 of 5</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/workspace')}
            >
              ← Exit Setup
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <CardTitle className="text-3xl">
              Gemini mapped your {proofLevelName} experience for {wizardState.roleTitle || "this role"}
            </CardTitle>
          </div>
          <p className="text-muted-foreground">
            Here's the snapshot it created from your job description and the proof level you just selected.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Proof Level Summary */}
          <div className="rounded-lg border bg-card p-6 space-y-3">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Best for</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{bestForCopy}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">What it is</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{whatItIsCopy}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">What you'll learn</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{outputCopy}</p>
              </div>
            </div>
          </div>

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
          <div className="flex flex-col sm:flex-row gap-3 justify-between pt-4">
            <Button onClick={handleBack} variant="outline" size="lg">
              ← Back
            </Button>
            <Button onClick={handleContinue} size="lg" className="sm:w-auto w-full">
              Continue to Final Step →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
