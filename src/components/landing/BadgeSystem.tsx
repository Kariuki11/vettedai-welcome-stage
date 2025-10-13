import { CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  variant: 'score' | 'signal' | 'time' | 'decision';
  animated?: boolean;
  delay?: number;
}

export const ProofBadge = ({ label, variant, animated = false, delay = 0 }: BadgeProps) => {
  const variantStyles = {
    score: "bg-primary/10 text-primary border-primary/20",
    signal: "bg-success/10 text-success border-success/20",
    time: "bg-muted text-muted-foreground border-border",
    decision: "bg-primary/10 text-primary border-primary/20"
  };

  const showIcon = variant === 'decision' || variant === 'time';
  const Icon = variant === 'decision' ? CheckCircle : Clock;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border",
        variantStyles[variant],
        animated && "motion-safe:animate-badge-appear opacity-0"
      )}
      style={animated ? { animationDelay: `${delay}ms`, animationFillMode: 'forwards' } : undefined}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      {label}
    </div>
  );
};

interface BadgeGroupProps {
  animated?: boolean;
  className?: string;
}

export const BadgeGroup = ({ animated = false, className }: BadgeGroupProps) => {
  const badges = [
    { label: "Task score 92", variant: 'score' as const, delay: 0 },
    { label: "Process signal strong", variant: 'signal' as const, delay: 150 },
    { label: "On-time 13:24", variant: 'time' as const, delay: 300 },
    { label: "Decision: Advance", variant: 'decision' as const, delay: 450 }
  ];

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {badges.map((badge, index) => (
        <ProofBadge
          key={index}
          label={badge.label}
          variant={badge.variant}
          animated={animated}
          delay={badge.delay}
        />
      ))}
    </div>
  );
};
