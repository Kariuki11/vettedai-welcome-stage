import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

export const ProgressIndicator = ({ currentStep, totalSteps = 6 }: ProgressIndicatorProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="sticky top-0 z-10 bg-card border-b border-border py-3 px-6">
      <div className="max-w-[960px] mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-medium text-primary">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
};
